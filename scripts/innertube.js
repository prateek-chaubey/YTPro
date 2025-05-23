/*****YTPRO*******
Author: Prateek Chaubey
Version: 3.8.7
URI: https://github.com/prateek-chaubey/YTPRO
*/

import Jinter from 'https://cdn.jsdelivr.net/npm/jintr@3.3.1/+esm';
import { BG } from 'https://cdn.jsdelivr.net/npm/bgutils-js@3.2.0/dist/index.min.js';
import {Player,Innertube, ProtoUtils, UniversalCache, Utils } from 'https://cdn.jsdelivr.net/npm/youtubei.js@13.4.0/bundle/browser.min.js';



function write(x){

if(typeof x == "object"){
x=JSON.stringify(x,null,2)
}
var ytproDownDiv=document.getElementById("downytprodiv");

ytproDownDiv.innerHTML=x;
}





var cver="19.35.36";
var player_id;
var poToken,visitorData;
var sig_timestamp,nsig_sc,sig_sc;







async function getPo(identifier){
const requestKey = 'O43z0dpjhgX20SCx4KAo';

const bgConfig = {
fetch: (input, init) => fetch(input, init),
globalObj: window,
requestKey,
identifier
};

const bgChallenge = await BG.Challenge.create(bgConfig);

if (!bgChallenge)
throw new Error('Could not get challenge');

const interpreterJavascript = bgChallenge.interpreterJavascript.privateDoNotAccessOrElseSafeScriptWrappedValue;

if (interpreterJavascript) {
new Function(interpreterJavascript)();
} else throw new Error('Could not load VM');

const poTokenResult = await BG.PoToken.generate({
program: bgChallenge.program,
globalName: bgChallenge.globalName,
bgConfig
});

return poTokenResult.poToken;

}









async function getDeciphers(){


return new Promise(async (resolve,reject)=>{



var scripts = document.getElementsByTagName('script');
for(var i=0;i<scripts.length;i++){
if(scripts[i].src.indexOf("/base.js") > 0){
player_id=scripts[i].src.match("(?<=player\/).*(?=\/player)");
}
}



visitorData = ProtoUtils.encodeVisitorData(Utils.generateRandomString(11), Math.floor(Date.now() / 1000));

write("Fetching PoTokens...");

const coldStartToken = BG.PoToken.generatePlaceholder(visitorData);
await getPo(visitorData).then((webPo) => poToken = webPo);



write("Fetching Player JS...");

var player_js=await fetch(`https://www.youtube.com/s/player/${player_id}/player_ias.vflset/en_US/base.js`).then(x => x.text());

const ast = Jinter.parseScript(player_js, { ecmaVersion: 'latest', ranges: true });



sig_timestamp = Player.extractSigTimestamp(player_js);
const global_variable = Player.extractGlobalVariable(player_js, ast);
sig_sc = Player.extractSigSourceCode(player_js, global_variable);
nsig_sc = Player.extractNSigSourceCode(player_js, ast, global_variable);


//write(nsig_sc)
//write(sig_sc)

write("Deciphering Scripts...");



const player = await Player.fromSource(player_id, sig_timestamp, null, sig_sc, nsig_sc);

//write(JSON.stringify(player,null,2))




write("Deciphered Scripts")

resolve("done");

});

}




















function decipherUrl(url){

const args = new URLSearchParams(url);
const url_components = new URL(args.get('url') || url);



if(args.get('s') != null){
const signature = Utils.Platform.shim.eval(sig_sc, {
sig: args.get('s')
});
const sp = args.get('sp');
if(sp) {
url_components.searchParams.set(sp, signature);
} else {
url_components.searchParams.set('signature', signature);
}
}




const n = url_components.searchParams.get('n');
if(n != null){
var nsig = Utils.Platform.shim.eval(nsig_sc, {
nsig: n
});
url_components.searchParams.set('n', nsig);
}


url_components.searchParams.set('pot',poToken);
url_components.searchParams.set('cver',cver);
return url_components.toString();
}










window.getDownloadStreams=async ()=>{


write("Getting Deciphers...");

await getDeciphers();

write("Fethcing Video Info...");


var id="";

if(window.location.pathname.indexOf("shorts") > -1){
id=window.location.pathname.substr(8,window.location.pathname.length);
}
else{
id=new URLSearchParams(window.location.search).get("v");
}

var body={
"videoId": id,
"racyCheckOk": true,
"contentCheckOk": true,
"playbackContext": {
"contentPlaybackContext": {
"vis": 0,
"splay": false,
"lactMilliseconds": "-1",
"signatureTimestamp": sig_timestamp
}
},
"serviceIntegrityDimensions": {
"poToken": poToken
},
"context": {
"client": {
"hl": "en",
"gl": "US",
"remoteHost": "",
"screenDensityFloat": 1,
"screenHeightPoints": 1440,
"screenPixelDensity": 1,
"screenWidthPoints": 2560,
"visitorData": visitorData,
"clientName": "ANDROID",
"clientVersion": cver,
"osName": "Android",
"osVersion": "12",
"userAgent": "com.google.android.youtube/19.35.36(Linux; U; Android 13; en_US; SM-S908E Build/TP1A.220624.014) gzip",
"platform": "DESKTOP",
"clientFormFactor": "UNKNOWN_FORM_FACTOR",
"userInterfaceTheme": "USER_INTERFACE_THEME_LIGHT",
"timeZone": "Asia/Calcutta",
"originalUrl": "https://www.youtube.com",
"deviceMake": "",
"deviceModel": "",
"browserName": "Chrome",
"browserVersion": "125.0.0.0",
"utcOffsetMinutes": 330,
"memoryTotalKbytes": "8000000",
"mainAppWebInfo": {
"graftUrl": "https://www.youtube.com",
"pwaInstallabilityStatus": "PWA_INSTALLABILITY_STATUS_UNKNOWN",
"webDisplayMode": "WEB_DISPLAY_MODE_BROWSER",
"isWebNativeShareAvailable": true
}
},
"user": {
"enableSafetyMode": false,
"lockedSafetyMode": false
},
"request": {
"useSsl": true,
"internalExperimentFlags": []
}
}
}




var info=await fetch("https://m.youtube.com/youtubei/v1/player?prettyPrint=false",{ 
method:"POST", 
body:JSON.stringify(body) 
}).then((res)=>res.json());




handleDownloadStreams(info);




}




