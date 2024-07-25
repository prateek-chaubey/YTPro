/*****YTPRO*******
Author: Prateek Chaubey
Version: 3.4.57
URI: https://github.com/prateek-chaubey/
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
if(window.eruda == null){
//ERUDA
window.location.href=`javascript:(function () { var script = document.createElement('script'); script.src="//cdn.jsdelivr.net/npm/eruda"; document.body.appendChild(script); script.onload = function () { eruda.init() } })();`;
}
/**/


/*Few Stupid Inits*/
var YTProVer="3.45";
if(ytproNCode == undefined && ytproDecipher == undefined){
var ytproNCode=[];
var ytproDecipher=[];
}
var ytoldV="";
var isF=false;   //what is this for?
var isAP=false; // oh it's for bg play 
var isM=false; // no idea !!
var sTime=[];

if(localStorage.getItem("autoSpn") == null || localStorage.getItem("fitS") == null){
localStorage.setItem("autoSpn","true");
localStorage.setItem("fitS","true");
localStorage.setItem("fzoom","false");
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

/*Cleans the URL for various functions of the YTPRO*/
function ytproGetURL(o,p){
try{
var url=o;

if(p == "sig"){
var sig=(new URLSearchParams(o)).get('s');
url=(new URLSearchParams(o)).get('url');
sig=eval(ytproDecipher[0]+ytproDecipher[1]+"('"+decodeURIComponent(sig)+"');");
url=decodeURIComponent(url);
}
const components = new URL(decodeURIComponent(url));
const n = components.searchParams.get('n');
var nc=eval(ytproNCode[0]+ytproNCode[1]+"('"+n+"');");
components.searchParams.set('n',nc);
if(p == "sig"){
return  components.toString()+"&sig="+sig;
}
else{
return components.toString();
}
}catch{}
}


/*Dark and Light Mode*/
var c="#000";
var d="#f2f2f2";
var dislikes="...";

if(document.cookie.indexOf("PREF") < 0 || document.cookie.indexOf("f6=") < 0){
document.cookie.replace(
/(?<=^|;).+?(?=\=|;|$)/g,
name => location.hostname
.split(/\.(?=[^\.]+\.)/)
.reduceRight((acc, val, i, arr) => i ? arr[i]='.'+val+acc : (arr[i]='', arr), '')
.map(domain => document.cookie=`${name}=;max-age=0;path=/;domain=${domain}`)
);
document.cookie="PREF=f6=400&f7=100;";
window.location.href=window.location.href;
}
if(document.cookie.indexOf("f6=400") > -1){
c ="#fff";d="rgba(255,255,255,0.1)";
}else{
c="#000";d="rgba(0,0,0,0.1)";
}
var downBtn=`<svg xmlns="http://www.w3.org/2000/svg" height="18" fill="${c}" viewBox="0 0 24 24" width="18" focusable="false"><path d="M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z"></path></svg>`;



/*Extract Functions , Credits:node-ytdl-core && @distube/ytdl-core*/
var extractFunctions = (body)=> {

/*Regex & Functions for Decipher & NCode*/
// NewPipeExtractor regexps
const DECIPHER_NAME_REGEXPS = [
  '\\bm=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(h\\.s\\)\\);',
  '\\bc&&\\(c=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(c\\)\\)',
  // eslint-disable-next-line max-len
  '(?:\\b|[^a-zA-Z0-9$])([a-zA-Z0-9$]{2,})\\s*=\\s*function\\(\\s*a\\s*\\)\\s*\\{\\s*a\\s*=\\s*a\\.split\\(\\s*""\\s*\\)',
  '([\\w$]+)\\s*=\\s*function\\((\\w+)\\)\\{\\s*\\2=\\s*\\2\\.split\\(""\\)\\s*;',
];

// LavaPlayer regexps
const VARIABLE_PART = '[a-zA-Z_\\$][a-zA-Z_0-9]*';
const VARIABLE_PART_DEFINE = `\\"?${VARIABLE_PART}\\"?`;
const BEFORE_ACCESS = '(?:\\[\\"|\\.)';
const AFTER_ACCESS = '(?:\\"\\]|)';
const VARIABLE_PART_ACCESS = BEFORE_ACCESS + VARIABLE_PART + AFTER_ACCESS;
const REVERSE_PART = ':function\\(a\\)\\{(?:return )?a\\.reverse\\(\\)\\}';
const SLICE_PART = ':function\\(a,b\\)\\{return a\\.slice\\(b\\)\\}';
const SPLICE_PART = ':function\\(a,b\\)\\{a\\.splice\\(0,b\\)\\}';
const SWAP_PART = ':function\\(a,b\\)\\{' +
      'var c=a\\[0\\];a\\[0\\]=a\\[b%a\\.length\\];a\\[b(?:%a.length|)\\]=c(?:;return a)?\\}';

const DECIPHER_REGEXP = `function(?: ${VARIABLE_PART})?\\(a\\)\\{` +
  `a=a\\.split\\(""\\);\\s*` +
  `((?:(?:a=)?${VARIABLE_PART}${VARIABLE_PART_ACCESS}\\(a,\\d+\\);)+)` +
  `return a\\.join\\(""\\)` +
  `\\}`;

const HELPER_REGEXP = `var (${VARIABLE_PART})=\\{((?:(?:${
  VARIABLE_PART_DEFINE}${REVERSE_PART}|${
  VARIABLE_PART_DEFINE}${SLICE_PART}|${
  VARIABLE_PART_DEFINE}${SPLICE_PART}|${
  VARIABLE_PART_DEFINE}${SWAP_PART}),?\\n?)+)\\};`;

const N_TRANSFORM_REGEXP = 'function\\(\\s*(\\w+)\\s*\\)\\s*\\{' +
  'var\\s*(\\w+)=(?:\\1\\.split\\(""\\)|String\\.prototype\\.split\\.call\\(\\1,""\\)),' +
  '\\s*(\\w+)=(\\[.*?]);\\s*\\3\\[\\d+]' +
  '(.*?try)(\\{.*?})catch\\(\\s*(\\w+)\\s*\\)\\s*\\' +
  '{\\s*return"enhanced_except_([A-z0-9-]+)"\\s*\\+\\s*\\1\\s*}' +
  '\\s*return\\s*(\\2\\.join\\(""\\)|Array\\.prototype\\.join\\.call\\(\\2,""\\))};';


/*Matches the Regex*/

const matchRegex = (regex, str) => {
const match = str.match(new RegExp(regex, 's'));
if (!match) throw new Error(`Could not match ${regex}`);
return match;
};

const matchFirst = (regex, str) => matchRegex(regex, str)[0];

const matchGroup1 = (regex, str) => matchRegex(regex, str)[1];

const getFuncName = (body, regexps) => {
let fn;
for (const regex of regexps) {
try {
fn = matchGroup1(regex, body);
const idx = fn.indexOf('[0]');
if (idx > -1) {
fn = matchGroup1(`${fn.substring(idx, 0).replace(/\$/g, '\\$')}=\\[([a-zA-Z0-9$\\[\\]]{2,})\\]`, body);
}
break;
} catch (err) {
continue;
}
}
if (!fn || fn.includes('[')) throw Error();
return fn;
};






const extractDecipherFunc = body => {
try {
const DECIPHER_FUNC_NAME = 'ytproDecipher';
const helperObject = matchFirst(HELPER_REGEXP, body);
const decipherFunc = matchFirst(DECIPHER_REGEXP, body);
const resultFunc = `var ${DECIPHER_FUNC_NAME}=${decipherFunc};`;
const callerFunc = `${decipherFuncName}`;
return [helperObject + resultFunc , callerFunc];
} catch (e) {
return null;
}
};



const extractDecipherWithName = body => {
try {
const decipherFuncName = getFuncName(body, DECIPHER_NAME_REGEXPS);
const funcPattern = `(${decipherFuncName.replace(/\$/g, '\\$')}=function\\([a-zA-Z0-9_]+\\)\\{.+?\\})`;
const decipherFunc = `var ${matchGroup1(funcPattern, body)};`;
const helperObjectName = matchGroup1(';([A-Za-z0-9_\\$]{2,})\\.\\w+\\(', decipherFunc);
const helperPattern = `(var ${helperObjectName.replace(/\$/g, '\\$')}=\\{[\\s\\S]+?\\}\\};)`;
const helperObject = matchGroup1(helperPattern, body);
const callerFunc = `${decipherFuncName}`;
return [helperObject + decipherFunc , callerFunc];
} catch (e) {
return null;
}
};





const getExtractFunctions = (extractFunctions, body) => {
for (const extractFunction of extractFunctions) {
try {
const func = extractFunction(body);
if (!func) continue;
return func;
} catch (err) {
continue;
}
}
return null;
};






const extractDecipher = body => {
const decipherFunc = getExtractFunctions([extractDecipherWithName, extractDecipherFunc], body);
if (!decipherFunc) {
console.warn('WARNING: Could not parse decipher function.\n' );
}
return decipherFunc;
};





const extractNTransformFunc = body => {
try {
const N_TRANSFORM_FUNC_NAME = 'ytproNCode';
const nFunc = matchFirst(N_TRANSFORM_REGEXP, body);
const resultFunc = `var ${N_TRANSFORM_FUNC_NAME}=${nFunc}`;
const callerFunc = `${N_TRANSFORM_FUNC_NAME}`;
return [resultFunc , callerFunc];
} catch (e) {
return null;
}
};




const extractNTransform = body => {
const nTransformFunc = getExtractFunctions([extractNTransformFunc], body);
if (!nTransformFunc) {
console.warn('WARNING: Could not parse nTransform function.\n');
}
return nTransformFunc;
};


ytproDecipher=extractDecipher(body);
ytproNCode=extractNTransform(body);




};



function insertAfter(referenceNode, newNode) {try{referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);}catch{}}

