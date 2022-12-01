const UglifyJS = require('uglify-js')
const htmlminify = require('html-minifier-terser');
const csso = require('csso')
const asciidoctor = require('@asciidoctor/core')();
const registry = asciidoctor.Extensions.create()
require('./head-docinfo.js')(registry)
const arjs = require('@asciidoctor/reveal.js');
const glob = require('glob');
const watch = require('node-watch');
const sass = require('sass');
const fs = require('fs');
const path = require('path')

arjs.register();

var options = { 
  safe: 'safe',
  backend: 'revealjs', 
  mkdirs: true, 
  to_dir: 'public', 
  extension_registry: registry,
  to_file: false,
  standalone: true
}

let buildHTML = async (file) => {
  console.log('Processing ' + file);
    let html = asciidoctor.convertFile(file, options);
    let minifiedHtml = await htmlminify.minify(html,
      { 
        minifyJS: true,
        minifyCSS: true,
        removeComments: true,
        removeCommentsFromCDATA: true,
        collapseWhitespace: true, 
      });
    fs.writeFileSync('public' + file.replace('src', '').replace('adoc', 'html'), minifiedHtml);
}
let buildHTMLAll = async () => {
  glob('src/**/*.adoc', async (er, fileList) => {
    for (file of fileList) {
      await buildHTML(file);
    }
  })
}

let buildCSS = () => {
  let result = sass.compile('src/scss/utd_theme.scss');
  try {
    fs.writeFileSync('public/utd_theme.css', csso.minify(result.css).css)
  } catch (err) {
    console.log('Error rebuilding theme, ', err);
  }
}

// Modified from https://stackoverflow.com/a/54137611
let createDirectories = (pathname) => {
  const __dirname = path.resolve();
  pathname = pathname.replace(/[^\/]+$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension
  fs.mkdirSync(path.resolve(__dirname, pathname), { recursive: true }, e => {
      if (e) {
          console.error(e);
      } 
   });
}



let copyRevealJSFiles = () => {
  let revealDir = 'node_modules/reveal.js';
  let globPattern = revealDir + '/{dist,plugin}/**/*';

  fileList = glob.sync(globPattern, { nodir: true })
  fileList.forEach(file => {
    let dest = 'public/reveal.js' + file.replace(revealDir, '');
    createDirectories(dest);
    fs.copyFileSync(file, dest);
  })
}

let copyHighlightJSFiles = () => {
  let globPattern = 'node_modules/highlight.js/styles/**/*';

  fileList = glob.sync(globPattern, { nodir: true })
  fileList.forEach(file => {
    let dest = 'public/highlight.js' + file.replace('node_modules/highlight.js', '');
    createDirectories(dest);
    fs.copyFileSync(file, dest);
  })
}

let copyAssets = () => {
  let globPattern = 'src/assets/**/*'

  fileList = glob.sync(globPattern, { nodir: true })
  fileList.forEach(file => {
    let dest = 'public/assets' + file.replace('src/assets', '');
    createDirectories(dest);
    fs.copyFileSync(file, dest);
  })
}

copyRevealJSFiles();
copyHighlightJSFiles();
copyAssets();
buildHTMLAll();
buildCSS();

if (process.argv[2] == 'watch') {
  console.log('Watching for changed files...')
  watch('src', { recursive: true }, (ev, file) => {
    console.log('Rebuilding ' + file);
    if (file.endsWith('adoc')) {
      buildHTML(file);
    } else if (file.endsWith('scss')) {
      buildCSS();
    } else if (file.startsWith('src/assets')) {
      copyAssets();
    }
  })
}

