"use strict";

let fs = require("fs");
let yaml = require("js-yaml");

const review = "review";
const bookConfig = yaml.safeLoad(fs.readFileSync(`${review}/config.yml`, "utf8"));

const reviewPrefix = process.env["REVIEW_PREFIX"] || "bundle exec ";
const reviewPostfix = process.env["REVIEW_POSTFIX"] || "";             // REVIEW_POSTFIX="-peg" npm run pdf とかするとPEGでビルドできるよ
const reviewConfig = process.env["REVIEW_CONFIG_FILE"] || "config.yml"; // REVIEW_CONFIG_FILE="config-ebook.yml" npm run pdf のようにすると別のconfigでビルドできるよ
const reviewPreproc = `${reviewPrefix}review-preproc${reviewPostfix}`;
const reviewCompile = `${reviewPrefix}review-compile${reviewPostfix}`;
const reviewPdfMaker = `${reviewPrefix}review-pdfmaker${reviewPostfix}`;
const reviewEpubMaker = `${reviewPrefix}review-epubmaker${reviewPostfix}`;
const reviewWebMaker = `${reviewPrefix}review-webmaker${reviewPostfix}`;
const reviewTextMaker = `${reviewPrefix}review-textmaker${reviewPostfix}`;

module.exports = grunt => {
	grunt.initConfig({
		clean: {
			review: {
				src: [
					`${review}/${bookConfig.bookname}-*/`, // pdf, epub temp dir
					`${review}/*.pdf`,
					`${review}/*.epub`,
					`${review}/*.html`,
					`${review}/*.md`,
					`${review}/*.xml`,
					`${review}/*.txt`,
					`${review}/webroot`
				]
			}
		},
		shell: {
			preprocess: {
				options: {
					execOptions: {
						cwd: review,
					}
				},
        command: `${reviewPreproc} -r --tabwidth=2 articles/*.re`
			},
			compile2text: {
				options: {
					execOptions: {
						cwd: review,
					}
				},
				command: `${reviewTextMaker} ${reviewConfig}`
			},
			compile2markdown: {
				options: {
					execOptions: {
						cwd: review,
					}
				},
				command: `${reviewCompile} --target=markdown`
			},
			compile2html: {
				options: {
					execOptions: {
						cwd: review,
					}
				},
				command: `${reviewCompile} --target=html --stylesheet=style.css --chapterlink`
			},
			compile2latex: {
				options: {
					execOptions: {
						cwd: review,
					}
				},
				command: `${reviewCompile} --target=latex --footnotetext`
			},
			compile2idgxml: {
				options: {
					execOptions: {
						cwd: review,
					}
				},
				command: `${reviewCompile} --target=idgxml`
			},
			compile2pdf: {
				options: {
					execOptions: {
						cwd: review,
					}
				},
				command: `${reviewPdfMaker} ${reviewConfig}`
			},
			compile2epub: {
				options: {
					execOptions: {
						cwd: review,
					}
				},
				command: `${reviewEpubMaker} ${reviewConfig}`
			},
			compile2web: {
				options: {
					execOptions: {
						cwd: review,
					}
				},
				command: `${reviewWebMaker} ${reviewConfig}`
			}
		}
	});

	function generateTask(target) {
		return ["clean", "shell:preprocess", `shell:compile2${target}`];
	}

	grunt.registerTask(
		"default",
		"原稿をコンパイルしてPDFファイルにする",
		"pdf");

	grunt.registerTask(
		"text",
		"原稿をコンパイルしてTextファイルにする",
		generateTask("text"));

	grunt.registerTask(
		"markdown",
		"原稿をコンパイルしてMarkdownファイルにする",
		generateTask("markdown"));

	grunt.registerTask(
		"html",
		"原稿をコンパイルしてHTMLファイルにする",
		generateTask("html"));

	grunt.registerTask(
		"idgxml",
		"原稿をコンパイルしてInDesign用XMLファイルにする",
		generateTask("idgxml"));

	grunt.registerTask(
		"pdf",
		"原稿をコンパイルしてpdfファイルにする",
		generateTask("pdf"));

	grunt.registerTask(
		"epub",
		"原稿をコンパイルしてepubファイルにする",
		generateTask("epub"));

	grunt.registerTask(
		"web",
		"原稿をコンパイルしてWebページファイルにする",
		generateTask("web"));

	require('load-grunt-tasks')(grunt);
};
