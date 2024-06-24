package com.google.android.youtube.pro;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.IBinder;
import android.util.Base64;
import android.content.BroadcastReceiver;
import android.content.IntentFilter;


import androidx.core.app.NotificationCompat;
import androidx.media.app.NotificationCompat.MediaStyle;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.PlaybackStateCompat;

public class ForegroundService extends Service {

public static final String CHANNEL_ID = "Media";
public static final String ACTION_UPDATE_NOTIFICATION = "UPDATE_NOTIFICATION";
private MediaSessionCompat mediaSession;
private NotificationManager notificationManager;
private static boolean isRunning = false;
private BroadcastReceiver updateReceiver;

@Override
public void onCreate() {
super.onCreate();

isRunning=true;

registerUpdateReceiver();
initMediaSession();
createNotificationChannel();
}

private void initMediaSession() {
mediaSession = new MediaSessionCompat(getApplicationContext(), "YourMediaSessionTag");
mediaSession.setFlags(MediaSessionCompat.FLAG_HANDLES_MEDIA_BUTTONS | MediaSessionCompat.FLAG_HANDLES_TRANSPORT_CONTROLS);

mediaSession.setCallback(new MediaSessionCompat.Callback() {
@Override
public void onPlay() {
super.onPlay();
getApplicationContext().sendBroadcast(new Intent("TRACKS_TRACKS")
.putExtra("actionname", "PLAY_ACTION"));

}

@Override
public void onPause() {
super.onPause();
getApplicationContext().sendBroadcast(new Intent("TRACKS_TRACKS")
.putExtra("actionname", "PAUSE_ACTION"));
}

@Override
public void onSkipToNext() {
super.onSkipToNext();
// Handle skip to next
getApplicationContext().sendBroadcast(new Intent("TRACKS_TRACKS")
.putExtra("actionname", "NEXT_ACTION"));
}

@Override
public void onSkipToPrevious() {
super.onSkipToPrevious();
// Handle skip to previous

getApplicationContext().sendBroadcast(new Intent("TRACKS_TRACKS")
.putExtra("actionname", "PREV_ACTION"));

}
@Override
public void onSeekTo(long pos) {
super.onSeekTo(pos);
getApplicationContext().sendBroadcast(new Intent("TRACKS_TRACKS")
.putExtra("actionname", "SEEKTO").putExtra("pos", pos+""));


}
});

mediaSession.setActive(true);
}

private void createNotificationChannel() {
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
NotificationChannel channel = new NotificationChannel(
CHANNEL_ID,
"Background Play",
NotificationManager.IMPORTANCE_MIN
);
notificationManager = getSystemService(NotificationManager.class);
if (notificationManager != null) {
notificationManager.createNotificationChannel(channel);
}
}
}




private void updateMediaSessionMetadata(String title, String artist, String album, Bitmap albumArt, long duration) {
MediaMetadataCompat metadata = new MediaMetadataCompat.Builder()
.putString(MediaMetadataCompat.METADATA_KEY_TITLE, title)
.putString(MediaMetadataCompat.METADATA_KEY_ARTIST, artist)
.putString(MediaMetadataCompat.METADATA_KEY_ALBUM, album)
.putBitmap(MediaMetadataCompat.METADATA_KEY_ALBUM_ART, albumArt)
.putLong(MediaMetadataCompat.METADATA_KEY_DURATION, duration)
.build();

mediaSession.setMetadata(metadata);
}







private void updatePlaybackState(long currentPosition, int state) {
PlaybackStateCompat playbackState = new PlaybackStateCompat.Builder()
.setActions(PlaybackStateCompat.ACTION_PLAY_PAUSE
| PlaybackStateCompat.ACTION_SKIP_TO_NEXT
| PlaybackStateCompat.ACTION_PAUSE
| PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS | PlaybackStateCompat.ACTION_SEEK_TO)
.setState(state, currentPosition, 1.0f) // 1.0f for playback speed
.build();

mediaSession.setPlaybackState(playbackState);
}








private void setupNotification(Intent intent) {


long duration = intent.getLongExtra("duration", 0);
long currentPosition = intent.getLongExtra("currentPosition", 0);
int playbackState = intent.getIntExtra("playbackState", PlaybackStateCompat.STATE_NONE);
String title= intent.getStringExtra("title");
String subtitle= intent.getStringExtra("subtitle");
String icon= intent.getStringExtra("icon");




byte[] decodedBytes = Base64.decode(icon, Base64.DEFAULT);
Bitmap largeIcon = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);




updateMediaSessionMetadata(title, subtitle, "YT PRO", largeIcon, duration);
updatePlaybackState(currentPosition, PlaybackStateCompat.STATE_PLAYING
);




Intent openAppIntent = new Intent(this, MainActivity.class);
openAppIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
PendingIntent openAppPendingIntent = PendingIntent.getActivity(this, 0, openAppIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);

Intent playIntent = new Intent(this, NotificationActionService.class);
playIntent.setAction("PAUSE_ACTION");
PendingIntent playPendingIntent = PendingIntent.getBroadcast(this, 0, playIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);

Intent nextIntent = new Intent(this, NotificationActionService.class);
nextIntent.setAction("NEXT_ACTION");
PendingIntent nextPendingIntent = PendingIntent.getBroadcast(this, 0, nextIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);

