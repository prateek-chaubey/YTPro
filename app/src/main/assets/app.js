setInterval(function() {
var ytdown_api_url="https://jfududuud.herokuapp.com/api/info?url=";
var jdjd=document.getElementById("wdymbyndown");
if(jdjd == null){
function insertAfter(referenceNode, newNode) {referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);}
var sneudiv=document.createElement("div");
sneudiv.style.height="50px";
sneudiv.style.width="100%";
sneudiv.style.display="flex";
sneudiv.setAttribute("id","wdymbyndown");
sneudiv.style.alignItems="center";
sneudiv.style.justifyContent="center";
sneudiv.style.overflow="hidden";
var jdjddiv=document.getElementsByClassName('slim-video-metadata-actions')[0];
insertAfter(jdjddiv,sneudiv);
var pkcjkD=document.createElement("div");
pkcjkD.style.display="block";
pkcjkD.style.height="90%";
pkcjkD.style.width="auto";
pkcjkD.style.textAlign="center";
pkcjkD.style.marginRight="10px";
pkcjkD.style.fontSize="12px";
pkcjkD.innerHTML='									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>								<br>Download';
sneudiv.appendChild(pkcjkD);
var divoitk=document.createElement("div");
var divoit=document.createElement("div");
divoitk.style.height="100%";
divoitk.style.width="100%";
divoitk.style.position="fixed";
divoitk.style.display="flex";
divoitk.style.background="rgba(0,0,0,.7)";
divoitk.style.top="0";
divoitk.style.left="0";
divoitk.style.justifyContent="center";
divoitk.style.alignItems="center";
divoitk.style.zIndex="99999999999999";
divoit.style.height="auto";
divoit.style.width="80%";
divoit.style.maxHeight="90%";
divoit.style.overflow="scroll";
divoit.style.background="rgba(255,255,255,1)";
divoit.style.justifyContent="center";
divoit.style.alignItems="center";
divoit.style.zIndex="99999999999999";
divoit.style.padding="20px";
divoit.style.textAlign="center";
divoit.innerHTML="<style>a{text-decoration:none;color:black;}li{list-style:none;padding:10px;background:#eee;border:1px solid silver;margin:5px;text-align:lft;}</style>";
divoit.innerHTML+="<span style='position:absolute;top:15px;left:15px;color:red;font-size:30px;' onclick='"+"this.parentElement.parentElement.style.display="+'"'+"none"+'"'+";'>&#x2715;</span>Format | Extension | Size<ul id='listurl'>";
pkcjkD.addEventListener("click",
function(){
pkcjkD.style.pointerEvents="none";
pkcjkD.innerHTML="&#9673;";
pkcjkD.style.lineHeight="40px";
var jsiu=0;
var iugv=setInterval(() => {if(jsiu == 0){pkcjkD.innerHTML="&#9675;<br>Please Wait..";jsiu=1;} else{jsiu=0;pkcjkD.innerHTML="&#9673;<br> Please Wait..";}},500);
fetch(ytdown_api_url+window.location.href)
.then(response => {
return response.json();
})
.then(jsonObject => {
clearInterval(iugv);
pkcjkD.style.lineHeight="normal";
pkcjkD.innerHTML='									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>								<br>Download';
pkcjkD.style.pointerEvents="auto";
Android.downvid((jsonObject.info.title+".mp4"),jsonObject.info.url);
Android.showToast("Downloading...");
})
.catch(error => {
clearInterval(iugv);
pkcjkD.style.lineHeight="normal";
pkcjkD.innerHTML='									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>								<br>Download';
pkcjkD.style.pointerEvents="auto";
Android.showToast("An Error Occurred");
});
});
var ipkcjkD=document.createElement("div");
ipkcjkD.style.display="block";
ipkcjkD.style.height="90%";
ipkcjkD.style.width="auto";
ipkcjkD.style.textAlign="center";
ipkcjkD.style.fontSize="12px";
ipkcjkD.style.marginLeft="10px";
ipkcjkD.innerHTML='									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"/></svg>								<br>PIP Mode';
sneudiv.appendChild(ipkcjkD);
ipkcjkD.addEventListener("click",
function(){
document.getElementsByClassName('video-stream')[0].play();
Android.pipvid("pip");
});
}
},50);