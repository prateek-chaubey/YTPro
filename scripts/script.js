/*****YTPRO*******
Author: Prateek Chaubey
Version: 3.9.5
URI: https://github.com/prateek-chaubey/YTPRO
Last Updated On: 14 Nov , 2025 , 15:57 IST
*/


//DEBUG
/*var debug=false;
var Android={
pipvid:()=>{},
gohome:()=>{},
getInfo:()=>{},
oplink:()=>{},
downvid:()=>{}
};
s1: FoQR9rLpRy8
s2: PN51tJhZscE
*/
if(window.eruda == null && localStorage.getItem("devMode") == "true"){
//ERUDA
window.location.href=`javascript:(function () { var script = document.createElement('script'); script.src="//youtube.com/ytpro_cdn/npm/eruda"; document.body.appendChild(script); script.onload = function () { eruda.init();} })();`;
}
/**/

if(!YTProVer){

/*Few Stupid Inits*/
var YTProVer="3.95";
var ytoldV="";
var isF=false;   //what is this for?
var isAp=false; // oh it's for bg play 
const originalPause = HTMLMediaElement.prototype.pause; // well long story short , save the original pause function
window.PIPause = false; // for pausing video when in PIP
window.isPIP=false;
window.pauseAllowed = true; // allow pause by default
var sTime=[];
var webUrls=["m.youtube.com","youtube.com","yout.be","accounts.google.com"];
var GeminiAT="";
var GeminiModels={
"2.0 Flash":'[null,null,null,null,"f299729663a2343f"]',   //g2.0 FLASH
"2.0 Flash Thinking": '[null,null,null,null,"7ca48d02d802f20a"]', //g2.0 flash thinking
'2.5 Flash':'[1,null,null,null,"71c2d248d3b102ff",null,null,0,[4]]',
'2.5 Pro':'[1,null,null,null,"4af6c7f5da75d65d",null,null,0,[4]]',
};
var YTPROCodecs={
video:["AV1","VP8","VP9","H264"],
audio:["Opus","Mp4a"]
}

let touchstartY = 0;
let touchendY = 0;
let initialDistance=null;

//swipe controls
var sens=0.005;
var vol=Android.getVolume();
var brt = Android.getBrightness()/100;

if(localStorage.getItem("saveCInfo") == null  || localStorage.getItem("gesC") == null || localStorage.getItem("gesM") == null || localStorage.getItem("bgplay") == null){
localStorage.setItem("autoSpn","true");
localStorage.setItem("bgplay","true");
localStorage.setItem("gesC","true");
localStorage.setItem("gesM","false");
localStorage.setItem("fzoom","false");
localStorage.setItem("saveCInfo","true");
localStorage.setItem("geminiModel","2.5 Flash");
localStorage.setItem("prompt","Give me details about this YouTube video Id: {videoId} , a detailed summary of timestamps with facts , resources and reviews of the main content");
localStorage.setItem("devMode","false");

localStorage.setItem("block_60fps","false");

YTPROCodecs.video.forEach((x)=>{
localStorage.setItem(x,"true");
});

YTPROCodecs.audio.forEach((x)=>{
localStorage.setItem(x,"true");
});

}
if(localStorage.getItem("fzoom") == "true"){
document.getElementsByName("viewport")[0].setAttribute("content","");
}



if(window.location.pathname.indexOf("shorts") > -1){
ytoldV=window.location.pathname;
}
else{
ytoldV=(new URLSearchParams(window.location.search)).get('v') ;
}


/*Dark and Light Mode*/
var c="#000";
var d="#f2f2f2";
var dc="#fff";
var isD=false;
var dislikes="...";


if(document.cookie.indexOf("f6=40000") > -1){
dc ="#000";c ="#fff";d="rgba(255,255,255,0.1)";
isD=true;
}else{
dc ="#fff";c="#000";d="rgba(0,0,0,0.05)";
isD=false;
}

var downBtn=`<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="none">
<path
d="M16.59 9H15V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5H7.41a1 1 0 0 0-.7 1.7l4.59 4.59a1 1 0 0 0 1.42 0l4.59-4.59a1 1 0 0 0-.72-1.7Z"
stroke="${c}"
stroke-width="1.8"
stroke-linecap="round"
stroke-linejoin="round"
/>
<rect x="5" y="17.2" width="14" height="1.8" rx="0.9" fill="${c}" />
</svg>
`;










function override() {

var videoElem = document.createElement('video');
var origCanPlayType = videoElem.canPlayType.bind(videoElem);
videoElem.__proto__.canPlayType = makeModifiedTypeChecker(origCanPlayType);

var mse = window.MediaSource;

if (mse === undefined) return;
var origIsTypeSupported = mse.isTypeSupported.bind(mse);
mse.isTypeSupported = makeModifiedTypeChecker(origIsTypeSupported);
}


function makeModifiedTypeChecker(origChecker) {


return function (type) {
if (type === undefined) return '';
var disallowed_types = [];
if (localStorage['H264'] === 'false') {
disallowed_types.push('avc');
}
if (localStorage['VP8'] === 'false') {
disallowed_types.push('vp8');
}
if (localStorage['VP9'] === 'false') {
disallowed_types.push('vp9', 'vp09');
}
if (localStorage['AV1'] === 'true') {
disallowed_types.push('av01', 'av99');
}
if (localStorage['Opus'] === 'false') {
disallowed_types.push('opus');
}
if (localStorage['Mp4a'] === 'false') {
disallowed_types.push('mp4a');
}

// If video type is in disallowed_types, say we don't support them
for (var i = 0; i < disallowed_types.length; i++) {
if (type.indexOf(disallowed_types[i]) !== -1) return '';
}

if (localStorage['block_60fps'] === 'true') {
var match = /framerate=(\d+)/.exec(type);
if (match && match[1] > 30) return '';
}

return origChecker(type);
};
}

override();





function insertAfter(referenceNode, newNode) {
try{
referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}catch{}
}


/*wait for the element , using observer*/
async function waitForElement(selector,vid) {
return new Promise((resolve) => {
const element = document.querySelector(selector);
if(element){
if(vid && element.src != "") return resolve(element);
if(!vid) return resolve(element);
}
const observer = new MutationObserver(() => {
const el = document.querySelector(selector);
if (el){

if(vid && el.src) resolve(el),observer.disconnect();;
if(!vid) resolve(el),observer.disconnect();;
}
});
observer.observe(document.body, {
childList: true,
subtree: true
});
});
}


/*Add Settings Tab*/
var addSettingsTab=()=>{
if(document.getElementById("setDiv") == null){
var setDiv=document.createElement("div");
setDiv.setAttribute("style",`
z-index:9999999999;
font-size:22px;
text-align:center;
line-height:35px;
pointer-events:auto;
`);
setDiv.setAttribute("id","setDiv");
var svg=document.createElement("ytm-pivot-bar-item-renderer");
svg.innerHTML=`<svg fill="${ window.location.href.indexOf("watch") < 0 ? c : "#fff" }" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"  id="hSett"><path d="M12.844 1h-1.687a2 2 0 00-1.962 1.616 3 3 0 01-3.92 2.263 2 2 0 00-2.38.891l-.842 1.46a2 2 0 00.417 2.507 3 3 0 010 4.525 2 2 0 00-.417 2.507l.843 1.46a2 2 0 002.38.892 3.001 3.001 0 013.918 2.263A2 2 0 0011.157 23h1.686a2 2 0 001.963-1.615 3.002 3.002 0 013.92-2.263 2 2 0 002.38-.892l.842-1.46a2 2 0 00-.418-2.507 3 3 0 010-4.526 2 2 0 00.418-2.508l-.843-1.46a2 2 0 00-2.38-.891 3 3 0 01-3.919-2.263A2 2 0 0012.844 1Zm-1.767 2.347a6 6 0 00.08-.347h1.687a4.98 4.98 0 002.407 3.37 4.98 4.98 0 004.122.4l.843 1.46A4.98 4.98 0 0018.5 12a4.98 4.98 0 001.716 3.77l-.843 1.46a4.98 4.98 0 00-4.123.4A4.979 4.979 0 0012.843 21h-1.686a4.98 4.98 0 00-2.408-3.371 4.999 4.999 0 00-4.12-.399l-.844-1.46A4.979 4.979 0 005.5 12a4.98 4.98 0 00-1.715-3.77l.842-1.459a4.98 4.98 0 004.123-.399 4.981 4.981 0 002.327-3.025ZM16 12a4 4 0 11-7.999 0 4 4 0 018 0Zm-4 2a2 2 0 100-4 2 2 0 000 4Z"></path></svg>
`;
setDiv.appendChild(svg);
insertAfter(document.getElementsByTagName("ytm-home-logo")[0],setDiv)
if(document.getElementById("hSett") != null){
document.getElementById("hSett").addEventListener("click",
function(ev){
window.location.hash="settings";
});
}
}


};




/*Dislikes To Locale, Credits: Return YT Dislikes*/
function getDislikesInLocale(num){
var nn=num;
if (num < 1000){
nn = num;
}
else{
const int = Math.floor(Math.log10(num) - 2);
const decimal = int + (int % 3 ? 1 : 0);
const value = Math.floor(num / 10 ** decimal);
nn= value * 10 ** decimal;
}
let userLocales;
if (document.documentElement.lang) {
userLocales = document.documentElement.lang;
} else if (navigator.language) {
userLocales = navigator.language;
} else {
try {
userLocales = new URL(
Array.from(document.querySelectorAll("head > link[rel='search']"))
?.find((n) => n?.getAttribute("href")?.includes("?locale="))
?.getAttribute("href")
)?.searchParams?.get("locale");
} catch {
userLocales = "en";
}
}
return Intl.NumberFormat(userLocales, {
notation: "compact",
compactDisplay: "short",
}).format(nn);
}



/*Skips the bad part :)*/
async function skipSponsor(){
var sDiv=document.createElement("div");
sDiv.setAttribute("style",`height:3px;pointer-events:none;width:100%;position:absolute;z-index:99;`)
sDiv.setAttribute("id","sDiv");
var player = document.getElementsByClassName("video-stream")[0];
var dur=player.duration;

if(isNaN(dur)) return;

for(var x in sTime){
var s1=document.createElement("div");
var s2=sTime[x];
s1.setAttribute("style",`height:3px;width:${(100/dur) * (s2[1]-s2[0])}%;background:#0f8;position:absolute;z-index:9;left:${(100/dur) * s2[0]}%;`)
sDiv.appendChild(s1);
}




var e=await waitForElement("yt-progress-bar",false);


if(document.getElementById("sDiv") == null){
if(document.getElementsByClassName('ytPlayerProgressBarHost')[0] != null){
document.getElementsByClassName('ytPlayerProgressBarHost')[0].appendChild(sDiv);
}else{
try{document.getElementsByClassName('ytProgressBarLineProgressBarLine')[0].appendChild(sDiv);}catch{}
}
}




}





/*Fetch The Dislikes*/
async function fDislikes(url){ 
var Url=new URL(url);
var vID="";
if(Url.pathname.indexOf("shorts") > -1){
vID=Url.pathname.substr(8,Url.pathname.length);
}
else if(Url.pathname.indexOf("watch") > -1){
vID=Url.searchParams.get("v");
}


fetch("https://returnyoutubedislikeapi.com/votes?videoId="+vID)
.then(response => {
return response.json();
}).then(jsonObject => {
if('dislikes' in jsonObject){
dislikes=getDislikesInLocale(parseInt(jsonObject.dislikes));
}
}).catch(error => {});

}



/*Check For Sponsorships*/
async function checkSponsors(Url){


if(Url.indexOf("watch") > -1){

sTime=[];

await fetch("https://sponsor.ajay.app/api/skipSegments?videoID="+new URL(Url).searchParams.get("v"))
.then(response => {
return response.json();
}).then(jsonObject => {
for(var x in jsonObject){
var time=jsonObject[x].segment;
sTime.push(time);
}
}).catch(error => {});



/*Skip the Sponsor*/
var player = await waitForElement(".video-stream",true);


player.ontimeupdate=()=>{
skipSponsor();
var cur=player.currentTime;
for(var x in sTime){
var s2=sTime[x];
if(Math.floor(cur) == Math.floor(s2[0])){
if(localStorage.getItem("autoSpn") == "true"){
player.currentTime=s2[1];
addSkipper(s2[0]);
}
}
}
};





}

}

/*Add Skip Sponsor Element*/
function addSkipper(sT){
var sSDiv=document.createElement("div");
sSDiv.setAttribute("style",`
height:50px;${(screen.width > screen.height) ? "width:50%;" : "width:80%;"}overflow:auto;background:rgba(130,130,130,.3);
backdrop-filter:blur(6px);
position:absolute;bottom:40px;
line-height:50px;
left:calc(15% / 2 );padding-left:10px;padding-right:10px;
z-index:99999999999999;text-align:center;border-radius:25px;
color:white;text-align:center;
`);
sSDiv.innerHTML=`<span style="height:30px;line-height:30px;margin-top:10px;display:block;font-family:monospace;font-size:16px;float:left;">Skipped Sponsor</span>
<span style="height:30px;line-height:44px;float:right;padding-right:30px;margin-top:10px;display:block;padding-left:30px;border-left:1px solid white;">
<svg onclick="this.parentElement.parentElement.remove();document.getElementsByClassName('video-stream')[0].currentTime=${sT+1};" xmlns="http://www.w3.org/2000/svg" width="23" height="23" style="margin-top:0px;" fill="currentColor" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
</svg>
<svg onclick="this.parentElement.parentElement.remove();" xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="margin-left:30px;" fill="#f24" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
</svg>
</span>`;
document.getElementById("player-control-container").appendChild(sSDiv);
setTimeout(()=>{sSDiv.remove();},5000);
}


fDislikes(window.location.href);
checkSponsors(window.location.href);


if((window.location.pathname.indexOf("watch") > -1) || (window.location.pathname.indexOf("shorts") > -1)){
var unV=setInterval(() => {


/*Unmute The Video*/ 

document.getElementsByClassName('video-stream')[0].muted=false;

if(!document.getElementsByClassName('video-stream')[0].muted){
clearInterval(unV);

}

}, 5);

}

/*Funtion to set Element Styles*/
function sty(e,v){
var s={
display:"flex",
alignItems:"center",
justifyContent:"center",
fontWeight:"550",
height:"65%",
minWidth:"80px",
width:"auto",
borderRadius:"20px",
background:d,
fontSize:"12px",
marginRight:"5px",
textAlign:"center"
};
for(x in s){
e.style[x]=s[x];
}
}


function getGeminiModels(){
var t="";

for(var x in GeminiModels){


t+=`<br>
<button onclick="localStorage.removeItem('geminiChatInfo');localStorage.setItem('geminiModel','${x}');this.parentElement.style.display='none';" ${(x == localStorage.getItem('geminiModel')) ? `style="background:${c};color:${dc};"` : "" } >${x}
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${c}"  viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
</svg>
</button>`;
}

return t;

}


/*Get Codecs*/
function getYTPROCodecs(){
var t=`<p style="text-align:center;font-size:14px;">This feature is experimental , this may break YTPro if not configured correctly. By default all the codecs are enabled , tap on the buttons below to switch them.</p><br> <vc  style="font-size:14px;">Video Codecs</vc><br>`;

for(var y in YTPROCodecs.video){

var x=YTPROCodecs.video[y];

t+=`<button onclick="setRemoveCodec('${x}',this)" ${("true" == localStorage.getItem(x)) ? `style="background:${c};color:${dc};"` : "" } >${x}
<svg  ${("true" != localStorage.getItem(x)) ? `style="display:none"` : "" } xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${dc}"  viewBox="0 0 16 16">
<path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
</svg>
</button>`;
}

t+=`<br><br><vc  style="font-size:14px">Audio Codecs</vc><br>`
for(var y in YTPROCodecs.audio){

var x=YTPROCodecs.audio[y];

t+=`<button onclick="setRemoveCodec('${x}',this)" ${("true" == localStorage.getItem(x)) ? `style="background:${c};color:${dc};"` : "" } >${x}
<svg ${("true" != localStorage.getItem(x)) ? `style="display:none"` : "" } xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${dc}"  viewBox="0 0 16 16">
<path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
</svg>
</button>`;
}

t+=`<br><br>
<div>Block 60FPS <span onclick="sttCnf(this,'block_60fps');" style="${sttCnf(0,0,"block_60fps")}" ><b style="${sttCnf(0,1,"block_60fps")}" ></b></span></div> `;

t+=`<br><br><button onclick="this.parentElement.style.display='none';" style="margin-top:10px;width:25%;float:right;text-align:center;background:${c};color:${dc};" >Done</button>`;


return t;

}


function setRemoveCodec(x,y){


if(localStorage[x] == "true"){
localStorage.setItem(x,"false");
y.style.background=isD ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)";
y.style.color=c;
y.children[0].style.display="none";
}else{
localStorage.setItem(x,"true");
y.style.background=c;
y.style.color=dc;
y.children[0].style.display="block";
}




}


