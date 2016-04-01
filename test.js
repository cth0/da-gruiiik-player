

function player()
{
  if ( audioTrack.paused)
  {
    audiotrack.play();
    playButton.src="button_pause_24x24.png";
    renderPause=false;
    renderFrame();
  }
  else
  {
    audioTrack.pause();
    playButton.src="button_play_24x24.png";
    renderPause=true;
  }
}


function debug()
{
  var string = "timelineWidth: " + timelineWidth + "\n" ; 

//  string += "currentTime: " + audiotrack.currentTime + "\n" ;
//  string += "duration : " + duration +"\n" ;

//  string += "old margin: " + playhead.style.marginLeft + "\n";

//  var playPercent = timelineWidth * (audiotrack.currentTime / duration);
//  string += "newmargin: " + playPercent + "px";

  var minutes = Math.floor ( audiotrack.currentTime / 60 ) ;
  var seconds = Math.floor ( audiotrack.currentTime - ( 60*minutes));
  var xseconds = "" + seconds ;  

  alert ( "seconds : " + seconds + "\n" + "length : " + xseconds.length );

//  alert (string);
}


function switchTimeDisplay()
{
  timedisplaymode *= -1;
  timeUpdate();
}

function finish()
{
  audioTrack.currentTime = 0;
  playButton.src="button_play_24x24.png";
}


function timeUpdate() {
	var playPercent = timelineWidth * (audiotrack.currentTime / duration);
	playhead.style.marginLeft = playPercent + "px";

	var label=document.getElementById("time");
	
	if ( timedisplaymode > 0 )
	  {
	    var minutes = Math.floor ( audiotrack.currentTime / 60 ) ;
	    var seconds = Math.floor ( audiotrack.currentTime - ( 60*minutes));
	  }
	else
	  {
	    var minutes = Math.floor ( ( duration - audiotrack.currentTime ) / 60 ) ;
	    var seconds = Math.floor ( ( duration - audiotrack.currentTime ) - ( 60*minutes));
	  }

	var xseconds = "" + seconds;

	if ( xseconds.length == 1 )
	  label.innerHTML = minutes + ":0" + seconds ;
	else
	  label.innerHTML = minutes + ":" + seconds ;

	
	//if (audiotrack.currentTime == duration) {
	//	playButton.className = "";
	//	playButton.className = "play";
	//}
}






function getDuration () 
{
  duration = audiotrack.duration;
  var label=document.getElementById("duration");
  var minutes = Math.floor ( duration / 60 ) ;
  var seconds = Math.floor ( duration - ( 60*minutes));
  
  var xseconds = "" + seconds;

  if ( xseconds.length == 1 )
    label.innerHTML = minutes + ":0" + seconds ;
  else
    label.innerHTML = minutes + ":" + seconds ;
}


function clickPercent(e) {
	return (e.pageX - timeline.offsetLeft) / timelineWidth;
}

function moveplayhead(e) {

  // e.layerX et e.layerY, mais c'est aps standard :/
  var newMargLeft = e.pageX - timeline.offsetLeft - audioplayer.offsetLeft - 6 ;  // don't know why!

  if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
    playhead.style.marginLeft = newMargLeft + "px";
  }
  if (newMargLeft < 0) {
    playhead.style.marginLeft = "0px";
  }
  if (newMargLeft > timelineWidth) {
    playhead.style.marginLeft = timelineWidth + "px";
  }


    var newtime = (newMargLeft / timelineWidth) * duration ;
    //alert ("duration : " + duration + "\n" + "new time : " + newtime);

    if ( newtime <= 0 )
      {
	newtime=0;
      }
    if ( newtime >= duration )
      {
	newtime = duration;
      }

    audiotrack.currentTime = newtime;
    timeUpdate();
}

function mouseDown() {
	onplayhead = true;
	window.addEventListener('mousemove', moveplayhead, true);
	audiotrack.removeEventListener('timeupdate', timeUpdate, false);
}

function mouseUp(e) {
	if (onplayhead == true) {
		moveplayhead(e);
		window.removeEventListener('mousemove', moveplayhead, true);
		// change current time
		audiotrack.currentTime = duration * clickPercent(e);
		audiotrack.addEventListener('timeupdate', timeUpdate, false);
	}
	onplayhead = false;
}


/* ******************************************************************************* */

var duration;
var onplayhead = false;
var timedisplaymode = 1 ; // 1 : increasing time, -1 : decreasing time

var audioTrack = document.getElementById("audiotrack") ;
var playhead = document.getElementById("playhead") ;
var timeline = document.getElementById("timeline") ;
var audioPlayer = document.getElementById("audioplayer") ;
var playButton = document.getElementById("playbutton");
var timeButton = document.getElementById("time");
var debugButton = document.getElementById("debug");

