export function encodeBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

export function decodeBase64(str) {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (e) {
    throw new Error('Base64解码失败，请检查输入是否合法');
  }
}
