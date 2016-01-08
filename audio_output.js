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
  if(!audioContext)
  {
    document.write("<font style='background-color:yellow;'>Your browser does not support real-time audio output. Try Chrome or Firefox.</font>");
  }
  audioOutputStart(audioContext.sampleRate);

  var scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
  scriptProcessor.onaudioprocess = function(event) { audioOutputRender(event.outputBuffer.getChannelData(0)); }
  scriptProcessor.connect(audioContext.destination);
  
  var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
  if(iOS) //need a dummy oscillator?
  {
    var dummyInput = audioContext.createOscillator()
    dummyInput.type = 0;
    dummyInput.connect(scriptProcessor);
    dummyInput.noteOn(0);
  }
}
