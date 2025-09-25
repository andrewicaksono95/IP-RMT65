import { User } from './User.js';
import { Fruit } from './Fruit.js';
import { Favorite } from './Favorite.js';

User.hasMany(Favorite, { foreignKey: 'userId', onDelete: 'CASCADE' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

Fruit.hasMany(Favorite, { foreignKey: 'fruitId', onDelete: 'CASCADE' });
Favorite.belongsTo(Fruit, { foreignKey: 'fruitId' });

export { User, Fruit, Favorite };
