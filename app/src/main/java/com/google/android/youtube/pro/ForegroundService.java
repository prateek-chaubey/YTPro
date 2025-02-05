package com.google.android.youtube.pro;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaMetadata;
import android.media.session.MediaSession;
import android.media.session.PlaybackState;
import android.os.Build;
import android.os.IBinder;
import android.util.Base64;

public class ForegroundService extends Service {

    public static final String CHANNEL_ID = "Media";
    public static final String ACTION_UPDATE_NOTIFICATION = "UPDATE_NOTIFICATION";
    private NotificationManager notificationManager;
    private BroadcastReceiver updateReceiver;
    private MediaSession mediaSession;

    @Override
    public void onCreate() {
        super.onCreate();
        initMediaSession();
        registerUpdateReceiver();
        createNotificationChannel();
    }


    private void initMediaSession() {
        mediaSession = new MediaSession(getApplicationContext(), "YourMediaSessionTag");
        mediaSession.setFlags(MediaSession.FLAG_HANDLES_MEDIA_BUTTONS | MediaSession.FLAG_HANDLES_TRANSPORT_CONTROLS);

        mediaSession.setCallback(new MediaSession.Callback() {
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


    public void updateNotification(String icon, String title, String subtitle, String action, long duration, long currentPosition) {

        Context cont=getApplicationContext();

        byte[] decodedBytes = Base64.decode(icon, Base64.DEFAULT);
        Bitmap largeIcon = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);


        int playbackState;
        if("pause".equals(action)){
            playbackState= PlaybackState.STATE_PAUSED;
        }
        else if("play".equals(action)){
            playbackState= PlaybackState.STATE_PLAYING;
        }else{
            playbackState= PlaybackState.STATE_BUFFERING;
        }

        updateMediaSessionMetadata(title, subtitle, largeIcon, duration); // Example usage
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

        Notification.Builder builder = (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) ? new Notification.Builder(this, CHANNEL_ID) : new Notification.Builder(this);

        builder.setSmallIcon(R.drawable.app_icon)
                .setContentTitle(title)
                .setContentText(subtitle)
                .setLargeIcon(largeIcon)
                .setContentIntent(openAppPendingIntent)
                .setStyle(new Notification.MediaStyle().setMediaSession(mediaSession.getSessionToken()))
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

                    updateNotification(icon, title, subtitle, action, duration, currentPosition);
                }
            }
        };

        IntentFilter filter = new IntentFilter(ACTION_UPDATE_NOTIFICATION);

          if (Build.VERSION.SDK_INT >= 34 && getApplicationInfo().targetSdkVersion >= 34) {
           registerReceiver(updateReceiver, filter,RECEIVER_EXPORTED);
          }
          else{
           registerReceiver(updateReceiver, filter);
          }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            setupNotification(intent);
        }
        return START_NOT_STICKY;
    }

    private void setupNotification(Intent intent) {
        long duration = intent.getLongExtra("duration", 0);
        long currentPosition = intent.getLongExtra("currentPosition", 0);
        int playbackState = intent.getIntExtra("playbackState", PlaybackState.STATE_NONE);
        String title = intent.getStringExtra("title");
        String subtitle = intent.getStringExtra("subtitle");
        String icon = intent.getStringExtra("icon");

        byte[] decodedBytes = Base64.decode(icon, Base64.DEFAULT);
        Bitmap largeIcon = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);

        Intent openAppIntent = new Intent(this, MainActivity.class);
        openAppIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent openAppPendingIntent = PendingIntent.getActivity(this, 0, openAppIntent, PendingIntent.FLAG_MUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);

        Intent playIntent = new Intent(this, NotificationActionService.class);
        playIntent.setAction("PLAY_ACTION");
        PendingIntent playPendingIntent = PendingIntent.getBroadcast(this, 0, playIntent, PendingIntent.FLAG_MUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);

        Intent pauseIntent = new Intent(this, NotificationActionService.class);
        pauseIntent.setAction("PAUSE_ACTION");
        PendingIntent pausePendingIntent = PendingIntent.getBroadcast(this, 0, pauseIntent, PendingIntent.FLAG_MUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);

        Intent nextIntent = new Intent(this, NotificationActionService.class);
        nextIntent.setAction("NEXT_ACTION");
        PendingIntent nextPendingIntent = PendingIntent.getBroadcast(this, 0, nextIntent, PendingIntent.FLAG_MUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);

        Intent prevIntent = new Intent(this, NotificationActionService.class);
        prevIntent.setAction("PREV_ACTION");
        PendingIntent prevPendingIntent = PendingIntent.getBroadcast(this, 0, prevIntent, PendingIntent.FLAG_MUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);

        Notification.Builder builder = (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) ? new Notification.Builder(this, CHANNEL_ID) : new Notification.Builder(this);

                builder.setSmallIcon(R.drawable.app_icon)
                .setContentTitle(title)
                .setContentText(subtitle)
                .setLargeIcon(largeIcon)
                .setContentIntent(openAppPendingIntent);

        // Set appropriate actions based on playback state
        switch (playbackState) {
            case PlaybackState.STATE_PLAYING:
                builder.addAction(R.drawable.ic_pause_white, "Pause", pausePendingIntent);
                break;
            case PlaybackState.STATE_PAUSED:
                builder.addAction(R.drawable.ic_play_arrow_white, "Play", playPendingIntent);
                break;
            case PlaybackState.STATE_BUFFERING:
                // Add buffering related actions if needed
                break;
            default:
                break;
        }

        builder.addAction(R.drawable.ic_skip_previous_white, "Previous", prevPendingIntent)
                .addAction(R.drawable.ic_skip_next_white, "Next", nextPendingIntent);

        Notification notification = builder.build();

        // Update MediaSession metadata and playback state
        updateMediaSessionMetadata(title, subtitle, largeIcon, duration);
        updatePlaybackState(currentPosition, playbackState);

        startForeground(1, notification);
    }
    private void updateMediaSessionMetadata(String title, String artist, Bitmap albumArt, long duration) {
        MediaMetadata metadata = new MediaMetadata.Builder()
                .putString(MediaMetadata.METADATA_KEY_TITLE, title)
                .putString(MediaMetadata.METADATA_KEY_ARTIST, artist)
                .putString(MediaMetadata.METADATA_KEY_ALBUM, "YT PRO")
                .putBitmap(MediaMetadata.METADATA_KEY_ALBUM_ART, albumArt)
                .putLong(MediaMetadata.METADATA_KEY_DURATION, duration)
                .build();

        mediaSession.setMetadata(metadata);
    }







    private void updatePlaybackState(long currentPosition, int state) {
        PlaybackState playbackState = new PlaybackState.Builder()
                .setActions(PlaybackState.ACTION_PLAY_PAUSE
                        | PlaybackState.ACTION_SKIP_TO_NEXT
                        | PlaybackState.ACTION_PAUSE
                        | PlaybackState.ACTION_SKIP_TO_PREVIOUS | PlaybackState.ACTION_SEEK_TO)
                .setState(state, currentPosition, 1.0f) // 1.0f for playback speed
                .build();

        mediaSession.setPlaybackState(playbackState);
    }


    @Override
    public void onDestroy() {
        super.onDestroy();
        unregisterReceiver(updateReceiver);
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
