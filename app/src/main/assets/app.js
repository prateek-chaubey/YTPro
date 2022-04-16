/*****YTPRO*******
Author: Prateek Chaubey
Version: 1.0
URI: https://github.com/prateek-chaubey/
*/
/*Few Stupid Inits*/
var ytprof1,ytprov1;
var ytoldV=(new URLSearchParams(window.location.search)).get('v');
function ytproGetURL(o){
var sig=(new URLSearchParams(o)).get('s');
var url=(new URLSearchParams(o)).get('url');
sig=eval(ytprov1+ytprof1+"('"+decodeURIComponent(sig)+"');");
url=decodeURIComponent(url);
return  url+"&sig="+sig;
}

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
var scripts = document.getElementsByTagName('script');
for(var i=0;i<scripts.length;i++){
if(scripts[i].src.indexOf("/base.js") > 0){
var request = new XMLHttpRequest();
request.open("GET", scripts[i].src, false);
request.send(null);
extractFunctions(request.responseText);
}
}



function ytproDownVid(){
var ytproDown=document.createElement("div");
var ytproDownDiv=document.createElement("div");
ytproDownDiv.setAttribute("id","downytprodiv");
ytproDown.style.height="100%";
ytproDown.style.width="100%";
ytproDown.style.position="fixed";
ytproDown.style.display="flex";
ytproDown.style.background="rgba(0,0,0,.7)";
ytproDown.style.top="0";
ytproDown.style.left="0";
ytproDown.style.justifyContent="center";
ytproDown.style.alignItems="center";
ytproDown.style.zIndex="99999999999999";
ytproDownDiv.style.height="auto";
ytproDownDiv.style.width="80%";
ytproDownDiv.style.maxHeight="90%";
ytproDownDiv.style.overflow="scroll";
ytproDownDiv.style.background="rgba(0,0,0,1)";
ytproDownDiv.style.justifyContent="center";
ytproDownDiv.style.alignItems="center";
ytproDownDiv.style.zIndex="99999999999999";
ytproDownDiv.style.padding="20px";
ytproDownDiv.style.borderRadius="5px";
ytproDownDiv.style.color="white";
ytproDownDiv.style.textAlign="center";
ytproDownDiv.innerHTML="<style>#downytprodiv a{text-decoration:none;color:white;} #downytprodiv li{list-style:none;color:#0dd;padding:10px;background:#001;border:1px solid silver;margin:5px;text-align:lft;}</style>";
ytproDownDiv.innerHTML+="<span style='position:absolute;top:15px;left:15px;color:red;font-size:30px;' onclick='"+"this.parentElement.parentElement.style.display="+'"'+"none"+'"'+";'>&#x2715;</span>Select Avilaible Quality<ul id='listurl'>";
document.body.appendChild(ytproDown);
ytproDown.appendChild(ytproDownDiv);
if("ytplayer" in window){
for(x in ytplayer.config.args.raw_player_response.streamingData.formats){
if("signatureCipher" in ytplayer.config.args.raw_player_response.streamingData.formats[x]){
ytproDownDiv.innerHTML+="<li data-ytprotit='"+ytplayer.config.args.title+"'  onclick='YTDownVid(this)'  data-ytprourl='"+ytproGetURL(ytplayer.config.args.raw_player_response.streamingData.formats[x].signatureCipher)+"'>"+  (ytplayer.config.args.raw_player_response.streamingData.formats[x].qualityLabel ) +"</li>" ;
}else{
ytproDownDiv.innerHTML+="<li data-ytprotit='"+ytplayer.config.args.title+"'  onclick='YTDownVid(this)'  data-ytprourl='"+ytplayer.config.args.raw_player_response.streamingData.formats[x].url+"'>"+  (ytplayer.config.args.raw_player_response.streamingData.formats[x].qualityLabel ) +"</li>" ;
}}}else {
alert("AN ERROR OCCURED , PLEASE UPDATE YT PRO");
}
}
function YTDownVid(o){
Android.downvid((o.getAttribute("data-ytprotit")+".mp4"),o.getAttribute("data-ytprourl"),navigator.userAgent+"");
}
/*THE 0NE AND 0NLY FUNCTION*/
function pkc(){
if(window.location.href.indexOf("youtube.com/watch") > -1){
/*Dark and Light Mode*/
var c ="#000";
if(document.cookie.indexOf("f6=400") > -1){c ="#fff";}else{c="#000";}
/*Fetch The Dislikes*/
fetch("https://returnyoutubedislikeapi.com/votes?videoId="+(new URLSearchParams(window.location.search)).get('v'))
.then(response => {
return response.json();
}).then(jsonObject => {
if('dislikes' in jsonObject){
document.querySelectorAll('[aria-label="Dislike this video"]')[0].children[0].children[1].innerHTML=jsonObject.dislikes;
}
}).catch(error => {});
/*Check If Element Already Exists*/
if(document.getElementById("ytproMainDivE") == null){
function insertAfter(referenceNode, newNode) {try{referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);}catch{}}
var ytproMainDiv=document.createElement("div");
ytproMainDiv.style.height="50px";
ytproMainDiv.style.width="100%";
ytproMainDiv.style.display="flex";
ytproMainDiv.setAttribute("id","ytproMainDivE");
ytproMainDiv.style.alignItems="center";
ytproMainDiv.style.justifyContent="center";
ytproMainDiv.style.overflow="hidden";
insertAfter(document.getElementsByClassName('slim-video-action-bar-actions')[0],ytproMainDiv);
var ytproDownVidElem=document.createElement("div");
ytproDownVidElem.style.display="block";
ytproDownVidElem.style.height="90%";
ytproDownVidElem.style.width="auto";
ytproDownVidElem.style.textAlign="center";
ytproDownVidElem.style.marginRight="10px";
ytproDownVidElem.style.fontSize="12px";
ytproDownVidElem.innerHTML='	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="'+c+'" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>								<br>Download';
ytproMainDiv.appendChild(ytproDownVidElem);
ytproDownVidElem.addEventListener("click",
function(){ytproDownVid();});
var ytproPIPVidElem=document.createElement("div");
ytproPIPVidElem.style.display="block";
ytproPIPVidElem.style.height="90%";
ytproPIPVidElem.style.width="auto";
ytproPIPVidElem.style.textAlign="center";
ytproPIPVidElem.style.fontSize="12px";
ytproPIPVidElem.style.marginLeft="10px";
ytproPIPVidElem.innerHTML='	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"   fill="'+c+'" viewBox="0 0 24 24"><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"/></svg>								<br>PIP Mode';
ytproMainDiv.appendChild(ytproPIPVidElem);
ytproPIPVidElem.addEventListener("click",
function(){
document.getElementsByClassName('video-stream')[0].play();
try{document.getElementById("ytproMainAudDivE").remove();}catch{console.log("");}
Android.pipvid("pip");
});
var ytproAudElem=document.createElement("div");
ytproAudElem.style.display="block";
ytproAudElem.style.height="90%";
ytproAudElem.style.width="auto";
ytproAudElem.style.textAlign="center";
ytproAudElem.style.fontSize="12px";
ytproAudElem.style.marginLeft="20px";
ytproAudElem.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="'+c+'" class="bi bi-music-note-list" viewBox="0 0 16 16"><path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2z"/><path fill-rule="evenodd" d="M12 3v10h-1V3h1z"/><path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1V2.82z"/><path fill-rule="evenodd" d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5z"/></svg><br>Music '
ytproMainDiv.appendChild(ytproAudElem);
ytproAudElem.addEventListener("click",
function(){
ytproAudPlayer();
});
}
/*Watch The old and New URL*/
if(ytoldV != (new URLSearchParams(window.location.search)).get('v')){
try{document.getElementById("ytproMainAudDivE").remove();}catch{console.log("");}
ytoldV=(new URLSearchParams(window.location.search)).get('v');
window.location.href=window.location.href;
}
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


/*YT ADS BLOCKER , I know it's Copy Paste*/
window.onload = function(){ 
var outerLayer = document.getElementsByClassName('video-ads ytp-ad-module');
var adPlayerOverlay = document.getElementsByClassName('ytp-ad-player-overlay'); // popup ads in video
var adImageOverlay = document.getElementsByClassName('ytp-ad-image-overlay');
var button = document.getElementsByClassName('ytp-ad-skip-button ytp-button');
var firstAd = document.getElementsByClassName('ytp-ad-text');
document.getElementsByClassName('video-stream')[0].muted=false;
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
