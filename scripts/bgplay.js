/*Again a few inits */
window.queue=[];
window.isPlayingAud=false;
window.songIndex=0;




/*This one links to the video*/
function createGTVideo(){
if (document.querySelector("#GTVideo") != null) return;
var a=document.createElement("div");
a.setAttribute("style",`height:40px;width:150px;border-radius:25px;background:rgba(255,255,255,.1);backdrop-filter:blur(10px);z-index:999999999;
position:fixed;top:150px;left:calc(50% - 75px);border:1px solid silver;
text-align:center;line-height:40px;color:white;`);
a.setAttribute("id","GTVideo")


a.innerHTML="Go to the Video";
a.addEventListener("click",()=>{
window.location.href="https://m.youtube.com/watch?v="+queue[songIndex];
})

document.body.appendChild(a);

}





/*The main BG Play fun*/
async function ytproAudPlayer(id){



if (!queue.includes(id)) {
queue.push(id);
}


if(document.getElementById("ytproAudDiv") == null ){
createAudElements();
}



if(id != new URLSearchParams(window.location.search).get("v")){
createGTVideo();
}else{
if (document.querySelector("#GTVideo") != null) document.querySelector("#GTVideo").remove();
}

Android.fetchYouTubeData(id,true);

}




async function backToBgplay(info){

var ytproURL="";

if(Object.keys(info).length === 0){
history.back();
return Android.showToast("Playback Error , Please open and issue on Github if the error persists.\n\n");
}


var af=info?.streamingData?.adaptiveFormats;

var author=info?.videoDetails?.author; 
var thumb =[...info?.videoDetails?.thumbnail?.thumbnails].pop().url;
var title=info?.videoDetails?.title;



for(var x in af){

if(af[x]?.itag == "140"){

ytproURL=af[x].url;


break;

}
}

//console.log(ytproURL)


/*UI is important as well*/
document.querySelector("#imgThumb").src=thumb;
document.querySelector("#imgThumb").style.background="url('"+thumb+"')";
document.querySelector("#imgThumb").style.backgroundSize="cover";
document.querySelector("#imgThumb").style.backgroundRepeat="no-repeat";
document.querySelector("#ib").style.background="url('"+thumb+"')";
document.querySelector("#ytProtitle").innerHTML=title;

var ytproAud=document.querySelector("#ytproAud");


ytproAud.src=ytproURL;


/*FallBack*/
/*ytproAud.onerror = async function() {
console.log("error",ytproURL);
var id=new URLSearchParams(window.location.search).get("v");
var info=await fetch("https://youtube-downloader.deno.dev/audio?id="+id);
var info=await info.json();
for(var x in info.audio){
if(info.audio[x].itag == "140"){
ytproAud.src=info.audio[x].url;
ytproURL=info.audio[x].url;
console.log("NEW URL",ytproURL);
}
}
}*/
//ytproAud.onerror = ytproAudPlayer(id);




/*Onload*/
ytproAud.onloadeddata = async function() {

isAP=true;
document.querySelector("#playpause").innerHTML=`<svg id="playpaus"  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5"/></svg>`;


var img = new Image();
img.crossOrigin="anonymous";
img.src=thumb;

var iconBase64="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";



var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

canvas.width = 160;
canvas.height  = 90;

//var z=performance.now();


await new Promise((res,rej)=>{
img.onload=()=>res();
});


//console.log("Loaded In",performance.now()-z)


try{
context.drawImage(img, 0,0 ,160,90);
iconBase64 = canvas.toDataURL('image/png',1.0);
}catch{}

if(isPlayingAud){
setTimeout(()=>{Android.bgUpdate(iconBase64.replace("data:image/png;base64,", ""),title,author,ytproAud.duration*1000);},50);
}
else{
isPlayingAud=true;
//console.log("NEW SERVICE");
setTimeout(()=>{Android.bgStart(iconBase64.replace("data:image/png;base64,", ""),title,author,ytproAud.duration*1000);},50);
}



ytproAud.play();


/*
if(songIndex >= (queue.length - 1)){
getQueue(id);
}*/



};







/*Pause event , updates the android notification*/
ytproAud.addEventListener('pause', async (event) => {
if(!isPlayingAud) return;
document.querySelector("#playpause").innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"  fill="white"  viewBox="0 0 16 16"><path d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z"/></svg>`;
setTimeout(()=>{Android.bgPause(ytproAud.currentTime*1000);},100);
});
/*Play event , updates the android notification*/
ytproAud.addEventListener('play', async (event) => {
if(!isPlayingAud) return;
document.querySelector("#playpause").innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"  fill="white"  viewBox="0 0 16 16"><path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5"/></svg>`;
setTimeout(()=>{Android.bgPlay(ytproAud.currentTime*1000);},100);
});


/*Timupdate event , updates the android notification*/
ytproAud.addEventListener("timeupdate", async function(){




if(!isPlayingAud) return;

var tim=document.querySelector("#timeUpdate");
document.querySelector("#inSeek").max=ytproAud.duration;


var duration=ytproAud.duration;
var currentTime=ytproAud.currentTime;

/*To prevent the numbers from being NaN*/
if(isNaN(duration)) return;


var totalTimehrs=Math.floor(duration / 3600);
var totalTimemin= Math.floor(duration % 3600 / 60);
var totalTimesec=Math.floor(duration % 3600 % 60);

var timehrs=Math.floor(currentTime / 3600);
var timemin= Math.floor(currentTime % 3600 / 60);
var timesec= Math.floor(currentTime % 3600 % 60);
if(timehrs < 10){ timehrs = "0"+timehrs; }
if(totalTimehrs < 10){ totalTimehrs = "0"+totalTimehrs; }
if(timesec < 10){ timesec = "0"+timesec; }
if(totalTimesec < 10){ totalTimesec = "0"+totalTimesec; }
if(timemin < 10){ timemin = "0"+timemin; }
if(totalTimemin < 10){ totalTimemin = "0"+totalTimemin; }

tim.innerHTML=`<span style="float:left">${(totalTimehrs >= 1 ) ? timehrs+":" : "" }${timemin}:${timesec}</span><span style="float:right">${(totalTimehrs >= 1 ) ? totalTimehrs+":" : "" }${totalTimemin}:${totalTimesec}</span>`;


document.querySelector("#inSeek").value=currentTime;
document.querySelector("#prog").style.width=(currentTime/duration * 100)+"%";
document.getElementsByClassName('video-stream')[0].pause();



if(ytproAud.currentTime==ytproAud.duration){

/*Nexto Songs*/
playNext();

}
});


/*Waits for the song , js like Mr Bean*/
ytproAud.addEventListener('waiting', () => {
//console.log("waiting");
document.querySelector("#playpause").innerHTML=`<span class="load"></span>`;
setTimeout(()=>{Android.bgBuffer(ytproAud.currentTime*1000);},50);
});

/*Playing event , updates da bla bla bla*/
ytproAud.addEventListener('playing', () => {
//console.log("playing");
document.querySelector("#playpause").innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"  fill="white"  viewBox="0 0 16 16"><path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5"/></svg>`;
setTimeout(()=>{Android.bgPlay(ytproAud.currentTime*1000);},50);
});






//console.log(id)
//console.log(queue,songIndex);

}



/*Creates da DOM for the audio player*/
function createAudElements(){


var ytADivOuter=document.createElement("div");
var ytADiv=document.createElement("div");
ytADivOuter.setAttribute("id","ytproAudDiv");
ytADivOuter.setAttribute("style",`height:100%;width:100%;position:fixed;top:0;left:0;background:rgba(0,0,0,.8);z-index:999;`);

ytADiv.setAttribute("style",`height:50%;width:98%;
background:${isD ? "rgba(0,0,0,.5)" : "rgba(255,255,255,.1)"};border:1px solid #222;position:fixed;border-radius:10px;backdrop-filter:blur(10px);bottom:15px;left:calc(1%);z-index:999;`);

ytADiv.innerHTML=`
<style>
#ytproAudDiv #imgThumb{
height:150px;
width:150px;
object-fit:cover;
border-radius:100%;
margin-left:calc(50% - 75px);
margin-top:10px;
position:relative;
background-size:cover;
background-repeat:no-repeat;
}
#ytproAudDiv #ib{
height:170px;
width:170px;
position:absolute;
z-index:-1;
top:2px;
border-radius:50%;
left:calc(50% - 85px);
background:url("");
filter:blur(5px);
background-size:cover;
background-repeat:no-repeat;
}
#ytproAudDiv .x{
position:absolute;
top:10px;
right:20px;
color:red;
font-size:20px;
}
#ytproAudDiv #ytProtitle{
width:95%;
height:60px;
margin:auto;
margin-top:20px;
color:white;
text-align:center;
overflow:hidden;
}
#ytproAudDiv .seek{
height:2px;
width:85%;
margin:auto;
background:#aaa;
position:absolute;
top:280px;
left:8%;
}
#ytproAudDiv #inSeek,#prog{
position:absolute;
height:2px;
top:0;
left:0;
width:100%;
opacity:0;
z-index:999999;
}
#ytproAudDiv #prog{
opacity:1;
background:#f33;
width:0;
transition:0.25s;
}
#ytproAudDiv .ytAudControls{
height:80px;
width:100%;
position:absolute;
bottom:0px;
text-align:center;
}
#ytproAudDiv .ytAudControls svg{
height:50px;
width:50px;
}
#ytproAudDiv #timeUpdate{
margin-left:8%;
font-size:12px;
width:85%;
color:white;
}
#ytproAudDiv .load{
height:50px;
width:50px;
background:white;
border-radius:50%;
display:block;
position:absolute;
left:calc(50% - 20px);
animation:loadAni 1s ease-in-out infinite;
}
@keyframes loadAni{
0%{
transform:scale(0);
opacity:1;
}
100%{
transform:scale(1.25);
opacity:0;
}
}
</style>
<img src="" crossorigin="anonymous" id="imgThumb"><div id="ib"></div><br>
<div id="ytProtitle"></div>
<br>
<div id="timeUpdate"><span style="float:left"></span><span style="float:right"></span></div><br><br>
<div class="seek" >
<input type="range" value="0" max="500" id="inSeek" oninput="seekProg(this)" onchange="backNormal()" />
<div id="prog"></div>
</div>
<div class="ytAudControls">
<svg style="float:left;margin-left:30px" fill="white"  onclick="playPrev()" xmlns="http://www.w3.org/2000/svg" width="16" height="16"  viewBox="0 0 16 16">
<path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.52-.302 1.233.043 1.233.696v7.384c0 .653-.713.998-1.233.696L5 8.752V12a.5.5 0 0 1-1 0zm7.5.633L5.696 8l5.804 3.367z"/>
</svg>
<span id="playpause" style="position:relative" onclick="playPause()">
<span class="load"></span>
</span>
<svg style="float:right;margin-right:30px" fill="white" onclick="playNext()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
<path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.713 3.31 4 3.655 4 4.308v7.384c0 .653.713.998 1.233.696L11.5 8.752V12a.5.5 0 0 0 1 0zM5 4.633 10.804 8 5 11.367z"/>
</svg>
</div>

<span class="x"  onclick="history.back();" >&#x2715;</span>
`;


/*Append it , appends to the body*/
document.body.appendChild(ytADivOuter);
ytADivOuter.appendChild(ytADiv);
document.getElementsByClassName('video-stream')[0].pause();


var ytproAud=document.createElement("audio");
ytproAud.style.height="0";
ytproAud.style.width="0";
ytproAud.setAttribute("id","ytproAud");
ytproAud.style.visibility="hidden";
ytADiv.appendChild(ytproAud);


}




/*Gets the queue for the queues*/
async function getQueue(id){


if (!queue.includes(id)) {
queue.push(id);
}



var n=await fetch("https://m.youtube.com/youtubei/v1/next?prettyPrint=false",{ 
method:"POST", 
body:JSON.stringify({ 
"context": { 
"client": { 
"hl": yt.config_.INNERTUBE_CONTEXT_HL, 
"gl": yt.config_.INNERTUBE_CONTEXT_HL, 
"userAgent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36,gzip(gfe)", 
"clientName": "MWEB", 
"clientVersion": yt.config_.INNERTUBE_CONTEXT_CLIENT_VERSION, 
"originalUrl": `https://m.youtube.com/watch?v=${id}`, 

} 
},
"videoId":id

}) 
}).then((res)=>res.json());


var results=n?.playerOverlays?.playerOverlayRenderer?.endScreen?.watchNextEndScreenRenderer?.results;

for(var z in results){
var nId=results[z]?.endScreenVideoRenderer?.videoId;
queue.push(nId);

}

//console.log("QUEUE Loop",queue)

/*Don*/
return "done";

}


/*When user hits the UI*/
function seekProg(e){
var p=e.value*1000;
document.querySelector(".seek").style.height=("6px");
document.querySelector("#prog").style.height="6px";
document.querySelector("#prog").style.width=(e.value/e.max*100)+"%";
document.querySelector("#ytproAud").currentTime=e.value;
}
/*When user hits the notification*/
function seekTo(t){
var e=parseInt(t) / 1000;
document.querySelector("#ytproAud").currentTime=e;
}
/*When user hits nothing*/
function backNormal(){
document.querySelector(".seek").style.height=("2px");
document.querySelector("#prog").style.height="2px";
}

/*Daamm , its play pause again*/
function playPause(){
if(document.querySelector("#ytproAud").paused){
document.querySelector("#ytproAud").play();
}
else{
document.querySelector("#ytproAud").pause();
}
}




/*Alexa , play da next song*/
async function playNext(){

document.querySelector("#ytproAud").pause();
songIndex++;

if (queue.length <= 0) await getQueue(new URLSearchParams(window.location.search).get("v"));

if(songIndex >= (queue.length - 1)){
songIndex = queue.length - 1;
return ytproAudPlayer(queue[(queue.length - 1)]);
}
ytproAudPlayer(queue[songIndex]);
}




/*Alexa , play the f**ng song once again */
function playPrev(){

/*If da song.played > 10 secs , play the song from the begining*/
if(document.querySelector("#ytproAud").currentTime > 10){
document.querySelector("#ytproAud").currentTime=0;
document.querySelector("#ytproAud").play();

return;
}


document.querySelector("#ytproAud").pause();

songIndex--;


if(songIndex <= 0){
songIndex=0;
return ytproAudPlayer(queue[0]);
}

ytproAudPlayer(queue[songIndex]);
}

/*LMAO DED , stops the playback*/
function stopPlayback(){

isPlayingAud=false;

var ad=document.getElementById("ytproAudDiv");
var ae=document.getElementById("ytproAud");


if (document.querySelector("#GTVideo") != null) document.querySelector("#GTVideo").remove();

ae.remove();
ad.remove();
Android.bgStop();
queue=[];


}

