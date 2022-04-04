import { format, addDays } from 'date-fns';

const getCoordinates = async (location) => {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=045fce2ab9cadc090005d293ba386801`,
    { mode: 'cors' }
  );

  const data = await response.json();
  console.log(data);
  const coord = {
    lat: data[0].lat,
    lon: data[0].lon,
  };
  return coord;
};

const getWeatherData = async (coord) => {
  console.log(`Latitude: ${coord.lat}\nLongitude: ${coord.lon}`);
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly,alerts&appid=045fce2ab9cadc090005d293ba386801`,
    { mode: 'cors' }
  );
  const data = await response.json();
  console.log(data);
  const date = new Date();
  console.log(`Updated as of: ${format(date, 'h:mmbbb')}`);
  console.log(format(addDays(date, 1), 'ccc LLL d'));
};

getCoordinates('llkkkjasf')
  .then(getWeatherData)
  .catch((err) => {
    // Do not change currently displayed info
    console.log(`An error occured: ${err}`);
  });
