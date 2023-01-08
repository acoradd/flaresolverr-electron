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

class Optional {
  _value;

  constructor(value) {
    this._value = value;
  }

  map(fct) {
    if (!this._isNull()) {
      this._value = fct(this._value);
    }

    return this;
  }

  get() {
    if (this._isNull()) {
      throw new Error('value is null');
    }

    return this._value;
  }

  orElse(value) {
    if (this._isNull()) {
      return value;
    } else {
      return this._value;
    }
  }

  _isNull() {
    return this._value === null || this._value === undefined;
  }

  static of(value) {
    return new Optional(value);
  }
}







module.exports = {
  encrypt,
  decrypt,
  getBaseUrl,
  Optional
};
