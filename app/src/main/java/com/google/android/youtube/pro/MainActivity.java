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
import android.provider.Settings;
import java.net.URLEncoder;
import android.content.SharedPreferences;
import android.webkit.CookieManager;
import android.media.AudioManager;
import java.net.*;
import javax.net.ssl.HttpsURLConnection;
import java.util.*;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;



public class MainActivity extends Activity {

  private boolean portrait = false;
  private BroadcastReceiver broadcastReceiver;
  private AudioManager audioManager;

  private String icon = "";
  private String title = "";
  private String subtitle = "";
  private long duration;
  private boolean isPlaying = false;
  private boolean mediaSession = false;
  private boolean isPip = false;
  private boolean dL = false;

  private YTProWebview web;
  private OnBackInvokedCallback backCallback;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.main);
    

    SharedPreferences prefs = getSharedPreferences("YTPRO", MODE_PRIVATE);

    if (!prefs.contains("bgplay")) {
      prefs.edit().putBoolean("bgplay", true).apply();
    }

    load(false);

    MainActivity.this.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

  }

  public void load(boolean dl) {

    web = findViewById(R.id.web);
    audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
   
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
    web.getSettings().setDomStorageEnabled(true);
    web.getSettings().setDatabaseEnabled(true);
    web.addJavascriptInterface(new WebAppInterface(this), "Android");
    web.setWebChromeClient(new CustomWebClient());
    web.getSettings().setMediaPlaybackRequiresUserGesture(false); // Allow autoplay
    web.setLayerType(View.LAYER_TYPE_HARDWARE, null);

    CookieManager cookieManager = CookieManager.getInstance();
    cookieManager.setAcceptCookie(true);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        cookieManager.setAcceptThirdPartyCookies(web, true); // 3rd party cookies 🍪 
    }

    web.setWebViewClient(new WebViewClient() {
    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            String url = request.getUrl().toString();

            if (url.contains("youtube.com/ytpro_cdn/")) {


                String modifiedUrl = null;

                if (url.contains("youtube.com/ytpro_cdn/esm")) {
                    modifiedUrl = url.replace("youtube.com/ytpro_cdn/esm", "esm.sh");
                } else if (url.contains("youtube.com/ytpro_cdn/npm")) {
                    modifiedUrl = url.replace("youtube.com/ytpro_cdn", "cdn.jsdelivr.net");
                }
                try {
                    URL newUrl = new URL(modifiedUrl);
                    HttpsURLConnection connection = (HttpsURLConnection) newUrl.openConnection();

                    connection.setUseCaches(false);
                    connection.setDefaultUseCaches(false);
                    connection.addRequestProperty("Cache-Control", "no-cache, no-store, must-revalidate");
                    connection.addRequestProperty("Pragma", "no-cache");
                    connection.addRequestProperty("Expires", "0");
                    connection.setRequestProperty("User-Agent", "YTPRO");
                    connection.setRequestProperty("Accept", "**");

                    connection.setConnectTimeout(10000);
                    connection.setReadTimeout(10000);

                    connection.setRequestMethod("GET");

                    connection.connect();

                    String mimeType = connection.getContentType();
                    String encoding = connection.getContentEncoding();
                    if (encoding == null) encoding = "utf-8";
                    String contentType = connection.getContentType();
                    if (contentType == null) {
                        contentType = "application/javascript";
                    }

                        Map < String, String > headers = new HashMap < > ();
                        headers.put("Access-Control-Allow-Origin", "*");
                        headers.put("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                        headers.put("Access-Control-Allow-Headers", "*");
                        headers.put("Content-Type", contentType);

                        headers.put("Access-Control-Allow-Credentials", "true");
                        headers.put("Cross-Origin-Resource-Policy", "cross-origin");

                        if (request.getMethod().equals("OPTIONS")) {
                            return new WebResourceResponse(
                                "text/plain",
                                "UTF-8",
                                204,
                                "No Content",
                                headers,
                                null
                            );
                        }



                        return new WebResourceResponse(
                            mimeType,
                            encoding,
                            connection.getResponseCode(),
                            "OK",
                            headers,
                            connection.getInputStream()
                        );


                    } catch (Exception e) {
                        e.printStackTrace();
                        return super.shouldInterceptRequest(view, request);
                    }

                }

                return super.shouldInterceptRequest(view, request);
      }
      @Override
      public void onPageStarted(WebView p1, String p2, Bitmap p3) {

        super.onPageStarted(p1, p2, p3);
      }

      @Override
      public void onPageFinished(WebView p1, String url) {

        web.evaluateJavascript("if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {window.trustedTypes.createPolicy('default', {createHTML: (string) => string,createScriptURL: string => string, createScript: string => string, });}",null);
        web.evaluateJavascript("(function () { var script = document.createElement('script'); script.src='https://youtube.com/ytpro_cdn/npm/ytpro'; document.body.appendChild(script);  })();",null);
        web.evaluateJavascript("(function () { var script = document.createElement('script'); script.src='https://youtube.com/ytpro_cdn/npm/ytpro/bgplay.js'; document.body.appendChild(script);  })();",null);
        web.evaluateJavascript("(function () { var script = document.createElement('script');script.type='module';script.src='https://youtube.com/ytpro_cdn/npm/ytpro/innertube.js'; document.body.appendChild(script);  })();",null);

        if (dl) {

          //Will Patch this later

          //web.loadUrl("javascript:(function () {window.location.hash='download';})();");
          //dL=false;                
        }

        if (!url.contains("youtube.com/watch") && !url.contains("youtube.com/shorts") && isPlaying) {
          isPlaying = false;
          mediaSession= false;
          stopService(new Intent(getApplicationContext(), ForegroundService.class));
        }

        super.onPageFinished(p1, url);
      }
    });

    setReceiver();



    if (android.os.Build.VERSION.SDK_INT >= 33) {
    
      OnBackInvokedDispatcher dispatcher = getOnBackInvokedDispatcher();
        
        backCallback = new OnBackInvokedCallback() {
            @Override
            public void onBackInvoked() {
                if (web.canGoBack()) {
                  web.goBack();
                } else {
                  finish();
                }
            }
        };
        
        dispatcher.registerOnBackInvokedCallback(
            OnBackInvokedDispatcher.PRIORITY_DEFAULT,
            backCallback
        );
    }
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    if (requestCode == 101) {
      if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
        web.loadUrl("https://m.youtube.com");
      } else {
        Toast.makeText(getApplicationContext(), getString(R.string.grant_mic), Toast.LENGTH_SHORT).show();
      }
    } else if (requestCode == 1) {
      if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_DENIED) {
        Toast.makeText(getApplicationContext(), getString(R.string.grant_storage), Toast.LENGTH_SHORT).show();
      }
    }
  }
  @Override
  public void onBackPressed() {
    if (web.canGoBack()) {
      web.goBack();
    } else {
      finish();
    }
  }

  @Override
  public void onPictureInPictureModeChanged(boolean isInPictureInPictureMode, Configuration newConfig) {
    web.loadUrl(isInPictureInPictureMode ?
      "javascript:PIPlayer();" :
      "javascript:removePIP();",null);
      
      if(isInPictureInPictureMode){
          isPip=true;
      }else{
          isPip=false;
      }

  }

  @Override
  protected void onUserLeaveHint() {
    super.onUserLeaveHint();
   
    if (android.os.Build.VERSION.SDK_INT >= 26 && web.getUrl().contains("watch")) {
      
         if(isPlaying){
      
           try {
            PictureInPictureParams params;
            isPip=true;
            if (portrait) {
               params = new PictureInPictureParams.Builder().setAspectRatio(new Rational(9, 16)).build();
               enterPictureInPictureMode(params);
             } else{
              params = new PictureInPictureParams.Builder().setAspectRatio(new Rational(16, 9)).build();
              enterPictureInPictureMode(params);
             }
           } catch (IllegalStateException e) {
             e.printStackTrace();
           }
        }

      } else {
         //Toast.makeText(getApplicationContext(), getString(R.string.no_pip), Toast.LENGTH_SHORT).show();
      }
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
      
      if (isPip) this.mOriginalOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT;
      

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
      this.mOriginalOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT;
      this.mCustomViewCallback = viewCallback;
      ((FrameLayout) MainActivity.this.getWindow().getDecorView()).addView(this.mCustomView, new FrameLayout.LayoutParams(-1, -1));
      MainActivity.this.getWindow().getDecorView().setSystemUiVisibility(3846);
    }
    public void onHideCustomView() {

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {

        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);

        WindowManager.LayoutParams params = getWindow().getAttributes();
        params.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_DEFAULT;
        MainActivity.this.getWindow().setAttributes(params);

      }

      ((FrameLayout) MainActivity.this.getWindow().getDecorView()).removeView(this.mCustomView);
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
      if (Build.VERSION.SDK_INT > 22 && request.getOrigin().toString().contains("youtube.com")) {
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_DENIED) {
          requestPermissions(new String[] {
            Manifest.permission.RECORD_AUDIO
          }, 101);
        } else {
          request.grant(request.getResources());
        }
      }
    }
  }

  private void downloadFile(String filename, String url, String mtype) {

    if (Build.VERSION.SDK_INT > 22 && Build.VERSION.SDK_INT < Build.VERSION_CODES.R && checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_DENIED) {
      runOnUiThread(() -> Toast.makeText(getApplicationContext(), R.string.grant_storage, Toast.LENGTH_SHORT).show());
      requestPermissions(new String[] {
        Manifest.permission.WRITE_EXTERNAL_STORAGE
      }, 1);
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
      Toast.makeText(getApplicationContext(), txt + "", Toast.LENGTH_SHORT).show();
    }
    @JavascriptInterface
    public void gohome(String x) {
      Intent startMain = new Intent(Intent.ACTION_MAIN);
      startMain.addCategory(Intent.CATEGORY_HOME);
      startMain.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      startActivity(startMain);
    }

    @JavascriptInterface
    public void downvid(String name, String url, String m) {
      downloadFile(name, url, m);
    }
    @JavascriptInterface
    public void fullScreen(boolean value) {
      portrait = value;
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
      try {
        PackageInfo info = manager.getPackageInfo(getApplicationContext().getPackageName(), PackageManager.GET_ACTIVITIES);
        return info.versionName + "";
      } catch (PackageManager.NameNotFoundException e) {
        return "1.0";
      }

    }
    @JavascriptInterface
    public void setBgPlay(boolean bgplay) {
      SharedPreferences prefs = getSharedPreferences("YTPRO", MODE_PRIVATE);
      prefs.edit().putBoolean("bgplay", bgplay).apply();

    }

    @JavascriptInterface
    public void bgStart(String iconn, String titlen, String subtitlen, long dura) {
      icon = iconn;
      title = titlen;
      subtitle = subtitlen;
      duration = dura;
      isPlaying = true;
      mediaSession=true; 

      Intent intent = new Intent(getApplicationContext(), ForegroundService.class);

      // Add extras to the Intent
      intent.putExtra("icon", icon);
      intent.putExtra("title", title);
      intent.putExtra("subtitle", subtitle);
      intent.putExtra("duration", duration);
      intent.putExtra("currentPosition", 0);
      intent.putExtra("action", "play");

      startService(intent);

    }

    @JavascriptInterface
    public void bgUpdate(String iconn, String titlen, String subtitlen, long dura) {

      icon = iconn;
      title = titlen;
      subtitle = subtitlen;
      duration = (long)(dura);
      isPlaying=true;

      getApplicationContext().sendBroadcast(new Intent("UPDATE_NOTIFICATION")
        .putExtra("icon", icon)
        .putExtra("title", title)
        .putExtra("subtitle", subtitle)
        .putExtra("duration", duration)
        .putExtra("currentPosition", 0)
        .putExtra("action", "pause")
      );

    }
    @JavascriptInterface
    public void bgStop() {
      isPlaying = false;
      mediaSession=false;

      stopService(new Intent(getApplicationContext(), ForegroundService.class));

    }
    @JavascriptInterface
    public void bgPause(long ct) {

       isPlaying=false;
      
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
 
        isPlaying=true;
      
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
      
        isPlaying=true;
      
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
    public void getSNlM0e(String cookies) {

      new Thread(() -> {
        String response = GeminiWrapper.getSNlM0e(cookies);
        runOnUiThread(() -> web.evaluateJavascript("callbackSNlM0e.resolve(`" + response + "`)", null));
      }).start();

    }
    @JavascriptInterface
    public void GeminiClient(String url, String headers, String body) {

      new Thread(() -> {
        JSONObject response = GeminiWrapper.getStream(url, headers, body);
        runOnUiThread(() -> web.evaluateJavascript("callbackGeminiClient.resolve(" + response + ")", null));
      }).start();

    }
    @JavascriptInterface
    public String getAllCookies(String url) {
      String cookies = CookieManager.getInstance().getCookie(url);
      return cookies;
    }
    @JavascriptInterface
    public float getVolume() {
        
     int currentVolume = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
     int maxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);

     return (float) currentVolume / maxVolume;

    }
    @JavascriptInterface
    public void setVolume(float volume) {
      int max = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
      int targetVolume = (int) (max * volume);

     audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, targetVolume, 0);
    }
    @JavascriptInterface
    public float getBrightness() {
        
       float brightnessPercent;
        
       try {
        int sysBrightness = Settings.System.getInt(
            getContentResolver(),
            Settings.System.SCREEN_BRIGHTNESS
        );
        brightnessPercent = (sysBrightness / 255f) * 100f;
       } catch (Settings.SettingNotFoundException e) {
        brightnessPercent = 50f; // fallback
       }
       
       return brightnessPercent;

    }
    @JavascriptInterface
    public void setBrightness(final float brightnessValue){
      
      runOnUiThread(new Runnable() {
        @Override
        public void run() {
           final float brightness = Math.max(0f, Math.min(brightnessValue, 1f));

           WindowManager.LayoutParams layout = getWindow().getAttributes();
           layout.screenBrightness = brightness;
           getWindow().setAttributes(layout);
           
         }
      });     
    
    
    }
    @JavascriptInterface
    public void pipvid(String x) {
      if (android.os.Build.VERSION.SDK_INT >= 26) {
        try {
          PictureInPictureParams params;
          if (x.equals("portrait")) {
            params = new PictureInPictureParams.Builder().setAspectRatio(new Rational(9, 16)).build();
          } else {
            params = new PictureInPictureParams.Builder().setAspectRatio(new Rational(16, 9)).build();
          }
          enterPictureInPictureMode(params);
        } catch (IllegalStateException e) {
          e.printStackTrace();
        }

      } else {
          Toast.makeText(getApplicationContext(), getString(R.string.no_pip), Toast.LENGTH_SHORT).show();
      }
    }
  }

  public void setReceiver() {
    broadcastReceiver = new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent) {
        String action = intent.getExtras().getString("actionname");

        Log.e("Action MainActivity", action);

        switch (action) {
        case "PLAY_ACTION":
          web.evaluateJavascript("playVideo();",null);
          Log.e("play", "play called");
          break;
        case "PAUSE_ACTION":
          web.evaluateJavascript("pauseVideo();",null);
          Log.e("pause", "pause called");
          break;
        case "NEXT_ACTION":
          web.evaluateJavascript("playNext();",null);
          break;
        case "PREV_ACTION":
          web.evaluateJavascript("playPrev();",null);
          break;
        case "SEEKTO":
          web.evaluateJavascript("seekTo('" + intent.getExtras().getString("pos") + "');",null);

          break;
        }

      }
    };

    if (Build.VERSION.SDK_INT >= 34 && getApplicationInfo().targetSdkVersion >= 34) {
      registerReceiver(broadcastReceiver, new IntentFilter("TRACKS_TRACKS"), RECEIVER_EXPORTED);
    } else {
      registerReceiver(broadcastReceiver, new IntentFilter("TRACKS_TRACKS"));
    }
  }

  @Override
  protected void onPause() {
    super.onPause();
    CookieManager.getInstance().flush();
  }

  @Override
  public void onDestroy() {
    super.onDestroy();

      Intent intent = new Intent(getApplicationContext(), ForegroundService.class);

      stopService(intent);

    if (broadcastReceiver != null) unregisterReceiver(broadcastReceiver);

    if (android.os.Build.VERSION.SDK_INT >= 33 && backCallback != null) {
            getOnBackInvokedDispatcher().unregisterOnBackInvokedCallback(backCallback);
    }
  }

}