var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;


//audiotrack.addEventListener("canplaythrough", getDuration() , false);
audiotrack.oncanplaythrough = getDuration;

audiotrack.addEventListener("timeupdate", timeUpdate, false);
audioTrack.addEventListener("ended" , finish);


playButton.addEventListener ("click", player);
timeButton.addEventListener ("mousedown", switchTimeDisplay);
debugButton.addEventListener ("click", debug);


timeline.addEventListener("click", function(event){moveplayhead(event);}, false);

playhead.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);






// *=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= analyzer =*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*

function renderFrame()
{
  if (!renderPause)
    {
      requestID=requestAnimationFrame(renderFrame);
      analyser.getByteFrequencyData(frequencyData);
      
      canvasCtx.clearRect(0, 0, 300, 150);
      mirrorCtx.clearRect(0, 0, 300, 150);

      canvasCtx.fillStyle=gradient;
      drawSpectrum(frequencyData);
      drawSpectrumMirror(frequencyData);
    }
}

function drawSpectrum(data)
{
  var width = canvas.width;
  var height = canvas.height;

  for ( var i = 0; i < (data.length); i++ )
    {
      var value = data[i]; // value : 0-255
      var xval = Math.floor ( (value/255)*height );
      canvasCtx.fillRect(i*(width/data.length) , height-xval , (width/data.length)-1 , xval);
    }
}

function drawSpectrumMirror(data)
{
  var width = mirror.width;
  var height = mirror.height;

  for ( var i = 0; i < (data.length); i++ )
    {
      var value = data[i]; // value : 0-255
      var xval = Math.floor ( (value/255)*height );
      //canvasCtx.fillRect(i*(width/data.length) , height-xval , (width/data.length)-1 , xval);
      mirrorCtx.fillRect(i*(width/data.length) , 0 , (width/data.length)-1 , xval);
    }
}

var requestID;
var renderPause=true;
var audioCtx = new AudioContext();
var audioSrc = audioCtx.createMediaElementSource(audiotrack);
var analyser = audioCtx.createAnalyser();

// fttsize must be power of 2
// frequencyBinCount = fftsize / 2

analyser.fftSize=128;

audioSrc.connect(analyser);
audioSrc.connect(audioCtx.destination);

var frequencyData = new Uint8Array(analyser.frequencyBinCount);

console.log ( "fftsize = " + analyser.fftSize + "\n" + "bincount = " + analyser.frequencyBinCount );




var canvas=document.getElementById("canvas");
var canvasCtx=canvas.getContext("2d");

var mirror=document.getElementById("mirror");
var mirrorCtx=mirror.getContext("2d");

var gradient=canvasCtx.createLinearGradient(0,0,0,300);
gradient.addColorStop(1,'#000000');
gradient.addColorStop(0.75,'#ff0000');
gradient.addColorStop(0.25,'#ffff00');
gradient.addColorStop(0,'#ffffff');







/*  *************************************************************** obsoletye  **********************************************************************************/

/*

function setAttributes (el,attrs)
{
  for (var key in attrs) 
  {
    el.innerHTML.setAttribute(key,attrs[key]);
  }
}


function muter ()
{
  if ( audioTrack.volume == 0 )
  {
    audioTrack.volume=restoreValue;
    volumeSlider.value=restoreValue;
  }
  else
  {
    restoreValue=volumeSlider.value;
    audioTrack.volume=0;
    volumeSlider.value=0;
  }
}

function setText(el,text)
{
  document.getElementById(el).innerHTML = text;
}


function volumizer()
{
  if (audioTrack.volume==0)
  {
    //setText(muteButton,"unmute");
  }
  else
  {
    //setText(muteButton,"mute");
  }
}



//var playButton = document.createElement("button") ;
var playButton = document.getElementById("playbutton");
var restoreValue=1;

//audioTrack.removeAttribute ("controls");

//playButtonType = "button" ;
setText (playButton,"play");
playButton.addEventListener ( "click", player)
audioPlayer.appendChild(playButton);

var muteButton = document.createElement("button") ;
muteButtonType = "button" ;
setText (muteButton,"mute");
muteButton.addEventListener ( "click", muter)
audioPlayer.appendChild(muteButton);

var volumeSlider=document.createElement("input") ;
volumeSlider.type="range";
setAttributes(volumeSlider, { "type" : "range" , 
                              "min"  : "0"     , 
                              "max"  : "1"     , 
                              "step" : "any"   ,
                              "value" : "1"    } ) ;
volumeSlider.addEventListener("input" , function () { audioTrack.volume = volumeSlider.value; });
audioPlayer.appendChild(volumeSlider);

audioTrack.addEventListener("volumechange" , volumizer);
audioTrack.addEventListener("ended" , finish);
*/
