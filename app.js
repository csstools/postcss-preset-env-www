const cssdb = require('cssdb').filter(feature => feature.stage >= 0);
const eslit = require('eslit');
const express = require('express');
const postcss = require('postcss');
const site = require('./site.json');
const util = require('./util.js');

const app = express();
const isDev = process.argv.includes('--dev');
const port = isDev ? 8080 : 80;

app.engine('html', (filePath, locals = {}, cb) => {
	eslit(filePath, locals)
	.then(
		out => cb(null, out),
		cb
	)
});

app.set('views', './views');
app.set('view engine', 'html');

app.use(express.static('public'));

cssdb.forEach(feature => {
	feature.example = postcss().process(feature.example, {
		stringifier: util.postcssToHtml
	}).css
})

app.get('*', (req, res) => {
	res.render('index.html', { cssdb, req, site, util });
});

app.listen(port);
