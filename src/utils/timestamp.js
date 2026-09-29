var DATE_RE = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

export function dateToSec(dateStr) {
  var m = DATE_RE.exec(dateStr.trim());
  if (!m) {
    throw new Error('日期格式应为 YYYY-MM-DD HH:mm:ss');
  }
  var iso = m[1] + '-' + m[2] + '-' + m[3] + 'T' + m[4] + ':' + m[5] + ':' + m[6] + '+08:00';
  var ms = Date.parse(iso);
  if (Number.isNaN(ms)) {
    throw new Error('日期无效');
  }
  return String(Math.floor(ms / 1000));
}

export function secToDate(secStr) {
  var raw = secStr.trim();
  if (!/^-?\d+$/.test(raw)) {
    throw new Error('秒数格式不正确');
  }
  var sec = Number(raw);
  var ms = sec * 1000 + 8 * 3600 * 1000;
  var d = new Date(ms);
  if (Number.isNaN(d.getTime())) {
    throw new Error('秒数无效');
  }
  return (
    d.getUTCFullYear() + '-' +
    pad2(d.getUTCMonth() + 1) + '-' +
    pad2(d.getUTCDate()) + ' ' +
    pad2(d.getUTCHours()) + ':' +
    pad2(d.getUTCMinutes()) + ':' +
    pad2(d.getUTCSeconds())
  );
}
