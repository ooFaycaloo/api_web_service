// src/pipeline/randommer.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.RANDOMMER_API_KEY;
const headers = { 'X-Api-Key': API_KEY };

export async function getRandomPhone() {
  const res = await fetch('https://randommer.io/api/Phone/Generate?CountryCode=FR', { headers });
  return res.text();
}

export async function getRandomIBAN() {
  const res = await fetch('https://randommer.io/api/IBAN?country=fr', { headers });
  return res.text();
}

export async function getRandomCreditCard() {
  const res = await fetch('https://randommer.io/api/Card', { headers });
  return res.json();
}

export async function getRandomName() {
  const res = await fetch('https://randommer.io/api/Name?nameType=fullname&quantity=1', { headers });
  const names = await res.json();
  return names[0];
}

export async function getRandomPet() {
  const res = await fetch('https://randommer.io/api/Animal', { headers });
  return res.text();
}
