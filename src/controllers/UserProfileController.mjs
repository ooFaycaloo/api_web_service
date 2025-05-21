import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const UserProfile = class UserProfile {
  constructor(app) {
    this.app = app;
    this.run();
  }

  run() {
    this.app.get('/user-profile', async (req, res) => {
      try {
        const randomUser = await fetch('https://randomuser.me/api').then((r) => r.json());

        const headers = {
          'X-Api-Key': process.env.RANDOMMER_API_KEY
        };

        const randomName = await fetch('https://randommer.io/api/Name?nameType=fullname&quantity=1', { headers }).then((r) => r.json());
        const pet = await fetch('https://randommer.io/api/Animal', { headers }).then((r) => r.json());
        const iban = await fetch('https://randommer.io/api/Bank/Iban?country=fr', { headers }).then((r) => r.text());
        const creditCard = await fetch('https://randommer.io/api/Bank/CreditCard', { headers }).then((r) => r.json());

        const weather = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=Paris`).then((r) => r.json());

        const profile = {
          nom_complet: `${randomUser.results[0].name.first} ${randomUser.results[0].name.last}`,
          email: randomUser.results[0].email,
          photo: randomUser.results[0].picture.large,
          telephone: randomUser.results[0].phone,
          iban,
          carte_credit: creditCard[0],
          nom_aleatoire: randomName[0],
          animal_de_compagnie: pet[0],
          // citation retirée
          meteo: `${weather.current.condition.text}, ${weather.current.temp_c}°C`
        };

        res.status(200).json(profile);
      } catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, message: 'Erreur interne serveur' });
      }
    });
  }
};

export default UserProfile;
