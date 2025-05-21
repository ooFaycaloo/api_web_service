import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export async function getQuote() {
  const res = await fetch('https://api.quotable.io/random');
  const data = await res.json();
  return `${data.content} — ${data.author}`;
}

export async function getWeather(city = 'Paris') {
  const API_KEY = process.env.WEATHER_API_KEY;
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
  const data = await res.json();
  if (data.weather && data.main) {
    return `${data.weather[0].description}, ${data.main.temp}°C`;
  }
  return 'Météo non disponible';
}
