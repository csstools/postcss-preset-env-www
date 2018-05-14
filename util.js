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

const stageColors = ['#414141', '#ed782a', '#899c1f', '#3e7817', '#005a9c'];

module.exports = {
	cssdbFilter(feature) {
		return !omissions.includes(feature.id);
	},
	getStageColor(stage) {
		return stageColors[stage];
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
	},
	// format css as syntax-highlighted HTML
	postcssToHtml(root, builder) {
		function toString(node, semicolon) {
			if ('atrule' === node.type) {
				return atruleToString(node, semicolon);
			} if ('rule' === node.type) {
				return ruleToString(node, semicolon);
			} else if ('decl' === node.type) {
				return declToString(node, semicolon);
			} else if ('comment' === node.type) {
				return commentToString(node, semicolon);
			} else {
				return node.nodes ? node.nodes.map(childNodes => toString(childNodes, semicolon)).join('') : '';
			}
		}

		function atruleToString(atrule, semicolon) {
			return `${atrule.raws.before||''}<span class=css-atrule><span class=css-atrule-name>@${atrule.name}</span>${atrule.raws.afterName||''}<span class=css-atrule-params>${atrule.params}</span>${atrule.raws.between||''}${atrule.nodes?`<span class=css-block>{${atrule.nodes.map(node => toString(node, atrule.raws.semicolon)).join('')}${atrule.raws.after||''}}</span>`:semicolon?';':''}</span>`;
		}

		function ruleToString(rule, semicolon) {
			return `${rule.raws.before||''}<span class=css-rule><span class=css-selector>${rule.selector}</span>${rule.raws.between||''}<span class=css-block>{${rule.nodes.map(node => toString(node, rule.raws.semicolon)).join('')}${rule.raws.after||''}}</span></span>`;
		}

		function declToString(decl, semicolon) {
			return `${decl.raws.before || ''}<span class=css-declaration><span class=css-property>${decl.prop}</span>${decl.raws.between || ':'}<span class=css-value>${decl.value}</span>${semicolon?';':''}</span>`;
		}

		function commentToString(comment, semicolon) {
			return `${comment.raws.before}<span class=css-comment>/*${comment.raws.left}${comment.text}${comment.raws.right}*/</span>`;
		}

		builder(
			toString(root)
		);
	}
}