/*The settings tab*/
async function ytproSettings(){
var ytpSet=document.createElement("div");
var ytpSetI=document.createElement("div");
ytpSet.setAttribute("id","settingsprodiv");
ytpSetI.setAttribute("id","ssprodivI");
ytpSet.setAttribute("style",`
height:100%;width:100%;position:fixed;top:0;left:0;
display:flex;justify-content:center;
background:rgba(0,0,0,0.7);
z-index:9999;
`);
ytpSet.addEventListener("click",
function(ev){

if(!(ev.target == ytpSetI  || ytpSetI.contains(ev.target))){

history.back();
}
});

ytpSetI.setAttribute("style",`
height:65%;width:calc(95% - 20px);overflow:auto;
background:${isD ? "#212121" : "#f1f1f1"};
position:fixed;
bottom:20px;
z-index:99999999999999;padding:10px;text-align:center;border-radius:25px;color:${c};text-align:center;
color:${isD ? "#ccc" : "#444"};`);

ytpSetI.innerHTML=`<style>
@import url('https://fonts.googleapis.com/css2?family=Delius&display=swap');
#settingsprodiv a{text-decoration:underline;} #settingsprodiv li{list-style:none; display:flex;align-items:center;justify-content:center;color:#fff;border-radius:25px;padding:10px;background:#000;margin:5px;}
#ssprodivI div{
height:10px;
width:calc(100% - 20px);
padding:10px;
font-size:1.45rem;
text-align:left;
display:flex;
align-items:center;
position:relative;
margin-top:3px;
}
#ssprodivI div span{
display:block;
height:23px;
width:40px;
border-radius:40px;
right:10px;
position:absolute;
background:#151515;
}
#ssprodivI div span b{
display:block;
height:19px;
width:19px;
position:absolute;
right:2px;
top:2px;
border-radius:50px;
background:#fff;
}
#ssprodivI div input::placeholder{color:${ isD ? "white" : "#000"};}
#ssprodivI div input,#ssprodivI div button{
height:35px;
background:${isD ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"};
width:100%;
border:0;
border-radius:20px;
padding:10px;
font-size:1.25rem;
}
#ssprodivI button{
background:transparent;
font-size:1.45rem;
width:calc(100% - 20px);
height:40px;
color:${isD ? "#ccc" : "#444"};
margin-top:3px;
text-align:left;
}
#ssprodivI button svg{
float:right;
}
#ssprodivI .credit{
font-family: "Delius", cursive;
font-style: normal;
display:flex;
justify-content:center;
align-items:center;
text-align:center;
font-size:1.55rem;
font-weight:bolder;
color:${isD ? "#fff" : "#000"};
position:fixed;
bottom:20px;
width:calc(95% - 20px);
left:calc(2.5% + 0px);
background:${d};
border-radius:0 0 25px 25px;
backdrop-filter:blur(10px);
height:15px;
}
#ssprodivI .geminiModels,#ssprodivI .disableCodecs,#ssprodivI .geminiPrompt{
height:auto;
min-height:100px;
padding-bottom:12px;
background:${isD ? "#212121" : "#f1f1f1"};
position:fixed;
display:block;
width:calc(95% - 20px);
left:calc(2.5% + 0px);
bottom:20px;
z-index:999999;
box-shadow:0px 0px 5px black;
border-radius:25px;
display:none;
}
#ssprodivI .geminiModels:before,#ssprodivI .disableCodecs:before,#ssprodivI .geminiPrompt:before{
height:100%;
width:100%;
background:rgba(0,0,0,.6);
position:fixed;
top:0;
left:0;
z-index:-999;
}
#ssprodivI .geminiPrompt textarea{
height:300px;
width:95%;
border-radius:20px;
padding:15px;
background:${d};
}
#ssprodivI .disableCodecs{
column:50%;
}
#ssprodivI .disableCodecs button{
width:48%;
column:50%;
margin-right:2%;
color:${c};
}
</style>`;
ytpSetI.innerHTML+=`<br><b style='font-size:18px' >YT PRO Settings</b>
<span style="font-size:10px">v${YTProVer}</span>
<br><br>
<div><input type="url" placeholder="Enter Youtube URL" onkeyup="searchUrl(this,event)"></div>
<br>
<button onclick="window.location.hash='#hearts';">Liked Videos
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${isD ? "#ccc" : "#444"}" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
</svg>
</button>
<br>
<button onclick="checkUpdates();">Check for Updates
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${isD ? "#ccc" : "#444"}"  viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
</svg>
</button>
<br>
<div>Autoskip Sponsors <span onclick="sttCnf(this,'autoSpn');" style="${sttCnf(0,0,"autoSpn")}" ><b style="${sttCnf(0,1,"autoSpn")}"></b></span></div>
<br>
<div>Gesture Controls <span onclick="sttCnf(this,'gesC');" style="${sttCnf(0,0,"gesC")}" ><b style="${sttCnf(0,1,"gesC")}"></b></span></div>
<br>
<div>Miniplayer Gesture <span onclick="sttCnf(this,'gesM');" style="${sttCnf(0,0,"gesM")}" ><b style="${sttCnf(0,1,"gesM")}"></b></span></div>
<br>
<div>Force Zoom <span onclick="sttCnf(this,'fzoom');" style="${sttCnf(0,0,"fzoom")}" ><b style="${sttCnf(0,1,"fzoom")}" ></b></span></div> 
<br>
<div>Background Play <span onclick="sttCnf(this,'bgplay');" style="${sttCnf(0,0,"bgplay")}" ><b style="${sttCnf(0,1,"bgplay")}" ></b></span></div> 
<br>
<div>Hide Shorts <span onclick="sttCnf(this,'shorts');" style="${sttCnf(0,0,"shorts")}" ><b style="${sttCnf(0,1,"shorts")}" ></b></span></div> 
<br>
<div>Use single Gemini chat <span onclick="sttCnf(this,'saveCInfo');" style="${sttCnf(0,0,"saveCInfo")}" ><b style="${sttCnf(0,1,"saveCInfo")}"></b></span></div>
<br>
<button onclick="document.getElementsByClassName('geminiModels')[0].style.display='block';document.getElementsByClassName('geminiModels')[0].innerHTML=getGeminiModels();">Select Gemini Model
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${isD ? "#ccc" : "#444"}" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
</svg>
</button>
<br>
<button onclick="document.getElementsByClassName('geminiPrompt')[0].style.display='block';">Edit Gemini Prompt
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${isD ? "#ccc" : "#444"}" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
</svg>
</button>
<br>
<button onclick="document.getElementsByClassName('disableCodecs')[0].style.display='block';document.getElementsByClassName('disableCodecs')[0].innerHTML=getYTPROCodecs();">Disable Codecs
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${isD ? "#ccc" : "#444"}" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
</svg>
</button>
<br>
<button onclick="Android.oplink('https://github.com/prateek-chaubey/YTPRO/issues')">Report Bugs
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${isD ? "#ccc" : "#444"}" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
</svg>
</button>
<br>
<button style="font-weight:bolder;" onclick="Android.oplink('https://github.com/sponsors/prateek-chaubey');">Become a Sponsor
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="${isD ? "#ccc" : "#444"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 2l6 6-6 6"/>
</svg>

</button>
<br>
<div>Developer Mode <span onclick="sttCnf(this,'devMode');" style="${sttCnf(0,0,"devMode")}" ><b style="${sttCnf(0,1,"devMode")}"></b></span></div>
<br><br>
<p style="font-size:1.25rem;width:calc(100% - 20px);margin:auto;text-align:left"><b style="font-weight:bold">Disclaimer</b>: This is an unofficial OSS Youtube Mod, all the logos and brand names are property of Google LLC.<br>
You can find the source code at <a href="#" style="font-family:monospace;" onclick="Android.oplink('https://github.com/prateek-chaubey/YTPRO')" > https://github.com/prateek-chaubey/YTPRO</a>
<br><br></p><br><br><br>

<div class="geminiModels">

</div>


<div class="geminiPrompt" style="text-align:center;">

<textarea>
${localStorage.getItem("prompt")}
</textarea>

<button onclick="localStorage.setItem('prompt',this.previousElementSibling.value);this.parentElement.style.display='none';" style="margin-top:10px;width:25%;float:right;text-align:center;background:${c};color:${dc};" >Save</button>
<br><br>
</div>


<div class="disableCodecs">

</div>


<div class="credit" >
<z style="margin-right:6px">Made with </z>

<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#fff" viewBox="-1 -1 18 18">
<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" 
stroke="black" ${ !isD ? "stroke-width='1'" : "" } stroke-linejoin="round" stroke-linecap="round"/>
</svg>



<z style="margin-left:6px">by Prateek Chaubey</z>
</div>
`;



document.body.appendChild(ytpSet);
ytpSet.appendChild(ytpSetI);



}



