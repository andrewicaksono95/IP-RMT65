import axios from 'axios';
import { sequelize } from '../config/database.js';
import '../models/index.js';
import { Fruit } from '../models/Fruit.js';

// Fruit image mappings using consistent Unsplash sources
const fruitImages = {
  'Apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop&crop=center',
  'Apricot': 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&h=400&fit=crop&crop=center',
  'Avocado': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop&crop=center',
  'Banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&crop=center',
  'Blackberry': 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=400&fit=crop&crop=center',
  'Blueberry': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center',
  'Cherry': 'https://images.unsplash.com/photo-1528819622765-d6bcf132ac11?w=400&h=400&fit=crop&crop=center',
  'Coconut': 'https://images.unsplash.com/photo-1447071994746-a8b8c943be78?w=400&h=400&fit=crop&crop=center',
  'Cranberry': 'https://images.unsplash.com/photo-1571575173700-afb9492-7137?w=400&h=400&fit=crop&crop=center',
  'Durian': 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=400&h=400&fit=crop&crop=center',
  'Fig': 'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=400&h=400&fit=crop&crop=center',
  'Gooseberry': 'https://images.unsplash.com/photo-1587411768941-1f6db42f6a2a?w=400&h=400&fit=crop&crop=center',
  'Grape': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=400&fit=crop&crop=center',
  'Grapefruit': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
  'Guava': 'https://images.unsplash.com/photo-1536511132770-e5058c9e5cd4?w=400&h=400&fit=crop&crop=center',
  'Kiwi': 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400&h=400&fit=crop&crop=center',
  'Lemon': 'https://images.unsplash.com/photo-1587486937820-4134c3ba7eb0?w=400&h=400&fit=crop&crop=center',
  'Lime': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&h=400&fit=crop&crop=center',
  'Lychee': 'https://images.unsplash.com/photo-1597714026720-8f74c62310ba?w=400&h=400&fit=crop&crop=center',
  'Mango': 'https://images.unsplash.com/photo-1605027990121-cbae9cd5af5a?w=400&h=400&fit=crop&crop=center',
  'Melon': 'https://images.unsplash.com/photo-1571575173700-afb949274f33?w=400&h=400&fit=crop&crop=center',
  'Orange': 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop&crop=center',
  'Papaya': 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400&h=400&fit=crop&crop=center',
  'Passionfruit': 'https://images.unsplash.com/photo-1512070750881-e088cba4123f?w=400&h=400&fit=crop&crop=center',
  'Peach': 'https://images.unsplash.com/photo-1629828874514-d71c2d487dd5?w=400&h=400&fit=crop&crop=center',
  'Pear': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop&crop=center',
  'Persimmon': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&crop=center',
  'Pineapple': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop&crop=center',
  'Plum': 'https://images.unsplash.com/photo-1571575173700-afb949274f37?w=400&h=400&fit=crop&crop=center',
  'Raspberry': 'https://images.unsplash.com/photo-1577003833619-76bbd4db1747?w=400&h=400&fit=crop&crop=center',
  'Strawberry': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop&crop=center',
  'Tangerine': 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&h=400&fit=crop&crop=center',
  'Tomato': 'https://images.unsplash.com/photo-1546470427-e075ad5ca17b?w=400&h=400&fit=crop&crop=center',
  'Watermelon': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop&crop=center'
};

// Default image for fruits not in mapping
const defaultFruitImage = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop&crop=center';

