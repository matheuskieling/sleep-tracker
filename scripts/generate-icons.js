const sharp = require("sharp");
const path = require("path");

// App color palette
const COLORS = {
  background: "#292D32", // primary dark
  cloud: "#F8F2EF", // warm beige (surface)
  cloudShadow: "#E8DDD6", // border color for depth
  moon: "#FF7617", // accent orange
  moonGlow: "#FFF3E0", // pastel amber for glow
  stars: "#A09389", // muted
};

function createIconSVG(size) {
  // Scale everything relative to 1024
  const s = size / 1024;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#353A40"/>
      <stop offset="100%" stop-color="${COLORS.background}"/>
    </radialGradient>
    <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${COLORS.moonGlow}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${COLORS.moonGlow}" stop-opacity="0"/>
    </radialGradient>
    <filter id="cloudShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="${4 * s}" stdDeviation="${12 * s}" flood-color="#000000" flood-opacity="0.15"/>
    </filter>
    <filter id="moonShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${2 * s}" stdDeviation="${8 * s}" flood-color="${COLORS.moon}" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#bgGrad)" rx="${80 * s}" ry="${80 * s}"/>

  <!-- Stars -->
  <circle cx="${200 * s}" cy="${220 * s}" r="${4 * s}" fill="${COLORS.stars}" opacity="0.6"/>
  <circle cx="${750 * s}" cy="${180 * s}" r="${3 * s}" fill="${COLORS.stars}" opacity="0.5"/>
  <circle cx="${850 * s}" cy="${350 * s}" r="${3.5 * s}" fill="${COLORS.stars}" opacity="0.4"/>
  <circle cx="${150 * s}" cy="${400 * s}" r="${3 * s}" fill="${COLORS.stars}" opacity="0.5"/>
  <circle cx="${320 * s}" cy="${150 * s}" r="${2.5 * s}" fill="${COLORS.stars}" opacity="0.45"/>
  <circle cx="${600 * s}" cy="${130 * s}" r="${3 * s}" fill="${COLORS.stars}" opacity="0.35"/>
  <circle cx="${880 * s}" cy="${250 * s}" r="${2 * s}" fill="${COLORS.stars}" opacity="0.5"/>

  <!-- Moon glow -->
  <circle cx="${620 * s}" cy="${300 * s}" r="${180 * s}" fill="url(#moonGlow)"/>

  <!-- Crescent Moon - created by overlapping two circles -->
  <g filter="url(#moonShadow)">
    <!-- Outer moon circle (orange) -->
    <circle cx="${620 * s}" cy="${300 * s}" r="${120 * s}" fill="${COLORS.moon}"/>
    <!-- Inner cutout circle (background color, offset to create crescent) -->
    <circle cx="${670 * s}" cy="${265 * s}" r="${100 * s}" fill="url(#bgGrad)"/>
  </g>

  <!-- Cloud - main body -->
  <g filter="url(#cloudShadow)">
    <!-- Cloud shadow layer for depth -->
    <ellipse cx="${512 * s}" cy="${640 * s}" rx="${280 * s}" ry="${80 * s}" fill="${COLORS.cloudShadow}" opacity="0.5"/>

    <!-- Main cloud body -->
    <ellipse cx="${512 * s}" cy="${620 * s}" rx="${280 * s}" ry="${80 * s}" fill="${COLORS.cloud}"/>

    <!-- Cloud puffs -->
    <circle cx="${380 * s}" cy="${570 * s}" r="${100 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${500 * s}" cy="${520 * s}" r="${130 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${630 * s}" cy="${545 * s}" r="${110 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${700 * s}" cy="${590 * s}" r="${80 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${320 * s}" cy="${600 * s}" r="${70 * s}" fill="${COLORS.cloud}"/>

    <!-- Cloud highlight for depth -->
    <circle cx="${460 * s}" cy="${510 * s}" r="${90 * s}" fill="white" opacity="0.4"/>
    <circle cx="${550 * s}" cy="${530 * s}" r="${70 * s}" fill="white" opacity="0.25"/>
  </g>
</svg>`;
}

function createAdaptiveIconSVG(size) {
  // Adaptive icon foreground: content in the safe zone (center 66%)
  // The icon should be 108dp with content in the inner 72dp (66.67%)
  const s = size / 1024;
  // Offset to center content within the safe zone
  const offset = size * 0.1; // push content toward center

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="moonGlow2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${COLORS.moonGlow}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${COLORS.moonGlow}" stop-opacity="0"/>
    </radialGradient>
    <filter id="cloudShadow2" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="${4 * s}" stdDeviation="${10 * s}" flood-color="#000000" flood-opacity="0.15"/>
    </filter>
    <filter id="moonShadow2" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${2 * s}" stdDeviation="${6 * s}" flood-color="${COLORS.moon}" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Transparent background for adaptive icon foreground -->
  <rect width="${size}" height="${size}" fill="transparent"/>

  <!-- Stars -->
  <circle cx="${250 * s}" cy="${280 * s}" r="${4 * s}" fill="${COLORS.stars}" opacity="0.6"/>
  <circle cx="${730 * s}" cy="${240 * s}" r="${3 * s}" fill="${COLORS.stars}" opacity="0.5"/>
  <circle cx="${820 * s}" cy="${380 * s}" r="${3.5 * s}" fill="${COLORS.stars}" opacity="0.4"/>
  <circle cx="${200 * s}" cy="${430 * s}" r="${3 * s}" fill="${COLORS.stars}" opacity="0.5"/>
  <circle cx="${370 * s}" cy="${220 * s}" r="${2.5 * s}" fill="${COLORS.stars}" opacity="0.45"/>

  <!-- Moon glow -->
  <circle cx="${620 * s}" cy="${340 * s}" r="${160 * s}" fill="url(#moonGlow2)"/>

  <!-- Crescent Moon -->
  <g filter="url(#moonShadow2)">
    <circle cx="${620 * s}" cy="${340 * s}" r="${110 * s}" fill="${COLORS.moon}"/>
    <circle cx="${665 * s}" cy="${308 * s}" r="${92 * s}" fill="${COLORS.background}"/>
  </g>

  <!-- Cloud -->
  <g filter="url(#cloudShadow2)">
    <ellipse cx="${512 * s}" cy="${640 * s}" rx="${260 * s}" ry="${75 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${400 * s}" cy="${590 * s}" r="${90 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${510 * s}" cy="${545 * s}" r="${115 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${630 * s}" cy="${565 * s}" r="${100 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${690 * s}" cy="${605 * s}" r="${72 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${340 * s}" cy="${615 * s}" r="${65 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${470 * s}" cy="${535 * s}" r="${80 * s}" fill="white" opacity="0.35"/>
  </g>
</svg>`;
}

