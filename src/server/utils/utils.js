

function encrypt(text) {
  return Buffer.from(text).toString('base64');
}

function decrypt(text) {
  return Buffer.from(text, 'base64').toString('ascii');
}

function getBaseUrl(url) {
  const parsedUrl = new URL(url);
  return `${parsedUrl.protocol}//${parsedUrl.hostname}`
}








module.exports = {
  encrypt,
  decrypt,
  getBaseUrl
};
