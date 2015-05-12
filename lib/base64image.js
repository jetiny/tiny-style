function btoa(str) {
    var buffer;
    if (str instanceof Buffer) {
      buffer = str;
    } else {
      buffer = new Buffer(str.toString(), 'binary');
    }
    return buffer.toString('base64');
}

function atob(str) {
   return new Buffer(str, 'base64').toString('binary');
}

var mimetypes = {
  'gif':  'image/gif',
  'jpeg': 'image/jpeg',
  'jpg':  'image/jpeg',
  'jpe':  'image/jpeg',
  'png':  'image/png',
  'svg':  'image/svg+xml',
  'ico':  'image/x-icon'
};

module.exports.toBase = function (buf, type) {
	if (!(buf instanceof Buffer)) {
		buf = new Buffer(buf);
	}
	if (type.indexOf('/') === -1) {
		type = mimetypes[type];
	}
	return 'data:' + type +';base64,' + btoa(buf);
};

var RE_DATA_BASE64 = /^data\:image\/([\w\+\-]+)\;base64/;
	// /^data\:image\/([\w]+)(?:[+\-])(?:\w+)\;base64/;

module.exports.toImage = function (text) {
	var matchs = text.match(RE_DATA_BASE64);
	if (matchs) {
		var type = matchs[1];
		for(var x in mimetypes) {
			if (mimetypes[x] == type) {
				type = x;
				break;
			}
		}
		return {
			type: type,
			mime: matchs[1],
			data: atob(text.substr(19+ matchs[1].length, text.length))
		};
	}
};