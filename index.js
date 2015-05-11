var parseSource = require("./lib/parseSource"),
	ReplaceMany = require("./lib/ReplaceMany"),
	queue = require('tiny-queue');

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




function createParser (opts) {
	if (!opts) 
		opts = {};
	var url_part = opts.url_part || '__IMPORT_URL__',
		RE_URL_PART = new RegExp(url_part + '([0-9]+)', 'g');
	return function (text, filter, done, context) {
		if (!filter)
			filter = function (next) {
				next();
			};
		if (!done) 
			done = function (err, css) {
				if (err)
					col.error(err);
				else
					col.done(css);
			};
		filter = filter.bind(context);
		var stuff = parseSource(text),
			replacer = new ReplaceMany(),
			q = queue(context, done, stuff.map(function (it) {
				return function (next) {
					filter(next, it);
				};
			}));
		q.next(function (next) {
			stuff.forEach(function (it, id) {
				//col('isRelativeUrl', it.isRelativeUrl(), 'isDataUrl', it.isDataUrl(), 'isAbsoulteUrl', it.isAbsoulteUrl() ,it.url);
				replacer.replace(it.start, it.length, url_part + id);
			});
			var cssContent = replacer.run(text);
			var css = JSON.stringify(cssContent);
			css = css.replace(RE_URL_PART, function (str, id) {
				return stuff[id].data;
			});
			next(null, css);
		})
		.start();
	};
}

//Parser("@import url( 'test.css' );\n.class { a: b c d; }");
//Parser("@import url('~test/css') screen and print;\n.class { a: b c d; }");
//Parser(".class { background: green url( \"img.png\" ) xyz }");
//Parser(".class { background: green url(data:image/png;base64,AAA) url(http://example.com/image.jpg) url(//example.com/image.png) xyz }");

var Context = {};

Context.load = function (url, cb) {
	
};

Context.save = function (url, data, cb) {
	
};

var Options = {
	
	stylePath:'./css',
	imagePath:'./images',
	fontPath:'./fonts',

	extractImageDataUrl: true
};

var Parser = createParser(Options);

Parser("@import url('~test/css') screen and print;\n.class { a: b c d; }", function (next, it) {
	console.log(it, this);
	next();
}, function (err, css) {
	col.done(css);
}, Context);

/*

	资源统一定位到一个目录
		
		/images
		/css
		/fonts
	
	合并CSS
		CSS的内容替换
	图像内嵌分离
		image到data:的转换

*/