/*Add Settings Tab*/
setInterval(()=>{
if(document.getElementById("setDiv") == null){
var setDiv=document.createElement("div");
setDiv.setAttribute("style",`
height:30px;width:30px;
z-index:9999999999;
font-size:22px;
text-align:center;line-height:35px;
`);
setDiv.setAttribute("id","setDiv");
var svg=document.createElement("div");
svg.innerHTML=`<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 22 22" width="22"  id="hSett"><path d="M12 9.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5m0-1c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zM13.22 3l.55 2.2.13.51.5.18c.61.23 1.19.56 1.72.98l.4.32.5-.14 2.17-.62 1.22 2.11-1.63 1.59-.37.36.08.51c.05.32.08.64.08.98s-.03.66-.08.98l-.08.51.37.36 1.63 1.59-1.22 2.11-2.17-.62-.5-.14-.4.32c-.53.43-1.11.76-1.72.98l-.5.18-.13.51-.55 2.24h-2.44l-.55-2.2-.13-.51-.5-.18c-.6-.23-1.18-.56-1.72-.99l-.4-.32-.5.14-2.17.62-1.21-2.12 1.63-1.59.37-.36-.08-.51c-.05-.32-.08-.65-.08-.98s.03-.66.08-.98l.08-.51-.37-.36L3.6 8.56l1.22-2.11 2.17.62.5.14.4-.32c.53-.44 1.11-.77 1.72-.99l.5-.18.13-.51.54-2.21h2.44M14 2h-4l-.74 2.96c-.73.27-1.4.66-2 1.14l-2.92-.83-2 3.46 2.19 2.13c-.06.37-.09.75-.09 1.14s.03.77.09 1.14l-2.19 2.13 2 3.46 2.92-.83c.6.48 1.27.87 2 1.14L10 22h4l.74-2.96c.73-.27 1.4-.66 2-1.14l2.92.83 2-3.46-2.19-2.13c.06-.37.09-.75.09-1.14s-.03-.77-.09-1.14l2.19-2.13-2-3.46-2.92.83c-.6-.48-1.27-.87-2-1.14L14 2z"></path></svg>
`;
setDiv.appendChild(svg);
insertAfter(document.getElementsByTagName("ytm-home-logo")[0],setDiv);

if(document.getElementById("hSett") != null){
document.getElementById("hSett").addEventListener("click",
function(ev){
window.location.hash="settings";
});
}
}


},50);



