var synth;
function playSequence(sequence,offset,interval,volume){
  offset=+offset;
  interval=+interval;
  volume=+volume;
  stop();
  synth=new Tone.Synth().toDestination();
  synth.volume.value=volume;
  if (typeof sequence=="string"){
    var matches=sequence.matchAll(/\d+/g);
    sequence=[];
    var next;
    while (next=matches.next(),!next.done){
      sequence.push(+next.value);
    }
  }
  var now=Tone.now();
  for (var i=0;i<sequence.length;i++){
    synth.triggerAttack(Tone.Midi(sequence[i]+offset),now+i*interval);
  }
  synth.triggerRelease(now+sequence.length*interval);
}
function stop(){
  if (synth) synth.dispose();
}