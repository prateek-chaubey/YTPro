/*****YTPRO*******
Author: Prateek Chaubey
Version: 4.0.0
URI: https://github.com/prateek-chaubey/YTPRO
Last Updated On: 19 Sep , 2026 , 07:11 IST
*/



window.ytproSabrDownload= async function() {


var ytproDownDiv=getDownloadElement();

ytproDownDiv.querySelector("#videoViewDiv").innerHTML="Loading...";


//Get Video ID
var videoId ="";

if(window.location.pathname.indexOf("shorts") > -1){
videoId=window.location.pathname.substr(8,window.location.pathname.length);
}
else{
videoId=new URLSearchParams(window.location.search).get("v");
}


//videoId="vY31qIX7LzQ";


if (!videoId) { window.Android?.showToast?.('No video ID found in URL.'); return; }

// Imports
const { Innertube, Platform, Constants,IRawResponse } = await import(
'https://cdn.jsdelivr.net/npm/youtubei.js@18.0.0/bundle/browser.min.js'
);
const { SabrStream } = await import('https://esm.sh/googlevideo@4.1.1/sabr-stream');
const { buildSabrFormat , EnabledTrackTypes } = await import('https://esm.sh/googlevideo@4.1.1/utils');

const { BotGuardClient, getChallenge } = await import('https://esm.sh/bgutils-js@4.0.3/botguard');
const { WebPoSignalOutput } = await import('https://esm.sh/bgutils-js@4.0.3/shared-types');
const { buildURL, getHeaders, USER_AGENT, parseLooseJSON } = await import('https://esm.sh/bgutils-js@4.0.3/utils');
const { WebPoMinter } = await import('https://esm.sh/bgutils-js@4.0.3/webpo');




async function fetchFunction(input, init = {}) {


const reqUrl = input instanceof Request ? input.url : input.toString();
const url    = new URL(reqUrl);
const method = init.method ?? (input instanceof Request ? input.method : 'GET');
const headers = new Headers();

if (input instanceof Request) input.headers.forEach((v, k) => headers.set(k, v));
if (init.headers) new Headers(init.headers).forEach((v, k) => headers.set(k, v));

headers.set('User-Agent', "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");
headers.set('Sec-Ch-Ua', '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"');
headers.set('Sec-Ch-Ua-Mobile', '?0');
headers.set('Sec-Ch-Ua-Platform', '"Windows"');

const playerId = Array.from(document.scripts)
.map(s => s.src.match(/player\/(.*?)\/player/))
.find(m => m)?.[1] || '4b0d80ee';

if (url.pathname === '/iframe_api') {
const mockedApiCode = `var scriptUrl = 'https:\\/\\/www.youtube.com\\/s\\/player\\/${playerId}\\/www-widgetapi.vflset\\/www-widgetapi.js';try{var ttPolicy=window.trustedTypes.createPolicy("youtube-widget-api",{createScriptURL:function(x){return x}});scriptUrl=ttPolicy.createScriptURL(scriptUrl)}catch(e){}var YT;if(!window["YT"])YT={loading:0,loaded:0};var YTConfig;if(!window["YTConfig"])YTConfig={"host":"https://www.youtube.com"};\nif(!YT.loading){YT.loading=1;(function(){var l=[];YT.ready=function(f){if(YT.loaded)f();else l.push(f)};window.onYTReady=function(){YT.loaded=1;var i=0;for(;i<l.length;i++)try{l[i]()}catch(e){}};YT.setConfig=function(c){var k;for(k in c)if(c.hasOwnProperty(k))YTConfig[k]=c[k]};var a=document.createElement("script");a.type="text/javascript";a.id="www-widgetapi-script";a.src=scriptUrl;a.async=true;var c=document.currentScript;if(c){var n=c.nonce||c.getAttribute("nonce");if(n)a.setAttribute("nonce",\nn)}var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)})()};`;
return new Response(mockedApiCode, { status: 200, headers: { 'Content-Type': 'text/javascript' } });
}

if (url.pathname.startsWith('/s/player/')) {
url.hostname = 'www.youtube.com';
headers.delete('Cookie');
headers.set('Origin',  'https://www.youtube.com');
headers.set('Referer', 'https://www.youtube.com/');
} else {
if (url.hostname.includes('youtube.com')) url.hostname = 'm.youtube.com';
headers.set('Origin',  'https://m.youtube.com');
headers.set('Referer', 'https://m.youtube.com/');
if (cookies) headers.set('Cookie', cookies);
}

let body = init.body ?? null;
if (!body && input instanceof Request && method !== 'GET' && method !== 'HEAD') {
body = await input.arrayBuffer();
}
return fetch(url.toString(), { method, headers, body, credentials: 'omit' });
}



  

Platform.shim.eval = async (data, env) => {
const props = [];
if (env.n)   props.push(`n: exportedVars.nFunction("${env.n}")`);
if (env.sig) props.push(`sig: exportedVars.sigFunction("${env.sig}")`);
return new Function(`${data.output}\nreturn { ${props.join(', ')} }`)();
};

// Create Innertube (WEB Client Setup & Proxy)
const cookies = window.Android?.getAllCookies?.('https://www.youtube.com') ?? '';

const yt = await Innertube.create({
cookie: cookies,
retrieve_player: true,
generate_session_locally: true,
fetch: fetchFunction});




  

// PoToken Generator 
let placeholderPoToken = null;

  
async function generateFullPoToken() {
try {

const initialAttestationData = document.body.innerHTML.match(/window\.ytAtN\(\s*({[\s\S]*?})\s*\)/);
const initialAttestationDataJson = parseLooseJSON(initialAttestationData[1]);


const payload = {
  engagementType: 'ENGAGEMENT_TYPE_UNBOUND',
  eacrToken: initialAttestationDataJson.T
};


const challengeResponse =  await yt.actions.execute('/att/get', { parse: true, ...payload });


const bg = challengeResponse.bg_challenge;

const challenge = {
interpreterUrl: {
privateDoNotAccessOrElseTrustedResourceUrlWrappedValue:
bg.interpreter_url.private_do_not_access_or_else_trusted_resource_url_wrapped_value,
},
interpreterHash:            bg.interpreter_hash,
program:                    bg.program,
globalName:                 bg.global_name,
clientExperimentsStateBlob: bg.client_experiments_state_blob,
};

const interpreterJsRes = await fetch(
`https:${challenge.interpreterUrl.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue}`
);
const interpreterJS = await interpreterJsRes.text();

new Function(interpreterJS)();
const bgClient = await BotGuardClient.create({
program:    challenge.program,
globalName: challenge.globalName,
globalObject:  window,
});

const webPoSignalOutput = [];
const botguardResponse  = await bgClient.snapshot({ webPoSignalOutput });

const REQUEST_KEY       = 'O43z0dpjhgX20SCx4KAo';
const integrityTokenRes = await fetch(buildURL('GenerateIT'), {
method:  'POST',
headers: getHeaders(),
body:    JSON.stringify([REQUEST_KEY, botguardResponse]),
});
const [integrityToken, estimatedTtlSecs, mintRefreshThreshold, websafeFallbackToken] =
await integrityTokenRes.json();

if (!integrityToken) throw new Error('Empty integrity token');

const minter  = await WebPoMinter.create(
{ integrityToken, estimatedTtlSecs, mintRefreshThreshold, websafeFallbackToken },
webPoSignalOutput
);

return await minter.mintAsWebsafeString(videoId);
} catch (e) {
console.error('[YTPRO] PoToken generation failed:', e);
return null;
}
}

const fullTokenPromise =await generateFullPoToken();

const info = await yt.getBasicInfo(videoId, { client: 'WEB' });

 
const player = yt.session.player;
const streamingData = info.streaming_data;
  

if (!streamingData || !player) { 
window.Android?.showToast?.('No streaming data or player found.'); 
return; 
}

const safeTitle = info.basic_info.title.replace(/[\/\\?%*:|"<>]/g, '-');

// Fallback size formatter just in case window.formatFileSize isn't ready
const formatBytes = (bytes) => {
if (window.formatFileSize) return window.formatFileSize(bytes);
if (bytes === 0 || isNaN(bytes)) return "Unknown Size";
const k = 1024;
const sizes = ['Bytes', 'KB', 'MB', 'GB'];
const i = Math.floor(Math.log(bytes) / Math.log(k));
return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper to standardize format objects
const cleanFormat = (f) => {
const durationSec = (f.approxDurationMs || f.approx_duration_ms || info.basic_info.duration * 1000 || 0) / 1000;
const bytes = f.contentLength ? parseInt(f.contentLength) : (f.bitrate ? Math.floor((f.bitrate * durationSec) / 8) : 0);
const mime = f.mimeType || f.mime_type || "";
const isWebm = mime.includes('webm');
const isMp4 = mime.includes('mp4');
const codec = mime.match(/codecs="(.*?)"/)?.[1] || "";

return {
itag: f.itag,
mimeType: mime,
container: isWebm ? 'webm' : (isMp4 ? 'mp4' : 'other'),
codec: codec,
qualityLabel: f.qualityLabel || f.quality_label || null,
bitrate: f.bitrate,
width: f.width,
hasVideo: !!f.width,
hasAudio: !!f.audioSampleRate || !!f.audio_sample_rate || mime.startsWith('audio/'),
languageId: f.language || f.audioTrack?.id || f.audio_track?.id || 'default',
languageName: f.audioTrack?.displayName || f.audio_track?.display_name || 'Default',
isDefaultAudio: f.audioTrack?.audioIsDefault || f.audio_track?.audio_is_default || (!f.audioTrack && !f.audio_track),
sizeBytes: bytes,
audioQuality:f.audio_quality || null,
audioTrackId:f.audio_track?.id,
sizeFormatted: formatBytes(bytes)
};
};

// Extract raw lists
const rawFormats = streamingData.formats || [];
const rawAdaptive = streamingData.adaptive_formats || [];

const preMuxed = rawFormats.map(cleanFormat);
const adaptive = rawAdaptive.map(cleanFormat);

// Filter adaptive for matching
const videoOnly = adaptive.filter(f => f.hasVideo && !f.hasAudio);
const audioOnly = adaptive.filter(f => f.hasAudio && !f.hasVideo);

// ── BUILD CATEGORY 2: MUXABLE COMBINATIONS ──
const muxableOptions = [];

// Get all unique video qualities (e.g., "1080p60", "1080p", "720p")
const uniqueQualities = [...new Set(videoOnly.map(v => v.qualityLabel).filter(Boolean))]
.sort((a, b) => parseInt(b) - parseInt(a)); // Sort High to Low

// Get all unique audio languages
const uniqueLanguages = [];
const langMap = new Map();
audioOnly.forEach(a => {
if (!langMap.has(a.languageId)) {
langMap.set(a.languageId, { id: a.languageId, name: a.languageName, isDefault: a.isDefaultAudio });
uniqueLanguages.push(langMap.get(a.languageId));
}
});

// Create explicit safe pairs
uniqueQualities.forEach(quality => {
// Ban AV1 to protect Android MediaMuxer
const vForQuality = videoOnly.filter(v => v.qualityLabel === quality && !v.codec.includes('av01'));

// Sort to get highest bitrate video for the container
const mp4Video = vForQuality.filter(v => v.container === 'mp4').sort((a,b) => b.bitrate - a.bitrate)[0];
const webmVideo = vForQuality.filter(v => v.container === 'webm').sort((a,b) => b.bitrate - a.bitrate)[0];

uniqueLanguages.forEach(lang => {
const aForLang = audioOnly.filter(a => a.languageId === lang.id);

// Sort to get highest bitrate audio for the container
const mp4Audio = aForLang.filter(a => a.container === 'mp4').sort((a,b) => b.bitrate - a.bitrate)[0];
const webmAudio = aForLang.filter(a => a.container === 'webm').sort((a,b) => b.bitrate - a.bitrate)[0];

// Add matching MP4 pair
if (mp4Video && mp4Audio) {
muxableOptions.push({
type: 'muxable',
qualityLabel: quality,
language: lang.name,
languageId: lang.id,
isDefaultLanguage: lang.isDefault,
container: 'mp4',
totalBytes: mp4Video.sizeBytes + mp4Audio.sizeBytes,
totalSizeFormatted: formatBytes(mp4Video.sizeBytes + mp4Audio.sizeBytes),
videoItag: mp4Video.itag,
audioItag: mp4Audio.itag,
videoDetails: mp4Video,
audioDetails: mp4Audio
});
}

// Add matching WebM pair
if (webmVideo && webmAudio) {
muxableOptions.push({
type: 'muxable',
qualityLabel: quality,
language: lang.name,
languageId: lang.id,
isDefaultLanguage: lang.isDefault,
container: 'webm',
totalBytes: webmVideo.sizeBytes + webmAudio.sizeBytes,
totalSizeFormatted: formatBytes(webmVideo.sizeBytes + webmAudio.sizeBytes),
videoItag: webmVideo.itag,
audioItag: webmAudio.itag,
videoDetails: webmVideo,
audioDetails: webmAudio
});
}
});
});

// Final Master Object
const ytproMediaData = {
title: info.basic_info.title,
videoId: videoId,
durationSec: info.basic_info.duration || 0,
categories: {
"muxable": muxableOptions,
"audioOnly": audioOnly,
"videoOnly": videoOnly
}
};



ytproDownDiv.insertAdjacentHTML('beforeend',`<style>#downytprodiv a{text-decoration:none;} #downytprodiv li{list-style:none; display:flex;align-items:center;justify-content:center;border-radius:25px;padding:8px;background:${d};margin:5px;margin-top:8px}
#downytprodiv select {
min-height: 20px;
width: auto;
border-radius: 25px;
border: 0;
padding:5px;
color:${c};
font-size:12px;
background:${d};
}

</style>`);




ytproDownDiv.querySelector("#videoViewDiv").innerHTML=`<label for="selectLang" style="margin-right:5px;">Language:</label>`;


var langList=document.createElement("select");
langList.setAttribute("id","selectLang")

uniqueLanguages.forEach(l=>{
var sl=document.createElement("option");
sl.textContent=l.name;
sl.value=l.id;
if (l.isDefault === true) {
sl.selected = true;
}
langList.appendChild(sl);
});



ytproDownDiv.querySelector("#videoViewDiv").appendChild(langList);


langList.addEventListener("change",(e)=>{
updateMuxFormats(e.target.value);
updateAudioOnlyFormats(e.target.value);
})









//var defaultLangId=uniqueLanguages.filter( arr => { return arr.isDefault;})[0].id;

var createAndAppend=()=>{
var div=document.createElement("div");
ytproDownDiv.querySelector("#videoViewDiv").appendChild(div);
return div;
}


var muxedDiv=createAndAppend();
var audioOnlyDiv=createAndAppend();
var videoOnlyDiv=createAndAppend();




function updateMuxFormats(langId=uniqueLanguages.filter( arr => { return arr.isDefault;})[0].id){

muxedDiv.innerHTML="";

muxableOptions.forEach(mux =>{
if(mux.languageId != langId) return;

var formatLi=document.createElement("li");
/*formatLi.dataset.audioItag=mux.audioItag;
formatLi.dataset.videoItag=mux.videoItag;
formatLi.dataset.langId=mux.languageId;
formatLi.dataset.isWebm=mux.container == "webm";
*/


Object.assign(formatLi.dataset,{
langId:mux.audioDetails.audioTrackId,
isWebm:mux.container == "webm",
audioItag:mux.audioItag,
videoItag:mux.videoItag
});


formatLi.innerHTML=`${downBtn}<span style="margin-left:10px;" >${mux.qualityLabel} | ${mux.container.toUpperCase()} | ${mux.totalSizeFormatted}</span>`;
muxedDiv.appendChild(formatLi);
});




}



function updateAudioOnlyFormats(langId=uniqueLanguages.filter( arr => { return arr.isDefault;})[0].id){

audioOnlyDiv.innerHTML="";

var formatDivider=document.createElement("li");

formatDivider.innerHTML=`
<span>Audio Only (${uniqueLanguages.filter( arr => { return arr.id==langId;})[0].name})</span> 
<span style="margin-left:10px;transform:rotate(180deg);"  >
<svg style="margin-top:5px" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${c}"  viewBox="0 0 18 18">
<path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
</svg>
</span>
`;
Object.assign(formatDivider.style,{
minHeight:"20px",
borderRadius:"5px",
background:"#0000"
})

audioOnlyDiv.appendChild(formatDivider);

formatDivider.addEventListener("click",()=>{
Array.from(formatDivider.parentElement.children).forEach((c,i)=>{
if(i == 0) {
c.children[1].style.transform = c.children[1].style.transform === "rotate(180deg)" ? "rotate(0deg)" : "rotate(180deg)";
return;
}
c.style.display = c.style.display === "none" ? "flex" : "none";
})
});


audioOnly.forEach(aud =>{
if(aud.languageId != langId) return;

var formatLi=document.createElement("li");
/*formatLi.dataset.audioItag=aud.itag;
formatLi.dataset.isWebm=aud.container == "webm";
formatLi.dataset.langId=mux.languageId;*/

Object.assign(formatLi.dataset,{
langId:aud.audioTrackId,
isWebm:aud.container == "webm",
audioItag:aud.itag
});

formatLi.innerHTML=`${downBtn}<span style="margin-left:10px;">${aud.audioQuality.replaceAll("AUDIO_QUALITY_"," ")} | ${aud.container.toUpperCase()} | ${aud.sizeFormatted}`;
audioOnlyDiv.appendChild(formatLi);
});




}



function updateVideoOnlyFormats(){

videoOnlyDiv.innerHTML="";

var formatDivider=document.createElement("li");

formatDivider.innerHTML=`
<span>Video Only</span> 
<span style="margin-left:10px;transform:rotate(180deg);"  >
<svg style="margin-top:5px" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${c}"  viewBox="0 0 18 18">
<path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
</svg>
</span>
`;
Object.assign(formatDivider.style,{
minHeight:"20px",
borderRadius:"5px",
background:"#0000"
})

videoOnlyDiv.appendChild(formatDivider);

formatDivider.addEventListener("click",()=>{
Array.from(formatDivider.parentElement.children).forEach((c,i)=>{
if(i == 0) {
c.children[1].style.transform = c.children[1].style.transform === "rotate(180deg)" ? "rotate(0deg)" : "rotate(180deg)";
return;
}
c.style.display = c.style.display === "none" ? "flex" : "none";
})
});


videoOnly.forEach(vid =>{

var formatLi=document.createElement("li");
formatLi.dataset.videoItag=vid.itag;
formatLi.dataset.isWebm=vid.container == "webm";
formatLi.innerHTML=`${downBtn}<span style="margin-left:10px;" >${vid.qualityLabel} | ${vid.container.toUpperCase()} | ${vid.sizeFormatted}</span>`;
videoOnlyDiv.appendChild(formatLi);
});




}





function updateThumbnails(){
var div=ytproDownDiv.querySelector("#thumbViewDiv");
div.innerHTML="<style>.thu{height:80px;border-radius:5px;}.thu img{max-height:97%;max-width:70%;border-radius:10px;border:1px solid silver;}</style>";

var thumbs=info.basic_info.thumbnail;

thumbs.forEach(thumb=>{
div.innerHTML+=`<li class="thu" data-url="${thumb.url}" data-title="Thumbnail ${thumb.height} &#x2715; ${thumb.width} ${safeTitle} YTPRO.jpg" >
<img src="${thumb.url}"><br>
<span style="margin-left:30px;display:flex;align-items:center;justify-content:center;"  >${downBtn}<span style="margin-left:10px;"  >${thumb.height} &#x2715; ${thumb.width}
</span></span></li>`
})


div.addEventListener("click",(e)=>{
var el=e.target.closest("[data-url]");
if(!el) return;

Android.downvid(el.dataset.title,el.dataset.url,"image/jpg");

});
}


function updateCaptions(){
var div=ytproDownDiv.querySelector("#captionsViewDiv");
div.innerHTML=`<style>cp{width:100%;height:auto;padding-bottom:8px;}c{height:45px;width:50px;padding-top:5px;background:${d};border-radius:10px;margin-left:10px;display:block}</style>`;

var captions=info?.captions?.caption_tracks;

if(!captions) return div.innerHTML=`No Captions Found`;

var t=`Captions ${safeTitle} YTPRO`;

captions.forEach(cap=>{

cap.baseUrl = cap.base_url.replace("&fmt=srv3","");

div.innerHTML+=`
<span style="width:100px;text-align:left">${cap?.name?.text}</span> 
<br><br>
<div style="position:absolute;right:10px;display:flex">
<c data-url="${cap.baseUrl}&fmt=sbv" data-title="${t}" data-ext=".txt" >${downBtn} <br>.txt</c>
<c  data-url="${cap.baseUrl}&fmt=srt" data-title="${t}" data-ext=".srt" >${downBtn} <br>.srt</c>
<c  data-url="${cap.baseUrl}" data-title="${t}" data-ext=".xml"  >${downBtn} <br>.xml</c>
<c  data-url="${cap.baseUrl}&fmt=vtt" data-title="${t}" data-ext=".vtt" >${downBtn} <br>.vtt</c>
<c data-url="${cap.baseUrl}&fmt=srv1" data-title="${t}.srv1" >${downBtn} <br>.srv1</c><c  data-url="${cap.baseUrl}&fmt=ttml" data-title="${t}" data-ext=".ttml" >${downBtn} <br>.ttml</c></div>
<br>
<br><br>
<br><br>`;
});



div.addEventListener("click",(e)=>{
var el=e.target.closest("[data-url]");
if(!el) return;

Android.downvid(el.dataset.title+el.dataset.ext,el.dataset.url,"plain/text");

});


}



/*EVENT LISTENERS**/
muxedDiv.addEventListener("click",(e)=>{
var el=e.target.closest("[data-audio-itag]");
if(!el) return;
downloadSABRStream(el.dataset.videoItag,el.dataset.audioItag,el.dataset.isWebm,el.dataset.langId,EnabledTrackTypes.VIDEO_AND_AUDIO);


});



audioOnlyDiv.addEventListener("click",(e)=>{
var el=e.target.closest("[data-audio-itag]");
if(!el) return;
downloadSABRStream(null,el.dataset.audioItag,el.dataset.isWebm,el.dataset.langId,EnabledTrackTypes.AUDIO_ONLY);
});



videoOnlyDiv.addEventListener("click",(e)=>{
var el=e.target.closest("[data-video-itag]");
if(!el) return;
downloadSABRStream(el.dataset.videoItag,null,el.dataset.isWebm,null,EnabledTrackTypes.VIDEO_ONLY);
});






if(info?.basic_info?.is_live || info?.basic_info?.is_live_content){

ytproDownDiv.querySelector("#videoViewDiv").innerHTML="Downloading live streams <br>aren't supported at the moment";
}else{
updateMuxFormats();
updateAudioOnlyFormats();
updateVideoOnlyFormats(); 
}
updateThumbnails();
updateCaptions();




// ── 7. Extract SABR URL & Config ──────────────────────────────────────────
async function extractSabrConfig(playerInfo) {
const url = await player.decipher(playerInfo.streaming_data?.server_abr_streaming_url);
const cfg = playerInfo.player_config
?.media_common_config
?.media_ustreamer_request_config
?.video_playback_ustreamer_config;
return { url, cfg };
}

const { url: serverAbrUrl, cfg: ustreamerConfig } = await extractSabrConfig(info);
if (!serverAbrUrl || !ustreamerConfig) {
window.Android?.showToast?.('Missing SABR config.');
return;
}

const rawUstreamerConfig = typeof ustreamerConfig === 'string' ? ustreamerConfig : JSON.stringify(ustreamerConfig);
const adaptiveFormats = streamingData.adaptive_formats ?? [];
const sabrFormats = adaptiveFormats.map(f => buildSabrFormat(f));






async function downloadSABRStream(videoItag,audioItag,isWebm,langId,enabledTrack){
  
  
if(!Android.isWebViewSupported()){
  Android.showToast("Please Update your WebView.");
  return;
}
if(!Android.hasStoragePermission()){
  return;
}

Android.showToast("Download Started");


const containerExt = isWebm == "true" ? 'webm' : 'mp4';

// ── Grab the absolute lowest qualities to feed to the Black Hole 

const lowestAudio = audioOnly.sort((a, b) => (a.bitrate || 0) - (b.bitrate || 0))[0].itag;

const lowestVideo = adaptiveFormats
.filter(f => f.width)
.sort((a, b) => (a.bitrate || 0) - (b.bitrate || 0))[0].itag;

const trashSabrAudio = sabrFormats.filter(s=> s.itag==lowestAudio)[0];
const trashSabrVideo =sabrFormats.filter(s=> s.itag==lowestVideo)[0];


const targetSabrVideo=sabrFormats.filter(s=> s.itag==videoItag)[0] || trashSabrVideo;

var targetSabrAudio;

if(langId != "undefined"){
targetSabrAudio = sabrFormats.filter(s=> s.itag==audioItag && s.audioTrackId == langId)[0] || trashSabrAudio;
}else{
targetSabrAudio = sabrFormats.filter(s=> s.itag==audioItag)[0] || trashSabrAudio;
}


const sabrStream = new SabrStream({
videoId: videoId,
cpn: info.cpn, 
serverAbrStreamingUrl: serverAbrUrl,
videoPlaybackUstreamerConfig: rawUstreamerConfig,
formats: sabrFormats,
poToken: placeholderPoToken ?? undefined, 
clientInfo: {
clientName: 1, // WEB
clientVersion: yt.session.context.client.clientVersion,
osName: 'Windows',
osVersion: '10.0',
},
durationMs: (info.basic_info.duration ?? 0) * 1000,
fetch: async (input, init = {}) => {
const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
return fetch(url, { ...init, mode: 'cors', credentials: 'include' });
},
});

sabrStream.on('reloadPlayerResponse', async () => {
try {
const freshInfo = await yt.getBasicInfo(videoId, { client: 'WEB' });
const { url: newUrl, cfg: newCfg } = await extractSabrConfig(freshInfo);
if (newUrl) sabrStream.setStreamingURL(newUrl);
if (newCfg) sabrStream.setUstreamerConfig(typeof newCfg === 'string' ? newCfg : JSON.stringify(newCfg));
} catch (e) {}
});

let isTokenApplied = false;
sabrStream.on('streamProtectionStatusUpdate', async (data) => {
if ((data.status === 2 || data.status === 3) && !isTokenApplied) {
isTokenApplied = true;
try {
const fullToken = await fullTokenPromise; 
if (fullToken) sabrStream.poToken = fullToken;
} catch (err) {}
}
});


const { videoStream ,audioStream} = await sabrStream.start({
preferMp4: !isWebm,  
preferH264: !isWebm, 
videoFormat: () => targetSabrVideo, 
audioFormat: () => targetSabrAudio,
enabledTrackTypes:enabledTrack,
});

const durationSec = info.basic_info.duration || 0;


createDownloaderStatus();
createDownloaderIndicator();

var downloaderDiv=document.querySelector("#ytProDownloaderDiv");



function createProgreses(streamName){

var elProgressBar=document.createElement("div");
var elProgress=document.createElement("div");
var elDetails=document.createElement("span");

elDetails.className="ytproDetails";
elProgressBar.className="ytproProgressBar";
elProgress.className="ytproProgress";
elProgressBar.appendChild(elProgress);

elDetails.innerHTML=`${streamName}: <span><span>`

downloaderDiv.appendChild(elDetails)
downloaderDiv.appendChild(elProgressBar);

return {elDetails,elProgress};
}



//video only
if(enabledTrack==EnabledTrackTypes.VIDEO_ONLY){

const estVideoBytes = targetSabrVideo.contentLength || (targetSabrVideo.bitrate ? Math.floor((targetSabrVideo.bitrate * durationSec) / 8) : 0);


downloaderDiv.insertAdjacentHTML("beforeend",`
<br><br><b>Title: ${safeTitle}</b><br>`)

var fileName=`${safeTitle}_video${new Date().getTime()}.${containerExt}`;

var {elDetails,elProgress} = createProgreses("Video Stream");

await pipeToDisk(videoStream,fileName, estVideoBytes,elDetails,elProgress);



}else if(enabledTrack==EnabledTrackTypes.AUDIO_ONLY){
//audio only 


const estAudioBytes = targetSabrAudio.contentLength || 
(targetSabrAudio.bitrate ? Math.floor((targetSabrAudio.bitrate * durationSec) / 8) : 0);

downloaderDiv.insertAdjacentHTML("beforeend",`
<br><br><b>Title: ${safeTitle}</b><br>`)


var {elDetails,elProgress} = createProgreses("Audio Stream");

var fileName=`${safeTitle}_audio${new Date().getTime()}.${containerExt}`;

await pipeToDisk(audioStream,fileName, estAudioBytes,elDetails,elProgress);



}else if(enabledTrack==EnabledTrackTypes.VIDEO_AND_AUDIO){
//both 



const estVideoBytes = targetSabrVideo.contentLength || (targetSabrVideo.bitrate ? Math.floor((targetSabrVideo.bitrate * durationSec) / 8) : 0);


const estAudioBytes = targetSabrAudio.contentLength || 
(targetSabrAudio.bitrate ? Math.floor((targetSabrAudio.bitrate * durationSec) / 8) : 0);


downloaderDiv.insertAdjacentHTML("beforeend",`
<br><br><b>Title: ${safeTitle}</b><br>`)


var videoEl= createProgreses("Video Stream");
var audioEl= createProgreses("Audio Stream");


var videoFileName=`${safeTitle}_video${new Date().getTime()}.${containerExt}`;

var audioFileName=`${safeTitle}_audio${new Date().getTime()}.${containerExt}`;


const downloadTasks = [];

if (videoStream) {
downloadTasks.push(pipeToDisk(videoStream, videoFileName, estVideoBytes,videoEl.elDetails,videoEl.elProgress));
}

if (audioStream) {
downloadTasks.push(pipeToDisk(audioStream, audioFileName, estAudioBytes,audioEl.elDetails,audioEl.elProgress));
}

await Promise.all(downloadTasks);


window.Android.showToast('Muxing formats...');

window.Android?.muxVideoAudio?.(videoFileName,audioFileName,`${safeTitle}_${new Date().getTime()}.${containerExt 
}`);

}









}


}




function getDownloadElement() {
const isExisting = (id) => document.getElementById(id);

// Reuse or create outer + inner divs
const ytproDown = isExisting("outerdownytprodiv") || document.createElement("div");
const ytproDownDiv = isExisting("downytprodiv") || document.createElement("div");

ytproDown.id = "outerdownytprodiv";
ytproDownDiv.id = "downytprodiv";

Object.assign(ytproDown.style, {
height: "100%", width: "100%", position: "fixed",
top: "0", left: "0", display: "flex",
justifyContent: "center", background: "rgba(0,0,0,0.4)", zIndex: "9"
});

Object.assign(ytproDownDiv.style, {
height: "65%", width: "85%", overflow: "auto",
background: isD ? "#212121" : "#f1f1f1",
position: "absolute", bottom: "20px", zIndex: "99",
padding: "20px", borderRadius: "25px", textAlign: "center"
});

ytproDown.addEventListener("click", (ev) => {
if (!ytproDownDiv.contains(ev.target)) history.back();
});

// Build tabs declaratively
const TABS = [
{ label: "Formats",    viewId: "videoViewDiv"    },
{ label: "Thumbnails", viewId: "thumbViewDiv"    },
{ label: "Captions",   viewId: "captionsViewDiv" },
];

const tabStyle = {
height: "100%",
width: "calc((100% - 10px) / 3)",
borderRadius: "25px",
lineHeight: "30px"
};

const tabs = document.createElement("div");
Object.assign(tabs.style, {
height: "30px", width: "95%", display: "flex",
gap: "5px", position: "absolute", top: "10px", left: "2.5%"
});

const views = [];

TABS.forEach(({ label, viewId }) => {
const tab = document.createElement("div");
Object.assign(tab.style, tabStyle);
tab.textContent = label;
tab.dataset.view = `#${viewId}`;
tabs.appendChild(tab);

const view = document.createElement("div");
view.id = viewId;
view.style.paddingTop="40px";
view.style.display = "none";
ytproDownDiv.appendChild(view);
views.push(view);
});

tabs.addEventListener("click", (e) => {
const el = e.target.closest("[data-view]");
if (!el) return;

[...tabs.children].forEach(child => child.style.background = "transparent");
views.forEach(v => v.style.display = "none");

document.querySelector(el.dataset.view).style.display = "block";
el.style.background = d;
});

document.body.appendChild(ytproDown);
ytproDown.appendChild(ytproDownDiv);
ytproDownDiv.prepend(tabs); // tabs sit above views

tabs.children[0].style.background=d;
document.querySelector("#videoViewDiv").style.display = "block"

return ytproDownDiv;
}




// 1. Global registry to catch ports when Android sends them back
const pendingStreams = {};

window.addEventListener("message", (event) => {
if (typeof event.data === "string" && event.data.startsWith("PORT_FOR:") && event.ports.length > 0) {
const fileName = event.data.substring(9);
if (pendingStreams[fileName]) {
pendingStreams[fileName](event.ports[0]); // Hand the port back to pipeToDisk
delete pendingStreams[fileName];
}
}
});

// 2. Helper function to request a dedicated pipe
function createDedicatedPipe(fileName) {
return new Promise((resolve) => {
pendingStreams[fileName] = resolve;
window.Android?.requestBinaryPort?.(fileName);
});
}

// 3. pipeToDisk
async function pipeToDisk(stream, fileName, expectedTotalBytesStr, elDetails, elProgress) {
const expectedBytes = parseInt(expectedTotalBytesStr || "0", 10);
const totalMB = expectedBytes > 0 ? (expectedBytes / (1024 * 1024)).toFixed(2) : '?';

const filePort = await createDedicatedPipe(fileName);
if (!filePort) {
console.error(`[YTPRO] Failed to get port for ${fileName}`);
return 0;
}

const reader = stream.getReader();
let total = 0;
let lastLogMB = -1;

try {
const CHUNK_SIZE = 1024 * 512; 

while (true) {
const { done, value } = await reader.read();
if (done) break;

if (value?.length > 0) {
let offset = 0;
while (offset < value.length) {
    const chunkBuffer = value.slice(offset, offset + CHUNK_SIZE).buffer;

    // Send the binary chunk down this file's specific port
    filePort.postMessage(chunkBuffer);

    const bytesWritten = chunkBuffer.byteLength;
    offset += bytesWritten;
    total += bytesWritten;

    const currentMBFloor = Math.floor(total / (1024 * 1024));
    if (currentMBFloor > lastLogMB) {
        const downloadedMB = (total / (1024 * 1024)).toFixed(2);
        const percent = expectedBytes > 0 ? Math.round((total / expectedBytes) * 100) : -1;

        elDetails.children[0].innerHTML = ` ${downloadedMB} MB / ${totalMB} MB`;
        elProgress.style.width = percent + "%";
        elProgress.innerHTML = percent + "%";

        window.Android?.onDownloadProgress?.(percent, total);
        lastLogMB = currentMBFloor;
    }

    await new Promise(r => setTimeout(r, 5)); 
}
}
}
} finally {
// Tell Android THIS specific port is finished, so Java can close the file and kill the port
filePort.postMessage("END");
}

const finalMB = (total / (1024 * 1024)).toFixed(2);
elDetails.children[0].innerHTML = ` ${finalMB} MB / ${totalMB} MB`;
elProgress.style.width = "100%";
elProgress.innerHTML = "100%";

return total;
}




function createDownloaderStatus(){

if(document.querySelector("#ytProDownloaderDiv")) return;

var div=document.createElement("div");

div.id="ytProDownloaderDiv";



Object.assign(div.style,{
height:"50%",
overflow:"auto",
width:"calc(95% - 20px)",
zIndex:999999,
position:"fixed",
padding:"10px",
bottom:"10px",
display:"none",
left:"2.5%",
background:isD ? "#212121" : "#f1f1f1",
borderRadius:"25px",
textAlign:"center",
boxShadow:"1px 1px 2px black"
});

div.innerHTML=`
<style>
.ytproDetails{
display:block;
width:95%;
margin:auto;
margin-top:5px;
text-align:left;
}
.ytproProgressBar{
display:flex;
position:relative;
width:95%;
height:20px;
padding:5px;
margin:auto;
margin-top:5px;
background:${d};
border-radius:20px;
}
.ytproProgress{
display:grid;
place-items:center;
position:relative;
width:0%;
height:20px;
background:${c};
border-radius:20px;
text-align:center;
color:${dc};
line-height:20px;
transition:0.25s;
}
</style>
<br>
<span style="opacity:0.8;"> INFO: Do NOT close YTPRO while we are downloading the files<br>
(SABR streams are limited with 1-2 MBps speed by youtube servers)</span>
<br>
`;


document.body.appendChild(div);

}






function createDownloaderIndicator(){
if(document.querySelector("#ytproDownloadIndicator") ) return;
var div=document.createElement("div");
div.id="ytproDownloadIndicator";

Object.assign(div.style,{
height:"50px",
width:"50px",
zIndex:999999,
position:"fixed",
bottom:"calc(40px)",
right:"20px",
background:isD ? "#212121" : "#f1f1f1",
borderRadius:"50%",
border:`1px solid ${c}`,
display:"grid",
placeItems:"center"
});

div.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" height="36" width="36" viewBox="0 0 24 24" fill="none"><style> .arrow { animation: drop 1.5s infinite ease-in-out; } @keyframes drop{  0% {transform: translateY(-8px);opacity: 0;}20% {opacity: 1;}80% {opacity: 1;}100% {transform: translateY(2px);opacity: 0;}}</style><path class="arrow" d="M16.59 9H15V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5H7.41a1 1 0 0 0-.7 1.7l4.59 4.59a1 1 0 0 0 1.42 0l4.59-4.59a1 1 0 0 0-.72-1.7Z" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><rect x="5" y="17.2" width="14" height="1.8" rx="0.9" fill="${c}" /></svg>`;


document.body.appendChild(div)

div.addEventListener("click",()=>{
var el=document.querySelector("#ytProDownloaderDiv");

if(el.style.display=="block"){
el.style.display="none";
div.style.bottom="70px";
}else{
el.style.display="block";
div.style.bottom="calc(50% + 40px)";
}
})

}


