/*****YTPRO*******
Author: Prateek Chaubey
Version: 2.3
URI: https://github.com/prateek-chaubey/
*/


/*Few Stupid Inits*/
var YTProVer="2.3";
if(ytprof1 == undefined && ytprov1 == undefined){
var ytprof1="";
var ytprov1="";
}
var ytoldv="";
if(window.location.pathname.indexOf("shorts") > -1){
ytoldV=window.location.pathname;
}
else{
ytoldV=(new URLSearchParams(window.location.search)).get('v') ;
}

function ytproGetURL(o){
var sig=(new URLSearchParams(o)).get('s');
var url=(new URLSearchParams(o)).get('url');
sig=eval(ytprov1+ytprof1+"('"+decodeURIComponent(sig)+"');");
url=decodeURIComponent(url);
return  url+"&sig="+sig;
}
/*Dark and Light Mode*/
var c="#000";
var d="#f2f2f2";
var dislikes="...";

if(document.cookie.indexOf("PREF") < 0){
document.cookie="PREF=f6=400&f7=100;";
window.location.href=window.location.href;
}
if(document.cookie.indexOf("f6=400") > -1){
c ="#fff";d="rgba(255,255,255,0.1)";
}else{
c="#000";d="rgba(0,0,0,0.1)";
}
var downBtn=`<svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${c}"  viewBox="0 0 16 16">
<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
<path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
</svg>`;





/*Utils for Deciphers*/
var utils={
between:(haystack, left, right) => {
let pos;
if (left instanceof RegExp) {
const match = haystack.match(left);
if (!match) { return ''; }
pos = match.index + match[0].length;
} else {
pos = haystack.indexOf(left);
if (pos === -1) { return ''; }
pos += left.length;
}
haystack = haystack.slice(pos);
pos = haystack.indexOf(right);
if (pos === -1) { return ''; }
haystack = haystack.slice(0, pos);
return haystack;
},
cutAfterJSON :( mixedJson )=> {
let open, close;
if (mixedJson[0] === '[') {
open = '[';
close = ']';
} else if (mixedJson[0] === '{') {
open = '{';
close = '}';
}
if (!open) {
throw new Error(`Can't cut unsupported JSON (need to begin with [ or { ) but got: ${mixedJson[0]}`);
}
let isString = false;
let isEscaped = false;
let counter = 0;
let i;
for (i = 0; i < mixedJson.length; i++) {
if (mixedJson[i] === '"' && !isEscaped) {
isString = !isString;
continue;
}
isEscaped = mixedJson[i] === '\\' && !isEscaped;
if (isString) continue;
if (mixedJson[i] === open) {
counter++;
} else if (mixedJson[i] === close) {
counter--;
}
if (counter === 0) {
return mixedJson.substr(0, i + 1);
}
}
throw Error("Can't cut unsupported JSON (no matching closing bracket found)");
}
}
/*Decipher Code , Credits:NODE-YTDL-CORE*/
var extractFunctions = (body)=> {
const functions = [];
const extractManipulations = caller => {
const functionName = utils.between(caller, `a=a.split("");`, `.`);
if (!functionName) return '';
const functionStart = `var ${functionName}={`;
const ndx = body.indexOf(functionStart);
if (ndx < 0) return '';
const subBody = body.slice(ndx + functionStart.length - 1);
return `var ${functionName}=${utils.cutAfterJSON(subBody)}`;
};
const extractDecipher = () => {
const functionName = utils.between(body, `a.set("alr","yes");c&&(c=`, `(decodeURIC`);
if (functionName && functionName.length) {
const functionStart = `${functionName}=function(a)`;
const ndx = body.indexOf(functionStart);
if (ndx >= 0) {
const subBody = body.slice(ndx + functionStart.length);
let functionBody = `var ${functionStart}${utils.cutAfterJSON(subBody)}`;
functionBody = `${extractManipulations(functionBody)};${functionBody};`;
ytprof1=functionName;
ytprov1=functionBody;
}
}
};
extractDecipher();
};
/*Fetch Script*/
var scripts = document.getElementsByTagName('script');
for(var i=0;i<scripts.length;i++){
if(scripts[i].src.indexOf("/base.js") > 0){
fetch(scripts[i].src).then((res) => res.text()).then((r) => extractFunctions(r));
}
}

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
/*Fetch The Dislikes*/
fetch("https://returnyoutubedislikeapi.com/votes?videoId="+(new URLSearchParams(window.location.search)).get('v'))
.then(response => {
return response.json();
}).then(jsonObject => {
if('dislikes' in jsonObject){
dislikes=getDislikesInLocale(parseInt(jsonObject.dislikes));
}
}).catch(error => {});


