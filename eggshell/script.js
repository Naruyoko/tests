var imageSources=[
  "./img/23548333_s_1.jpg",
  "./img/24313833_s_1.jpg",
  "./img/24313833_s_2.jpg",
  "./img/24313833_s_3.jpg",
  "./img/26050832_s_1.jpg",
  "./img/26050834_s_1.jpg",
  "./img/26050834_s_2.jpg",
  "./img/26050834_s_3.jpg",
  "./img/29708623_s_1.jpg",
  "./img/29708623_s_2.jpg",
  "./img/34169781_s_1.jpg",
  "./img/34169784_s_1.jpg",
  "./img/34169784_s_2.jpg",
  "./img/34169784_s_3.jpg",
  "./img/34581726_s_1.jpg",
  "./img/34581726_s_2.jpg",
];
document.head.innerHTML+=
  imageSources.map(s=>`<link rel="preload" href="${s}" as="image">`).join("\n");
var soundSources=[
  "./snd/freesound_community-egg-crack4-85848.mp3",
  "./snd/freesound_community-egg-crack5-104555.mp3",
  "./snd/freesound_community-egg-crack6-104553.mp3",
  "./snd/freesound_community-egg-crack7-85844.mp3",
  "./snd/freesound_community-egg-crack13-104557.mp3",
  "./snd/freesound_community-egg-crack14-85853.mp3",
  "./snd/freesound_community-egg-crack17-85850_1.mp3",
  "./snd/freesound_community-egg-crack17-85850_2.mp3",
  "./snd/freesound_community-egg-crack17-85850_3.mp3",
  "./snd/freesound_community-egg-crack18-104552.mp3",
  "./snd/freesound_community-egg-crack25-85838_1.mp3",
  "./snd/freesound_community-egg-crack25-85838_2.mp3",
  "./snd/freesound_community-egg-cracking-6844.mp3",
  "./snd/u_xg7ssi08yr-egg-crack-362042.mp3",
  "./snd/freesound_community-egg-crack1-104560.mp3",
];
var sounds=soundSources.map(s=>new Audio(s));
function changeImage(){
  document.body.style.backgroundImage=
    `url(${imageSources[Math.floor(Math.random()*imageSources.length)]})`;
}
function playRandomSound(){
  sounds[Math.floor(Math.random()*sounds.length)].play();
}
var eggshellCalcium=0;
var calciumPerEggshell=2070; //https://pubmed.ncbi.nlm.nih.gov/23607686/
window.onload=function (){
  changeImage();
  document.body.onclick=function (){
    changeImage();
    playRandomSound();
    eggshellCalcium+=calciumPerEggshell;
  };
};