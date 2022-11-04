package com.google.android.youtube.pro;

import android.app.Activity;
import android.app.*;
import android.os.*;
import android.view.*;
import android.view.View.*;
import android.widget.*;
import android.content.*;
import android.content.res.*;
import android.graphics.*;
import android.graphics.drawable.*;
import android.media.*;
import android.net.*;
import android.text.*;
import android.text.style.*;
import android.util.*;
import android.webkit.*;
import android.animation.*;
import android.view.animation.*;
import java.io.*;
import java.util.*;
import java.util.regex.*;
import android.app.DownloadManager;
import java.text.*;
import org.json.*;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.content.Intent;
import android.net.Uri;
import android.webkit.WebViewClient;
import android.app.Fragment;
import android.app.FragmentManager;
import android.app.DialogFragment;
import android.util.Base64;
import java.io.InputStream;


public class MainActivity extends Activity {
	
	private WebView web;
	private Intent i = new Intent();
	
	@Override
	protected void onCreate(Bundle _savedInstanceState) {
		super.onCreate(_savedInstanceState);
		setContentView(R.layout.main);
		
		web = findViewById(R.id.web);
		web.getSettings().setJavaScriptEnabled(true);
		web.getSettings().setSupportZoom(true);
		
		web.setWebViewClient(new WebViewClient() {
			@Override
			public void onPageStarted(WebView _param1, String _param2, Bitmap _param3) {
				final String _url = _param2;
				
				super.onPageStarted(_param1, _param2, _param3);
			}
			
			@Override
			public void onPageFinished(WebView _param1, String _param2) {
				final String _url = _param2;
				//For Auto Updation 
		          	web.loadUrl("javascript:(function () { var script = document.createElement('script'); script.src='https://cdn.jsdelivr.net/gh/prateek-chaubey/YTPro@latest/app/src/main/assets/app.js'; document.body.appendChild(script);  })();");
				
		        //For Using Local JS file uncomment the below line
		 	//	inject();
				super.onPageFinished(_param1, _param2);
			}
		});
		web.loadUrl("https://m.youtube.com/");
		web.getSettings().setDomStorageEnabled(true); web.getSettings().setDatabaseEnabled(true);
		web.addJavascriptInterface(new WebAppInterface(this), "Android");
		web.setWebChromeClient(new CustomWebClient());
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
		if (isInPictureInPictureMode) {
			
			web.loadUrl("javascript:(function(){"+"setTimeout( () => {"+"document.getElementById('player-container-id').style.position='fixed';"+"document.getElementById('player-container-id').style.top='0'; "+"document.getElementsByClassName('mobile-topbar-header')[0].style.display='none'; "+"},50);})()");
			} else {
			web.loadUrl("javascript:(function(){"+"setTimeout( () => {"+"document.getElementById('player-container-id').style.position='fixed';"+"document.getElementById('player-container-id').style.top='48px'; "+"document.getElementsByClassName('mobile-topbar-header')[0].style.display='flex'; "+"},50);})()");
		}
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
				
		private int mOriginalOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE;
		
		private int mOriginalSystemUiVisibility;
				
		public CustomWebClient() {}
		
		
		public Bitmap getDefaultVideoPoster() {
			
			if (MainActivity.this == null) {
				
			return null;
                            }   
			
		return BitmapFactory.decodeResource(MainActivity.this.getApplicationContext().getResources(), 2130837573); }
		
		
		public void onShowCustomView(View paramView, WebChromeClient.CustomViewCallback viewCallback) {
			
			if (this.mCustomView != null) {
				
				onHideCustomView();
				
			return; }
			
			this.mCustomView = paramView;
			
			this.mOriginalSystemUiVisibility = MainActivity.this.getWindow().getDecorView().getSystemUiVisibility();
			
			MainActivity.this.setRequestedOrientation(this.mOriginalOrientation);
			this.mOriginalOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT;this.mCustomViewCallback = viewCallback; ((FrameLayout)MainActivity.this.getWindow().getDecorView()).addView(this.mCustomView, new FrameLayout.LayoutParams(-1, -1)); MainActivity.this.getWindow().getDecorView().setSystemUiVisibility(3846);
			
		}
		
		
		public void onHideCustomView() {
			
			((FrameLayout)MainActivity.this.getWindow().getDecorView()).removeView(this.mCustomView);
			
			this.mCustomView = null;
			
			MainActivity.this.getWindow().getDecorView().setSystemUiVisibility(this.mOriginalSystemUiVisibility);
			
			MainActivity.this.setRequestedOrientation(this.mOriginalOrientation);
						
			this.mOriginalOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE; this.mCustomViewCallback.onCustomViewHidden();
			
			this.mCustomViewCallback = null;
			
		}
		
	}
	
	      private void downloadFile(String filename, String url, String mtype) {
        try {
            DownloadManager downloadManager = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
            request.setTitle(filename)
                    .setDescription(filename)
                    .setMimeType(mtype)
                    .setAllowedOverMetered(true)
                    .setAllowedOverRoaming(true)
                    .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS.toString(), filename)				 
                    .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE |
                            DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            downloadManager.enqueue(request);
            Toast.makeText(this, "Download Started", Toast.LENGTH_SHORT).show();


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
		public void showToast(String fko) {
			
			Toast.makeText(getApplicationContext(), fko+"", Toast.LENGTH_SHORT).show();
		}
		@JavascriptInterface
		public void gohome(String fko) {
			Intent startMain = new Intent(Intent.ACTION_MAIN);
			startMain.addCategory(Intent.CATEGORY_HOME);
			startMain.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			startActivity(startMain);
		}
		
		@JavascriptInterface
		public void downvid(String namee,String urll, String m) {
		downloadFile(namee,urll,m);
		}
		@JavascriptInterface
		public void oplink(String urll) {			
		Intent ka = new Intent();
		ka.setAction(Intent.ACTION_VIEW);
        ka.setData(Uri.parse(urll));
        startActivity(ka);
        }

		@JavascriptInterface
		public void pipvid(String fk) {
			if (android.os.Build.VERSION.SDK_INT >= 26) {
				
				
				try {
					
					enterPictureInPictureMode();
					
					} catch (IllegalStateException e) {
					
					e.printStackTrace();
					
				}
				
				} else {
				Toast.makeText(getApplicationContext(), "PIP not Supported", Toast.LENGTH_SHORT).show();
			}
	}}
	
	
	
	
	public void inject() {
		
		try {
			InputStream inputStream = getAssets().open("app.js");
			byte[] buffer = new byte[inputStream.available()];
			inputStream.read(buffer);
			inputStream.close();
			String encoded = Base64.encodeToString(buffer, Base64.NO_WRAP);
			web.loadUrl("javascript:(function() {" +
			"var parent = document.getElementsByTagName('head').item(0);" +
			"var script = document.createElement('script');" +
			"script.type = 'text/javascript';" +
			"script.innerHTML = window.atob('" + encoded + "');" +
			"parent.appendChild(script)" +
			"})()");
			} catch (Exception e) {
			
		}
		
	}
}
