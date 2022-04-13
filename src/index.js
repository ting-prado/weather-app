/* eslint-disable no-plusplus */
import { format, addDays } from 'date-fns';

const searchBar = document.querySelector('#searchbar');
const searchBtn = document.querySelector('button');
const errorMsg = document.querySelector('.error');
const currentIcon = document.querySelector('.currentIcon');
const currentLocation = document.querySelector('.location');
const currentTemp = document.querySelector('.currentTemp');
const currentDesc = document.querySelector('.currentDesc');
const currentTime = document.querySelector('.currentTime span');
const feelsLike = document.querySelector('.feels_like');
const windSpeed = document.querySelector('.wind_speed');
const windIcon = document.querySelector('.windIcon');
const visibility = document.querySelector('.visibility span');
const pressure = document.querySelector('.pressure span');
const humidity = document.querySelector('.humidity span');
const dewPoint = document.querySelector('.dew_point span');
const fahr = document.querySelector('.tempUnit span:nth-child(1)');
const cel = document.querySelector('.tempUnit span:nth-child(2)');
const cards = document.querySelectorAll('.card');

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
    `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&units=metric&exclude=minutely,hourly,alerts&appid=045fce2ab9cadc090005d293ba386801`,
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

const displayData = (() => {
  const date = new Date();

  const current = (weather) => {
    errorMsg.textContent = '';
    cel.setAttribute('style', 'color: goldenrod');
    fahr.setAttribute('style', 'color: gainsboro');
    currentLocation.textContent = weather.loc.toUpperCase();
    currentTemp.textContent = `${Number(weather.current.temp).toFixed(1)}°`;
    currentDesc.textContent =
      weather.current.weather[0].description.toUpperCase();
    currentTime.textContent = `${format(date, 'h:mm bbb')}`;
    currentIcon.src = `https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`;
    windIcon.setAttribute(
      'style',
      `transform: rotate(${weather.current.wind_deg}deg); 
       -webkit-transform: rotate(${weather.current.wind_deg}deg);
       -moz-transform: rotate(${weather.current.wind_deg}deg);
       -ms-transform: rotate(${weather.current.wind_deg}deg)`
    );
    windSpeed.textContent = `${Number(weather.current.wind_speed).toFixed(
      1
    )} m/s`;
    visibility.textContent = `${(
      Number(weather.current.visibility) / 1000
    ).toFixed(1)} km`;
    feelsLike.textContent = `${Number(weather.current.feels_like).toFixed(
      0
    )}°C`;
    pressure.textContent = `${weather.current.pressure} hPa`;
    humidity.textContent = `${weather.current.humidity}%`;
    dewPoint.textContent = `${weather.current.dew_point}°C`;
  };

  const daily = (weather) => {
    for (let i = 0; i < weather.daily.length; i++) {
      cards[i].children[0].textContent = format(
        addDays(date, i + 1),
        'ccc LLL d'
      );
      cards[i].children[1].src = `https://openweathermap.org/img/wn/${
        weather.daily[i + 1].weather[0].icon
      }@2x.png`;
      cards[i].children[2].children[0].textContent = `${
        weather.daily[i + 1].temp.max
      }°C`;
      cards[i].children[2].children[1].textContent = `${
        weather.daily[i + 1].temp.min
      }°C`;
      cards[i].children[3].textContent =
        weather.daily[i + 1].weather[0].description.toUpperCase();
    }
  };

  return { current, daily };
})();

const cToFahr = (temp) => {
  const f = (temp * 9) / 5 + 32;
  return f;
};

const fahrToC = (temp) => {
  const c = (temp - 32) * (5 / 9);
  return c;
};

const changeUnits = (currentUnit) => {
  const a = currentTemp.textContent;
  let temp = a.slice(0, a.length - 1);
  if (currentUnit === 'celcius') {
    temp = cToFahr(temp);
  } else {
    temp = fahrToC(temp);
  }
  currentTemp.textContent = `${temp.toFixed(1)}°`;
};

const getData = (location) => {
  getCoord(location)
    .then(getWeather)
    .then((data) => {
      displayData.current(data);
      displayData.daily(data);
    })
    .catch((error) => {
      if (
        error.message === "Cannot read properties of undefined (reading 'lat')"
      ) {
        errorMsg.textContent = 'Location not found, enter another one.';
      } else if (error.message === 'Failed to fetch') {
        errorMsg.textContent = 'Network error, try again later.';
      } else {
        console.log(error);
      }
    });
};

searchBtn.addEventListener('click', () => {
  getData(searchBar.value);
});

searchBar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    getData(searchBar.value);
  }
});

fahr.addEventListener('click', () => {
  if (fahr.style.color !== 'goldenrod') {
    changeUnits('celcius');
    fahr.setAttribute('style', 'color: goldenrod');
    cel.setAttribute('style', 'color: gainsboro');
  }
});

cel.addEventListener('click', () => {
  if (cel.style.color !== 'goldenrod') {
    changeUnits('fahrenheit');
    fahr.setAttribute('style', 'color: gainsboro');
    cel.setAttribute('style', 'color: goldenrod');
  }
});

window.addEventListener('load', () => {
  getData('Manila');
  document
    .querySelector('.tempUnit > span:nth-child(2)')
    .setAttribute('style', 'color: gainsboro');
});
