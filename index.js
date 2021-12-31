import axios from 'axios'; // JS puro
// const axios = require('axios') // Executa em Node

const FIXER_API_KEY = 'bbb57d27de395fa1317f71cc36124784';
const FIXER_API = `http://data.fixer.io/api/latest?access_key=bbb57d27de395fa1317f71cc36124784`;

const REST_COUNTRIES_API = 'https://restcountries.com/v2/currency/';


// dados das moedas
const getExchangeRate = async (fromCurrency, toCurrency) => {
    try {
        const { data: { rates } } = await axios.get(FIXER_API);

        const euro = 1 / rates[fromCurrency];
        const exchangeRate = euro * rates[toCurrency];

        return exchangeRate;
    } catch (error) {
        throw new Error(`Unable to get currency ${fromCurrency} to ${toCurrency}`);
    }
    
}

// getExchangeRate('EUR', 'BRL');

// dados dos paises

const getCountries = async (currencyCode) => {
    try {
        const { data } = await axios.get(`${REST_COUNTRIES_API}/${currencyCode}`);

        return data.map(({ name }) => name);
    } catch (error) {
        throw new Error(`Unable to get countries that use ${currencyCode}`)
    }
   

    //console.log(data);
}

// getCountries('BRL');


const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    fromCurrency = fromCurrency.toUpperCase();
    toCurrency = toCurrency.toUpperCase();

    const [exchangeRate, countries] = await Promise.all([
        getExchangeRate(fromCurrency, toCurrency),
        getCountries(toCurrency),
    ]);

    const convertedAmount = (amount* exchangeRate).toFixed(2);

    return (
        `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.
            You cant spend this in the following countries: ${countries}.`
    );
    
}

convertCurrency('EUR', 'USD', 20)
    .then((result) => console.log(result))
    .catch((error) => console.log(error));