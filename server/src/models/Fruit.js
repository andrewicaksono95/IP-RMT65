import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Fruit extends Model {}

Fruit.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  family: { type: DataTypes.STRING },
  order: { type: DataTypes.STRING },
  genus: { type: DataTypes.STRING },
  calories: { type: DataTypes.FLOAT },
  fat: { type: DataTypes.FLOAT },
  sugar: { type: DataTypes.FLOAT },
  carbohydrates: { type: DataTypes.FLOAT },
  protein: { type: DataTypes.FLOAT },
  imageUrl: { type: DataTypes.STRING }
}, { sequelize, modelName: 'Fruit' });
