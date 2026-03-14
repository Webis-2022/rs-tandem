export function playSound(soundFile: string) {
  const audio = new Audio();
  audio.src = soundFile;
  audio.play();
}
