var RE_URL_ABSOULTE = /((^)|(\:))\/\//,                                  // http://... file://... //...
    RE_URL_RELATIVE = /^\.|^([a-zA-Z0-9\_\-\@]+([\-\.|\/]|$))/,            // ./xxx ../xxx mmx/...
    RE_URL_MEMORY = /^(\w+):\w/,                                         // about:blank data:image/png...
    RE_URI_TRIM = /(\?.*)|(#.*)/,
    RE_URL_DATA = /^data:/;


function isMemoryUrl (url) {
	return RE_URL_MEMORY.test(url);
}

module.exports = {
	isMemoryUrl: isMemoryUrl,
	isDataUrl : function (url) {
	    return RE_URL_DATA.test(url);
	},
	isRelativeUrl : function (url) {
	    return RE_URL_RELATIVE.test(url);
	},
	isAbsoulteUrl : function (url) {
	    return RE_URL_ABSOULTE.test(url);
	},
	filePath : function (url) {
		return url.replace(RE_URI_TRIM, '');
	}
};