function searchUrl(x,e){
if(e.keyCode === 13 || e === "Enter"){
//window.location.href=x.value;
var url="",id="";
var u=x.value;
try{
url=new URL(u);
}catch{
Android.showToast("Enter a valid URL");
return;
}
if((url.hostname.indexOf("youtube.com") > -1) || (url.hostname.indexOf("youtu.be") > -1) ){
if(url.pathname.indexOf("shorts") > -1){
id=url.pathname.substr(8,url.pathname.length);
}
else if(url.pathname.indexOf("watch") > -1){
id=url.searchParams.get("v");
}else if(url.hostname.indexOf("youtu.be") > -1){
id=id=url.pathname.substr(1,url.pathname.length);
}
}

var a=document.createElement("a");
a.href=url;
document.body.appendChild(a);
try{document.getElementById("settingsprodiv").remove();}catch{}
a.click();

}
}

function checkUpdates(){
if(parseFloat(Android.getInfo()) < parseFloat(YTProVer) ){
updateModel();
}else{
Android.showToast("Your app is up to date");
}

fetch('https://youtube.com/ytpro_cdn/npm/ytpro', {cache: 'reload'});
fetch('https://youtube.com/ytpro_cdn/npm/ytpro/bgplay.js', {cache: 'reload'});
fetch('https://youtube.com/ytpro_cdn/npm/ytpro/innertube.js', {cache: 'reload'});
}


