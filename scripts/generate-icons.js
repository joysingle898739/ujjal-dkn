import fs from 'fs';
import zlib from 'zlib';

function createPng(width, height, bgColor, drawPhone = true) {
  // Generate RGBA raw pixels
  // Each scanline begins with a filter byte (0 = None)
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const rawData = Buffer.alloc((stride + 1) * height);

  const [bgR, bgG, bgB, bgA] = bgColor;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (stride + 1);
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * bytesPerPixel;

      // Rounded squircle mask
      const rx = width * 0.22;
      const ry = height * 0.22;
      const dx = Math.max(0, Math.abs(x - width / 2) - (width / 2 - rx));
      const dy = Math.max(0, Math.abs(y - height / 2) - (height / 2 - ry));
      const isOutside = (dx * dx + dy * dy) > (rx * rx);

      if (isOutside) {
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
        continue;
      }

      // Check inner elements
      // Phone border in gold
      const phoneLeft = width * 0.26;
      const phoneRight = width * 0.74;
      const phoneTop = height * 0.16;
      const phoneBottom = height * 0.84;
      const phoneBorder = width * 0.02;

      const inPhoneOuter = x >= phoneLeft && x <= phoneRight && y >= phoneTop && y <= phoneBottom;
      const inPhoneInner = x >= (phoneLeft + phoneBorder) && x <= (phoneRight - phoneBorder) &&
                           y >= (phoneTop + phoneBorder * 2) && y <= (phoneBottom - phoneBorder * 2);

      // Gold screen display box
      const boxLeft = width * 0.35;
      const boxRight = width * 0.65;
      const boxTop = height * 0.32;
      const boxBottom = height * 0.62;
      const inBox = x >= boxLeft && x <= boxRight && y >= boxTop && y <= boxBottom;

      if (inBox) {
        // Gold amber icon center
        rawData[pxOffset] = 245;     // R
        rawData[pxOffset + 1] = 158; // G
        rawData[pxOffset + 2] = 11;  // B
        rawData[pxOffset + 3] = 255;
      } else if (inPhoneInner) {
        // Screen background (deep slate blue)
        rawData[pxOffset] = 15;
        rawData[pxOffset + 1] = 23;
        rawData[pxOffset + 2] = 42;
        rawData[pxOffset + 3] = 255;
      } else if (inPhoneOuter) {
        // Gold phone frame
        rawData[pxOffset] = 251;
        rawData[pxOffset + 1] = 191;
        rawData[pxOffset + 2] = 36;
        rawData[pxOffset + 3] = 255;
      } else {
        // Card background (slate 900)
        rawData[pxOffset] = bgR;
        rawData[pxOffset + 1] = bgG;
        rawData[pxOffset + 2] = bgB;
        rawData[pxOffset + 3] = bgA;
      }
    }
  }

  // Deflate compressed data
  const compressed = zlib.deflateSync(rawData);

  // Build PNG chunks
  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeBuf = Buffer.from(type, 'ascii');
    const crcInput = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    crc.writeInt32BE(crc32(crcInput), 0);

    return Buffer.concat([len, typeBuf, data, crc]);
  }

  // Standard CRC32 table
  function crc32(buf) {
    let c = 0xffffffff;
    for (let n = 0; n < buf.length; n++) {
      c = crcTable[(c ^ buf[n]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) | 0;
  }

  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }

  // Header chunk IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression: 0
  ihdr[11] = 0; // Filter: 0
  ihdr[12] = 0; // Interlace: 0

  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  return Buffer.concat([
    pngSignature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

// Generate files
const slateBg = [15, 23, 42, 255]; // #0f172a

fs.writeFileSync('public/pwa-192x192.png', createPng(192, 192, slateBg));
fs.writeFileSync('public/pwa-512x512.png', createPng(512, 512, slateBg));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPng(512, 512, slateBg));
fs.writeFileSync('public/apple-touch-icon.png', createPng(180, 180, slateBg));
fs.writeFileSync('public/favicon.ico', createPng(48, 48, slateBg));

console.log('Successfully generated PWA and App icons!');
