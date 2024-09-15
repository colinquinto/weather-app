const searchEvent = (() => {
    const search = document.querySelector('form > button');

    search.addEventListener('click', (e) => {
        handleSearch(e);
    })
})();

const handleSearch = (e) => {
    const input = document.querySelector('form > input');

    if (input.checkValidity()){
        e.preventDefault();
        fetchWeather(input.value);
    }
   
}

const fetchWeather = async (location) => {
    const loader = document.querySelector('.loader');
    const errorMsg = document.querySelector('.error');
    const weatherDiv = document.querySelector('.weather-data');
    let today = new Date().toLocaleDateString('en-CA');
    try {
        weatherDiv.style.visibility = 'hidden';
        errorMsg.style.display = 'none';
        errorMsg.textContent = '';
        loader.style.display = 'block';
        const getData = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'
             + location 
             + '/' 
             + today 
             + '?&unitGroup=uk&key=RGFUEVCF7LUPHF2LEWE66V8M4', {mode: 'cors'});
        const response = await getData.json();
        const getGif = await fetch('https://api.giphy.com/v1/gifs/translate?api_key=RBmGbryfHqdHncyzsXd0jEg4sAPPwHe6&s=' 
            + response.days[0].icon
            + ' weather&weirdness=1', {mode: 'cors'});
        const storeGif = await getGif.json();
        loader.style.display = 'none';
        weatherDiv.textContent = '';
        weatherDiv.style.visibility = '';
        displayData(weatherDiv, response, storeGif);
        convertEvent();
    } catch (err){
        if (err instanceof SyntaxError) {
            loader.style.display = 'none';
            errorMsg.style.display = 'block';
            errorMsg.textContent = "LOCATION NOT FOUND";
        } else {
            loader.style.display = 'none';
            errorMsg.style.display = 'block';
            errorMsg.textContent = err;
        }
        
    }
}

const displayData = (container, weatherData, gif) => {
    // Location
    const location = document.createElement('h2');
    location.textContent = weatherData.resolvedAddress.toUpperCase();

    // Weather condition
    const conditionDiv = document.createElement('div');
    conditionDiv.classList.add('condition');
    conditionDiv.style.backgroundImage = "url('" +gif.data.images.original.url+ "')";

    const displayIcon = document.createElement('img');
    const weatherIcon = weatherData.days[0].icon;
    displayIcon.src = 'icons/' + weatherIcon + '.svg';

    const condition = document.createElement('p');
    condition.textContent = weatherData.days[0].description;

    conditionDiv.append(
        displayIcon,
        condition
    )

    // Temperature & other
    const tempDiv = document.createElement('div');
    tempDiv.classList.add('temps');

    const tempText = document.createElement('p');
    tempText.textContent = 'Temperature'

    const currentTemp = document.createElement('p');
    currentTemp.classList.add('currentTemp');
    currentTemp.textContent = weatherData.days[0].temp + '°C';

    const minTemp = document.createElement('p');
    minTemp.classList.add('minTemp');
    minTemp.textContent = 'Min: ' + weatherData.days[0].tempmin.toFixed(1) + '°C';

    const maxTemp = document.createElement('p');
    maxTemp.classList.add('maxTemp');
    maxTemp.textContent = 'Max: ' + weatherData.days[0].tempmax.toFixed(1) + '°C';

    const celBtn = document.createElement('button');
    celBtn.classList.add('toC');
    celBtn.style.pointerEvents = 'none';
    celBtn.textContent = '°C';

    const farBtn = document.createElement('button');
    farBtn.classList.add('toF');
    farBtn.textContent = '°F';

    // Other data
    const humidity = document.createElement('p');
    humidity.textContent = 'Humidity: ' + weatherData.days[0].humidity;

    const precip = document.createElement('p');
    precip.textContent = 'Precipitation Chance: ' + weatherData.days[0].precipprob + '%';

    const rise = document.createElement('p');
    rise.textContent = 'Sunrise: ' + weatherData.days[0].sunrise.slice(0,5) + ' AM';

    const set = document.createElement('p');
    set.textContent = 'Sunset: ' + weatherData.days[0].sunset.slice(0,5) + ' PM';

    tempDiv.append(
        tempText,
        celBtn,
        currentTemp,
        farBtn,
        minTemp,
        maxTemp,
        humidity,
        precip,
        rise,
        set
    )

    // Hourly Condition
    const hourlyDiv = document.createElement('div');
    hourlyDiv.classList.add('hourly-data');

    weatherData.days[0].hours.forEach(hour => {
        const icon = document.createElement('img');
        icon.src = 'icons/' + hour.icon + '.svg'

        const condition = document.createElement('p');
        if (hour.datetime.slice(0,2) < 12) {
            condition.textContent = hour.datetime.slice(0,5) + ' AM: ' + hour.conditions;
        } else {
            condition.textContent = hour.datetime.slice(0,5) + ' PM: ' + hour.conditions;
        }
        
        hourlyDiv.append(
            icon,
            condition
        )
    });

    // Append to container
    const forecast = document.createElement('h3');
    forecast.classList.add('title-cast');
    forecast.textContent = 'FORECAST FOR TODAY';

    const hourly = document.createElement('h3');
    hourly.classList.add('title-hourly');
    hourly.textContent = 'HOURLY CONDITIONS';

    container.append(
        location,
        forecast,
        conditionDiv,
        tempDiv,
        hourly,
        hourlyDiv
    );
}