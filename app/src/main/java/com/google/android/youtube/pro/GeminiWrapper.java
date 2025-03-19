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
import java.util.regex.*;
import android.util.*;
import java.io.*;
import java.util.Iterator;


public class GeminiWrapper {


private static final String GEMINI_URL = "https://gemini.google.com/app";




public static JSONObject getStream(String url, String headers, String body) {
try {


HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
connection.setRequestMethod("POST");




try{

JSONObject headersObj = new JSONObject(headers);

Iterator<String> keys = headersObj.keys();

while (keys.hasNext()) {
String key = keys.next(); 
try {
String value = headersObj.get(key).toString(); 

connection.setRequestProperty(key,value);

} catch (JSONException e) {
e.printStackTrace();
return new JSONObject();
}
}

} catch (JSONException e) {
e.printStackTrace();
return new JSONObject();
}



connection.setDoOutput(true);

try (OutputStream os = connection.getOutputStream()) {
os.write(body.toString().getBytes());
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
response.append(line).append("\n");
}

JSONObject stream = new JSONObject();
stream.put("stream", response.toString());

return stream;
}
}








public static String getSNlM0e(String cookies) {
try {

HttpURLConnection connection = (HttpURLConnection) new URL(GEMINI_URL).openConnection();
connection.setRequestMethod("GET");
connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

connection.setRequestProperty("Origin", "https://gemini.google.com");
connection.setRequestProperty("Referer", "https://gemini.google.com");
connection.setRequestProperty("X-Same-Domain", "1");
connection.setRequestProperty("Cookie", cookies);



int responseCode = connection.getResponseCode();
if (responseCode != HttpURLConnection.HTTP_OK) {
return "error";
}


try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
StringBuilder response = new StringBuilder();
String line;
while ((line = reader.readLine()) != null) {
response.append(line);
}


Matcher matcher = Pattern.compile("\"SNlM0e\":\"(.*?)\"").matcher(response.toString());
return matcher.find() ? matcher.group(1) : "error";


}catch(Exception e){
e.printStackTrace();
return "error";
}



} catch (Exception e) {
e.printStackTrace();
return "error";
}
}




}
