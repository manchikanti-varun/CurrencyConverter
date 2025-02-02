const apiUrl = "https://api.exchangerate-api.com/v4/latest/USD";

const currencySymbols = {
    "USD": "$", "EUR": "€", "GBP": "£", "INR": "₹", "JPY": "¥", "AUD": "A$", "CAD": "C$",
    "CHF": "CHF", "CNY": "¥", "SEK": "kr", "NZD": "NZ$"
};

async function fetchCurrencies() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch exchange rates");

        const data = await response.json();
        const currencies = Object.keys(data.rates);
        let fromDropdown = document.getElementById("from-currency");
        let toDropdown = document.getElementById("to-currency");

        currencies.forEach(currency => {
            let symbol = currencySymbols[currency] || currency;
            let option1 = new Option(`${symbol} (${currency})`, currency);
            let option2 = new Option(`${symbol} (${currency})`, currency);
            fromDropdown.add(option1);
            toDropdown.add(option2);
        });

        fromDropdown.value = localStorage.getItem("fromCurrency") || "USD";
        toDropdown.value = localStorage.getItem("toCurrency") || "EUR";
    } catch (error) {
        console.error("Error fetching currencies:", error);
    }
}

async function convertCurrency() {
    try {
        const amount = document.getElementById("amount").value;
        const fromCurrency = document.getElementById("from-currency").value;
        const toCurrency = document.getElementById("to-currency").value;

        if (!amount || amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch exchange rates");

        const data = await response.json();
        const rate = data.rates[toCurrency] / data.rates[fromCurrency];
        const result = (amount * rate).toFixed(2);

        document.getElementById("converted-amount").value = result;
        document.getElementById("exchange-rate").textContent = `Exchange Rate: 1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
    } catch (error) {
        console.error("Error converting currency:", error);
    }
}

function reverseCurrencies() {
    let fromDropdown = document.getElementById("from-currency");
    let toDropdown = document.getElementById("to-currency");
    [fromDropdown.value, toDropdown.value] = [toDropdown.value, fromDropdown.value];
}

window.addEventListener("beforeunload", () => {
    localStorage.setItem("fromCurrency", document.getElementById("from-currency").value);
    localStorage.setItem("toCurrency", document.getElementById("to-currency").value);
});

fetchCurrencies();
