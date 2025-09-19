import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Favorite extends Model {}

Favorite.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  note: { type: DataTypes.STRING(255) }
}, { sequelize, modelName: 'Favorite' });