// Local SVG file mappings - using the actual SVG files from your collection
const localSvgMappings = {
  // Direct matches
  'Apple': '/svg/reshot-icon-red-apple-67KYC54EAQ.svg',
  'GreenApple': '/svg/reshot-icon-red-apple-67KYC54EAQ.svg', // Using red apple for green apple
  'Avocado': '/svg/reshot-icon-avacado-QEP9WBK3YH.svg',
  'Banana': '/svg/reshot-icon-bananas-AYC9N75EVM.svg',
  'Blackberry': '/svg/reshot-icon-berry-FYDN6JHL3S.svg',
  'Blueberry': '/svg/reshot-icon-blueberry-ARBT36EUMV.svg',
  'Cherry': '/svg/reshot-icon-cherries-HQZFKBN5UX.svg',
  'Coconut': '/svg/reshot-icon-coconut-2R5P3HBGWX.svg',
  'Cranberry': '/svg/reshot-icon-cranberry-4HX85VNB6M.svg',
  'Dragonfruit': '/svg/reshot-icon-dragonfruit-DACL4S3WXY.svg',
  'Pitahaya': '/svg/reshot-icon-dragonfruit-DACL4S3WXY.svg', // Dragon fruit alternative name
  'Fig': '/svg/reshot-icon-fig-3Q4DM8CBLY.svg',
  'Gooseberry': '/svg/reshot-icon-gooseberry-R3B72SH4ZT.svg',
  'Grape': '/svg/reshot-icon-black-grapes-N4F7GEKAD9.svg',
  'Grapefruit': '/svg/reshot-icon-grapefruit-5VZYJXSD7T.svg',
  'Jackfruit': '/svg/reshot-icon-jackfruit-8UGR2YKAJP.svg',
  'Kiwi': '/svg/reshot-icon-kiwi-UK7JBWLDEF.svg',
  'Kiwifruit': '/svg/reshot-icon-kiwi-UK7JBWLDEF.svg',
  'Lemon': '/svg/reshot-icon-lemon-AJE7L9HRCP.svg',
  'Lime': '/svg/reshot-icon-lime-GZDFPRAXSQ.svg',
  'Lychee': '/svg/reshot-icon-lychee-97WBTXC4KQ.svg',
  'Mango': '/svg/reshot-icon-mango-274CZTHXEA.svg',
  'Melon': '/svg/reshot-icon-half-melon-9547RJYXU6.svg',
  'Orange': '/svg/reshot-icon-orange-LMFY2K8R7H.svg',
  'Tangerine': '/svg/reshot-icon-orange-LMFY2K8R7H.svg', // Using orange for tangerine
  'Papaya': '/svg/reshot-icon-papaya-5W4XKU2SYA.svg',
  'Passionfruit': '/svg/reshot-icon-passion-fruit-TWS64UCGRA.svg',
  'Peach': '/svg/reshot-icon-peach-F68VAEDZYG.svg',
  'Pear': '/svg/reshot-icon-pear-6DPQASG2FY.svg',
  'Persimmon': '/svg/reshot-icon-persimmon-HWN7XLDMBT.svg',
  'Japanese Persimmon': '/svg/reshot-icon-persimmon-HWN7XLDMBT.svg',
  'Pineapple': '/svg/reshot-icon-pineapple-USW4L6R3KP.svg',
  'Plum': '/svg/reshot-icon-plum-68J5GHSWPB.svg',
  'Pomegranate': '/svg/reshot-icon-pomegranate-6H4AW7TB58.svg',
  'Raspberry': '/svg/reshot-icon-raspberry-RXTE8WFJ25.svg',
  'Strawberry': '/svg/reshot-icon-strawberry-G6TLPBA5F2.svg',
  'Watermelon': '/svg/reshot-icon-watermelon-XJQRU85NGS.svg',
  
  // Similar/close matches for fruits without exact SVGs
  'Apricot': '/svg/reshot-icon-peach-F68VAEDZYG.svg', // Similar to peach
  'Nectarine': '/svg/reshot-icon-nectarine-PVGA8LS3MZ.svg',
  'Durian': '/svg/reshot-icon-jackfruit-8UGR2YKAJP.svg', // Similar spiky fruit
  'Guava': '/svg/reshot-icon-pink-fruit-SLCWPJX9RH.svg',
  'Lingonberry': '/svg/reshot-icon-cranberry-4HX85VNB6M.svg', // Similar to cranberry
  'Feijoa': '/svg/reshot-icon-gooseberry-R3B72SH4ZT.svg', // Similar small fruit
  'Morus': '/svg/reshot-icon-blackcurrents-ANSG8Z79HY.svg', // Mulberry - similar to blackcurrants
  'Pomelo': '/svg/reshot-icon-grapefruit-5VZYJXSD7T.svg', // Similar citrus
  'Mangosteen': '/svg/reshot-icon-purple-fruit-56NAYFBTKW.svg',
  'Horned Melon': '/svg/reshot-icon-half-melon-9547RJYXU6.svg', // Melon variety
  'Hazelnut': '/svg/reshot-icon-coconut-2R5P3HBGWX.svg', // Using coconut for nuts
  'Annona': '/svg/reshot-icon-seeded-fruit-YHB6XUC8Q5.svg', // Custard apple - seeded fruit
  'Ceylon Gooseberry': '/svg/reshot-icon-gooseberry-R3B72SH4ZT.svg',
  'Tomato': '/svg/reshot-icon-red-berry-UDBLG673FT.svg', // Using red berry for tomato
  'Pumpkin': '/svg/reshot-icon-half-melon-9547RJYXU6.svg' // Using melon for pumpkin (similar shape)
};

