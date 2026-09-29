export function encodeUrl(str) {
  return encodeURIComponent(str);
}

export function decodeUrl(str) {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    throw new Error('URL解码失败，请检查输入是否合法');
  }
}