/*Fetches da base.js*/
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



/*Skips the bad part :)*/
function skipSponsor(){
var sDiv=document.createElement("div");
sDiv.setAttribute("style",`height:3px;pointer-events:none;width:100%;background:transparent;position:fixed;z-index:99999999;`)
sDiv.setAttribute("id","sDiv");
var dur=document.getElementsByClassName('video-stream')[0].duration;

for(var x in sTime){
var s1=document.createElement("div");
var s2=sTime[x];
s1.setAttribute("style",`height:3px;width:${(100/dur) * (s2[1]-s2[0])}%;background:#0f8;position:fixed;z-index:99999999;left:${(100/dur) * s2[0]}%;`)
sDiv.appendChild(s1);
}
if(document.getElementById("sDiv") == null){
if(document.getElementsByClassName('YtmChapteredProgressBarHost')[0] != null){
document.getElementsByClassName('YtmChapteredProgressBarHost')[0].appendChild(sDiv);
}else{
try{document.getElementsByClassName('YtmProgressBarProgressBarLine')[0].appendChild(sDiv);}catch{}
}
}
}





/*Fetch The Dislikes*/
async function fDislikes(){ 
var vID="";
var Url=new URL(window.location.href);
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
fDislikes();


if(window.location.pathname.indexOf("watch") > -1){

/*Check For Sponsorships*/
fetch("https://sponsor.ajay.app/api/skipSegments?videoID="+(new URLSearchParams(window.location.search)).get('v'))
.then(response => {
return response.json();
}).then(jsonObject => {
for(var x in jsonObject){
var time=jsonObject[x].segment;
sTime.push(time);
}
}).catch(error => {});




/*Skip the Sponsor*/
document.getElementsByClassName('video-stream')[0].ontimeupdate=()=>{
var cur=document.getElementsByClassName('video-stream')[0].currentTime;
for(var x in sTime){
var s2=sTime[x];
if(Math.floor(cur) == Math.floor(s2[0])){
if(localStorage.getItem("autoSpn") == "true"){
document.getElementsByClassName('video-stream')[0].currentTime=s2[1];
addSkipper(s2[0]);
}
}
}
};


setInterval(skipSponsor,50);


}




if((window.location.pathname.indexOf("watch") > -1) || (window.location.pathname.indexOf("shorts") > -1)){
var unV=setInterval(() => {
/*Set Orientation*/

var v=document.getElementsByClassName('video-stream')[0].getBoundingClientRect();
if(v.height > v.width){
Android.fullScreen(true);
}
else{
Android.fullScreen(false);
}

/*Unmute The Video*/ 

document.getElementsByClassName('video-stream')[0].muted=false;
if(!document.getElementsByClassName('video-stream')[0].muted){
clearInterval(unV);
}

}, 5);

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

/*The settings tab*/
async function ytproSettings(){
var ytpSet=document.createElement("div");
var ytpSetI=document.createElement("div");
ytpSet.setAttribute("id","settingsprodiv");
ytpSetI.setAttribute("id","ssprodivI");
ytpSet.setAttribute("style",`
height:100%;width:100%;position:fixed;top:0;left:0;
display:flex;justify-content:center;
background:rgba(0,0,0,0.4);
z-index:9999;
`);
ytpSet.addEventListener("click",
function(ev){
if(!(ev.target == ytpSetI  || ytpSetI.contains(ev.target))){
history.back();
}
});

ytpSetI.setAttribute("style",`
height:65%;width:85%;overflow:auto;background:#0f0f0f;
position:absolute;bottom:20px;
z-index:99999999999999;padding:20px;text-align:center;border-radius:25px;color:white;text-align:center;
`);

ytpSetI.innerHTML=`<style>
#settingsprodiv a{text-decoration:underline;color:white;} #settingsprodiv li{list-style:none; display:flex;align-items:center;justify-content:center;color:#fff;border-radius:25px;padding:10px;background:#000;margin:5px;}
#ssprodivI div{
height:10px;
width:calc(100% - 20px);
padding:10px;
font-size:1.35rem;
font-family:monospace;
text-align:left;
display:block;
}
#ssprodivI div span{
display:block;
height:15px;
width:30px;
border-radius:20px;
float:right;
position:relative;
background:rgba(255,0,0,.5);
}
#ssprodivI div span b{
display:block;
height:20px;
width:20px;
position:absolute;
right:-6px;
top:-2px;
border-radius:50px;
background:rgba(255,0,220,5);
}
#ssprodivI div input::placeholder{color:white;}
#ssprodivI div input,#ssprodivI div button{
height:30px;
background:rgba(255,255,255,.1);
width:100%;
border:0;
border-radius:20px;
padding:10px;
font-size:1.25rem;
}
#ssprodivI div button{
background:linear-gradient(120deg,#038,#0a3);
font-size:1.25rem;
width:47%;
border-radius:50px;
padding:0;
color:white;
}

</style>`;
ytpSetI.innerHTML+=`<b style='font-size:18px' >YT PRO Settings</b>
<span style="font-size:10px">v${YTProVer}</span>
<br><br>
<div><input type="url" placeholder="Enter Youtube URL" onkeyup="searchUrl(this,event)"></div>
<br>
<div style="text-align:center" ><button onclick="showHearts();">Hearted Videos</button>
<button style="margin-left:10px" onclick="checkUpdates();">Check for Updates</button>
</div>
<br>
<div>Autoskip Sponsors <span onclick="sttCnf(this,'autoSpn');" style="${sttCnf(0,0,"autoSpn")}" ><b style="${sttCnf(0,1,"autoSpn")}"></b></span></div>
<br>
<div>Auto FitScreen <span onclick="sttCnf(this,'fitS');" style="${sttCnf(0,0,"fitS")}" ><b style="${sttCnf(0,1,"fitS")}" ></b></span></div> 
<br>
<div>Force Zoom <span onclick="sttCnf(this,'fzoom');" style="${sttCnf(0,0,"fzoom")}" ><b style="${sttCnf(0,1,"fzoom")}" ></b></span></div> 
<br>
<div>Hide Shorts <span onclick="sttCnf(this,'shorts');" style="${sttCnf(0,0,"shorts")}" ><b style="${sttCnf(0,1,"shorts")}" ></b></span></div> 
<br>
<div style="display:flex;justify-content:center;font-family:cursive;text-align:center;font-size:2.25rem;font-weight:bolder;color:#0f8;">Made with 
&#x2665; by Prateek Chaubey</div>
<br><br>
<div style="font-size:1.25rem;"><b style="font-weight:bold">Disclaimer</b>: This is an unofficial OSS Youtube Mod , all the logos and brand names are property of Google LLC.<br>
You can get the source code at <a href="#" onclick="Android.oplink('https://github.com/prateek-chaubey/YTPRO')" > https://github.com/prateek-chaubey/YTPRO</a>
<br><br><center>
<a href="#" onclick="Android.oplink('https://github.com/prateek-chaubey/YTPRO/issues')" >Report Bugs</a>
</center></div>`;

document.body.appendChild(ytpSet);
ytpSet.appendChild(ytpSetI);

}

function searchUrl(x,e){
if(e.keyCode === 13 || e === "Enter"){
window.location.href=x.value;
}
}

function checkUpdates(){
if(parseFloat(Android.getInfo()) < parseFloat(YTProVer) ){
updateModel();
}else{
alert("Your app is up to date");
}

fetch('https://cdn.jsdelivr.net/npm/ytpro', {cache: 'reload'});
fetch('https://cdn.jsdelivr.net/npm/ytpro/bgplay.js', {cache: 'reload'});
}


/*Set Configration*/
function sttCnf(x,z,y){

/*Way too complex to understand*/

if(typeof y == "string"){

if(localStorage.getItem(y) != "true"){
if(z == 1){
return 'background:rgba(255,255,255,.7);left:-6px;'
}else{
return 'background:rgba(255,255,255,.1)';
}
}else{
if(z == 1){
return 'background:rgba(255,50,50,1);left:auto;right:-6px;'
}else{
return 'background:rgba(255,50,50,.5)';
}
}
}
if(localStorage.getItem(z) == "true"){
localStorage.setItem(z,"false");
x.style.background="rgba(255,255,255,.1)";
x.children[0].style.left="-6px";
x.children[0].style.background="rgba(255,255,255,.7)";
}
else{
localStorage.setItem(z,"true");
x.style.background="rgba(255,50,50,.5)";
x.children[0].style.left="auto";
x.children[0].style.right="-6px";
x.children[0].style.background="rgba(255,50,50,7)";
}

if(localStorage.getItem("fzoom") == "false"){
document.getElementsByName("viewport")[0].setAttribute("content","width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,");
}else{
document.getElementsByName("viewport")[0].setAttribute("content","");
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
if(ev.target != ytproDownDiv ){
history.back();
}
});

ytproDownDiv.setAttribute("style",`
height:50%;width:85%;overflow:auto;background:#0f0f0f;
position:absolute;bottom:20px;
z-index:99999999999999;padding:20px;text-align:center;border-radius:25px;color:white;text-align:center;
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

var info=await fetch("https://m.youtube.com/watch?v="+id).then(r => r.text());



try{
var sD=JSON.parse("{"+(info.substr(info.indexOf("streamingData")-1,((info.indexOf("playbackTracking")-1)-info.indexOf("streamingData"))))+"}");
var vD=JSON.parse("{"+info.substr(info.indexOf("\"videoDetails"),((info.indexOf("\"trackingParams")-1)-info.indexOf("\"videoDetails")))+"}");
var cD=JSON.parse("{"+info.substr(info.indexOf("\"captionTracks\""),(info.indexOf("\"audioTracks\"") -1 - info.indexOf("\"captionTracks\"")))+"}");
}catch(e){
history.back();
return Android.showToast("Download Error , Please open and issue on Github if the error persists.\n\n"+e);
}




var thumb=vD?.videoDetails?.thumbnail?.thumbnails;
var vids=sD?.streamingData?.formats;
var avids=sD?.streamingData?.adaptiveFormats;
var cap=cD?.captionTracks;
var t=vD?.videoDetails?.title.replaceAll("|","").replaceAll("\\","").replaceAll("?","").replaceAll("*","").replaceAll("<","").replaceAll("/","").replaceAll(":","").replaceAll('"',"").replaceAll(">","");
ytproDownDiv.innerHTML="<style>#downytprodiv a{text-decoration:none;color:white;} #downytprodiv li{list-style:none; display:flex;align-items:center;justify-content:center;color:#fff;border-radius:25px;padding:8px;background:rgb(10,0,0);margin:5px;box-shadow:0px 0px 2px rgb(236,84,232);margin-top:8px}</style>";



ytproDownDiv.innerHTML+="Select Avilaible Formats<ul id='listurl'>";

for(var x in vids){

var url="";
if("signatureCipher" in vids[x]){
url=ytproGetURL(vids[x].signatureCipher,"sig");
}else{
url=ytproGetURL(vids[x].url,"n");
}

ytproDownDiv.innerHTML+=`<li data-ytprotit="${t}"  style="background:#001;box-shadow:0px 0px 2px rgb(70,84,232);"  onclick="YTDownVid(this,'.mp4')"  data-ytprourl="${url}">
${downBtn}<span style="margin-left:10px;"  >${vids[x].qualityLabel} ${formatFileSize(((vids[x].bitrate*(vids[x].approxDurationMs/1000))/8))} </span></li>` ;
}




for(x in avids){


if(avids[x].mimeType.indexOf("audio") > -1){

var url="";
if("signatureCipher" in avids[x]){
url=ytproGetURL(avids[x].signatureCipher,"sig");
}else{
url=ytproGetURL(avids[x].url,"n");
}

ytproDownDiv.innerHTML+=`<li data-ytprotit="${t}"  onclick="YTDownVid(this,'.mp3')"  data-ytprourl="${url}">
${downBtn}<span style="margin-left:10px;"  >Audio | ${avids[x].audioQuality.replace("AUDIO_QUALITY_","")}${formatFileSize(avids[x].contentLength)} 
</span></li>` ;
}
}



ytproDownDiv.innerHTML+="<br>Thumbnails<br><br><style>.thu{height:80px;border-radius:10px;}.thu img{max-height:97%;max-width:70%;border-radius:10px;border:1px solid silver;}</style>";
for(x in thumb){
ytproDownDiv.innerHTML+=`<li data-ytprotit="${t+Date.now()}"  onclick="YTDownVid(this,'.png')" style="box-shadow:0px 0px 2px rgb(70,234,232);" class="thu" data-ytprourl="${thumb[x].url}">
<img src="${thumb[x].url}"><br>
<span style="margin-left:30px;display:flex;align-items:center;justify-content:center;"  >${downBtn}<span style="margin-left:10px;"  >${thumb[x].height} &#x2715; ${thumb[x].width}
</span></span></li>` ;
}

if(cap && cap.length){
ytproDownDiv.innerHTML+="<br>Captions<br><br><style>cp{display:flex;align-items:center;width:100%;height:30px}c{height:45px;width:50px;padding-top:5px;background:rgba(255,255,255,.1);border-radius:10px;margin-left:10px;display:block}</style>";
for(var x in cap){
ytproDownDiv.innerHTML+=`<cp><span style="width:100px;text-align:left">${cap[x]?.name?.runs[0]?.text}</span> <div style="position:absolute;right:10px;display:flex"><c onclick="downCap('${cap[x].baseUrl}&fmt=xml','${t}.xml')" >${downBtn} <br>.xml</c><c onclick="downCap('${cap[x].baseUrl}&fmt=vtt','${t}.vtt')">${downBtn} <br>.vtt</c><c onclick="downCap('${cap[x].baseUrl}&fmt=srv1','${t}.srv1')">${downBtn} <br>.srv1</c><c onclick="downCap('${cap[x].baseUrl}&fmt=ttml','${t}.ttml')">${downBtn} <br>.ttml</c></div></cp><br><br>`; 
}
}




}


/*Add the meme type and extensions lol*/
function downCap(x,t){
Android.downvid(t,`https://m.youtube.com${x}`,"plain/text");
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

//console.log(o.getAttribute("data-ytprourl"))


Android.downvid((o.getAttribute("data-ytprotit")+ex),o.getAttribute("data-ytprourl"),mtype);
}


/*THE 0NE AND 0NLY FUNCTION*/
function pkc(){

if(window.location.href.indexOf("youtube.com/watch") > -1){


try{
var elm=document.getElementsByTagName("dislike-button-view-model")[0].children[0].children[0]; 
elm.children[0].style.width="80px";
elm.children[0].children[0].style.position="absolute";
elm.children[0].children[0].style.left="15px";
if(elm.children[0].children[2] == null){
elm.children[0].innerHTML+=`<span style="margin-left:20px">${dislikes}<span>`;
}else{elm.children[0].children[2].innerHTML=dislikes;}
}catch{}


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
height:50px;width:130%;display:flex;overflow:auto;
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
ytproDownVidElem.innerHTML=`${downBtn.replace('width="18"','width="24"').replace('height="18"','height="24"')}<span style="margin-left:2px">Download<span>`;
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
isAP=false;
PIPlayer2();
});



/*Minimize Button*/
var ytproMinVidElem=document.createElement("div");
sty(ytproMinVidElem);
ytproMinVidElem.style.width="110px";
ytproMinVidElem.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-in-down-right" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M6.364 2.5a.5.5 0 0 1 .5-.5H13.5A1.5 1.5 0 0 1 15 3.5v10a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 2 13.5V6.864a.5.5 0 1 1 1 0V13.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-.5-.5H6.864a.5.5 0 0 1-.5-.5z"/>
<path fill-rule="evenodd" d="M11 10.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h3.793L1.146 1.854a.5.5 0 1 1 .708-.708L10 9.293V5.5a.5.5 0 0 1 1 0v5z"/>
</svg>
<span style="margin-left:8px">Minimize<span>`;
ytproMainDiv.appendChild(ytproMinVidElem);
ytproMinVidElem.addEventListener("click",
function(){

var d=document.createElement("div");
d.setAttribute("style",`
height:118px;width:182px;background:rgba(130,130,130,.3);
backdrop-filter:blur(6px);
position:absolute;bottom:40px;
line-height:50px;position:fixed;
bottom:50px;
left:calc(5% / 2);padding-right:20px;
z-index:99999999999999;text-align:center;border-radius:5px;
color:white;text-align:center;
`);
d.innerHTML=`<span style="height:30px;position:absolute;right:-10px;top:-15px;display:block;z-index:999999999999999999;">
<svg onclick="this.parentElement.parentElement.remove();" xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="margin-left:30px;" fill="#f24" viewBox="0 0 16 16">
<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
</svg>
</span>`;


var v=document.createElement("video");

v.setAttribute("style",`position:fixed;top:5px;left:5px;height:108px;width:192px;z-index:999;`);
v.setAttribute("controls",``);
var f=ytplayer.config.args.raw_player_response.streamingData.formats;
if("signatureCipher" in f[0]){
v.src=ytproGetURL(f[0].signatureCipher,"sig");
}else{
v.src=ytproGetURL(f[0].url,"n");
}


v.currentTime=document.getElementsByClassName('video-stream')[0].currentTime;
d.appendChild(v);
v.play();
document.body.appendChild(d);



history.pushState({},"","https://m.youtube.com/");
history.pushState({},"","https://m.youtube.com/");
history.back();

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

if(parseFloat(Android.getInfo()) < parseFloat(YTProVer)){
return updateModel();
}

window.location.hash="bgplay";
});

if(ytproNCode.length < 1 && ytproDecipher.length < 1 ){
ytproAudElem.style.opacity=".5";
ytproAudElem.style.pointerEvents="none";
}
else if(ytproNCode.length > 1 && ytproDecipher.length > 1 ){
ytproAudElem.style.opacity="1";
ytproAudElem.style.pointerEvents="auto";
}


}

/*Watch The old and New URL*/
if(ytoldV != (new URLSearchParams(window.location.search)).get('v')){
try{document.getElementById("ytproMainAudDivE").remove();}catch{console.log("No Element Found");}
isAPlaying=false;
ytoldV=(new URLSearchParams(window.location.search)).get('v');
window.location.href=window.location.href;
}


}else if(window.location.href.indexOf("youtube.com/shorts") > -1){



if(document.getElementById("ytproMainSDivE") == null){
var ys=document.createElement("div");
ys.setAttribute("id","ytproMainSDivE");
ys.setAttribute("style",`width:50px;height:100px;position:absolute;display:block;right:10px;bottom:500px;`);


/*Download Button*/
ysDown=document.createElement("div");
ysDown.setAttribute("style",`
height:50px;width:50px;text-align:center;line-height:65px;display:block;overflow:auto;
background:rgba(0,0,0,.4);border-radius:50%;margin-bottom:25px;
`);
ysDown.innerHTML=downBtn.replace(`width="18"`,`width="26"`).replace(`height="18"`,`height="26"`)+
`<span style="position:absolute;bottom:5px;color:white;font-size:14px;left:-10px">Download<span>`;
ysDown.addEventListener("click",
function(){
window.location.hash="download";
});


/*Heart Button*/
ysHeart=document.createElement("div");
ysHeart.setAttribute("style",`
height:50px;width:50px;text-align:center;line-height:65px;display:block;overflow:auto;
background:rgba(0,0,0,.4);border-radius:50%;margin-top:8px;margin-bottom:0px;
`);


if(!isHeart()){
ysHeart.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="${c}" viewBox="0 0 16 16">
<path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
</svg><span style="position:absolute;bottom:-70px;color:white;font-size:14px;left:7px">Heart<span>`;
}else{
ysHeart.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="#f00" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
</svg><span style="position:absolute;bottom:-70px;color:white;font-size:14px;left:7px">Heart<span>`;
}


ysHeart.addEventListener("click",
function(){
ytProHeart(ysHeart);
});





insertAfter(document.getElementsByClassName("carousel-wrapper")[0],ys);
ys.appendChild(ysDown);
ys.appendChild(ysHeart);
}

try{document.querySelectorAll('[aria-label="Dislike this video"]')[0].nextElementSibling.children[0].innerHTML=dislikes;}catch{}



if(document.getElementsByClassName('video-stream')[0].paused){
if(document.getElementById("ytproMainSDivE") != null) document.getElementById("ytproMainSDivE").style.bottom="510px";
}else{
if(document.getElementById("ytproMainSDivE") != null) document.getElementById("ytproMainSDivE").style.bottom="470px";
}


/*Watch The old and New URL*/
if(ytoldV != window.location.pathname){
fDislikes();
ytoldV=window.location.pathname;
}


}

}


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
height:50%;width:85%;overflow:auto;background:#0f0f0f;
position:absolute;bottom:20px;
z-index:99999999999999;padding:20px;text-align:center;border-radius:25px;color:white;text-align:center;
`);
ytproHh.innerHTML="<style>#heartytprodiv a{text-decoration:none;color:white;} #heartytprodiv li{list-style:none; display:flex;align-items:center;color:#fff;border-radius:5px;padding:0px;background:#000;margin:5px;}</style>";
ytproHh.innerHTML+="Hearted Videos<ul id='listurl'>";


ytproHh.innerHTML+="<style>.thum{height:70px;border-radius:5px;}.thum img{float:left;height:70px;width:125px;border-radius:5px;flex-shrink: 0;}</style>";

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



if(window.location.pathname.indexOf("shorts") > -1){

var video=document.getElementsByClassName('video-stream')[0];
var canvas = document.createElement('canvas');
canvas.style.width = "1600px"; 
canvas.style.height = "900px";
canvas.style.background="black";
var context = canvas.getContext('2d');
context.drawImage(video,105, 0, 90,160);
var dataURI = canvas.toDataURL('image/jpeg');



var vDetails={
thumb:dataURI,
title:document.getElementsByClassName('ReelPlayerHeaderRendererReelTitle')[0].textContent.replaceAll("|","").replaceAll("\\","").replaceAll("?","").replaceAll("*","").replaceAll("<","").replaceAll("/","").replaceAll(":","").replaceAll('"',"").replaceAll(">","")
};

}else{

var vDetails={
thumb:[...ytplayer.config.args.raw_player_response?.videoDetails?.thumbnail?.thumbnails].pop().url,
title:ytplayer.config.args.raw_player_response?.videoDetails?.title.replaceAll("|","").replaceAll("\\","").replaceAll("?","").replaceAll("*","").replaceAll("<","").replaceAll("/","").replaceAll(":","").replaceAll('"',"").replaceAll(">","")
};

}


var g="16";
var h=`<span style="margin-left:8px">Heart<span>`;
(window.location.href.indexOf('youtube.com/shorts') > -1) ? h=`<span style="position:absolute;bottom:-70px;color:white;font-size:14px;left:7px">Heart<span>`:h=`<span style="margin-left:8px">Heart<span>`;
(window.location.href.indexOf('youtube.com/shorts') > -1) ? g="23" : g="16" ;

if(localStorage.getItem("hearts")?.indexOf(vid) > -1){
var j=JSON.parse(localStorage.getItem("hearts") || "{}");
delete j[vid];
localStorage.setItem("hearts",JSON.stringify(j));
x.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="${g}" height="${g}" fill="${c}" viewBox="0 0 16 16">
<path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
</svg>${h}`;
}else{
var j=JSON.parse(localStorage.getItem("hearts") || "{}");
j[vid]=vDetails;
localStorage.setItem("hearts",JSON.stringify(j));
x.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="${g}" height="${g}" fill="#f00" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
</svg>${h}`;
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



/*Factoring the code after months , i really don't know what miracle this piece does*/
function removePIP(){
if(!isF){
document.getElementsByClassName("fullscreen-icon")[0].click();
}
isAP=false;
}




function PIPlayer(){
if(isAP == false) PIPlayer1();
}

function PIPlayer1(){

try{stopPlayback();}catch{console.log("Audio Not Playing");}
if(window.innerWidth == screen.width && window.innerHeight == screen.height){
isF=true;
}
else{
isF=false;
}
if(!document.getElementsByClassName('video-stream')[0].paused){
if(!isF){
document.getElementsByClassName("fullscreen-icon")[0].click();
}
Android.pipvid("pip");
var o=0;
var h=setInterval(()=>{o+=1;if(o==10){clearInterval(h);}document.getElementsByClassName('video-stream')[0].play(); },10);
}
}



function PIPlayer2(){
try{stopPlayback();}catch{console.log("No Audio Playing");}
if(window.innerWidth == screen.width && window.innerHeight == screen.height){
isF=true;
}
else{
isF=false;
}
isHPIP=false;
Android.pipvid("pip");
if(!isF){
document.getElementsByClassName("fullscreen-icon")[0].click();
}
document.getElementsByClassName('video-stream')[0].play();
}






/*YTPRO Audio Player*/
/*hehe i removed this lmao*/


setInterval(pkc,0);


/*Check The Hash Change*/
window.onhashchange=()=>{
if(window.location.hash == "#download"){
ytproDownVid();
}else if(window.location.hash == "#settings"){
ytproSettings();
}
else if(window.location.hash == "#hearts"){
showHearts();
}
else if(window.location.hash == "#bgplay"){
ytproAudPlayer(new URLSearchParams(window.location.search).get("v"));
}
else{
try{stopPlayback();}catch{}
try{document.getElementById("outerdownytprodiv").remove();}catch{}
try{document.getElementById("outerheartsdiv").remove();}catch{}
try{document.getElementById("settingsprodiv").remove();}catch{}
}
}




/*YT ADS BLOCKER*/
setInterval(function(){ 

/*Block Ads*/
var ads=document.getElementsByTagName("ad-slot-renderer");
for(var x in ads){
try{ads[x].remove();}catch{}
}
try{
document.getElementsByClassName("ad-interrupting")[0].getElementsByTagName("video")[0].currentTime=document.getElementsByClassName("ad-interrupting")[0].getElementsByTagName("video")[0].duration;
document.getElementsByClassName("ytp-ad-skip-button-text")[0].click();
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
document.querySelectorAll('[aria-label="Open App"]')[0].remove(); 
}catch{}
/*Remove Promotion Element*/
try{document.getElementsByTagName("ytm-paid-content-overlay-renderer")[0].style.display="none";}catch{}

/*Hide Shorts*/
if(localStorage.getItem("shorts") == "true"){

for( x in document.getElementsByTagName("ytm-reel-shelf-renderer")){
try{document.getElementsByTagName("ytm-reel-shelf-renderer")[x].remove();
}catch{}

}
}

/****** I LOVE YOU <3 *****/


/*Removing this till next update , as it causes bug in certain devices*/

//Add Maximize Button
/*
var pElem=document.getElementById('player-container-id');
if(pElem === document.fullscreenElement){

var Vv=document.getElementsByClassName('video-stream')[0];

var mE=document.createElement("div");

if((Vv.getBoundingClientRect().width / Vv.offsetWidth) > 1){
mE.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-angle-contract" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M.172 15.828a.5.5 0 0 0 .707 0l4.096-4.096V14.5a.5.5 0 1 0 1 0v-3.975a.5.5 0 0 0-.5-.5H1.5a.5.5 0 0 0 0 1h2.768L.172 15.121a.5.5 0 0 0 0 .707zM15.828.172a.5.5 0 0 0-.707 0l-4.096 4.096V1.5a.5.5 0 1 0-1 0v3.975a.5.5 0 0 0 .5.5H14.5a.5.5 0 0 0 0-1h-2.768L15.828.879a.5.5 0 0 0 0-.707z"/>
</svg>`;
}else{
mE.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-angle-expand" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707z"/>
</svg>`;
}


mE.setAttribute("id","mE");
mE.setAttribute("style",`position:absolute;right:60px;padding:15px;`);

if(document.getElementById("mE") == null) {
document.getElementsByClassName("player-controls-bottom")[0].appendChild(mE);
}

mE.addEventListener("click",()=>{
var scale=(Vv.videoHeight > Vv.videoWidth) ? (screen.height / Vv.videoHeight) : (screen.width / Vv.videoWidth);
if((Vv.getBoundingClientRect().width / Vv.offsetWidth) > 1){
Vv.style.transform=`scale(1)`;
}else{
Vv.style.transform=`scale(${scale})`;
}
});
}
*/



}, 1);


//Add FitScreen Button
/*
document.getElementById('player-container-id').addEventListener("fullscreenchange",(ev)=>{
if(document.fullscreenElement != null){
var Vv=document.getElementsByClassName('video-stream')[0];
var scale=(Vv.videoHeight > Vv.videoWidth) ? (screen.height / Vv.videoHeight) : (screen.width / Vv.videoWidth);
if (scale < 1) scale =1;
if(localStorage.getItem("fitS") == "true"){
setTimeout(()=>{Vv.style.transform=`scale(${scale})`;},0);
}
}
});*/



/*Update your app bruh*/
function updateModel(){


var x=document.createElement("div");

x.setAttribute("style",`height:100%;width:100%;position:fixed;display:grid;align-items:center;top:0;left:0;background:rgba(0,0,0,.2);z-index:99999;`);

x.innerHTML=`
<div style="height:140px;width:70%;padding:20px;background:rgba(0,0,0,.1);border:1px solid #888;box-shadow:0px 0px 5px black;backdrop-filter:blur(10px);border-radius:15px;margin:auto">
<h2> Update Available</h2><br>
Latest Version ${YTProVer} of YTPRO is available , update the YTPRO to get latest features.
<br>- Improved Background Play<br>
- Bug fixes and updates
<br>
<br>
<div style="display:flex;">
<button style="border:0;border-radius:10px;height:30px;width:150px;background:;" onclick="this.parentElement.parentElement.parentElement.remove();">Cancel</button>
<button style="border:0;border-radius:10px;height:30px;width:150px;background:rgba(255,50,50,.7);float:right;" onclick="Android.downvid('YTPRO.zip','https://nightly.link/prateek-chaubey/YTPro/workflows/gradle/main/Apk.zip','application/zip');">Download</button>
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