function getFruitImageUrl(fruitName) {
  // Use local SVG for Strawberry
  if (fruitName.toLowerCase() === 'strawberry') {
    return '/svg/reshot-icon-strawberry-G6TLPBA5F2.svg';
  }

  // Check if we have a local SVG mapping for this fruit
  if (localSvgMappings[fruitName]) {
    return localSvgMappings[fruitName];
  }

  // Try exact match first in the old image mappings (fallback to Unsplash)
  if (fruitImages[fruitName]) {
    return fruitImages[fruitName];
  }
  
  // Try partial matches for compound names
  const normalizedName = fruitName.toLowerCase();
  
  // Check local SVG mappings for partial matches
  for (const [key, svgPath] of Object.entries(localSvgMappings)) {
    if (normalizedName.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedName)) {
      return svgPath;
    }
  }
  
  // Fallback to Unsplash images for partial matches
  for (const [key, url] of Object.entries(fruitImages)) {
    if (normalizedName.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedName)) {
      return url;
    }
  }
  
  return defaultFruitImage;
}

export async function run({ exit = false } = {}) {
  try {
    console.log('Starting fruit data synchronization from Fruityvice API...');
    
    await sequelize.sync();
    
    const { data } = await axios.get('https://www.fruityvice.com/api/fruit/all');
    console.log(`Fetched ${data.length} fruits from Fruityvice API`);
    
    let upsertedCount = 0;
    
    for (const item of data) {
      const { id, name, family, order, genus, nutritions } = item;
      
      // Prepare fruit data (excluding ID for upsert to avoid conflicts)
      const fruitData = {
        name,
        family,
        order,
        genus,
        calories: nutritions?.calories || 0,
        fat: nutritions?.fat || 0,
        sugar: nutritions?.sugar || 0,
        carbohydrates: nutritions?.carbohydrates || 0,
        protein: nutritions?.protein || 0,
        imageUrl: getFruitImageUrl(name)
      };
      
      const [fruit, created] = await Fruit.upsert(fruitData, {
        conflictFields: ['name']
      });
      if (created) {
        upsertedCount++;
      }
      
      console.log(`${created ? 'Created' : 'Updated'}: ${name}`);
    }
    
    console.log(`Fruits synchronization complete! ${upsertedCount} fruits added/updated`);
    
    if (exit) process.exit(0);
  } catch (error) {
    console.error('Error synchronizing fruits:', error);
    if (exit) process.exit(1);
    throw error;
  }
}

// Only execute automatically when invoked directly via node
if (process.argv[1] && process.argv[1].endsWith('seedFruityvice.js')) {
  run({ exit: true }).catch(e=> { console.error(e); process.exit(1); });
}
