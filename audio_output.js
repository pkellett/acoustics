
///Real-time audio output.
///Provide the following callback functions:
///
///  audioOutputStart(sampleRate);  <- called when audio output is about to start
///  audioOutputRender(float32array);  <- called when more audio data is needed
///
function AudioOutput(audioOutputStart, audioOutputRender)
{
  var sampleRate = 48000;
  var audioContext = null;

  if(typeof AudioContext == "function")
  {
    audioContext = new AudioContext(); //try Web Audio API
  }
  else if(typeof webkitAudioContext == "function")
  {
    audioContext = new webkitAudioContext(); //didn't exist, so try with prefix
  }

  if(audioContext)
  {
    sampleRate = audioContext.sampleRate;
    audioOutputStart(sampleRate);
    var node = audioContext.createScriptProcessor(2048, 1, 1);
    node.onaudioprocess = function(event) { audioOutputRender(event.outputBuffer.getChannelData(0)); } //specify callback
    node.connect(audioContext.destination);
    
    // check if we run on iOS and need a dummy oscillator
    if(navigator.userAgent.match(/(iPad|iPhone|iPod)/g))
    {
      var osc = context.createOscillator();
      osc.type = 0;
      osc.connect(node);
      osc.noteOn(0);
    }
  }
  else //no audio output, but run the callback anyway
  {
    document.write("<font style='background-color:yellow;'>Your browser does not support real-time audio output. Try Chrome or Firefox.</font>");

    audioOutputStart(sampleRate);
    var buffer = new Array(sampleRate / 10);
    setInterval(function() { renderCallback(buffer); }, 100);
  }
}

