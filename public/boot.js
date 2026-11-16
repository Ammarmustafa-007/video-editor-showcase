/* loading screen: timecode, percentage and the 'slow connection' note; main.tsx calls __bootDone when the app is up */
(function(){var s=performance.now(),p=0,b=document.getElementById("boot");
function pad(n){return(n<10?"0":"")+n}
function tick(){if(!b||b.classList.contains("done"))return;var t=(performance.now()-s)/1000;
  p=p+(Math.max(0,93-p))*0.035;var f=Math.floor(t*30)%30,sec=Math.floor(t);
  document.getElementById("boot-tc").textContent="00:00:"+pad(sec)+":"+pad(f);
  document.getElementById("boot-pc").textContent=Math.round(p)+"%";
  document.getElementById("boot-bar").style.width=p+"%";
  if(t>4)document.getElementById("boot-st").textContent="Slow connection, still rendering";
  requestAnimationFrame(tick)}
requestAnimationFrame(tick);
window.__bootDone=function(){if(!b)return;document.getElementById("boot-pc").textContent="100%";document.getElementById("boot-bar").style.width="100%";
  setTimeout(function(){b.classList.add("done");setTimeout(function(){b.remove()},700)},180)};})();
