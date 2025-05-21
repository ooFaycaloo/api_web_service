// src/pipeline/randomUser.js
import fetch from 'node-fetch';

export async function getRandomUser() {
  const res = await fetch('https://randomuser.me/api/');
  const data = await res.json();
  return data.results[0];
}
