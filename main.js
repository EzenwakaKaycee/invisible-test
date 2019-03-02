const http = require("http");
const axios = require('axios');

let counter = 0;
let result = [];
let res;

http.createServer(function (request, response) {

    let array = request.body;
    if(!array){
        array = [{ name: 'lagos', code: '23401' }, { name: 'lagos', code: '23401' }];
    }
    
    res = response;
    getWeatherAndTime(array);
}).listen(8888);


function getWeatherAndTime(array) {
    if (counter < array.length) {

        let count = counter++;
        let name = array[count].name;

        return getWeather(name)
            .then(response => {
                let text = response.data.replace('test(', '');
                text = text.replace(')', '');
                let json = JSON.parse(text);

                if (json.cod == 200) {
                    let weather = json.weather[0].description;
                    let date = new Date(json.dt);
                    result.push({ name: name, weather: weather, date: date });
                }

                return getWeatherAndTime(array);
            })
            .catch(error => {
                return getWeatherAndTime(array);
            });

    } else {
        console.log('Result', result);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }

}

function getWeather(name) {
    let url = 'https://community-open-weather-map.p.rapidapi.com/weather?callback=test&id=2172797&units=%22metric%22+or+%22imperial%22&mode=xml%2C+html&q=' + name;

    var params = {
        url: url,
        key: '25d2b138a6mshcd8e6bd1d789b1fp133029jsnba3c1548307c'
    };

    return httpRequest(params);
}

function httpRequest(params) {
    return axios.get(params.url, { headers: { 'X-RapidAPI-Key': params.key } });
}