function handleDownloadStreams(info){
console.log(info?.streamingData);




var ytproDownDiv=document.getElementById("downytprodiv");

var thumb=info?.videoDetails?.thumbnail?.thumbnails;
var vids=info?.streamingData?.formats;
var avids=info?.streamingData?.adaptiveFormats;
var cap=info?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
var t=info?.videoDetails?.title.replaceAll("|","").replaceAll("\\","").replaceAll("?","").replaceAll("*","").replaceAll("<","").replaceAll("/","").replaceAll(":","").replaceAll('"',"").replaceAll(">","").replaceAll("'","");
ytproDownDiv.innerHTML=`<style>#downytprodiv a{text-decoration:none;} #downytprodiv li{list-style:none; display:flex;align-items:center;justify-content:center;border-radius:25px;padding:8px;background:${d};margin:5px;margin-top:8px}</style>`;



ytproDownDiv.innerHTML+="Select Avilaible Formats<ul id='listurl'>";

for(var x in vids){

var url=vids[x].url;

ytproDownDiv.innerHTML+=`<li data-ytprotit="${t}"  onclick="YTDownVid(this,'.mp4')"  data-ytprourl="${url}">
${downBtn}<span style="margin-left:10px;"  >${vids[x].qualityLabel} ${formatFileSize(((vids[x].bitrate*(vids[x].approxDurationMs/1000))/8))} </span></li>` ;
}


ytproDownDiv.innerHTML+=`<li id="showAdaptives" onclick="showHideAdaptives()" style="min-height:20px;border-radius:5px">
Show Adaptive Formats (No Audio) 
<span style="margin-left:10px;"  >
<svg style="margin-top:5px" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${c}"  viewBox="0 0 18 18">
<path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
</svg>
</span>
</li>` ;


for(x in avids){
if(!(avids[x].mimeType.indexOf("audio") > -1)){
var url=avids[x].url;
ytproDownDiv.innerHTML+=`<li data-ytprotit="${t}" class="adpFormats" style="display:none;"  onclick="YTDownVid(this,'.mp4')"  data-ytprourl="${url}">
${downBtn}<span style="margin-left:10px;"  >${avids[x].qualityLabel} ${formatFileSize(avids[x].contentLength)} 
</span></li>` ;
}
}


for(x in avids){
if(avids[x].mimeType.indexOf("audio") > -1){
var url=avids[x].url;
ytproDownDiv.innerHTML+=`<li data-ytprotit="${t}"  onclick="YTDownVid(this,'.mp3')"  data-ytprourl="${url}">
${downBtn}<span style="margin-left:10px;"  >Audio ${avids[x]?.audioTrack?.displayName || ""}  | ${avids[x].audioQuality.replace("AUDIO_QUALITY_","")}${formatFileSize(avids[x].contentLength)} 
</span></li>` ;
}
}



ytproDownDiv.innerHTML+="<br>Thumbnails<br><br><style>.thu{height:80px;border-radius:5px;}.thu img{max-height:97%;max-width:70%;border-radius:10px;border:1px solid silver;}</style>";
for(x in thumb){
ytproDownDiv.innerHTML+=`<li data-ytprotit="${t+Date.now()}"  onclick="YTDownVid(this,'.png')" class="thu" data-ytprourl="${thumb[x].url}">
<img src="${thumb[x].url}"><br>
<span style="margin-left:30px;display:flex;align-items:center;justify-content:center;"  >${downBtn}<span style="margin-left:10px;"  >${thumb[x].height} &#x2715; ${thumb[x].width}
</span></span></li>` ;
}

if(cap && cap.length){
ytproDownDiv.innerHTML+=`<br>Captions<br><br><style>cp{width:100%;height:auto;padding-bottom:8px;}c{height:45px;width:50px;padding-top:5px;background:${d};border-radius:10px;margin-left:10px;display:block}</style>`;
for(var x in cap){
cap[x].baseUrl = cap[x].baseUrl.replace("&fmt=srv3","");


ytproDownDiv.innerHTML+=`<cp>
<br><br>
<span style="width:100px;text-align:left">${cap[x]?.name?.runs[0]?.text}</span> 
<br><br>
<div style="position:absolute;right:10px;display:flex">
<c onclick="downCap('${cap[x].baseUrl}&fmt=sbv','${t}.txt')">${downBtn} <br>.txt</c>
<c onclick="downCap('${cap[x].baseUrl}&fmt=srt','${t}.srt')">${downBtn} <br>.srt</c>
<c onclick="downCap('${cap[x].baseUrl}','${t}.xml')" >${downBtn} <br>.xml</c>
<c onclick="downCap('${cap[x].baseUrl}&fmt=vtt','${t}.vtt')">${downBtn} <br>.vtt</c>
<c onclick="downCap('${cap[x].baseUrl}&fmt=srv1','${t}.srv1')">${downBtn} <br>.srv1</c><c onclick="downCap('${cap[x].baseUrl}&fmt=ttml','${t}.ttml')">${downBtn} <br>.ttml</c></div>
<br>
</cp>
<br><br>
`;
}
}




}
