import fs from 'fs';
import dotenv from 'dotenv';
import process from 'process';
dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    fs.writeFileSync('models_response.json', JSON.stringify(data, null, 2));
    console.log('API response saved to models_response.json');
  })
  .catch(err => console.error('Error fetching models:', err));
