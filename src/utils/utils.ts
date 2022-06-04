const sleep = (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const msToTime = (duration: number): string => {
  const minutes = Math.floor(duration / 60000);
  const seconds = ((duration % 60000) / 1000).toFixed(2);


  let timeString = '';
  if(minutes > 0) timeString += `${minutes}m `;
  timeString += `${seconds}s`;
  
  return timeString;
}
  
export default { sleep, formatMsToTime: msToTime }