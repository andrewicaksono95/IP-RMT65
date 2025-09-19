import axios from 'axios';
import { Fruit } from '../models/index.js';
import { Op } from 'sequelize';

export async function listFruits({ search, sort='name', order='ASC', limit=20, offset=0, family }) {
  const where = {};
  if (search) where.name = { [Op.iLike]: `%${search}%` };
  if (family) where.family = family;
  const validSort = ['name','calories','sugar','protein'];
  if (!validSort.includes(sort)) sort = 'name';
  return Fruit.findAndCountAll({ where, order: [[sort, order]], limit, offset });
}

export async function getFruit(id) {
  return Fruit.findByPk(id);
}
