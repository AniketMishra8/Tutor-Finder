import fs from 'fs';
const url = "https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCac9Ck6qx6W4x0ZZel535k-05rfXQo_u0";

fetch(url)
  .then(res => res.json())
  .then(data => fs.writeFileSync('models_response.json', JSON.stringify(data, null, 2)))
  .catch(err => console.error(err));
