
///Real-time audio output.
///Provide the following callback functions:
///
///  audioOutputStart(sampleRate);  <- called when audio output is about to start
///  audioOutputRender(float32array);  <- called when more audio data is needed
///
function AudioOutput(audioOutputStart, audioOutputRender)
{
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioContext = new AudioContext();

  audioOutputStart(audioContext.sampleRate);
  var scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
  scriptProcessor.onaudioprocess = function(event) { audioOutputRender(event.outputBuffer.getChannelData(0)); }
  
  var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
  if(iOS) //need a dummy oscillator?
  {
    var osc = audioContext.createOscillator()
	  osc.type = 0;
	  osc.connect(processor);
  }

  processor.connect(audioContext.destination);
  if(iOS)
  {
    osc.noteOn(0);
  }

  //document.write("<font style='background-color:yellow;'>Your browser does not support real-time audio output. Try Chrome or Firefox.</font>");
  //audioOutputStart(sampleRate);
  //var buffer = new Array(sampleRate / 10);
  //setInterval(function() { renderCallback(buffer); }, 100);
}

