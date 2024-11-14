const container = document.querySelector('.container')
const wrapper = document.querySelector('.wrapper')
const countryInput = document.querySelector('#countryInput')
const searchBtn = document.querySelector('#searchButton');
const errorMsg = document.querySelector('.errorMsg');
const countryList = document.querySelector('.ul');

// Get Countries HTTP request
async function getCountries(country) {
    try {
        const res = await fetch(`https://restcountries.com/v3.1/name/${country}`)
        if (!res.ok) {
            throw new Error(`${res.status}, ${res.statusText}`)
        }
        // console.log(res)
        const [data] = await res.json();
        console.log('COUNTRY DATA:', data)

        countryList.innerHTML = '';
        countryList.classList.remove('hidden')
        let li = document.createElement('li')
        countryList.appendChild(li)
        li.innerHTML = `${data.name.official}`;

        wrapper.innerHTML = `
        <div id="countryDetails" class="details-section hidden">
            <h2>Country Details</h2>
            <img id="countryFlag" alt="Country flag">
            <p><strong>Name:</strong> <span id="countryName">${data.name.official}</span></p>
            <p><strong>Capital:</strong> <span id="countryCapital">${data.capital}</span></p>
            <p><strong>Region:</strong> <span id="countryRegion">${data.region}</span></p>
            <p><strong>Population:</strong> <span id="countryPopulation">${data.population}</span></p>
<!--            <p><strong>Currencies:</strong> <span id="countryCurrencies">Currencies</span></p>-->
        </div>
         <div id="weatherDetails" class="details-section hidden">
            <h2>Weather in <span id="capitalCity"></span></h2>
            <p><strong>Description:</strong> <span id="weatherDescription"></span></p>
            <p><strong>Temperature:</strong> <span id="temperature"></span> °C</p>
            <p><strong>Humidity:</strong> <span id="humidity"></span>%</p>
            <p><strong>Wind Speed:</strong> <span id="windSpeed"></span> m/s</p>
        </div>
        <div id="currencyDetails" class="details-section hidden">
            <h2>Exchange Rates</h2>
            <p><strong>1 <span id="currencyCode"></span> to USD:</strong> <span id="exchangeRate"></span></p>
        </div>
        `;

        const flag = document.querySelector('#countryFlag')
        flag.src = `${data.flags.png}`;

        li.addEventListener('click', async function () {
            const countryDetails = document.querySelector('#countryDetails');
            const weatherDetails = document.querySelector('#weatherDetails');
            const currencyDetails = document.querySelector('#currencyDetails');

            countryDetails.classList.toggle('hidden');
            weatherDetails.classList.toggle('hidden');
            currencyDetails.classList.toggle('hidden');

            const weatherData = await getWeather(data.capital);
            console.log('WEATHER DATA:', weatherData);

            const capitalCity = document.querySelector('#capitalCity');
            capitalCity.innerHTML = `${weatherData.name}`;

            const desc = document.querySelector('#weatherDescription')
            desc.innerHTML = `${weatherData.weather[0].description}`;

            const temp = document.querySelector('#temperature')
            temp.innerHTML = ` ${Math.trunc(weatherData.main.temp - 273)}`;

            const humidity = document.querySelector('#humidity')
            humidity.innerHTML = `${weatherData.main.humidity}`;

            const windSpeed = document.querySelector('#windSpeed')
            windSpeed.innerHTML = `${weatherData.wind.speed}`;

            const exchangeData = await getExchangeRates(Object.keys(data.currencies)[0]);
            console.log('EXCHANGE DATA:', exchangeData);

            const currencyCode = document.querySelector('#currencyCode');
            currencyCode.innerHTML = `${exchangeData.base_code}`

            const exchangeRate = document.querySelector('#exchangeRate');
            exchangeRate.innerHTML = `${exchangeData.conversion_rates.USD}`


        });

    } catch (err) {
        console.log(err);
        errorMsg.classList.remove('hidden')
        errorMsg.innerHTML = `${err}`
    }
}

// Get Weather HTTP request
async function getWeather(city) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1876895863da0c70b5e8c5b69d9d3aab`)
        if (!res.ok) {
            throw new Error(`${res.status}, ${res.statusText}`)
        }
        // console.log(res)
        const weatherData = await res.json();

        return weatherData
    } catch (err) {
        console.log(err)
        errorMsg.classList.remove('hidden')
        errorMsg.innerHTML = `${err}`
        return null
    }
}

async function getExchangeRates(curr) {
    try {
        const res = await fetch(`https://v6.exchangerate-api.com/v6/fa8766c105b24b738fad6457/latest/${curr}`);
        // console.log(res)
        if (!res.ok) {
            throw new Error(`${res.status}, ${res.statusText}`)
        }
        const exchangeData = await res.json();
        return exchangeData;
    } catch (err) {
        console.log(err)
        errorMsg.classList.remove('hidden')
        errorMsg.innerHTML = `${err}`

    }
}


////
function search() {
    getCountries(countryInput.value)
}

searchBtn.addEventListener('click', search)

