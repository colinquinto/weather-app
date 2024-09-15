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
