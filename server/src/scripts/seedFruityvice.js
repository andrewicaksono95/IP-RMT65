import axios from 'axios';
import { sequelize } from '../config/database.js';
import '../models/index.js';
import { Fruit } from '../models/Fruit.js';

export async function run({ exit = false } = {}) {
  await sequelize.sync();
  const { data } = await axios.get('https://www.fruityvice.com/api/fruit/all');
  for (const item of data) {
    const { name, family, order, genus, nutritions } = item;
    await Fruit.upsert({
      name,
      family,
      order,
      genus,
      calories: nutritions?.calories,
      fat: nutritions?.fat,
      sugar: nutritions?.sugar,
      carbohydrates: nutritions?.carbohydrates,
      protein: nutritions?.protein
    });
  }
  console.log('Fruits synced');
  if (exit) process.exit(0);
}

// Only execute automatically when invoked directly via node
if (process.argv[1] && process.argv[1].endsWith('seedFruityvice.js')) {
  run({ exit: true }).catch(e=> { console.error(e); process.exit(1); });
}
