export function ipToInt(ip) {
  var parts = ip.trim().split('.');
  if (parts.length !== 4) {
    throw new Error('IP格式不正确');
  }
  var n = 0;
  for (var i = 0; i < 4; i++) {
    if (!/^\d+$/.test(parts[i])) {
      throw new Error('IP格式不正确');
    }
    if (parts[i].length > 1 && parts[i][0] === '0') {
      throw new Error('IP格式不正确');
    }
    var x = Number(parts[i]);
    if (x < 0 || x > 255) {
      throw new Error('IP格式不正确');
    }
    n = n * 256 + x;
  }
  return String(n);
}

export function intToIp(intStr) {
  var raw = intStr.trim();
  if (!/^\d+$/.test(raw)) {
    throw new Error('整数格式不正确');
  }
  var n = Number(raw);
  if (!Number.isInteger(n) || n < 0 || n > 4294967295) {
    throw new Error('整数范围应为 0 ~ 4294967295');
  }
  return [
    (Math.floor(n / 16777216)) % 256,
    (Math.floor(n / 65536)) % 256,
    (Math.floor(n / 256)) % 256,
    n % 256
  ].join('.');
}
