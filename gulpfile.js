let project_folder= require('path').basename(__dirname); //сюда будет выгружаться готовый проект,папка создастся с тем названием, которое сы впишем тут!
let source_folder = "#src"; //папка с исходниками
let fs = require('fs');//переменная для подключения автоматического шрифтов

let path = {
	build: {  //пути вывода готовых файлов проекта
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/img/",
		fonts: project_folder + "/fonts",
		mailer: project_folder + "/mailer",
	},
	src: {  //пути вывода готовых файлов проекта
		html: [source_folder + "/*.html", "!"+source_folder + "/_*.html"],//исключаем все файлы начинающиеся с символа подчёркивание
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/js/script.js",
		img: source_folder + "/img/**/*.+(png|jpg|gif|ico|svg|webp)",  //две звёздочки означает, что мы будем слушать все подпапки в папке src/img, одна звёздочка - любое название
		fonts: source_folder + "/fonts/*.ttf",
	},
	watch: {  //указываем что мы будем слушать
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/img/**/*.+(png|jpg|gif|ico|svg|webp)",
		mailer: source_folder + "/mailer",
	},
	clean: "./" + project_folder + "/" //объект который удаляет папку готового проета при кардом запуске галпа
}

let { src, dest } = require('gulp'),  //переменные для написания сценария
	gulp = require('gulp'),
	browsersync = require('browser-sync').create(),//- обновляет браузер при изменениях в файлах проекта
	fileinclude = require('gulp-file-include'),// - собирает отдельные файлы (хэдер, футер и т.д. в один)
	del = require("del"), //удалаяет файлы из папки distr
	scss = require("gulp-sass"),//преобразует sass в css
	autoprefixer = require("gulp-autoprefixer"),//автоматически добавляет вендерные префиксы к свойствам в css
	group_media = require("gulp-group-css-media-queries"),//собирает все медиа запросы и группирует их в конце css файла
	clean_css = require("gulp-clean-css"),//для вывода сжатого и не сжатого css
	rename = require("gulp-rename"),//для вывода сжатого и не сжатого css
	uglify = require("gulp-uglify-es").default, //для сжатия js файлов
	imagemin = require('gulp-imagemin'),//сжимает и оптимизирует картинки
	webp = require('gulp-webp'),//конвертирует изображения в WEBp формат и подключает в файл css и html
	webphtml = require('gulp-webp-html'),//автоматизирует подключение webp изображений в html
	webpcss = require('gulp-webpcss'),//автоматизирует подключение webp изображений в css
	svgSprite = require('gulp-svg-sprite'),//плагин для работы с svg спрайтами
	ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	fonter = require('gulp-fonter');

// Уточнения. 
// У кого проблемы с плагином WEBPCSS нужно установить converter командой -
// npm install webp-converter@2.2.3 --save-dev
// Папка проекта не должна называться gulp
// Запускать можно и отдельные функции, например gulp css
// У кого копирует в dist только .jpg попробуйте немного изменить запись форматов с /*.{jpg, png, svg, gif, ico, webp} на /*.+(png|jpg|gif|ico|svg|webp)
// Для WEBP-CSS следует использовать настройки: webpcss({webpClass: '.webp',noWebpClass: '.no-webp'}
// WEBP-CSS выдает ошибку если в названии файла картинки есть пробелы и/или кириллица

function browserSync(params) {//функция обновления нашей страницы
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		port: 3000,
		notify: false
	})
}

function html() {
	return src(path.src.html)//получаем исходник
		.pipe(fileinclude())
		.pipe(webphtml())
		.pipe(dest(path.build.html))//выводим
		.pipe(browsersync.stream())
}

function css() {//Задачи выолнения
	return src(path.src.css)//получаем исходник
		.pipe(
			scss({
				outputStyle: "expanded"//делаем выводной файл не сжатым
			})
		)
		.pipe(
			group_media()
		)
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(webpcss())
		.pipe(dest(path.build.css))//выводим
		.pipe(clean_css())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(dest(path.build.css))//выводим
		.pipe(browsersync.stream())
}

function js() {
	return src(path.src.js)//получаем исходник
		.pipe(fileinclude())
		.pipe(dest(path.build.js))//выводим
		.pipe(
			uglify()
		)
		.pipe(
			rename({
				extname: ".min.js"
			})
		)
		.pipe(dest(path.build.js))//выводим
		.pipe(browsersync.stream())
}

function images() {
	return src(path.src.img)//получаем исходник
		.pipe(
			webp({
				quality: 70//качество сконвертированной картинки
			})
		)
		.pipe(dest(path.build.img))//выводим
		.pipe(src(path.src.img))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3 // 0 to 7
			})
		)
		.pipe(dest(path.build.img))//выводим
		.pipe(browsersync.stream())
}

function fonts() {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts));//выгружаем
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts));//выгружаем
};

//Конвертация otf в ttf
//инструкция:
//в терминале пишем gulp otf2ttf
//в папке src появятся сконвертированные шрифты в формате ttf
gulp.task('otf2ttf', function() {
	return src([source_folder + '/fonts/*.otf'])
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest(source_folder + '/fonts/'));
});

gulp.task('mailer', function () {
	return gulp.src( source_folder + '/mailer/*')
		.pipe(gulp.dest(project_folder + '/mailer/'));
});

//инструкция:
//запускаем gulp
//запускаем еще один терминал(кнопка рядом с мусорным ведром в терминале)
//пишем gulp svgSprite (во втором терминале!!!)
//в папке dist/img создадутся 2 папки: папка stack с примерами спрайтов, в папке icons будет лежать сам спрайт
//файл-пример можно открыть через редактор кода и скопировать оттуда готовый код для подключения svg
gulp.task('svgSprite', function () {//подключение плагина для работы с svg спрайтами, вызывается отдельно, в терминале
	return gulp.src([source_folder + '/iconsprite/*.svg'])
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../icons/icons.svg", //sprite file name место куда будет выводится готовый спрайт
					example: true //создаёт html файл с примерами иконок
				}
			},
		}
		))
		.pipe(dest(path.build.img))//выгружаем в папку с изобраджениями
})


function fontsStyle(params) {// функция для автоматического подключения шрифтов
	let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
	if (file_content == '') {
		fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
}

function cb() { //вспомогательная функция для автоматического подключения шрифтов

}




function watchFiles(params) {//следит
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);//папка img, функция images
}

function clean(params) {//автоматиески удаляет ненужные файлы из папки distr
	return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts,), fontsStyle);//процесс выполнения
let watch = gulp.parallel(build, watchFiles, browserSync);//это сценарий выполнения функций
gulp.task('default', gulp.parallel('mailer'));
//дружим переменные с галпом
exports.fontsStyle = fontsStyle;
exports.fonts = fonts; 
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;