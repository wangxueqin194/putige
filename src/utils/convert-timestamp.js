import moment from 'moment';

export function convertTimestamp(timestamp, format = 'YYYY-MM-DD HH:mm:ss', isMillisecond = true) {
  if (!timestamp) return '';

  // 如果时间戳是秒，转换为毫秒
  const time = isMillisecond ? timestamp : timestamp * 1000;

  const date = new Date(time);
  // return date.toLocaleString()//2021/10/1 15:20:00

  // const pad = (num) => (num < 10 ? `0${num}` : num);
  // const replacements = {
  //   'YYYY': date.getFullYear(),
  //   'MM': pad(date.getMonth() + 1),
  //   'DD': pad(date.getDate()),
  //   'HH': pad(date.getHours()),
  //   'mm': pad(date.getMinutes()),
  //   'ss': pad(date.getSeconds()),
  // };
  // return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => replacements[match]);//2021-10-01 15:20:00

  let formattedDate = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');//2021-10-01 15:20:00
  return formattedDate;
}