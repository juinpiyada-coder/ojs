import sharp from 'sharp';
import fs from 'fs';

sharp('public/logo.svg')
  .png()
  .toFile('public/logo.png')
  .then(info => {
    console.log('Successfully converted logo.svg to logo.png', info);
  })
  .catch(err => {
    console.error('Error converting image:', err);
  });