/*Set Configration*/
function sttCnf(x,z,y){

/*Way too complex to understand*/
if(isD){
var s=["#000","#717171","#fff"];
}else{
var s=["#fff","#909090","#151515"];
}



if(typeof y == "string"){

if(localStorage.getItem(y) != "true"){
if(z == 1){
return `background:${s[0]};left:2px;`;
}else{
return `background:${s[1]};`;
}
}else{
if(z == 1){
return `background:${s[0]};`;
}else{
return `background:${s[2]};`;
}
}
}
if(localStorage.getItem(z) == "true"){
localStorage.setItem(z,"false");
x.style.background=s[1];
x.children[0].style.left="2px";
x.children[0].style.background=s[0];
}
else{
localStorage.setItem(z,"true");
x.style.background=s[2];
x.children[0].style.left="auto";
x.children[0].style.right="2px";
x.children[0].style.background=s[0];
}

if(localStorage.getItem("fzoom") == "false"){
document.getElementsByName("viewport")[0].setAttribute("content","width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,");
}else{
document.getElementsByName("viewport")[0].setAttribute("content","");
}



if(localStorage.getItem("bgplay") == "true"){
Android.setBgPlay(true);
}else{
Android.setBgPlay(false);
}


if(localStorage.getItem("gesC") != "true"){
try{
document.getElementById("brtS").remove();
document.getElementById("volS").remove();
}catch{}
  
}

if(localStorage.getItem("devMode") == "false"){
try{eruda.destroy();}catch{}
}else{
window.location.href=`javascript:(function () { var script = document.createElement('script'); script.src="//youtube.com/ytpro_cdn/npm/eruda"; document.body.appendChild(script); script.onload = function () { eruda.init();} })();`;
}



}




/*Format File Size*/
function formatFileSize(x){
var s=parseInt(x);
let ss = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
for (var i=0; s > 1024; i++) s /= 1024;
return ` | ${s.toFixed(1)} ${ss[i]}`;
}

/*Video Downloader*/
async function ytproDownVid(){
var ytproDown=document.createElement("div");
var ytproDownDiv=document.createElement("div");
ytproDownDiv.setAttribute("id","downytprodiv");
ytproDown.setAttribute("id","outerdownytprodiv");
ytproDown.setAttribute("style",`
height:100%;width:100%;position:fixed;top:0;left:0;
display:flex;justify-content:center;
background:rgba(0,0,0,0.4);
z-index:99999999999999;
`);
ytproDown.addEventListener("click",
function(ev){
if(ev.target != ytproDownDiv && !(ytproDownDiv.contains(ev.target)) ){
history.back();
}
});

ytproDownDiv.setAttribute("style",`
height:50%;width:85%;overflow:auto;background:${isD ? "#212121" : "#f1f1f1"};
position:absolute;bottom:20px;
z-index:99999999999999;padding:20px;text-align:center;border-radius:25px;text-align:center;
`);

document.body.appendChild(ytproDown);
ytproDown.appendChild(ytproDownDiv);

var id="";

if(window.location.pathname.indexOf("shorts") > -1){
id=window.location.pathname.substr(8,window.location.pathname.length);
}
else{
id=new URLSearchParams(window.location.search).get("v");
}

ytproDownDiv.innerHTML="Loading...";

window.getDownloadStreams();

}





function showHideAdaptives(){
var z=document.querySelectorAll(".adpFormats");
z.forEach((x)=>{
if(x.style.display=="none"){
x.style.display="flex";
}else{
x.style.display="none";
}

});

}

/*Add the meme type and extensions lol*/
function downCap(x,t){
Android.downvid(t,x,"plain/text");
}

/*Send to Download Manager*/
function YTDownVid(o,ex){
var mtype="";
if(ex ==".png"){
mtype="image/png";
}else if(ex ==".mp4"){
mtype="video/mp4";
}
else if(ex ==".mp3"){
mtype="audio/mp3";
}

//console.log(o.getAttribute("data-ytprourl"))

Android.downvid((o.getAttribute("data-ytprotit")+ex),o.getAttribute("data-ytprourl"),mtype);
}








var stopProp = false;
var zoomIn=false;
var scale=1;


/*Checks the Direction of the Swipe*/
function checkDirection(e) {
if ((touchendY > touchstartY) && (touchendY - touchstartY > 20)) {
minimize(true);
}else if ((touchendY < touchstartY) && (touchstartY - touchendY > 20)) {
minimize(false);
//console.log((touchstartY - touchendY ))
}
}

/*for zoom in and out*/
function getDistance(touches) {
const [a, b] = touches;
return Math.hypot(b.pageX - a.pageX, b.pageY - a.pageY);
}



/*touch start*/
document.body.addEventListener('touchstart', e => {
touchstartY = e.changedTouches[0].screenY;
if (e.touches.length === 2) {
initialDistance = getDistance(e.touches);
}
}, { capture: true });




/*touch move*/
document.body.addEventListener('touchmove', (e) => {


if(stopProp){
e.stopPropagation();
}

if (e.touches.length === 2 && initialDistance !== null) {
const currentDistance = getDistance(e.touches);
const z = currentDistance / initialDistance;

stopProp=true;


if((e.target.className.toString().includes("video-stream") || e.target.className.toString().includes("player-controls-background")) && document.fullscreenElement){

if (z > 1.05) {
var Vv=document.getElementsByClassName('video-stream')[0];
zoomIn=true;
scale=Math.max((screen.height / Vv.offsetHeight) , (screen.width / Vv.offsetWidth)); 
addMaxButton();
} else if (z < 0.95) {
zoomIn=false;
scale=1;
addMaxButton();
}
}



}
},{capture:true});






/*touch end*/
document.body.addEventListener('touchend', e => {


touchendY = e.changedTouches[0].screenY;

if((e.target.className.toString().includes("video-stream") || e.target.className.toString().includes("player-controls-background")) && !document.fullscreenElement && localStorage.getItem("gesM") == "true"){
checkDirection();
}

if (e.touches.length < 2) {
initialDistance = null; // reset

setTimeout(()=>{
stopProp=false;
},500)

}

}, { capture: true });





navigation.addEventListener("navigate", e => {
if(e.destination.url.indexOf("watch") > -1 || e.destination.url.indexOf("shorts") > -1){
  dislikes="...";
fDislikes(e.destination.url);
checkSponsors(e.destination.url);
}
});


/*minimize function to mini the video*/
function minimize(yes){


const createIframe=()=>{

var iframe=document.createElement("iframe");
iframe.setAttribute("id",`miniIframe`);
iframe.setAttribute("style",`
height:99.999%;width:100%;
background:${c};
top:0px;
line-height:50px;
position:fixed;
left:0;
z-index:999;
border:0;
`);


iframe.src="https://m.youtube.com/";
document.body.appendChild(iframe);


var iwindow = iframe.contentWindow || iframe.contentDocument.defaultView;
var doc = iwindow.document;

if (doc.readyState  == 'complete' ) {
if (iwindow.trustedTypes && iwindow.trustedTypes.createPolicy && !iwindow.trustedTypes.defaultPolicy) {
iwindow.trustedTypes.createPolicy('default', {createHTML: (string) => string,createScriptURL: string => string, createScript: string => string, });
}
}

iwindow.navigation.addEventListener("navigate", e => {
if(e.destination.url.indexOf("youtube.com") > -1){
if(e.destination.url.indexOf("/watch") > -1 || e.destination.url.indexOf("/shorts") > -1){
window.location.href=e.destination.url;
}
var script = doc.createElement("script");
var scriptSource=`window.addEventListener('DOMContentLoaded', function() {
var script2 = document.createElement('script');
script2.src="//youtube.com/ytpro_cdn/npm/ytpro";
document.body.appendChild(script2);
});
`;
}
else{
window.location.href=e.destination.url;
}


});

var script = doc.createElement("script");
var scriptSource=`window.addEventListener('DOMContentLoaded', function() {
var script2 = document.createElement('script');
script2.src="//youtube.com/ytpro_cdn/npm/ytpro";
document.body.appendChild(script2);
});
`;

/*
var script = document.createElement('script'); 
script.src="//cdn.jsdelivr.net/npm/eruda"; 
document.body.appendChild(script);
script.onload = function () { eruda.init() } ;
*/


  
var source = doc.createTextNode(scriptSource);
script.appendChild(source);
doc.body.appendChild(script);

return iframe;

}



var iframe = document.getElementById("miniIframe") || createIframe();
var player=document.getElementById("player-container-id");




//var ogCss=getComputedStyle(player);

if(yes){

iframe.style.display="block";


player.setAttribute("ogTop",getComputedStyle(player).top)


player.style.transform="scale(0.65)";
player.style.top=(window.screen.height-(player.getBoundingClientRect().height*2.5))+"px";
player.style.zIndex="9999";


}else{

iframe.style.display="none";



player.style.transform="scale(1)";
player.style.top=player.getAttribute("ogTop");
player.style.zIndex="normal";

player.removeAttribute("ogTop");


}
}



/*JAVA Callback for AccessToken*/
function callbackSNlM0e(){
return new Promise(resolve => {
callbackSNlM0e.resolve = resolve; 
});
}

/*JAVA Callback for Gemini Response*/
function callbackGeminiClient(){
return new Promise(resolve => {
callbackGeminiClient.resolve = resolve; 
});
}





