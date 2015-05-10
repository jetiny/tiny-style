var parseSource = require("./lib/parseSource"),
	ReplaceMany = require("./lib/ReplaceMany");

/*

css 依赖及资源处理
	url://file.css
	data://
	./file.css
	/file.css
	file.css
css 合并
css 压缩

*/

var col = require('tiny-col');


var url_part = '__IMPORT_URL__',
	RE_URL_PART = new RegExp(url_part + '([0-9]+)', 'g');

function Parser (content) {
	var stuff = parseSource(content),
		replacer = new ReplaceMany();
	stuff.forEach(function (it, id) {
		replacer.replace(it.start, it.length, url_part + id);
	});
	var cssContent = replacer.run(content);
	var css = JSON.stringify(cssContent);
	css = css.replace(RE_URL_PART, function (str, id) {
		console.log(stuff[id]);
	});
}

//Parser("@import url( 'test.css' );\n.class { a: b c d; }");
//Parser("@import url('~test/css') screen and print;\n.class { a: b c d; }");
//Parser(".class { background: green url( \"img.png\" ) xyz }");
Parser(".class { background: green url(data:image/png;base64,AAA) url(http://example.com/image.jpg) url(//example.com/image.png) xyz }");