const cssdb = require('cssdb');
const eslit = require('eslit');
const express = require('express');
const site = require('./site.json');
const util = require('./util.js');

const app = express();

app.engine('html', (filePath, locals = {}, cb) => {
	eslit(filePath, locals)
	.then(
		out => cb(null, out),
		cb
	)
})

app.set('views', './views');
app.set('view engine', 'html');

app.use(express.static('public'));

app.get('*', (req, res) => {
	res.render('index.html', { cssdb, req, site, util });
});

app.listen(3000, () => console.log('http://localhost:3000/'));