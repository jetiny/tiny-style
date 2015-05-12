var RE_URL_ABSOULTE = /((^)|(\:))\/\//, // http://... file://... //...
    RE_URL_RELATIVE = /^\.|^([a-zA-Z0-9\_\-\@]+([\-\.|\/]|$))/, // ./xxx ../xxx mmx/...
    RE_URL_MEMORY = /^(\w+):\w/, // about:blank data:image/png...
    RE_URI_TRIM = /(\?.*)|(#.*)/,
    RE_URL_DATA = /^data:/,
    RE_WIN_DOT = /\\/g,
    RE_URI_EXT = /\.([a-zA-z0-9]+)$/i,
    RE_FILE_NAME = /([^\\\/]+)$/;


function isMemoryUrl(url) {
    return RE_URL_MEMORY.test(url);
}

module.exports = {
    isMemoryUrl: isMemoryUrl,
    isDataUrl: function(url) {
        return RE_URL_DATA.test(url);
    },
    isRelativeUrl: function(url) {
        return RE_URL_RELATIVE.test(url);
    },
    isAbsoulteUrl: function(url) {
        return RE_URL_ABSOULTE.test(url);
    },
    filePath: function(url) {
        return url.replace(RE_URI_TRIM, '');
    },
    fileExtension: function(url) {
        var _url;
        return (_url = String(url || '')
            .replace(RE_URI_TRIM, '')
            .match(RE_URI_EXT)
        ) ? _url[1].toLowerCase() : '';
    },
    fileName: function(url) {
        var _url;
        return (_url = String(url || '')
            .replace(RE_URI_TRIM, '')
            .replace(RE_WIN_DOT, '/')
            .match(RE_FILE_NAME)
        ) ? _url[1].toLowerCase() : '';
    }
};
