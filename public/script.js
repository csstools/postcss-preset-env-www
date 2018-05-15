document.addEventListener('DOMContentLoaded', () => {
	onHashChange()
	initFeatureNav()
})

window.addEventListener('hashchange', onHashChange);

const hashElements = [];
const omittedElements = [];
const stages = [0, 1, 2, 3];

function onHashChange() {
	hashElements.forEach(element => {
		element.removeAttribute('aria-current');
	});

	const selector = `.ppe-features a[href="${location.pathname}${location.hash}"]`;

	hashElements.splice(
		0,
		hashElements.length,
		...Array.prototype.slice.call(
			document.querySelectorAll(selector)
		)
	);

	hashElements.forEach(element => {
		element.setAttribute('aria-current', 'page');
	});
}

function initFeatureNav() {
	const nav = document.querySelector('.ppe-navigation');

	if (nav) {
		const select = document.createElement('select');

		select.className = 'ppe-navigation-select';

		stages.forEach(stage => {
			const option = select.appendChild(document.createElement('option'));

			option.value = stage;

			option.appendChild(document.createTextNode(`Stage ${stage}+`));
		});

		select.addEventListener('change', () => {
			omittedElements.forEach(element => {
				element.hidden = false;
			});
			const omittedStages = stages.slice(0, stages.indexOf(Number(select.value)));
			const selector = omittedStages.map(stage => `[data-stage="${stage}"]`).join(',')

			omittedElements.splice(
				0,
				omittedElements.length,
				...Array.prototype.slice.call(
					selector ? document.querySelectorAll(selector) : []
				)
			);

			omittedElements.forEach(element => {
				element.hidden = true;
			});
		});

		nav.insertBefore(select, nav.firstChild);
	}
}

document.addEventListener('click', function (event) {
	var closestHash = event.target.closest('a[href*="#"]');

	if (closestHash) {
		var target = document.getElementById(closestHash.hash.slice(1));
		var easing = function (t) {
			return t * (2 - t);
		};

		if (target) {
			event.preventDefault();

			scrollTo(target, 300, easing, function () {
				location.hash = closestHash.hash;
			});
		}
	}
});

function scrollTo(target, duration, easing, callback) {
	var start = window.pageYOffset;
	var startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

	var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
	var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
	var targetOffset = typeof target === 'number' ? target : target.offsetTop;
	var targetOffsetToScroll = Math.round(documentHeight - targetOffset < windowHeight ? documentHeight - windowHeight : targetOffset);

	scroll();

	function scroll() {
		var now = 'now' in window.performance ? performance.now() : new Date().getTime();
		var time = Math.min(1, ((now - startTime) / duration));
		var timeFunction = easing(time);

		window.scroll(0, Math.ceil((timeFunction * (targetOffsetToScroll - start)) + start));

		if (window.pageYOffset !== targetOffsetToScroll) {
			requestAnimationFrame(scroll);
		} else {
			window.scroll(0, start);

			callback();
		}
	}
}
