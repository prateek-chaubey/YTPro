package com.google.android.youtube.pro;

import android.Manifest;
import android.app.*;
import android.os.*;
import android.view.*;
import android.widget.*;
import android.content.*;
import android.content.res.*;
import android.graphics.*;
import android.net.*;
import android.util.*;
import android.webkit.*;
import java.io.*;
import org.json.*;
import android.content.pm.*;
import java.net.URLEncoder;
import android.webkit.CookieManager;

public class MainActivity extends Activity {

    WebView web;
    private boolean portrait = false;
    BroadcastReceiver broadcastReceiver;


    private String icon = "";
    private String title = "";
    private String subtitle = "";
    private long duration;
    private boolean isPlaying = false;
    private boolean dL=false;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        load(false);

        MainActivity.this.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }
    public void load(boolean dl) {
        dL=dl;
        
        web = findViewById(R.id.web);
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setSupportZoom(true);
        web.getSettings().setBuiltInZoomControls(true);
        web.getSettings().setDisplayZoomControls(false);

        Intent intent = getIntent();
        String action = intent.getAction();
        Uri data = intent.getData();
        String url = "https://m.youtube.com/";
        if (Intent.ACTION_VIEW.equals(action) && data != null) {
            url = data.toString();
        } else if (Intent.ACTION_SEND.equals(action)) {
            String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
            if (sharedText != null && (sharedText.contains("youtube.com") || sharedText.contains("youtu.be"))) {
                url = sharedText;
            }
        }
        web.loadUrl(url);
        web.getSettings().setDomStorageEnabled(true); web.getSettings().setDatabaseEnabled(true);
        web.addJavascriptInterface(new WebAppInterface(this), "Android");
        web.setWebChromeClient(new CustomWebClient());
        web.getSettings().setMediaPlaybackRequiresUserGesture(false); // Allow autoplay
        web.setLayerType(View.LAYER_TYPE_HARDWARE, null);


        web.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView p1, String p2, Bitmap p3) {

                super.onPageStarted(p1, p2, p3);
            }

            @Override
            public void onPageFinished(WebView p1, String url) {


                web.loadUrl("javascript:if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {window.trustedTypes.createPolicy('default', {createHTML: (string) => string,createScriptURL: string => string, createScript: string => string, });}");
                web.loadUrl("javascript:(function () { var script = document.createElement('script'); script.src='https://cdn.jsdelivr.net/npm/ytpro'; document.body.appendChild(script);  })();");
                web.loadUrl("javascript:(function () { var script = document.createElement('script'); script.src='https://cdn.jsdelivr.net/npm/ytpro/bgplay.js'; document.body.appendChild(script);  })();");
                if(dl){

                    //Will Patch this later
                    
                    //web.loadUrl("javascript:(function () {window.location.hash='download';})();");
                    //dL=false;                
                }
                if(!url.contains("#bgplay") && isPlaying){
                    isPlaying=false;
                    stopService(new Intent(getApplicationContext(), ForegroundService.class));
                }

                super.onPageFinished(p1, url);
            }
        });

        setReceiver();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if(requestCode == 101) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                web.loadUrl("https://m.youtube.com");
            } else {
                Toast.makeText(getApplicationContext(),getString(R.string.grant_mic), Toast.LENGTH_SHORT).show();
            }
        } else if(requestCode == 1) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_DENIED) {
                Toast.makeText(getApplicationContext(), getString(R.string.grant_storage), Toast.LENGTH_SHORT).show();
            }
        }
    }
    @Override
    public void onBackPressed() {
        if (web.canGoBack()) {
            web.goBack();
        }
        else {
            finish();
        }
    }

    @Override
    public void onPictureInPictureModeChanged (boolean isInPictureInPictureMode, Configuration newConfig) {
        web.loadUrl(isInPictureInPictureMode ?
                "javascript:document.getElementsByClassName('video-stream')[0].play();" :
                "javascript:removePIP();");
    }

    @Override
    protected void onUserLeaveHint() {
        super.onUserLeaveHint();
        web.loadUrl("javascript:PIPlayer();");
    }



    public class CustomWebClient extends WebChromeClient {
        private View mCustomView;
        private WebChromeClient.CustomViewCallback mCustomViewCallback;
        protected FrameLayout frame;
        private int mOriginalOrientation;
        private int mOriginalSystemUiVisibility;
        public CustomWebClient() {}


        public Bitmap getDefaultVideoPoster() {

            if (MainActivity.this == null) {
                return null;
            }
            return BitmapFactory.decodeResource(MainActivity.this.getApplicationContext().getResources(), 2130837573);
        }


        public void onShowCustomView(View paramView, WebChromeClient.CustomViewCallback viewCallback) {

            this.mOriginalOrientation = portrait ?
                    android.content.pm.ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT :
                    android.content.pm.ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE;

             if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
             getWindow().setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
        
             WindowManager.LayoutParams params = MainActivity.this.getWindow().getAttributes();
             params.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
             MainActivity.this.getWindow().setAttributes(params); 
             }

            if (this.mCustomView != null) {
                onHideCustomView();
                return;
            }
            this.mCustomView = paramView;
            this.mOriginalSystemUiVisibility = MainActivity.this.getWindow().getDecorView().getSystemUiVisibility();
            MainActivity.this.setRequestedOrientation(this.mOriginalOrientation);
            this.mOriginalOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT;this.mCustomViewCallback = viewCallback; ((FrameLayout)MainActivity.this.getWindow().getDecorView()).addView(this.mCustomView, new FrameLayout.LayoutParams(-1, -1)); MainActivity.this.getWindow().getDecorView().setSystemUiVisibility(3846);
        }
        public void onHideCustomView() {


              if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
    
              getWindow().clearFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);

              WindowManager.LayoutParams params = getWindow().getAttributes();
              params.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_DEFAULT;
              MainActivity.this.getWindow().setAttributes(params);
                  
              }
            

            ((FrameLayout)MainActivity.this.getWindow().getDecorView()).removeView(this.mCustomView);
            this.mCustomView = null;
            MainActivity.this.getWindow().getDecorView().setSystemUiVisibility(this.mOriginalSystemUiVisibility);
            MainActivity.this.setRequestedOrientation(this.mOriginalOrientation);
            this.mOriginalOrientation = portrait ?
                    android.content.pm.ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT :
                    android.content.pm.ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE;

            this.mCustomViewCallback = null;
            web.clearFocus();
        }

        @Override
        public void onPermissionRequest(final PermissionRequest request) {
            if(Build.VERSION.SDK_INT > 22 && request.getOrigin().toString().contains("youtube.com")) {
                if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_DENIED) {
                    requestPermissions(new String[] {Manifest.permission.RECORD_AUDIO}, 101);
                } else {
                    request.grant(request.getResources());
                }
            }
        }
    }

    private void downloadFile(String filename, String url, String mtype) {
        
        if (Build.VERSION.SDK_INT > 22 && Build.VERSION.SDK_INT < Build.VERSION_CODES.R && checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_DENIED) {
            runOnUiThread(() -> Toast.makeText(getApplicationContext(), R.string.grant_storage, Toast.LENGTH_SHORT).show());
            requestPermissions(new String[] {Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
        }
        try {
            try {
                String encodedFileName = URLEncoder.encode(filename, "UTF-8").replaceAll("\\+", "%20");

                DownloadManager downloadManager = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
                DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                request.setTitle(filename)
                        .setDescription(filename)
                        .setMimeType(mtype)
                        .setAllowedOverMetered(true)
                        .setAllowedOverRoaming(true)
                        .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, encodedFileName)
                        .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE |
                                DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                downloadManager.enqueue(request);
                Toast.makeText(this, getString(R.string.dl_started), Toast.LENGTH_SHORT).show();
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        } catch (Exception ignored) {
            Toast.makeText(this, ignored.toString(), Toast.LENGTH_SHORT).show();
        }
    }




    public class WebAppInterface {
        Context mContext;
        WebAppInterface(Context c) {
            mContext = c;
        }

        @JavascriptInterface
        public void showToast(String txt) {

            Toast.makeText(getApplicationContext(), txt+"", Toast.LENGTH_SHORT).show();
        }
        @JavascriptInterface
        public void gohome(String x) {
            Intent startMain = new Intent(Intent.ACTION_MAIN);
            startMain.addCategory(Intent.CATEGORY_HOME);
            startMain.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(startMain);
        }

        @JavascriptInterface
        public void downvid(String name,String url, String m) {
            downloadFile(name,url,m);
        }
        @JavascriptInterface
        public void fullScreen(boolean value){
            portrait =  value;
        }
        @JavascriptInterface
        public void oplink(String url) {
            Intent i = new Intent();
            i.setAction(Intent.ACTION_VIEW);
            i.setData(Uri.parse(url));
            startActivity(i);
        }
        @JavascriptInterface
        public String getInfo() {
            PackageManager manager = getApplicationContext().getPackageManager();
            try{
                PackageInfo info = manager.getPackageInfo(getApplicationContext().getPackageName(), PackageManager.GET_ACTIVITIES);
                return info.versionName+"";
            } catch(PackageManager.NameNotFoundException e){
                return "1.0";
            }

        }

        @JavascriptInterface
        public void bgStart(String iconn , String titlen , String subtitlen,long dura) {
            icon=iconn;
            title=titlen;
            subtitle=subtitlen;
            duration=dura;
            isPlaying=true;

            Intent intent = new Intent(getApplicationContext(), ForegroundService.class);

// Add extras to the Intent
            intent.putExtra("icon", icon);
            intent.putExtra("title", title);
            intent.putExtra("subtitle", subtitle);
            intent.putExtra("duration", duration);
            intent.putExtra("currentPosition", 0);

            startService(intent);

        }

        @JavascriptInterface
        public void bgUpdate(String iconn , String titlen , String subtitlen,long dura) {


            icon=iconn;
            title=titlen;
            subtitle=subtitlen;
            duration=(long)(dura);


            getApplicationContext().sendBroadcast(new Intent("UPDATE_NOTIFICATION")
                    .putExtra("icon", icon)
                    .putExtra("title", title)
                    .putExtra("subtitle", subtitle)
                    .putExtra("duration", duration)
                    .putExtra("currentPosition", "0")
                    .putExtra("action", "pause")
            );

        }
        @JavascriptInterface
        public void bgStop() {
            isPlaying=false;

            stopService(new Intent(getApplicationContext(), ForegroundService.class));



        }
        @JavascriptInterface
        public void bgPause(long ct) {


            getApplicationContext().sendBroadcast(new Intent("UPDATE_NOTIFICATION")
                    .putExtra("icon", icon)
                    .putExtra("title", title)
                    .putExtra("subtitle", subtitle)
                    .putExtra("duration", duration)
                    .putExtra("currentPosition", ct)
                    .putExtra("action", "pause")
            );

        }
        @JavascriptInterface
        public void bgPlay(long ct) {

            getApplicationContext().sendBroadcast(new Intent("UPDATE_NOTIFICATION")
                    .putExtra("icon", icon)
                    .putExtra("title", title)
                    .putExtra("subtitle", subtitle)
                    .putExtra("duration", duration)
                    .putExtra("currentPosition", ct)
                    .putExtra("action", "play")
            );

        }
        @JavascriptInterface
        public void bgBuffer(long ct) {

            getApplicationContext().sendBroadcast(new Intent("UPDATE_NOTIFICATION")
                    .putExtra("icon", icon)
                    .putExtra("title", title)
                    .putExtra("subtitle", subtitle)
                    .putExtra("duration", duration)
                    .putExtra("currentPosition", ct)
                    .putExtra("action", "buffer")
            );


        }
        @JavascriptInterface
        public void fetchYouTubeData(String videoId,final boolean bgplay) {
            new Thread(() -> {
                JSONObject response = YoutubeRequest.getData(videoId,false);
                if (response != null) {
                    String jsonResponse = response.toString();
                    runOnUiThread(() -> web.evaluateJavascript("callbackVideoResponse(" + jsonResponse + ","+bgplay+")", null));
                }
            }).start();
        }
        @JavascriptInterface
         public void getSNlM0e(String cookies) {
            
            new Thread(() -> {
            String response = GeminiWrapper.getSNlM0e(cookies);
            runOnUiThread(() -> web.evaluateJavascript("callbackSNlM0e.resolve(`" + response +"`)", null));    
            }).start();


        }
        @JavascriptInterface
         public void GeminiClient(String url,String headers,String body) {
        
                
            new Thread(() -> {
            JSONObject response = GeminiWrapper.getStream(url,headers,body);
            runOnUiThread(() -> web.evaluateJavascript("callbackGeminiClient.resolve(" + response +")", null));   
            }).start();


        }
        @JavascriptInterface
        public String getAllCookies(String url) {	
        String cookies = CookieManager.getInstance().getCookie(url);
        return cookies;
        }
        @JavascriptInterface
        public void pipvid(String x) {
            if (android.os.Build.VERSION.SDK_INT >= 26) {
                try {
                    PictureInPictureParams params;
                    if(portrait){
                        params = new PictureInPictureParams.Builder().setAspectRatio(new Rational(9,16)).build();
                    }
                    else{
                        params = new PictureInPictureParams.Builder().setAspectRatio(new Rational(16, 9)).build();
                    }
                    enterPictureInPictureMode(params);
                } catch (IllegalStateException e) {
                    e.printStackTrace();
                }

            } else {
                Toast.makeText(getApplicationContext(), getString(R.string.no_pip), Toast.LENGTH_SHORT).show();
            }
        }}





    public void setReceiver(){
        broadcastReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String action = intent.getExtras().getString("actionname");

                switch (action) {
                    case "PLAY_ACTION":
                    case "PAUSE_ACTION":
                        web.loadUrl("javascript:playPause();");
                        break;
                    case "NEXT_ACTION":
                        web.loadUrl("javascript:playNext();");
                        break;
                    case "PREV_ACTION":
                        web.loadUrl("javascript:playPrev();");
                        break;
                    case "SEEKTO":
                        web.loadUrl("javascript:seekTo('" + intent.getExtras().getString("pos") + "');");

                        break;
                }



                Log.e("Action",action);


            }
        };

        if (Build.VERSION.SDK_INT >= 34 && getApplicationInfo().targetSdkVersion >= 34) {
        registerReceiver(broadcastReceiver, new IntentFilter("TRACKS_TRACKS"),RECEIVER_EXPORTED);
        }
        else{
        registerReceiver(broadcastReceiver, new IntentFilter("TRACKS_TRACKS"));
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        unregisterReceiver(broadcastReceiver);
    }

}
