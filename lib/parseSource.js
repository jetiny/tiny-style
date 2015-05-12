var Parser = require("fastparse"),
    Asset = require("./asset"),
    Url = require("./url");

function init_Asset (self, url, start, length) {
    self.url = url;
    if (!Url.isMemoryUrl(url)) {
        self.filePath = Url.filePath(url);
        self.fileName = Url.fileName(url);
        self.fileExtension = Url.fileExtension(url);
    }
    self.data = '';
    self.start = start;
    self.length = length;
}

function urlMatch(match, textBeforeUrl, replacedText, url, index) {
    var asset = new Asset();
    asset.isUrl = true;
    init_Asset(asset, url, index + textBeforeUrl.length, replacedText.length);
    this.push(asset);
}

function importMatch(match, url, mediaQuery, index) {
    var asset = new Asset();
    asset.isImport = true;
    init_Asset(asset, url, index, match.length);
    asset.mediaQuery = mediaQuery;
    this.push(asset);
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