/*Handles the reponse*/
function handleGeminiResponse(res){


/*Extract the body from the response*/
const getBody=(x)=>{
for(var i in x){
try{
var json=JSON.parse(x[i][2]);
if(json[4]?.[0]?.[0].indexOf("rc_") > -1) return json;
}catch(e){console.log("JSON parse error: "+e);}}
}

/*Modifies the timestamps , to handle them inside the video element*/
const modifyTimestamps=(x)=>{
var html=x;
var hrefs=html.match(/href="([^"]*)"/g) || [];
var urls= [...hrefs].map(url => url.replace(/href="|"/g, ""));
hrefs.forEach((x,i)=>{
var time=new URL(urls[i]).searchParams.get("t");
if(time != null){
html=html.replace(x,`href="javascript:void(0);" onclick="document.getElementsByClassName('video-stream')[0].currentTime='${time}'"`)
}else if(urls[i].indexOf("youtube.com") < 0 && urls[i].indexOf("youtu.be") < 0){
html=html.replace(x,`href="javascript:void(0);" onclick="try{document.getElementsByClassName('video-stream')[0].pause();}catch{}Android.oplink('${urls[i]}')"`)
}
})
return html;
}






/*checks if the object is empty*/
var response=res.stream;

if (response == undefined) return document.getElementById("GeminiResponse").innerHTML=`<center style="margin-top:15px" > An error Occurred while connecting to Gemini`;

var lines=response.split("\n");
var responseJson=JSON.parse(lines[2])


var body=getBody(responseJson) || [];

//console.log(body)

var chat=[];

chat.push(body?.[1]?.[0]);
chat.push(body?.[1]?.[1]);
chat.push(body?.[4]?.[0]?.[0]);

/*Stores the recent chat info*/
localStorage.setItem("geminiChatInfo",chat.toString());


body=body?.[4]?.[0];

var text=body?.[1]?.[0] || "";
text=text.replace(/http:\/\/googleusercontent\.com\/\S+/g,'');
var thoughts = body?.[37]?.[0]?.[0] || null;
var images=[];

for(var i in body?.[12]?.[1]){
var img=body?.[12]?.[1]?.[i]
images.push({
url:img[0][0][0],
alt:img[0][4],
title:img[7][0]
});

text+=`<center><img alt="${img[0][4]}" src="${img[0][0][0]}"></center>`;
}

//console.log(text,"\n\n\n-------- \n\n",thoughts)






let converter = new showdown.Converter();
converter.setFlavor('github');
let html = modifyTimestamps(converter.makeHtml(text));


let thoughtsHtml=(thoughts != null) ? `<button onclick="(this.nextElementSibling.style.height=='auto') ? (this.children[0].style.transform='rotate(-90deg)',this.nextElementSibling.style.height='0') : (this.children[0].style.transform='rotate(90deg)',this.nextElementSibling.style.height='auto');" class="think" >Show Thinking 
<svg xmlns="http://www.w3.org/2000/svg" style="transform:rotate(-90deg);margin-left:10px" width="16" height="16" fill="${isD ? "#ccc" : "#444"}" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
</svg></button>
<div class="geminiThoughts">
<br>
${converter.makeHtml(thoughts)}


</div><br>` : "";

document.getElementById("GeminiResponse").innerHTML=`<a href="https://gemini.google.com/chat/${chat[0].replace("c_","")}" >Go to the chat</a><br><br>

${thoughtsHtml}



<div class="geminiAnswer">
${html}
</div>
`;


}





/*Main Gemini Function*/
async function geminiInfo(){
if(document.getElementById("GeminiResponse") == null){
var GeminiRes=document.createElement("div");
GeminiRes.setAttribute("style",`min-height:80px;max-height:400px;display:block;height:auto;overflow:scroll;font-weight:400;width:calc(92% - 20px);font-size:14px;padding:10px;position:relative;margin:auto;background:${d};border-radius:15px;margin-bottom:8px;`);
GeminiRes.setAttribute("id","GeminiResponse");


insertAfter(document.getElementById('ytproMainDivE'),GeminiRes);

}else{
var GeminiRes=document.getElementById("GeminiResponse");
}


document.getElementById("GeminiResponse").innerHTML=`
<div class="geminiLoader"></div>`;

var cookies=Android.getAllCookies(window.location.href);

if(cookies.indexOf("__Secure-1PSID=") < 0){
GeminiRes.innerHTML=`
<center style="margin-top:15px">
<span >Sign in to use Gemini<span>
<br><br>
<a href="https://accounts.google.com/ServiceLogin?service=youtube" >
<button style="background:${c};color:${isD ? "#000" : "#fff"};font-weight:500;height:35px;width:90px;border-radius:25px;text-align:center;line-height:35px;">Sign In</button>
</a>
<br><br>

</center>`;

return;

}


/*checks if the user is logged in*/
cookies=cookies.split(";");

var secured="";

cookies.forEach((x)=>{
if(x.indexOf("__Secure-1PSID=") > -1 || x.indexOf("__Secure-1PSIDTS=") > -1)
secured+=x+";";
})



var endpoint="https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate";
var headers=JSON.stringify({
"accept": "*/*",
"accept-language": "en",
"content-type":"application/x-www-form-urlencoded;charset=UTF-8",
"x-goog-ext-525001261-jspb": GeminiModels[localStorage.getItem('geminiModel')], 
"x-same-domain": "1",
"cookie": secured,
"Referer": "https://gemini.google.com/",
"Referrer-Policy": "origin"
});


if(GeminiAT == ""){
Android.getSNlM0e(secured);
GeminiAT=await callbackSNlM0e();

var sd = document.createElement('script');
sd.src="//youtube.com/ytpro_cdn/npm/showdown/dist/showdown.min.js";
document.body.appendChild(sd);

}




var prompt=localStorage.getItem('prompt').replaceAll("{url}",window.location.href).replaceAll("{videoId}",new URL(window.location.href).searchParams.get("v")).replaceAll("{title}",document.getElementsByClassName('slim-video-metadata-header')[0].textContent.replaceAll("|","").replaceAll("\\","").replaceAll("?","").replaceAll("*","").replaceAll("<","").replaceAll("/","").replaceAll(":","").replaceAll('"',"").replaceAll(">","")); 
//`send me details with timestamps and images related to this youtube com video ${}`;
// , including all the aspects and scopes with timestamp , add facts in the analysis as well ,Here's the youtube 



var chat = null;

if(localStorage.getItem("saveCInfo") == "true" && localStorage.getItem("geminiChatInfo") != null){
chat = localStorage.getItem("geminiChatInfo").split(",");
}

const formData = new URLSearchParams();
formData.append("f.req", JSON.stringify([
null,
JSON.stringify([[prompt],null,chat])
]));

formData.append("at", GeminiAT);



Android.GeminiClient(endpoint,headers,formData.toString());
var response=await callbackGeminiClient();

handleGeminiResponse(response);

}


var volSvg=`<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16" focusable="false" aria-hidden="true" style="pointer-events: none;filter:drop-shadow(0px 0px 1px black);position:absolute;top:10%"><path fill="#fff" d="M11.485 2.143 3.913 6.687A6 6 0 001 11.832v.338a6 6 0 002.913 5.144l7.572 4.543A1 1 0 0013 21V3a1.001 1.001 0 00-1.515-.857Zm6.88 2.079a1 1 0 00-.001 1.414 9 9 0 010 12.728 1 1 0 001.414 1.414 11 11 0 000-15.556 1 1 0 00-1.413 0Zm-2.83 2.828a1 1 0 000 1.415 5 5 0 010 7.07 1 1 0 001.415 1.415 6.999 6.999 0 000-9.9 1 1 0 00-1.415 0Z"></path></svg>`;
var brtSvg=`<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="16" viewBox="0 0 24 24" width="16" style="filter:drop-shadow(0px 0px 1px black);position:absolute;top:10%;"><rect fill="none" height="24" width="24"/><path fill="#fff" d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41 l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"/></svg>`;


