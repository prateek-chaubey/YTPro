package com.google.android.youtube.pro;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class YoutubeRequest {

    private static final String CPN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    private static final String YOUTUBE_API_URL = "https://youtubei.googleapis.com/youtubei/v1/player";
 
    private static final String USER_AGENT_ANDROID = "com.google.android.youtube/19.30.36 (Linux; U; Android 14; en_US) gzip";

    private static boolean hasError = false;
    private static double currentVersion = 1.0;




    private static String generateClientPlaybackNonce(int length) {
        Random random = new Random();
        StringBuilder nonce = new StringBuilder();
        for (int i = 0; i < length; i++) {
            nonce.append(CPN_CHARS.charAt(random.nextInt(CPN_CHARS.length())));
        }
        return nonce.toString();
    }





    private static JSONObject getDefaultPayload() throws JSONException {
        JSONObject payload = new JSONObject();
        payload.put("cpn", generateClientPlaybackNonce(16));
        payload.put("contentCheckOk", true);
        payload.put("racyCheckOk", true);

        JSONObject client = new JSONObject();
        client.put("clientName", "ANDROID");
        client.put("clientVersion", "19.30.36");
        client.put("platform", "MOBILE");
        client.put("osName", "Android");
        client.put("osVersion", "14");
        client.put("androidSdkVersion", "34");
        client.put("hl", "en");
        client.put("gl", "US");
        client.put("utcOffsetMinutes", -240);

        JSONObject context = new JSONObject();
        context.put("client", client);
        context.put("request", new JSONObject().put("internalExperimentFlags", new JSONArray()).put("useSsl", true));
        context.put("user", new JSONObject().put("lockedSafetyMode", false));

        payload.put("context", context);
        return payload;
    }
    
    
    
    
    
    

    public static JSONObject getData(String videoId, boolean isRaw) {
        try {
            JSONObject payload = getDefaultPayload();
            payload.put("videoId", videoId);

            String query = "prettyPrint=false&t=" + generateClientPlaybackNonce(12) + "&id=" + videoId;
            HttpURLConnection connection = (HttpURLConnection) new URL(YOUTUBE_API_URL + "?" + query).openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("User-Agent", USER_AGENT_ANDROID);
            connection.setRequestProperty("X-Goog-Api-Format-Version", "2");
            connection.setDoOutput(true);

            try (OutputStream os = connection.getOutputStream()) {
                os.write(payload.toString().getBytes());
            }

            int responseCode = connection.getResponseCode();
            if (responseCode != HttpURLConnection.HTTP_OK) {
                return new JSONObject();
            }

            return readResponse(connection);
        } catch (Exception e) {
            e.printStackTrace();
            return new JSONObject();
        }
    }



    private static JSONObject readResponse(HttpURLConnection connection) throws Exception {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            return new JSONObject(response.toString());
        }
    }
    

}
