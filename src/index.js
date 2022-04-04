import { format, addDays } from 'date-fns';

const searchBar = document.querySelector('#searchbar');
const searchBtn = document.querySelector('button');
const currentIcon = document.querySelector('.currentIcon');
const currentLocation = document.querySelector('.location');
const currentTemp = document.querySelector('.currentTemp');
const currentDesc = document.querySelector('.currentDesc');
const currentTime = document.querySelector('.currentTime');

const getCoord = async (location) => {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=045fce2ab9cadc090005d293ba386801`,
    { mode: 'cors' }
  );
  const data = await response.json();

  const coord = {
    lat: data[0].lat,
    lon: data[0].lon,
    loc: `${data[0].name}, ${data[0].country}`,
  };

  return coord;
};

const getWeather = async (coord) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly,alerts&appid=045fce2ab9cadc090005d293ba386801`,
    { mode: 'cors' }
  );
  const complete = await response.json();
  const data = {
    loc: coord.loc,
    current: complete.current,
    daily: complete.daily,
  };
  return data;
};

const displayData = (weather) => {
  currentLocation.textContent = weather.loc.toUpperCase();
  currentTemp.textContent = `${weather.current.temp}°`;
  currentDesc.textContent =
    weather.current.weather[0].description.toUpperCase();
  currentTime.textContent = `Updated as of: ${format(new Date(), 'h:mmbbb')}`;
  currentIcon.src = `https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`;
};

const getData = (location) => {
  getCoord(location)
    .then(getWeather)
    .then(displayData)
    .catch((error) => {
      console.log(error);
    });
};

searchBtn.addEventListener('click', () => {
  getData(searchBar.value);
});

window.addEventListener('load', () => {
  getData('Gingoog City');
});
