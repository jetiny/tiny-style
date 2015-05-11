function Asset () {
}

var RE_URL_ABSOULTE = /((^)|(\:))\/\//,                                  // http://... file://... //...
    RE_URL_RELATIVE = /^\.|^([a-zA-Z0-9\_\-]+([\-\.|\/]|$))/,            // ./xxx ../xxx mmx/...
    RE_URL_MEMORY = /^(\w+):\w/,                                         // about:blank data:image/png...
    RE_URL_DATA = /^data:/;

Asset.prototype.isMemoryUrl = function () {
    return RE_URL_MEMORY.test(this.url);
};

Asset.prototype.isDataUrl = function () {
    return RE_URL_DATA.test(this.url);
};

Asset.prototype.isRelativeUrl = function () {
    return RE_URL_RELATIVE.test(this.url);
};

Asset.prototype.isAbsoulteUrl = function () {
    return RE_URL_ABSOULTE.test(this.url);
};

module.exports = Asset;
