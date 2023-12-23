export function convertMsToMinutes(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return seconds == 60
    ? minutes + 1 + ":00"
    : minutes + ":" + (parseInt(seconds) < 10 ? "0" : "") + seconds;
}
