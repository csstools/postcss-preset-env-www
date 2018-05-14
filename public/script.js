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