Intent prevIntent = new Intent(this, NotificationActionService.class);
prevIntent.setAction("PREV_ACTION");
PendingIntent prevPendingIntent = PendingIntent.getBroadcast(this, 0, prevIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);

NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
.setSmallIcon(R.drawable.app_icon)
.setContentTitle(title)
.setContentText(subtitle)
.setLargeIcon(largeIcon)
.setContentIntent(openAppPendingIntent)
.setStyle(new MediaStyle().setMediaSession(mediaSession.getSessionToken()))
.addAction(R.drawable.ic_skip_previous_white, "Previous", prevPendingIntent)
.addAction(R.drawable.ic_pause_white, "Pause", playPendingIntent)
.addAction(R.drawable.ic_skip_next_white, "Next", nextPendingIntent);

Notification notification = builder.build();

/* if(!isRunning){
isRunning=true;
startForeground(1, notification);
}
*/

startForeground(1, notification);


notificationManager.notify(1, notification);
}








@Override
public int onStartCommand(Intent intent, int flags, int startId) {

if (intent != null) {

notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

setupNotification(intent);
}

return START_NOT_STICKY;
}











public void updateNotification(String icon, String title, String subtitle, String action, long duration, long currentPosition) {

Context cont=getApplicationContext();

byte[] decodedBytes = Base64.decode(icon, Base64.DEFAULT);
Bitmap largeIcon = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);


int playbackState;
if("pause".equals(action)){
playbackState= PlaybackStateCompat.STATE_PAUSED;
}
else if("play".equals(action)){
playbackState= PlaybackStateCompat.STATE_PLAYING;
}else{
playbackState= PlaybackStateCompat.STATE_BUFFERING;
}

updateMediaSessionMetadata(title, subtitle, "YT PRO", largeIcon, duration); // Example usage
updatePlaybackState(currentPosition, playbackState); // Example usage

Intent openAppIntent = new Intent(cont, MainActivity.class);
openAppIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
PendingIntent openAppPendingIntent = PendingIntent.getActivity(cont, 0, openAppIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);

Intent playIntent = new Intent(cont, NotificationActionService.class);
playIntent.setAction("PLAY_ACTION");
PendingIntent playPendingIntent = PendingIntent.getBroadcast(cont, 0, playIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);

Intent pauseIntent = new Intent(cont, NotificationActionService.class);
pauseIntent.setAction("PAUSE_ACTION");
PendingIntent pausePendingIntent = PendingIntent.getBroadcast(cont, 0, pauseIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);

Intent nextIntent = new Intent(cont, NotificationActionService.class);
nextIntent.setAction("NEXT_ACTION");
PendingIntent nextPendingIntent = PendingIntent.getBroadcast(cont, 0, nextIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);

Intent prevIntent = new Intent(cont, NotificationActionService.class);
prevIntent.setAction("PREV_ACTION");
PendingIntent prevPendingIntent = PendingIntent.getBroadcast(cont, 0, prevIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);

NotificationCompat.Builder builder = new NotificationCompat.Builder(cont, CHANNEL_ID)
.setSmallIcon(R.drawable.app_icon)
.setContentTitle(title)
.setContentText(subtitle)
.setLargeIcon(largeIcon)
.setContentIntent(openAppPendingIntent)
.setStyle(new MediaStyle().setMediaSession(mediaSession.getSessionToken()))
.addAction(R.drawable.ic_skip_previous_white, "Previous", prevPendingIntent);

if ("play".equals(action)) {
builder.addAction(R.drawable.ic_pause_white, "Pause", pausePendingIntent)
.addAction(R.drawable.ic_skip_next_white, "Next", nextPendingIntent);
} else if ("pause".equals(action))  {
builder.addAction(R.drawable.ic_play_arrow_white, "Play", playPendingIntent)
.addAction(R.drawable.ic_skip_next_white, "Next", nextPendingIntent);
}else{

builder.addAction(R.drawable.ic_pause_white, "Pause", pausePendingIntent)
.addAction(R.drawable.ic_skip_next_white, "Next", nextPendingIntent);

}



notificationManager.notify(1, builder.build());
}







private void registerUpdateReceiver() {
updateReceiver = new BroadcastReceiver() {
@Override
public void onReceive(Context context, Intent intent) {
if (ACTION_UPDATE_NOTIFICATION.equals(intent.getAction())) {
String icon = intent.getStringExtra("icon");
String title = intent.getStringExtra("title");
String subtitle = intent.getStringExtra("subtitle");
String action = intent.getStringExtra("action");
long duration = intent.getLongExtra("duration", 0);
long currentPosition = intent.getLongExtra("currentPosition", 0);


updateNotification(icon, title, subtitle, action,  duration, currentPosition);


}
}
};


IntentFilter filter = new IntentFilter(ACTION_UPDATE_NOTIFICATION);
registerReceiver(updateReceiver, filter);
}


@Override
public void onDestroy() {
super.onDestroy();
isRunning=false;
if (mediaSession != null) {
mediaSession.release();
}
unregisterReceiver(updateReceiver);
}

@Override
public IBinder onBind(Intent intent) {
return null;
}
}