function createFaviconSVG(size) {
  const s = size / 48;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="bgGrad3" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#353A40"/>
      <stop offset="100%" stop-color="${COLORS.background}"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#bgGrad3)" rx="${4 * s}" ry="${4 * s}"/>

  <!-- Simplified Moon -->
  <circle cx="${30 * s}" cy="${14 * s}" r="${8 * s}" fill="${COLORS.moon}"/>
  <circle cx="${33 * s}" cy="${11 * s}" r="${6.5 * s}" fill="url(#bgGrad3)"/>

  <!-- Simplified Cloud -->
  <ellipse cx="${24 * s}" cy="${32 * s}" rx="${16 * s}" ry="${5 * s}" fill="${COLORS.cloud}"/>
  <circle cx="${20 * s}" cy="${28 * s}" r="${6 * s}" fill="${COLORS.cloud}"/>
  <circle cx="${27 * s}" cy="${26 * s}" r="${8 * s}" fill="${COLORS.cloud}"/>
  <circle cx="${33 * s}" cy="${29 * s}" r="${5.5 * s}" fill="${COLORS.cloud}"/>
</svg>`;
}

function createSplashIconSVG(size) {
  // Splash icon: just the cloud+moon without background, centered
  const s = size / 512;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <filter id="moonShadow3" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${2 * s}" stdDeviation="${6 * s}" flood-color="${COLORS.moon}" flood-opacity="0.35"/>
    </filter>
    <filter id="cloudShadow3" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="${3 * s}" stdDeviation="${8 * s}" flood-color="#6B5E57" flood-opacity="0.12"/>
    </filter>
  </defs>

  <!-- Crescent Moon -->
  <g filter="url(#moonShadow3)">
    <circle cx="${310 * s}" cy="${140 * s}" r="${70 * s}" fill="${COLORS.moon}"/>
    <circle cx="${340 * s}" cy="${115 * s}" r="${58 * s}" fill="${COLORS.background}"/>
  </g>

  <!-- Cloud -->
  <g filter="url(#cloudShadow3)">
    <ellipse cx="${256 * s}" cy="${330 * s}" rx="${180 * s}" ry="${55 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${180 * s}" cy="${290 * s}" r="${65 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${260 * s}" cy="${255 * s}" r="${85 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${345 * s}" cy="${275 * s}" r="${70 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${390 * s}" cy="${305 * s}" r="${50 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${145 * s}" cy="${310 * s}" r="${45 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${230 * s}" cy="${250 * s}" r="${55 * s}" fill="white" opacity="0.3"/>
  </g>
</svg>`;
}

async function generateIcons() {
  const assetsDir = path.join(__dirname, "..", "assets");

  console.log("Generating app icons...\n");

  // 1. Main icon (1024x1024)
  const iconSVG = createIconSVG(1024);
  await sharp(Buffer.from(iconSVG)).resize(1024, 1024).png().toFile(path.join(assetsDir, "icon.png"));
  console.log("  icon.png (1024x1024)");

  // 2. Adaptive icon foreground (1024x1024, transparent bg)
  const adaptiveSVG = createAdaptiveIconSVG(1024);
  await sharp(Buffer.from(adaptiveSVG)).resize(1024, 1024).png().toFile(path.join(assetsDir, "adaptive-icon.png"));
  console.log("  adaptive-icon.png (1024x1024)");

  // 3. Favicon (48x48)
  const faviconSVG = createFaviconSVG(48);
  await sharp(Buffer.from(faviconSVG)).resize(48, 48).png().toFile(path.join(assetsDir, "favicon.png"));
  console.log("  favicon.png (48x48)");

  // 4. Splash icon (512x512)
  const splashSVG = createSplashIconSVG(512);
  await sharp(Buffer.from(splashSVG)).resize(512, 512).png().toFile(path.join(assetsDir, "splash-icon.png"));
  console.log("  splash-icon.png (512x512)");

  console.log("\nAll icons generated successfully!");
}

generateIcons().catch(console.error);
