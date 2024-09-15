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