/*Unmute The Video*/
var unV=setInterval(() => {
document.getElementsByClassName('video-stream')[0].muted=false;
if(!document.getElementsByClassName('video-stream')[0].muted){
clearInterval(unV);
}
}, 5);




/*Funtion to set Element Styles*/
function sty(e,v){
var s={
display:"flex",
alignItems:"center",
justifyContent:"center",
fontWeight:"550",
height:"65%",
width:"80px",
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
function formatFileSize(x){
var s=parseInt(x);
let ss = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
for (var i=0; s > 1024; i++) s /= 1024;
return ` | ${s.toFixed(1)} ${ss[i]}`;
}
async function getSize(u){
const r = await fetch(u, {
method: 'HEAD'
});
try{
document.querySelectorAll(`[data-ytprourl="${u}"]`)[0].children[1].innerHTML+= formatFileSize(r.headers.get("Content-Length"));
}catch{}
}


async function ytproDownVid(){
var ytproDown=document.createElement("div");
var ytproDownDiv=document.createElement("div");
ytproDownDiv.setAttribute("id","downytprodiv");
ytproDown.setAttribute("id","outerdownytprodiv");
ytproDown.setAttribute("style",`
height:100%;width:100%;position:fixed;top:0;left:0;
display:flex;justify-content:center;
background:rgba(0,0,0,0.7);
z-index:99999999999999;
`);
ytproDown.addEventListener("click",
function(ev){
if(ev.target != ytproDownDiv ){
history.back();
}
});

ytproDownDiv.setAttribute("style",`
height:50%;width:85%;overflow:auto;background:#212121;
position:absolute;bottom:20px;
z-index:99999999999999;padding:20px;text-align:center;border-radius:25px;color:white;text-align:center;
`);

ytproDownDiv.innerHTML="<style>#downytprodiv a{text-decoration:none;color:white;} #downytprodiv li{list-style:none; display:flex;align-items:center;justify-content:center;color:#fff;border-radius:25px;padding:10px;background:#000;margin:5px;}</style>";
ytproDownDiv.innerHTML+="Select Avilaible Formats<ul id='listurl'>";

document.body.appendChild(ytproDown);
ytproDown.appendChild(ytproDownDiv);



if("ytplayer" in window){

var t=ytplayer.config.args.title.replaceAll("|","").replaceAll("\\","").replaceAll("?","").replaceAll("*","").replaceAll("<","").replaceAll("/","").replaceAll(":","").replaceAll('"',"").replaceAll(">","");
var f=ytplayer.config.args.raw_player_response.streamingData.formats;
var af=ytplayer.config.args.raw_player_response.streamingData.adaptiveFormats;
var thumb=ytplayer.config.args.raw_player_response.videoDetails.thumbnail?.thumbnails;
for(x in f){
if("signatureCipher" in f[x]){

ytproDownDiv.innerHTML+=`<li data-ytprotit="${t}" style="background:#001;"  onclick="YTDownVid(this,'.mp4')"  data-ytprourl="${ytproGetURL(f[x].signatureCipher)}">
${downBtn}<span style='margin-left:10px;'  >${f[x].qualityLabel}
</span></li>`;

getSize(ytproGetURL(f[x].signatureCipher));
}else{

ytproDownDiv.innerHTML+=`<li data-ytprotit="${t}"  style="background:#001;"  onclick="YTDownVid(this,'.mp4')"  data-ytprourl="${f[x].url}">
${downBtn}<span style="margin-left:10px;"  >${f[x].qualityLabel} </span></li>` ;
getSize(f[x].url);
}
}

for(x in af){
if(af[x].mimeType.indexOf("audio") > -1){
if("signatureCipher" in af[x]){
ytproDownDiv.innerHTML+=`<li data-ytprotit="${t}"  onclick="YTDownVid(this,'.mp3')"  data-ytprourl="${ytproGetURL(af[x].signatureCipher)}">
${downBtn}<span style='margin-left:10px;'  >Audio${formatFileSize(af[x].contentLength)}
</span></li>`;
}else{
ytproDownDiv.innerHTML+=`<li data-ytprotit="${t}"  onclick="YTDownVid(this,'.mp3')"  data-ytprourl="${af[x].url}">
${downBtn}<span style="margin-left:10px;"  >Audio${formatFileSize(af[x].contentLength)} 
</span></li>` ;
}}
}

if(thumb != undefined){

ytproDownDiv.innerHTML+="<br>Thumbnails<br><br><style>.thu{height:80px;border-radius:10px;}.thu img{max-height:97%;max-width:70%;border-radius:10px;border:1px solid silver;}</style>";
for(x in thumb){
ytproDownDiv.innerHTML+=`<li data-ytprotit="${t+Date.now()}"  onclick="YTDownVid(this,'.png')" class="thu" data-ytprourl="${thumb[x].url}">
<img src="${thumb[x].url}"><br>
<span style="margin-left:30px;display:flex;align-items:center;justify-content:center;"  >${downBtn}<span style="margin-left:10px;"  >${thumb[x].height} &#x2715; ${thumb[x].width}
</span></span></li>` ;
}

}


}else {
alert("AN ERROR OCCURED , PLEASE UPDATE YT PRO");
}
}


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
Android.downvid((o.getAttribute("data-ytprotit")+ex),o.getAttribute("data-ytprourl"),mtype);
}


/*THE 0NE AND 0NLY FUNCTION*/
function pkc(){

if(window.location.href.indexOf("youtube.com/watch") > -1){

try{
var elm=document.getElementsByTagName('ytm-segmented-like-dislike-button-renderer')[0].getElementsByTagName("ytm-toggle-button-renderer")[1];
elm.children[0].children[0].style.position="absolute";
elm.children[0].children[0].style.left="10px";
elm.children[0].style.width="80px";
if(elm.children[0].children[2] == null){
elm.children[0].innerHTML+=`<span style="margin-left:20px">${dislikes}<span>`;
}
else{
elm.children[0].children[2].innerHTML=dislikes;
}
}catch{}


/*Check If Element Already Exists*/
if(document.getElementById("ytproMainDivE") == null){
function insertAfter(referenceNode, newNode) {try{referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);}catch{}}
var ytproMainDivA=document.createElement("div");
ytproMainDivA.setAttribute("id","ytproMainDivE");
ytproMainDivA.setAttribute("style",`
height:50px;width:100%;display:block;overflow:auto;
`);

insertAfter(document.getElementsByClassName('slim-video-action-bar-actions')[0],ytproMainDivA);

var ytproMainDiv=document.createElement("div");
ytproMainDiv.setAttribute("style",`
height:50px;width:100%;display:flex;overflow:auto;
align-items:center;justify-content:center;padding-left:20px;padding-right:20px;
`);
ytproMainDivA.appendChild(ytproMainDiv);

/*Heart Button*/
var ytproFavElem=document.createElement("div");
sty(ytproFavElem);
if(!isHeart()){
ytproFavElem.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${c}" viewBox="0 0 16 16">
<path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
</svg><span style="margin-left:8px">Heart<span>`;
}else{
ytproFavElem.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f00" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
</svg><span style="margin-left:8px">Heart<span>`;
}
ytproMainDiv.appendChild(ytproFavElem);
ytproFavElem.addEventListener("click",()=>{ytProHeart(ytproFavElem);});



/*Download Button*/
var ytproDownVidElem=document.createElement("div");
sty(ytproDownVidElem);
ytproDownVidElem.style.width="110px";
ytproDownVidElem.innerHTML=`${downBtn}<span style="margin-left:8px">Download<span>`;
ytproMainDiv.appendChild(ytproDownVidElem);
ytproDownVidElem.addEventListener("click",
function(){
window.location.hash="download";
});

/*PIP Button*/
var ytproPIPVidElem=document.createElement("div");
sty(ytproPIPVidElem);
ytproPIPVidElem.style.width="110px";
ytproPIPVidElem.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${c}"  viewBox="0 0 16 16">
<path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/>
<path d="M8 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-3z"/>
</svg>
<span style="margin-left:8px">PIP Mode<span>`;
ytproMainDiv.appendChild(ytproPIPVidElem);
ytproPIPVidElem.addEventListener("click",
function(){
document.getElementsByClassName('video-stream')[0].play();
try{document.getElementById("ytproMainAudDivE").remove();}catch{console.log("");}
Android.pipvid("pip");
});

/*Music Button*/
var ytproAudElem=document.createElement("div");
sty(ytproAudElem);
ytproAudElem.style.width="90px";
ytproAudElem.innerHTML=`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${c}" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z"/>
</svg>
<span style="margin-left:8px">BG Play<span>`;
ytproMainDiv.appendChild(ytproAudElem);
ytproAudElem.addEventListener("click",
function(){
ytproAudPlayer();
});

if(ytprof1.length =="" && ytprov1.length ==""){
ytproAudElem.style.opacity=".5";
ytproAudElem.style.pointerEvents="none";
ytproDownVidElem.style.opacity=".5";
ytproDownVidElem.style.pointerEvents="none";
}
else if(ytprof1.length !="" && ytprov1.length !=""){
ytproAudElem.style.opacity="1";
ytproAudElem.style.pointerEvents="auto";
ytproDownVidElem.style.opacity="1";
ytproDownVidElem.style.pointerEvents="auto";
}
}
/*Watch The old and New URL*/

if(ytoldV != (new URLSearchParams(window.location.search)).get('v')){
try{document.getElementById("ytproMainAudDivE").remove();}catch{console.log("");}
ytoldV=(new URLSearchParams(window.location.search)).get('v');
window.location.href=window.location.href;
}


}


/*
* Shorts Vidoes
* Probably will Expand This in future updates.
if(window.location.href.indexOf("youtube.com/shorts") > -1){
if(ytoldV != window.location.pathname){
try{document.getElementById("ytproMainAudDivE").remove();}catch{console.log("");}
ytoldV=window.location.pathname;
window.location.href=window.location.href;
}
}*/


}


function ytProHeart(x){

var vid=(new URLSearchParams(window.location.search)).get('v');
if(localStorage.getItem("vids")?.indexOf(vid) > -1){
var ritem=localStorage.getItem("vids");
ritem=ritem.substr(0,(ritem?.indexOf(vid)-1))+ritem.substr((ritem?.indexOf(vid)+vid.length),ritem.length);
localStorage.setItem("vids",ritem);
x.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${c}" viewBox="0 0 16 16">
<path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
</svg><span style="margin-left:8px">Heart<span>`;
}else{
localStorage.setItem("vids",localStorage.getItem("vids")+","+(new URLSearchParams(window.location.search)).get('v'));
x.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f00" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
</svg><span style="margin-left:8px">Heart<span>`;
}
}


function isHeart(){
if(localStorage.getItem("vids")?.indexOf((new URLSearchParams(window.location.search)).get('v')) > -1){
return true;
}else{
return false;
}
}

function PIPlayer(){
if(!document.getElementsByClassName('video-stream')[0].paused){
try{document.getElementById("ytproMainAudDivE").remove();}catch{console.log("");}
/*Idk why i have done this but this really solves the issue LOL*/
var o=0;
var h=setInterval(()=>{o+=1;if(o==10){clearInterval(h);}document.getElementsByClassName('video-stream')[0].play(); },10);
Android.pipvid("pip");
}
}

/*YTPRO Audio Player*/
function ytproAudPlayer(){
var ytproTitle="";
var ytproURL="";
if("ytplayer" in window){
for(x in ytplayer.config.args.raw_player_response.streamingData.adaptiveFormats){
if(ytplayer.config.args.raw_player_response.streamingData.adaptiveFormats[x].itag == "140"){
if("signatureCipher" in ytplayer.config.args.raw_player_response.streamingData.adaptiveFormats[x]){
ytproTitle=ytplayer.config.args.title ;
ytproURL=ytproGetURL(ytplayer.config.args.raw_player_response.streamingData.adaptiveFormats[x].signatureCipher);
}else{
ytproTitle=ytplayer.config.args.title;
ytproURL=ytplayer.config.args.raw_player_response.streamingData.adaptiveFormats[x].url;
}}}
try{document.getElementById("ytproMainAudDivE").remove();}catch{console.log("");}
var ytproAudDivElem=document.createElement("div");
var ytproAudPlayerElem=document.createElement("audio");
var ytproAudX=document.createElement("div");
ytproAudDivElem.style.position="fixed";
ytproAudDivElem.style.bottom="0";
ytproAudDivElem.style.left="0";
ytproAudDivElem.style.zIndex="99999999999";
ytproAudDivElem.style.height="70px";
ytproAudDivElem.style.width="100%";
ytproAudDivElem.style.background="white";
ytproAudDivElem.setAttribute("id","ytproMainAudDivE");
ytproAudX.style.position="absolute";
ytproAudX.style.left="0px";
ytproAudX.style.height="40px";
ytproAudX.style.width="40px";
ytproAudX.style.background="white";
ytproAudDivElem.style.borderTop="3px solid red";
ytproAudX.style.borderTop="3px solid red";
ytproAudX.style.borderRight="3px solid red";
ytproAudX.style.position="absolute";
ytproAudX.style.top="-43.25px";
ytproAudX.style.color="red";
ytproAudX.style.textAlign="center";
ytproAudX.innerHTML="&#x2715;";
ytproAudX.style.fontSize="20px";
ytproAudPlayerElem.style.position="absolute";
ytproAudPlayerElem.style.top="-20px";
ytproAudPlayerElem.style.left="0";
ytproAudPlayerElem.style.height="80px";
ytproAudPlayerElem.style.width="100%";
ytproAudDivElem.innerHTML+="<style>audio::-webkit-media-controls-panel{background:white;}</style>";
ytproAudPlayerElem.setAttribute("id","ytproaudss");
ytproAudPlayerElem.controls=true;
ytproAudPlayerElem.src=ytproURL;
document.body.appendChild(ytproAudDivElem);
ytproAudDivElem.appendChild(ytproAudPlayerElem);
ytproAudDivElem.appendChild(ytproAudX);
document.getElementsByClassName('video-stream')[0].pause();
ytproAudX.addEventListener("click",function(){this.parentElement.remove();});
/*Listen To the Song*/
ytproAudPlayerElem.onloadeddata = function() {
ytproAudPlayerElem.play();
Android.showToast("Now Playing \n"+ytproTitle);
Android.gohome("ok");
};
/*Watch The Audio Player*/
ytproAudPlayerElem.addEventListener("timeupdate",function(){
if(ytproAudPlayerElem.currentTime==ytproAudPlayerElem.duration){
window.location.href="https://m.youtube.com"+document.getElementsByTagName("lazy-list")[1].children[1].children[0].children[0].getAttribute("href")+"&auds=ab";
}
});
}
else {
alert("AN ERROR OCCURED , PLEASE UPDATE YT PRO");
}
}
setInterval(pkc,1);


/*Check The Hash Change*/
window.onhashchange=()=>{
if(window.location.hash == "#download"){
ytproDownVid();
}else{
try{document.getElementById("outerdownytprodiv").remove();}catch{}
}
}




/*YT ADS BLOCKER , Credits: Unknown Source*/
window.onload = function(){ 
var outerLayer = document.getElementsByClassName('video-ads ytp-ad-module');
var adPlayerOverlay = document.getElementsByClassName('ytp-ad-player-overlay'); // popup ads in video
var adImageOverlay = document.getElementsByClassName('ytp-ad-image-overlay');
var button = document.getElementsByClassName('ytp-ad-skip-button ytp-button');
var firstAd = document.getElementsByClassName('ytp-ad-text');
function skipFirstInner(callback) {
if (adPlayerOverlay[0] && adPlayerOverlay.length > 0) {
adPlayerOverlay[0].style.visibility = 'hidden';
}
else if (adImageOverlay[0] && adImageOverlay.length > 0) {
adImageOverlay[0].style.visibility = 'hidden';
}
callback();
}
function clickSkipBtn() {
if(button[0] && button.length > 0) {
button[0].click();
}
}
setInterval(function(){ 
if (outerLayer && outerLayer.length > 0) {
clickSkipBtn();
skipFirstInner(function() {
if((firstAd && firstAd[2] && firstAd[2].innerHTML.includes('Ad')) ||
(firstAd && firstAd[1] && firstAd[1].innerHTML.includes('Ad')) ||
(firstAd && firstAd[0] && firstAd[0].innerHTML.includes('Ad'))) {
clickSkipBtn();
let videos = document.querySelectorAll('video');
for(let i=0; i<videos.length; i++) {
if(videos[i] && videos[i].duration) {
videos[i].currentTime = videos[i].duration;
}
}
}
});
}
}, 1);
if((new URLSearchParams(window.location.search)).get('auds') == "ab"){
ytproAudPlayer();
}
};


