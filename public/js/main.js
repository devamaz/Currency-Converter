document.getElementById('convert').addEventListener('click', convertCurrency);

window.onload = function () {
    let urlCurr = 'https://free.currencyconverterapi.com/api/v5/currencies';
    let networkDataReceived = false;
    let dropdown = '';

    fetch(urlCurr)
        .then((res) => res.json())
        .then((data) => {
            nnetworkDataReceived = true;
            console.log('From web', data);

            Object.values(data.results).forEach(element => {
                const { currencyName, id } = element;
                dropdown += `<option value="${id}">${currencyName}</option>`;
                document.querySelector('#fromCurrency').innerHTML = dropdown;
                document.querySelector('#toCurrency').innerHTML = dropdown;
            });
        });

    // check if browser support indexDB
    if ('indexedDB' in window) {
        readData('curr')
            .then( (data) => {
                //checked if network data isnot available
                if (!networkDataReceived) {
                    console.log('From cache');
                    console.log(data);

                    data.forEach(element => {
                        const { currencyName, id } = element;
                        dropdown += `<option value="${id}">${currencyName}</option>`;
                        document.querySelector('#fromCurrency').innerHTML = dropdown;
                        document.querySelector('#toCurrency').innerHTML = dropdown;
                    })
                }
                })
            }
}

function convertCurrency() {
    let fromCurrency = document.querySelector('#fromCurrency').value,
        toCurrency = document.querySelector('#toCurrency').value,
        amount = document.querySelector('#amount').value;
    let query = `${fromCurrency}_${toCurrency}`;
    let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`

    //fetch data from api usin cache, then Network stategy
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            Object.entries(data)
                .forEach(([key, val]) => {
                    let total = (val * amount).toFixed(2);
                    document.querySelector('#result').innerHTML = `Convertion from  <span class="w3-tag w3-blue">${key}</span> is <span class="w3-tag w3-blue">${total}</span> `;
                })
        });
}


