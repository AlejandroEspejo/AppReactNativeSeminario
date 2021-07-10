export function timeDiffCalc(dateFuture: any, dateNow: any = new Date()) {
  if (typeof dateFuture === 'string') {
    dateFuture = new Date(Date.parse(dateFuture));
  }
  let diffInMilliSeconds: number = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days: number = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;

  let difference = '';
  if (days > 0) {
    difference += days === 1 ? `${days} dia.` : `${days} dias.`;
    return difference;
  }

  if (hours > 0) {
    difference += hours === 1 ? `${hours} hora.` : `${hours} horas.`;
    return difference;
  }

  difference += minutes === 1 ? `${minutes} minuto.` : `${minutes} minutos.`;

  return difference;
}
