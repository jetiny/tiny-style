var parseSource = require("./lib/parseSource"),
	ReplaceMany = require("./lib/ReplaceMany"),
	queue = require('tiny-queue'),
	Url = require('./lib/url');

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


function createParser (options) {
	if (!options) 
		options = {};
	var url_part = options.url_part || '__IMPORT_URL__',
		RE_URL_PART = new RegExp(url_part + '([0-9]+)', 'g');
	initOptions(options);
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
					filter(next, it, options);
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

var Context = {
	directory : './public',
	assetsPaths: {
		'images': ['png', 'jpg', 'gif', 'svg'] ,
		'styles': ['css'] ,
		'fonts':  ['woff', 'woff2', 'ttf', 'eot'] // 'svg'
	},
	combine : true,   // 合并外链css到一个文件
	imageData: true,  // 将图片转换为data:image
	imageDataFilters: [
		function (img, asset) {
			return false; // return true;
		}
	], //过滤器
	imageFile: true,  // 将data:image 转换为文件
	imageFileFilters: [
		function (img, asset) {
			return false; // return true;
		}
	], //过滤器
};

Context.load = function (url, cb) {
	
};

Context.save = function (url, data, cb) {
	
};


var Options = {
	stylePath:'./css',
	imagePath:'./images',
	fontPath:'./fonts',
	extractImageDataUrl: true,
};

function initOptionsFilter(options, name, vals) {
	if (!options[name]) {
		options[name] = [];
	};
	var filters = options[name];
	filters.push.apply(filters, vals);
}

function makeFileTypeFilter(type, extensions) {
	var RE_FILETYPE = new RegExp('(' + extensions + ')$', 'ig');
	return function(it){
		if (RE_FILETYPE.test(it.fileName)) {
			it.fileType = type;
			return true;
		}
	}
}

function makeAssetPathFilter(type, dir) {
	return function(it) {
		if (it.fileType === 'type') {
			it.distDir = dir;
			return true;
		}
	}
}

function initOptions(options) {
	initOptionsFilter(options, 'assets', [
		makeAssetPathFilter('image', 'images'),
		makeAssetPathFilter('font', 'fonts'),
		makeAssetPathFilter('css', 'css')
	]);
	initOptionsFilter(options, 'fileType', [
		makeFileTypeFilter('image', 'png|gif|jpg|svg|jpeg'),
		makeFileTypeFilter('font', 'woff|woff2|ttf|eot'),
		makeFileTypeFilter('css', 'css')
	]);
	options.emitFilters = function (type, context, func) {
		var filters = getFilters(type, options, context);
		if (filters.length) {
			var r;
			for(var i=0, l= filters.length-1; i<l; i++) {
				r = func(filters[i]);
				if (undefined !== r)
					break;
			}
			return r;
		}
	}
}

function getFilters(type, opts, context) {
	var dist = [],
		opt_filters = opts && opts[type],
		context_filters = context && context[type];
	if (context_filters){
		dist.push.apply(dist, context_filters.slice());
	}
	if (opt_filters){
		dist.push.apply(dist, opt_filters.slice());
	}
	return dist;
}

var Parser = createParser(Options);

var bsFonts = [
	"@font-face {",
	"    font-family: 'Glyphicons Halflings';",
	"    src: url('../fonts/glyphicons-halflings-regular.eot');",
	"    src: url('../fonts/glyphicons-halflings-regular.eot?#iefix') format('embedded-opentype'), url('../fonts/glyphicons-halflings-regular.woff2') format('woff2'), url('../fonts/glyphicons-halflings-regular.woff') format('woff'), url('../fonts/glyphicons-halflings-regular.ttf') format('truetype'), url('../fonts/glyphicons-halflings-regular.svg#glyphicons_halflingsregular') format('svg');",
	"}"
].join('\n');

var cssText = [
	".class { background: green url( \"img.png\" ) xyz }",
	//".class { background: green url(data:image/png;base64,AAA) url(http://example.com/image.jpg) url(//example.com/image.png) xyz }",
	//"@import url('path/test.css') screen and print;\n.class { a: b c d; }",
	//bsFonts,
	""
].join('\n');

Parser(cssText, function (next, it, control) {
	if (!Url.isMemoryUrl(it.url)) {
		var emitResult = control.emitFilters('fileType', this, function(filter){
			return filter(it);
		});
		console.log(it);
	}
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