/*THE 0NE AND 0NLY FUNCTION*/
async function pkc(){

if(window.location.href.indexOf("youtube.com/watch") > -1){


try{
var elm=document.getElementsByTagName("dislike-button-view-model")[0].children[0]; 
elm.children[0].children[0].style.width="auto";
elm.children[0].children[0].style.paddingRight="15px";

if(!document.getElementById("diskl")){
  var diskl=document.createElement("span");
  diskl.setAttribute("id","diskl");
  diskl.innerHTML=dislikes;
  diskl.style.marginLeft="5px";
  
insertAfter(elm.getElementsByClassName("yt-spec-button-shape-next__icon")[0],diskl);

}else{
document.getElementById("diskl").innerHTML=dislikes;
}

}catch(e){}


//Volume and brightness slider 
try{

if(localStorage.getItem("gesC") == "true"){
  

var v= document.getElementById("player-container-id");
var rect=v.getBoundingClientRect();

var elStyle={
height:"100%",
width:rect.width*0.15+"px",
display:"flex",
"flex-direction":"column",
"align-items":"center",
"justify-content":"center",
position:"absolute",
top:"0px", 
right:"0px",
opacity:"0"
};  
  
  

var el=document.createElement("div");
var elB=document.createElement("div");
elB.setAttribute("id","brtS");
el.setAttribute("id","volS");

Object.assign(el.style,elStyle);
Object.assign(elB.style,elStyle);
elB.style.left="0";

el.innerHTML=`${volSvg}<div style="position:absolute;bottom:5%;left:calc(50% - 1.5px);background:rgba(255,255,255,0.5); height:70%;width:3px;border-radius:3px;color:red;box-shadow:0px 0px 2px black;pointer-events:none" ><div style="background:white;width:100%;height:${vol * 100}%;border-radius:3px;position:absolute;bottom:0;box-shadow:0px 0px 2px black;" id="volIS"></div></div>`;
elB.innerHTML=`${brtSvg}<div style="position:absolute;bottom:5%;left:calc(50% - 1.5px);background:rgba(255,255,255,0.5); height:70%;width:3px;border-radius:3px;color:red;box-shadow:0px 0px 2px black;pointer-events:none" ><div style="background:white;width:100%;height:${brt * 100}%;border-radius:3px;position:absolute;bottom:0;box-shadow:0px 0px 1px black;" id="brtIS"></div></div>`;


if(!document.getElementById("brtS")){
document.getElementById("player-container-id").appendChild(elB);

elB.addEventListener("touchmove",(e)=>{
e.preventDefault();
elB.style.opacity="1";

var diff= touchstartY - e.touches[0].pageY;

if(diff > 0){
brt +=sens;
}else{
brt -=sens;
}

if(brt > 1) brt=1;
if(brt < 0) brt =0;

touchstartY=e.touches[0].pageY;

Android.setBrightness(brt);
document.getElementById("brtIS").style.height=brt*100+"%";

},{ passive: false })


//hide the element after touch endas
elB.addEventListener("touchend",(e)=>{
elB.style.opacity="0";
},{ passive: false });

}





if(!document.getElementById("volS")){
document.getElementById("player-container-id").appendChild(el);

el.addEventListener("touchmove",(e)=>{
e.preventDefault();
el.style.opacity="1";

var diff= touchstartY - e.touches[0].pageY;

if(diff > 0){
vol +=sens;
}else{
vol -=sens;
}

if(vol > 1) vol=1;
if(vol < 0) vol =0;

touchstartY=e.touches[0].pageY;

Android.setVolume(vol);
document.getElementById("volIS").style.height=vol * 100 +"%";

},{ passive: false })



//hide the element after touch endas , yes endas
el.addEventListener("touchend",(e)=>{
el.style.opacity="0";
},{ passive: false });

}

}


  
}catch(e){
  console.log(e)
}











/*Check If Element Already Exists*/
if(document.getElementById("ytproMainDivE") == null){



var ytproMainDivA=document.createElement("div");
ytproMainDivA.setAttribute("id","ytproMainDivE");
ytproMainDivA.setAttribute("style",`
height:50px;width:100%;display:block;overflow:auto;
`);

insertAfter(document.getElementsByClassName('slim-video-action-bar-actions')[0],ytproMainDivA);

var ytproMainDiv=document.createElement("div");
ytproMainDiv.setAttribute("style",`
height:50px;width:100%;display:flex;overflow:auto;
align-items:center;justify-content:center;padding-left:20px;padding-right:10px;
`);
ytproMainDivA.appendChild(ytproMainDiv);

/*Gemini Button*/
var ytproGemini=document.createElement("div");
sty(ytproGemini);
ytproGemini.style.width="115px";
ytproGemini.style.height="calc(65% - 4.5px)";
ytproGemini.style.position="relative";
ytproGemini.style.background=`linear-gradient(${isD ? "#272727,#272727" : "#f2f2f2,#f2f2f2"}) padding-box , linear-gradient(16deg ,#4285f4 ,#9b72cb ,#d96570) border-box`;
ytproGemini.style.border="2px solid transparent";
ytproGemini.innerHTML=`
<svg style="height:16px;width:16px" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z" fill="url(#prefix__paint0_radial_980_20147)"/><defs><radialGradient id="prefix__paint0_radial_980_20147" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)"><stop offset=".067" stop-color="#9168C0"/><stop offset=".343" stop-color="#5684D1"/><stop offset=".672" stop-color="#1BA1E3"/></radialGradient></defs></svg>
<span style="margin-left:4px">Gemini</span>
<style type="text/css">
#GeminiResponse img{
max-width:90%;
height:auto;
border-radius:10px;
margin-top:5px;
}
#GeminiResponse a{
color:rgb(62,166,255);
}
.geminiLoader,.geminiLoader:before,.geminiLoader:after{
content:'';
height:10px;
width:70%;
position:absolute;
top:15px;
border-radius:5px;
left:10px;
background:${d};
animation: geminiLoad 1s linear infinite alternate;
}
.geminiLoader:before{
top:27px;
left:0;
}
.geminiLoader:after{
top:54px;
left:0;
width:90%;
}
@keyframes geminiLoad{
0% {
opacity:1;
}
100% {
opacity:.4;
}
}
.geminiThoughts{
height:0;
width:calc(100% - 30px);
transition:5s;
float:left;
overflow:hidden;
padding-left:5px;
font-style:italic;
border-left:3px solid ${d};
display:block;
float:none;
clear:both;
}
.geminiAnswer{
height:auto;
width:100%;
display:block;
float:none;
clear:both;
}
#GeminiResponse .think{
background:transparent;
font-size:1.45rem;
width:calc(100% - 20px);
height:20px;
color:${isD ? "#ccc" : "#444"};
margin-top:3px;
text-align:left;
display:flex;
padding-left:5px;
border-left:3px solid ${d};
}
</style>
`;






ytproMainDiv.appendChild(ytproGemini);


ytproGemini.addEventListener("click",
async function(){


if(parseFloat(Android.getInfo()) < parseFloat(YTProVer)){
updateModel();

return;
}

geminiInfo();


});











/*Heart Button*/
var ytproFavElem=document.createElement("div");
sty(ytproFavElem);
if(!isHeart()){
ytproFavElem.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path fill="${c}" d="M19.66 3.99c-2.64-1.8-5.9-.96-7.66 1.1-1.76-2.06-5.02-2.91-7.66-1.1-1.4.96-2.28 2.58-2.34 4.29-.14 3.88 3.3 6.99 8.55 11.76l.1.09c.76.69 1.93.69 2.69-.01l.11-.1c5.25-4.76 8.68-7.87 8.55-11.75-.06-1.7-.94-3.32-2.34-4.28zM12.1 18.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg><span style="margin-left:8px">Heart<span>`;
}else{
ytproFavElem.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path fill="${c}" d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z"/></svg><span style="margin-left:8px">Heart<span>`;
}
ytproMainDiv.appendChild(ytproFavElem);
ytproFavElem.addEventListener("click",()=>{ytProHeart(ytproFavElem);});



/*Download Button*/
var ytproDownVidElem=document.createElement("div");
sty(ytproDownVidElem);
ytproDownVidElem.style.width="140px";
ytproDownVidElem.innerHTML=`${downBtn.replace('width="18"','width="24"').replace('height="18"','height="24"')}<span style="margin-left:2px">Download<span>`;
ytproMainDiv.appendChild(ytproDownVidElem);
ytproDownVidElem.addEventListener("click",
function(){
window.location.hash="download";
});

/*PIP Button*/
var ytproPIPVidElem=document.createElement("div");
sty(ytproPIPVidElem);
ytproPIPVidElem.style.width="140px";
ytproPIPVidElem.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 24 24" width="22"><path fill="${c}" d="M18 7h-6c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1zm3-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm-1 16.01H4c-.55 0-1-.45-1-1V5.98c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v12.03c0 .55-.45 1-1 1z"/></svg><span style="margin-left:8px">PIP Mode<span>`;
ytproMainDiv.appendChild(ytproPIPVidElem);
ytproPIPVidElem.addEventListener("click",
function(){
PIPlayer(true);
});





}





}else if(window.location.href.indexOf("youtube.com/shorts") > -1){


let b = document.getElementById("brtS");
let v = document.getElementById("volS");
if (b) b.remove();
if (v) v.remove();


if(document.getElementById("ytproMainSDivE") == null){
var ys=document.createElement("div");
ys.setAttribute("id","ytproMainSDivE");
ys.setAttribute("style",`width:50px;height:auto;position:relative;display:block;`);


/*Download Button*/
ysDown=document.createElement("div");
ysDown.setAttribute("style",`
height:48px;width:48px;display:flex;align-items:center;justify-content:center;
background:rgba(0,0,0,.3);border-radius:50%;margin-bottom:20px;backdrop-filter:blur(3px);
`);
ysDown.innerHTML=downBtn.replaceAll(`${c}`,`#fff`).replace(`width="24"`,`width="30"`).replace(`height="24"`,`height="30"`);


ysDown.addEventListener("click",
function(){
window.location.hash="download";
});


/*Heart Button*/
ysHeart=document.createElement("div");
ysHeart.setAttribute("style",`
height:48px;width:48px;
display:flex;align-items:center;justify-content:center;backdrop-filter:blur(3px);
background:rgba(0,0,0,.3);border-radius:50%;margin-top:8px;margin-bottom:0px;
`);


if(!isHeart()){
ysHeart.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path fill="#fff" d="M19.66 3.99c-2.64-1.8-5.9-.96-7.66 1.1-1.76-2.06-5.02-2.91-7.66-1.1-1.4.96-2.28 2.58-2.34 4.29-.14 3.88 3.3 6.99 8.55 11.76l.1.09c.76.69 1.93.69 2.69-.01l.11-.1c5.25-4.76 8.68-7.87 8.55-11.75-.06-1.7-.94-3.32-2.34-4.28zM12.1 18.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>`;
}else{
ysHeart.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path fill="#fff" d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z"/></svg>`;
}


ysHeart.addEventListener("click",
function(){
ytProHeart(ysHeart);
});





try{
  
  if(document.getElementsByClassName("reel-player-overlay-actions")[0].children[0]){
  
document.getElementsByClassName("reel-player-overlay-actions")[0].insertBefore(ys,document.getElementsByClassName("reel-player-overlay-actions")[0].children[0]);
ys.appendChild(ysDown);
ys.appendChild(ysHeart);
}
}catch{}

}

try{document.querySelectorAll('dislike-button-view-model')[0].children[0].children[0].children[0].children[1].children[0].innerHTML=dislikes;}catch{}





/*Watch The old and New URL*
if(ytoldV != window.location.pathname){
fDislikes();
ytoldV=window.location.pathname;
}*/


}

}


