import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const port = Number(process.env.PORT) || 5050;

app.listen(port, () => {
  console.log(`Zeymar Scents API listening on http://localhost:${port}`);
});
