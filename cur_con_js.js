async function populateCurrencyDropdowns() {
  const fromSelect = document.getElementById("fromCurrency");
  const toSelect = document.getElementById("toCurrency");

  try {
    const response = await fetch("https://api.frankfurter.app/currencies");
    const currencies = await response.json();

    for (const code in currencies) {
      const optionFrom = new Option(`${code} - ${currencies[code]}`, code);
      const optionTo = new Option(`${code} - ${currencies[code]}`, code);
      fromSelect.add(optionFrom);
      toSelect.add(optionTo);
    }

    fromSelect.value = "USD";
    toSelect.value = "INR";
  } catch (err) {
    console.error("Failed to load currency list:", err);
  }
}

async function convertCurrency() {
  const amount = parseFloat(document.getElementById("amount").value);
  const from = document.getElementById("fromCurrency").value;
  const to = document.getElementById("toCurrency").value;
  const resultEl = document.getElementById("result");

  if (!amount || isNaN(amount)) {
    resultEl.textContent = "Please enter a valid amount.";
    return;
  }

  if (from === to) {
    resultEl.textContent = `Result: ${amount.toFixed(2)} ${to}`;
    return;
  }

  try {
    const response = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`);
    const data = await response.json();
    const rate = data.rates[to];

    const currencySymbols = {
      USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥',
      AUD: 'A$', CAD: 'C$', CNY: '¥', CHF: 'Fr', SEK: 'kr'
    };

    const symbol = currencySymbols[to] || '';
    resultEl.textContent = `Result: ${symbol}${rate.toFixed(2)} ${to}`;
  } catch (error) {
    console.error("Conversion failed:", error);
    resultEl.textContent = "Error converting currency.";
  }
}

// 3D effect with mouse movement across entire screen
const card = document.querySelector('.converter-card');

document.addEventListener('mousemove', (e) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const percentX = (e.clientX - centerX) / centerX;
  const percentY = (e.clientY - centerY) / centerY;

  const rotateX = percentY * 10;
  const rotateY = percentX * 10;

  const shadowX = -percentX * 20;
  const shadowY = -percentY * 20;

  card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
  card.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.3)`;
});

document.addEventListener('mouseleave', () => {
  card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  card.style.boxShadow = `0 20px 30px rgba(0, 0, 0, 0.3)`;
});

// Initialize on page load
populateCurrencyDropdowns();
