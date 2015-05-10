var Parser = require("fastparse");

function urlMatch(match, textBeforeUrl, replacedText, url, index) {
    var it = {
    	symbol: "url",
		url: url,
		start: index + textBeforeUrl.length,
		length: replacedText.length
	};
	this.push(it);
}

function importMatch(match, url, mediaQuery, index) {
    var it = {
    	symbol: "import",
		url: url,
		mediaQuery: mediaQuery,
		start: index,
		length: match.length
	};
	this.push(it);
}

var parser = new Parser({
	source: {
		"/\\*": "comment",
		// imports
		'@\\s*import\\s+"([^"]*)"\\s*([^;\\n]*);': importMatch,
		"@\\s*import\\s+'([^'']*)'\\s*([^;\\n]*);": importMatch,
		'@\\s*import\\s+url\\s*\\(\\s*"([^"]*)"\\s*\\)\\s*([^;\\n]*);': importMatch,
		"@\\s*import\\s+url\\s*\\(\\s*'([^']*)'\\s*\\)\\s*([^;\\n]*);": importMatch,
		"@\\s*import\\s+url\\s*\\(\\s*([^)]*)\\s*\\)\\s*([^;\\n]*);": importMatch,
		// url
		'(url\\s*\\()(\\s*"([^"]*)"\\s*)\\)': urlMatch,
		"(url\\s*\\()(\\s*'([^']*)'\\s*)\\)": urlMatch,
		"(url\\s*\\()(\\s*([^)]*)\\s*)\\)": urlMatch
	},
	comment: {
		"\\*/": "source"
	}
});

module.exports = function parseSource(source) {
	return parser.parse("source", source, []);
};
