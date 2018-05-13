const eslit = require('eslit');

const replacements = {
	'any-link-pseudo-class': ':any-link pseudo-class',
	'color-functional-notation': 'functional color notation',
	'dir-pseudo-class': ':dir pseudo-class',
	'focus-visible-pseudo-class': ':focus-visible pseudo-class',
	'focus-within-pseudo-class': ':focus-within pseudo-class',
	'focus-within-pseudo-class': ':focus-within pseudo-class',
	'has-pseudo-class': ':has() pseudo-class',
	'hexadecimal-alpha-notation': 'alpha hex colors',
	'matches-pseudo-class': ':matches pseudo-class',
	'not-pseudo-class': ':not pseudo-class',
	'something-pseudo-class': ':something pseudo-class',
	'when-else-rules': '@when and @else'
};

const omissions = [
	'custom-property-sets',
	'has-pseudo-class',
	'something-pseudo-class',
	'when-else-rules'
];

const symbolsByHREF = {
	'/features': 'symbols/features.svg',
	'/playground': 'symbols/playground.svg',
	'https://gitter.im/postcss': 'symbols/support.svg',
	'https://github.com/csstools/postcss-preset-env': 'symbols/github.svg'
};

module.exports = {
	cssdbFilter(feature) {
		return !omissions.includes(feature.id);
	},
	getSymbol(href) {
		return `../${symbolsByHREF[href]}`;
	},
	getURL(href) {
		return `pages${href}`;
	},
	href(href, req) {
		return `href="${href}"${
			href.slice(0, 4) === 'http' ? ' rel="noopener noreferrer" target="_blank"' : ''
		}${
			req.url === href ? ' aria-current="page"' : ''
		}`;
	},
	titlify(id, fallback) {
		return replacements[id] || fallback.replace(/`/g, '').toLowerCase();
	}
}
