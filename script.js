'use strict';

document.addEventListener('DOMContentLoaded', () => {
	const firstInput = document.querySelector('[data-input-1]'),
		  secondInput = document.querySelector('[data-input-2]'),
		  firstSelect = document.querySelector('[data-select-1]'),
		  secondSelect = document.querySelector('[data-select-2]'),
		  selectFirstOptions = firstSelect.querySelectorAll('option'),
		  selectSecondOptions = secondSelect.querySelectorAll('option'),
		  loading = document.querySelector('.status'),
		  firstInfo = document.querySelector('[data-info-1]'),
		  secondInfo = document.querySelector('[data-info-2]'),
		  currNames = {
			'USD': 'Доллар США',
			'EUR': 'Евро',
			'RUB': 'Российский рубль',
			'BYN': 'Белорусский рубль',
			'JOD': 'Иорданский динар',
			'KZT': 'Казахский тенге',
			'TRY': 'Турецкая лира'
		  };

	let firstValue, secondValue, exRateOfFirstValue, exRateOfSecondValue;

	// Choice of the currency

	firstSelect.addEventListener('change', () => {
		if (firstValue != 'none') {
			selectSecondOptions.forEach(item => {
				if (item.attributes[`data-${firstValue}`]) {
					item.removeAttribute('disabled');
				}
			});
		}
		firstValue = firstSelect.value;

		// Getting exchange rate

		if (firstValue != 'none') {
			loading.classList.toggle('hidden');
			fetch(`https://v6.exchangerate-api.com/v6/3b75513717b258598da70aca/latest/${firstValue}`)
			.then(response => response.json())
			.then(response => {
				loading.classList.toggle('hidden');
				exRateOfFirstValue = response;
			})
			.then(() => {
				//Update area
				if (firstInput.value != '' && secondInput.value != '') {
					secondInput.value = calculateRate(firstInput.value, secondValue, exRateOfFirstValue);
				}
			});
		}

		// Disable choosen

		if (firstValue != 'none') {
			selectSecondOptions.forEach(item => {
				if (item.attributes[`data-${firstValue}`]) {
					item.setAttribute('disabled', '');
				}
			});
		}
	});
	secondSelect.addEventListener('change', () => {
		if (secondValue != 'none') {
			selectFirstOptions.forEach(item => {
				if (item.attributes[`data-${secondValue}`]) {
					item.removeAttribute('disabled');

				}
			});
		}
		secondValue = secondSelect.value;

		// Getting exchange rate

		if (secondValue != 'none') {
			loading.classList.toggle('hidden');
			fetch(`https://v6.exchangerate-api.com/v6/3b75513717b258598da70aca/latest/${secondValue}`)
			.then(response => response.json())
			.then(response => {
				loading.classList.toggle('hidden');
				exRateOfSecondValue = response;
			})
			.then(() => {
				//Update area
				if (firstInput.value != '' && secondInput.value != '') {
					firstInput.value = calculateRate(secondInput.value, firstValue, exRateOfSecondValue);
				}
			});
		}

		// Disable choosen

		if (secondValue != 'none') {
			selectFirstOptions.forEach(item => {
				if (item.attributes[`data-${secondValue}`]) {
					item.setAttribute('disabled', '');
				}
			});
		}
	});

	function calculateRate(inputValue, curr, exRate) {
		return (inputValue * exRate.conversion_rates[curr]).toFixed(4);
	}

	// Calculating rates

	firstInput.addEventListener('focus', () => {
		if (firstValue && secondValue) {
			firstInput.addEventListener('input', () => {
				if (firstValue != 'none' && secondValue != 'none') {
					secondInput.value = calculateRate(firstInput.value, secondValue, exRateOfFirstValue);
				}
			});
		}
	});
	secondInput.addEventListener('focus', () => {
		if (firstValue && secondValue) {
			secondInput.addEventListener('input', () => {
				if (firstValue != 'none' && secondValue != 'none') {
					firstInput.value = calculateRate(secondInput.value, firstValue, exRateOfSecondValue);
				}
			});
		}
	});

	// information about currency

	firstInfo.addEventListener('click', () => {
		firstInfo.innerHTML = '';
		firstInfo.innerHTML = `<span>${currNames[firstValue]}<span>`;
		setTimeout(() => {
			firstInfo.innerHTML = 'Что за валюта?';
		}, 300000);
	});
	secondInfo.addEventListener('click', () => {
		secondInfo.innerHTML = currNames[secondValue];
		setTimeout(() => {
			secondInfo.innerHTML = 'Что за валюта?';
		}, 3000);
	});
});