setInterval(pkc,0);





/*SHOW HEARTS*/
async function showHearts(){
var ytproH=document.createElement("div");
var ytproHh=document.createElement("div");
ytproHh.setAttribute("id","heartytprodiv");
ytproH.setAttribute("id","outerheartsdiv");
ytproH.setAttribute("style",`
height:100%;width:100%;position:fixed;top:0;left:0;
display:flex;justify-content:center;
background:rgba(0,0,0,0.4);
z-index:99999999999999;
`);

ytproHh.setAttribute("style",`
height:50%;width:85%;overflow:auto;background:${isD ? "#212121" : "#f1f1f1"};
position:absolute;bottom:20px;
z-index:99999999999999;padding:20px;text-align:center;border-radius:25px;text-align:center;
`);
ytproHh.innerHTML=`<style>#heartytprodiv a{text-decoration:none;} #heartytprodiv li{list-style:none; display:flex;align-items:center;border-radius:15px;padding:0px;background:${isD ? "rgba(0,0,0,.5)" : "#fff"};margin:5px;}</style>`;
ytproHh.innerHTML+="Liked Videos<ul id='listurl'>";


ytproHh.innerHTML+="<style>.thum{height:70px;border-radius:5px;}.thum img{float:left;height:70px;width:125px;border-radius:15px 0 0 15px;flex-shrink: 0;}</style>";

document.body.appendChild(ytproH);
ytproH.appendChild(ytproHh);

ytproH.addEventListener("click",
function(ev){
if(!event.composedPath().includes(ytproHh)){
history.back();
}
});



if(localStorage.getItem("hearts") == null){
ytproHh.innerHTML+="No Videos Found";
}else{

var v=JSON.parse(localStorage.getItem("hearts"));

if(Object.keys(v).length === 0){
return ytproHh.innerHTML+="No Videos Found";
}

for(var n=Object.keys(v).length - 1; n >  -1 ; n--){
var x=Object.keys(v)[n];
ytproHh.innerHTML+=`<li class="thum" >
<img onclick="window.location.href=('https://youtu.be/${x}');" src="${v[x].thumb}" ><br>
<div style="width:calc(100% - 170px);margin-left:5px;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical; -webkit-line-clamp:3;overflow:hidden;text-overflow:ellipsis;" onclick="window.location.href=('https://youtu.be/${x}');" >${v[x].title}</div>
<div style="width:calc(100% - (100% - 35px))">
<svg onclick="remHeart(this,'${x}');" xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="margin-left:0px;" fill="#f24" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
</svg>
</span>
</div>
</li>`;
await new Promise(r => setTimeout(r, 1));
}
}





}





/*Dil hata diya vro*/
function remHeart(y,x){
if(localStorage.getItem("hearts")?.indexOf(x) > -1){
y.parentElement.parentElement.remove();
var j=JSON.parse(localStorage.getItem("hearts") || "{}");
delete j[x];
localStorage.setItem("hearts",JSON.stringify(j));
}

}

function ytProHeart(x){


var vid=(new URLSearchParams(window.location.search)).get('v') || window.location.pathname.replace("/shorts/","");

var video=document.getElementsByClassName('video-stream')[0];
var canvas = document.createElement('canvas');
canvas.style.width = "1600px"; 
canvas.style.height = "900px";
canvas.style.background="black";
var context = canvas.getContext('2d');

(window.location.pathname.indexOf("shorts") > -1) ? context.drawImage(video,105, 0, 90,160) :  context.drawImage(video,0, 0, 320,180);

var dataURI = canvas.toDataURL('image/jpeg');


if(window.location.pathname.indexOf("shorts") > -1){

var vDetails={
thumb:dataURI,
title:document.getElementsByClassName('ytShortsVideoTitleViewModelShortsVideoTitle')[0].textContent.replaceAll("|","").replaceAll("\\","").replaceAll("?","").replaceAll("*","").replaceAll("<","").replaceAll("/","").replaceAll(":","").replaceAll('"',"").replaceAll(">","")
};

}else{

var vDetails={
thumb:dataURI,
title:document.getElementsByClassName('slim-video-metadata-header')[0].textContent.replaceAll("|","").replaceAll("\\","").replaceAll("?","").replaceAll("*","").replaceAll("<","").replaceAll("/","").replaceAll(":","").replaceAll('"',"").replaceAll(">","")
}

/*
var vDetails={
thumb:[...ytplayer.config.args.raw_player_response?.videoDetails?.thumbnail?.thumbnails].pop().url,
title:ytplayer.config.args.raw_player_response?.videoDetails?.title.replaceAll("|","").replaceAll("\\","").replaceAll("?","").replaceAll("*","").replaceAll("<","").replaceAll("/","").replaceAll(":","").replaceAll('"',"").replaceAll(">","")
};*/

}



var g="16";
var h=`<span style="margin-left:8px">Heart<span>`;
(window.location.href.indexOf('youtube.com/shorts') > -1) ? h=``:h=`<span style="margin-left:8px">Heart<span>`;
(window.location.href.indexOf('youtube.com/shorts') > -1) ? g="24" : g="24" ;



if(localStorage.getItem("hearts")?.indexOf(vid) > -1){
var j=JSON.parse(localStorage.getItem("hearts") || "{}");
delete j[vid];
localStorage.setItem("hearts",JSON.stringify(j));
x.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="${g}" height="${g}" fill="${(window.location.href.indexOf('youtube.com/shorts') > -1) ? "#fff" : c }" viewBox="0 0 24 24">
<path d="M0 0h24v24H0V0z" fill="none"/><path fill="${(window.location.href.indexOf('youtube.com/shorts') > -1) ? "#fff" : c }" d="M19.66 3.99c-2.64-1.8-5.9-.96-7.66 1.1-1.76-2.06-5.02-2.91-7.66-1.1-1.4.96-2.28 2.58-2.34 4.29-.14 3.88 3.3 6.99 8.55 11.76l.1.09c.76.69 1.93.69 2.69-.01l.11-.1c5.25-4.76 8.68-7.87 8.55-11.75-.06-1.7-.94-3.32-2.34-4.28zM12.1 18.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>${h}`;
}else{
var j=JSON.parse(localStorage.getItem("hearts") || "{}");
j[vid]=vDetails;
localStorage.setItem("hearts",JSON.stringify(j));
x.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="${g}" height="${g}" viewBox="0 0 24 24" ><path d="M0 0h24v24H0V0z" fill="none"/><path fill="${(window.location.href.indexOf('youtube.com/shorts') > -1) ? "#fff" : c }" d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z"/></svg>${h}`;
}

}



/*Dil diya hai ya nhi diya!!*/
function isHeart(){

if((localStorage.getItem("hearts")?.indexOf((new URLSearchParams(window.location.search)).get('v'))  > -1)  ||  (localStorage.getItem("hearts")?.indexOf(window.location.pathname.replace("/shorts/",""))  > -1)){
return true;
}else{
return false;

}
}






///PIP MODE CONFIG
function removePIP(){

isPIP=false;
pauseAllowed = true;
document.exitFullscreen();
 
document.getElementsByClassName('video-stream')[0].pause();
setTimeout(()=>{
document.getElementsByClassName('video-stream')[0].play();
},5);


}




function PIPlayer(pip = false){
  
var v=document.getElementsByClassName('video-stream')[0];

 
if(pip){

if(v.getBoundingClientRect().height > v.getBoundingClientRect().width){
Android.pipvid("portrait");
}
else{
Android.pipvid("landscape");
}

return;
}


v.requestFullscreen();
v.play();
pauseAllowed = false;
isPIP=true;

}



















// well this is for bypassing the pause function of Youtube when video is in
// PIP mode , its a workaround for now , until i find a proper method
// to allow the pip mode for the video element , like chromium browsers

HTMLMediaElement.prototype.pause = function(){
  
if (pauseAllowed || PIPause) {
return originalPause.apply(this, arguments);
}

if (this.paused) {
this.play().catch(() => {});
}
};









const originalExitFullscreen = document.exitFullscreen;
const originalRequestFullscreen = Element.prototype.requestFullscreen;

//exit full screen
document.exitFullscreen = function (...args) {
 if(!isPIP){ return originalExitFullscreen.apply(this, args);}
};


//request full screen
Element.prototype.requestFullscreen = function (...args) {
var video = document.getElementsByClassName('video-stream')[0];

if(video.getBoundingClientRect().height > video.getBoundingClientRect().width){
Android.fullScreen(true);
}
else{
Android.fullScreen(false);
}

return originalRequestFullscreen.apply(this, args);
};






