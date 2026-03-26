import { readFileSync, writeFileSync } from 'fs';
import { Resvg } from '@resvg/resvg-js';

const svg = readFileSync('assets/icon.svg');
const resvg = new Resvg(svg, {
  background: 'rgba(59, 130, 246, 1)',
  fitTo: {
    mode: 'width',
    value: 1024,
  },
});

const pngData = resvg.render();
const pngBuffer = pngData.asPng();

writeFileSync('assets/icon.png', pngBuffer);
writeFileSync('assets/splash.png', pngBuffer);
console.log('Done rendering icon and splash PNGs.');
