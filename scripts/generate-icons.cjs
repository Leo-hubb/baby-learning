// 生成 PWA 所需的 PNG 图标
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([length, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, pixels) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const rawData = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    rawData[y * (1 + width * 4)] = 0;
    pixels.copy(rawData, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = zlib.deflateSync(rawData, { level: 9 });
  return Buffer.concat([signature, createChunk('IHDR', ihdr), createChunk('IDAT', idat), createChunk('IEND', Buffer.alloc(0))]);
}

const rainbowColors = [
  [255, 182, 193], [135, 206, 235], [255, 250, 205], [152, 251, 152], [221, 160, 221],
];

function lerp(a, b, t) { return Math.round(a + (b - a) * t); }

function getGradientColor(x, y, width, height) {
  const t = ((x / width) + (y / height)) / 2;
  const segment = t * (rainbowColors.length - 1);
  const idx = Math.min(Math.floor(segment), rainbowColors.length - 2);
  const localT = segment - idx;
  const c1 = rainbowColors[idx], c2 = rainbowColors[idx + 1];
  return [lerp(c1[0], c2[0], localT), lerp(c1[1], c2[1], localT), lerp(c1[2], c2[2], localT)];
}

function generateIcon(size, maskable) {
  const pixels = Buffer.alloc(size * size * 4);
  const cornerRadius = maskable ? 0 : Math.floor(size * 0.22);
  const padding = maskable ? Math.floor(size * 0.15) : 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      let inCorner = false;
      if (!maskable) {
        const check = (cx, cy) => {
          const dx = Math.abs(cx), dy = Math.abs(cy);
          return dx * dx + dy * dy > cornerRadius * cornerRadius;
        };
        if (x < cornerRadius && y < cornerRadius && check(cornerRadius - x, cornerRadius - y)) inCorner = true;
        if (x >= size - cornerRadius && y < cornerRadius && check(x - (size - cornerRadius - 1), cornerRadius - y)) inCorner = true;
        if (x < cornerRadius && y >= size - cornerRadius && check(cornerRadius - x, y - (size - cornerRadius - 1))) inCorner = true;
        if (x >= size - cornerRadius && y >= size - cornerRadius && check(x - (size - cornerRadius - 1), y - (size - cornerRadius - 1))) inCorner = true;
      }
      if (inCorner) { pixels[idx] = 0; pixels[idx+1] = 0; pixels[idx+2] = 0; pixels[idx+3] = 0; }
      else {
        const gx = Math.max(0, Math.min(size - 1, x - padding));
        const gy = Math.max(0, Math.min(size - 1, y - padding));
        const gSize = Math.max(1, size - padding * 2);
        const color = getGradientColor(gx, gy, gSize, gSize);
        pixels[idx] = color[0]; pixels[idx+1] = color[1]; pixels[idx+2] = color[2]; pixels[idx+3] = 255;
      }
    }
  }
  return encodePNG(size, size, pixels);
}

const publicDir = path.join(__dirname, '..', 'public');
const icons = [
  { name: 'icon-192.png', size: 192, maskable: false },
  { name: 'icon-512.png', size: 512, maskable: false },
  { name: 'icon-maskable-192.png', size: 192, maskable: true },
  { name: 'icon-maskable-512.png', size: 512, maskable: true },
];
icons.forEach(({ name, size, maskable }) => {
  fs.writeFileSync(path.join(publicDir, name), generateIcon(size, maskable));
  console.log('Generated ' + name + ' (' + size + 'x' + size + (maskable ? ', maskable' : '') + ')');
});
console.log('All icons generated!');