/*Check The Hash Change*/
window.onhashchange=()=>{
try{document.getElementById("outerdownytprodiv").remove();}catch{}
try{document.getElementById("outerheartsdiv").remove();}catch{}
try{document.getElementById("settingsprodiv").remove();}catch{}
if(window.location.hash == "#download"){
ytproDownVid();
}else if(window.location.hash == "#settings"){
ytproSettings();
}
else if(window.location.hash == "#hearts"){
showHearts();
}


}



// AdBlocker which removes the ad contents from the fetch requests itself !!
(() => {
const _origFetch = window.fetch;
window.fetch = async function(input, init) {
try {
const url = (typeof input === 'string') ? input : input.url;

//block ad urls
if(url.includes("googleads.g.doubleclick.net") || url.includes("youtube.com/youtubei/v1/player/ad_break") || url.includes("youtube.com/pagead/adview") || url.includes("youtube.com/api/stats/ads")){

//console.log("Blocked",url);
return "";
}else{


const response = await _origFetch.apply(this, arguments);

try {

const clone = response.clone();
let data = await clone.json();

if(data.responseContext.webResponseContextExtensionData.webResponseContextPreloadData.preloadMessageNames[0] == "adSlotRenderer" || data.responseContext.webResponseContextExtensionData.webResponseContextPreloadData.preloadMessageNames[0] == "shortsAdsRenderer"){
data={};
}


//remove the ad content
delete data.adSlots;
delete data.playerAds;
delete data.adPlacements;
delete data.adBreakHeartbeatParams;

const newBody = JSON.stringify(data);

// Build new headers (update content-length + content-type)
const newHeaders = new Headers(response.headers);
newHeaders.set("content-length", String(newBody.length));
newHeaders.set("content-type", "application/json");

// Return modified Response
return new Response(newBody, {
status: response.status,
statusText: response.statusText,
headers: newHeaders
});
} catch (e) {
// not JSON, return original
return response;
}



}

} catch (e) { /* ignore logging errors */ }

};


})();



//modified XHR for the same purpose
const XHR = window.XMLHttpRequest;
const origOpen = XHR.prototype.open;
const origSend = XHR.prototype.send;

XHR.prototype.open = function(method, url, ...rest) {
this._interceptedMethod = method;
this._interceptedUrl = url;
return origOpen.apply(this, [method, url, ...rest]);
};

XHR.prototype.send = function(body) {
// Block certain URLs
if (
this._interceptedUrl.includes("googleads.g.doubleclick.net") ||
this._interceptedUrl.includes("youtube.com/youtubei/v1/player/ad_break") ||
this._interceptedUrl.includes("youtube.com/pagead/adview") ||
this._interceptedUrl.includes("youtube.com/api/stats/ads")
) {
console.warn("Blocked:", this._interceptedUrl);
return;
}

// Intercept JSON responses
this.addEventListener("readystatechange", function() {
if (this.readyState === 4 && this.responseType === "" || this.responseType === "text") {
try {
// Try parsing response as JSON
const contentType = this.getResponseHeader("Content-Type");
if (contentType && contentType.includes("application/json")) {
let json = JSON.parse(this.responseText);


// ----------------------------------------
if (json.adPlacements) {
console.log("Removed ad placements from response!");
json.adPlacements = []; // remove ads
}

//remove the ad content
delete json.adSlots;
delete json.playerAds;
delete json.adPlacements;
delete json.adBreakHeartbeatParams;


// Redefine responseText to modified JSON
Object.defineProperty(this, "responseText", { value: JSON.stringify(json) });
Object.defineProperty(this, "response", { value: json });
}
} catch (err) {
// Ignore non-JSON or parse errors
}
}
});

return origSend.apply(this, arguments);
};












/****** I LOVE YOU <3 *****/
/*YT ADS BLOCKER*/
function adsBlock(){


try{
document.getElementsByClassName('video-stream')[0].removeAttribute('disablepictureinpicture');
}catch{}


/*Block Ads*/
var ads=document.getElementsByTagName("ad-slot-renderer");
for(var x in ads){
try{ads[x].remove();}catch{}
}
try{
document.getElementsByClassName("ad-interrupting")[0].getElementsByTagName("video")[0].currentTime=document.getElementsByClassName("ad-interrupting")[0].getElementsByTagName("video")[0].duration;
document.getElementsByClassName("ytp-ad-skip-button-modern")[0].click();

}catch{}




/*Block Ads*/
try{
document.getElementsByTagName("ytm-promoted-sparkles-web-renderer")[0].remove();
}catch{}
try{
document.getElementsByTagName("ytm-companion-ad-renderer")[0].remove();
}catch{}

/*Remove Open App*/
try{
document.querySelectorAll('a').forEach(a => {
if (a.href.indexOf("intent://") > -1) {
a.style.display = 'none';
}
});
}catch{}
/*Remove Promotion Element*/
try{document.getElementsByTagName("ytm-paid-content-overlay-renderer")[0].style.display="none";}catch{}

/*Hide Shorts*/
if(localStorage.getItem("shorts") == "true"){


for( x in document.getElementsByClassName("big-shorts-singleton")){
try{document.getElementsByClassName("big-shorts-singleton")[x].remove();
}catch{}
}

for( x in document.getElementsByTagName("ytm-reel-shelf-renderer")){
try{document.getElementsByTagName("ytm-reel-shelf-renderer")[x].remove();
}catch{}

for( x in document.getElementsByTagName("ytm-shorts-lockup-view-model")){
try{document.getElementsByTagName("ytm-shorts-lockup-view-model")[x].remove();
}catch{}

}

}
}




}





//Add Maximize Gesture
function addMaxButton(){


var pElem=document.getElementById('player-container-id');
var Ve=document.getElementById('player');
var Vv=document.getElementsByClassName('video-stream')[0];



if(pElem === document.fullscreenElement){


try{
if(zoomIn){
Ve.style.transform=`scale(${scale})`;
}else{
Ve.style.transform="scale(1)";  
}
}catch{}


}else{
try{
Ve.style.transform="scale(1)";
}catch{}
}


}



//https://youtube.com/watch?v=SInH_fP0deQ



/*Mutation Observer*/
//as i have been developing YTPRO for almost 4 years now
//thus it still contains the code which i used when i was a
//totally noob in copy pasting , that time i wasn't aware of
//plenty of things and by which i used `setInterval` instead
//of mutation observer , i shall be optimizing the code in future
//releases but rn only a few code blocks will be in the obesrver

const targetNode = document.body;
const config = { childList: true, subtree: true };

const observer = new MutationObserver(() => {


  
  
//ads Block
adsBlock();


//mE button
addMaxButton();

//settingsTab
addSettingsTab();


try{
var video = document.getElementsByClassName('video-stream')[0];
if(video.getBoundingClientRect().height > video.getBoundingClientRect().width){
Android.fullScreen(true);
}
else{
Android.fullScreen(false);
}}
catch{}


});

// Start observing changes in the body
observer.observe(targetNode, config);





/*Update your app bruh*/
function updateModel(){
var x=document.createElement("div");

x.setAttribute("style",`height:100%;width:100%;position:fixed;display:grid;align-items:center;top:0;left:0;background:rgba(0,0,0,.6);z-index:99999;`);

x.innerHTML=`
<div style="height:auto;width:70%;padding:20px;background:rgba(0,0,0,.6);border:1px solid #888;box-shadow:0px 0px 5px black;color:white;backdrop-filter:blur(10px);border-radius:15px;margin:auto">
<h2> Mandatory Update </h2><br>
Latest Version ${YTProVer} of YTPRO is available , update the YTPRO to get latest features.
<br>- This update is mandatory as it fixes a ton of bugs and improves functionality <br>
- Fixed PIP mode , BG Player , Downloads<br>
- Fixed fitscreen bug , with pinch gesture<br>
- Added gestures for brightness and volume control<br>
- Optimized the UI of both Download and Settings menu<br>
- Added new UI icons based on the latest YouTube's UI<br>
- Fixed bugs and improved functionality<br>
- for the full list <u onclick="Android.oplink('https://github.com/prateek-chaubey/YTPRO/releases');" >click here</u>
<br>
<br>
<div style="display:flex;">
<!--<button style="border:0;border-radius:10px;height:30px;width:150px;background:;" onclick="this.parentElement.parentElement.parentElement.remove();">Cancel</button>-->
<button style="border:0;border-radius:10px;height:30px;width:150px;background:rgba(255,50,50,.7);float:right;" onclick="Android.downvid('YTPRO.zip','https://nightly.link/prateek-chaubey/YTPro/workflows/gradle/main/YTPRO.zip','application/zip');">Download</button>
</div>

</div>
`;

document.body.appendChild(x);
}





window.onload = function(){ 
if(parseFloat(Android.getInfo()) < parseFloat(YTProVer) && (window.location.href == "https://m.youtube.com/" || window.location.href == "https://m.youtube.com") ){
updateModel();
}

};




document.addEventListener('click',(event) => {

let anchor = event.target.closest('a');
if (anchor){


if(anchor.href.includes("www.youtube.com/redirect")){

try{
document.getElementsByClassName('video-stream')[0].pause();
}catch{}

const url=new URL(anchor.href).searchParams.get("q");

setTimeout(()=>{Android.oplink(url)},50);

event.preventDefault();
event.stopPropagation(); 

}


}
},
true);




}
