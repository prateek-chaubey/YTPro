package com.google.android.youtube.pro;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.AttributeSet;
import android.view.View;
import android.util.Log;
import android.webkit.WebView;

public class YTProWebview extends WebView {

    public YTProWebview(Context context) {
        super(context);
    }

    public YTProWebview(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public YTProWebview(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    protected void onWindowVisibilityChanged(int visibility) {
        
        
          SharedPreferences prefs = getContext().getSharedPreferences("YTPRO", Context.MODE_PRIVATE);
          boolean bgPlay = prefs.getBoolean("bgplay", false); 
          

        
        if (visibility != View.GONE && visibility != View.INVISIBLE || !bgPlay){
            super.onWindowVisibilityChanged(visibility);
            }
    }
}
