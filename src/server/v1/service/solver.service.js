const Timeout = require('await-timeout');
const {getBaseUrl, Optional} = require('../../utils');

const RETRIVE_BODY_CODE = `
function gethtml () {
    return new Promise((resolve, reject) => { resolve('<!DOCTYPE html> <html lang="en"> ' + document.documentElement.innerHTML + ' </html>'); });
}
gethtml();
`;

async function goToPage(params, window) {
  return new Promise((resolve, reject) => {

    window.webContents.session.webRequest.onCompleted((details) => {
      if (details.resourceType === 'mainFrame') {
        window.webContents.session.webRequest.onCompleted(null);
        return resolve(details);
      }
    });

    if (params.method === 'POST') {
      window.loadURL(params.url, {
        postData: [{type: 'rawData', bytes: Buffer.from(params.postData)}]
      }).then().catch(reason => reject(reason));
    } else {
      window.loadURL(params.url).then().catch(reason => reject(reason));
    }

  })
}

async function _solveChallenge(params, window, nbTentative) {

  const challengeSolver = `
  function sdfgs () {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), ${nbTentative * 1000});
      });
  }
  
  sdfgs();
  `;

  return window.webContents.executeJavaScript(challengeSolver, true)
}

function getCookies(params) {
  if (params.cookies && params.cookies.length > 0) {
    return params.cookies.map(cookie => {
      return {
        name: cookie.name,
        value: cookie.value,
        url: Optional.of(cookie.url).orElse(params.baseUrl),
        domain: cookie.domain,
        path: Optional.of(cookie.path).orElse('/'),
        secure: Optional.of(cookie.secure).orElse(true),
        httpOnly: Optional.of(cookie.httpOnly).orElse(true),
        expirationDate: Optional.of(cookie.expires).map(val => Math.trunc(val)).orElse(10),
        sameSite: Optional.of(cookie.sameSite).map(getCookieSameSiteForSend).orElse('no_restriction')
      };
    });
  }

  return undefined;
}

async function updatePageCookie(params, window, reload = false) {
  const cookies = getCookies(params);
  if (cookies) {
    const session = window.webContents.session;
    await session.cookies.set(cookies);

    if (reload) {
      window.reload();
    }
  }
}


async function getHeadersFromResponse(response) {
  const result = {};
  for(const key of Object.keys(response.responseHeaders)) {
    if (Array.isArray(response.responseHeaders[key])) {
      result[key] = response.responseHeaders[key][0];
    } else {
      result[key] = response.responseHeaders[key];
    }
  }

  return result;
}

function getCookieSameSiteForResponse(cookieSameSite) {
  switch (cookieSameSite.toLowerCase()) {
    case 'unspecified': return 'None';
    case 'no_restriction': return 'None';
    case 'lax': return 'Lax';
    case 'strict': return 'Strict';
  }
}

function getCookieSameSiteForSend(cookieSameSite) {
  switch (cookieSameSite.toLowerCase()) {
    case 'None': return 'no_restriction';
    case 'lax': return 'lax';
    case 'strict': return 'strict';
    default: 'no_restriction';
  }
}

function getCookieForResponse(cookies) {
  return cookies
    .map(cookie => {
      return {
        domain: cookie.domain,
        expires: Math.trunc(cookie.expirationDate) - 600,
        httpOnly: cookie.httpOnly,
        name: cookie.name,
        path: cookie.path,
        sameSite: getCookieSameSiteForResponse(cookie.sameSite),
        secure: cookie.secure,
        value: cookie.value,
        size: cookie.name.length + cookie.value.length,
        session: cookie.session
      }
    });
}

async function getBody(webContents) {
  return webContents.executeJavaScript(RETRIVE_BODY_CODE, true);
}

async function resolveChallenge(params, session) {
  try {
    let status = 'ok';
    let message = '';

    const window = session.window;

    params.baseUrl = getBaseUrl(params.url);


    await updatePageCookie(params, window);

    let response = await goToPage(params, window);
    let nbTentative = 0;

    while (response.statusCode === 403) {
      console.warn('Challenge detected');
      await _solveChallenge(params, window, ++nbTentative);
      response = await goToPage(params, window);
    }

    const webContents = window.webContents;

    const payload = {
      status,
      message,
      result: {
        url: webContents.getURL(),
        status: response.statusCode,
        headers: getHeadersFromResponse(response),
        cookies: getCookieForResponse(await webContents.session.cookies.get({url: params.baseUrl})),
        userAgent: webContents.getUserAgent()
      }
    }

    if (params.returnOnlyCookies) {
      payload.result.headers = null;
      payload.result.userAgent = null;
    } else {
      payload.result.response = await getBody(webContents);
    }

    return payload;

  } catch (e) {
    console.error(e);
    throw e;
  }
}


async function resolveChallengeWithTimeout(params, session) {
  const timer = new Timeout();
  try {
    const promise = resolveChallenge(params, session);
    return await Promise.race([
      promise,
      timer.set(params.maxTimeout, `Maximum timeout reached. maxTimeout=${params.maxTimeout} (ms)`)
    ]);
  } finally {
    timer.clear();
  }
}

module.exports = {
  resolveChallenge: resolveChallengeWithTimeout
}
