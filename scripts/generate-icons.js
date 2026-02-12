const sharp = require("sharp");
const path = require("path");

// Warm color palette from the app
const COLORS = {
  bgDark: "#3D1E08", // warm deep brown (darkened secondary)
  bgMid: "#652D07", // secondary deep brown
  cloud: "#FFFFFF", // white cloud
  cloudBeige: "#F8F2EF", // warm beige highlights
  cloudShadow: "#C4A88E", // warm brown shadow
  moon: "#FF7617", // accent orange
  moonLight: "#FFB347", // lighter orange for gradient
  moonGlow: "#FF9A4D", // warm orange glow
  stars: "#FFD699", // warm golden stars
  splashBg: "#652D07", // deep brown splash background (matches adaptive icon bg)
};

function createIconSVG(size) {
  const s = size / 1024;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7A3E14"/>
      <stop offset="50%" stop-color="${COLORS.bgMid}"/>
      <stop offset="100%" stop-color="${COLORS.bgDark}"/>
    </linearGradient>
    <radialGradient id="moonGlow" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="${COLORS.moonGlow}" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="${COLORS.moon}" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="${COLORS.moon}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.moonLight}"/>
      <stop offset="100%" stop-color="${COLORS.moon}"/>
    </linearGradient>
    <filter id="cloudShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="${6 * s}" stdDeviation="${14 * s}" flood-color="${COLORS.bgDark}" flood-opacity="0.25"/>
    </filter>
    <filter id="moonShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="${3 * s}" stdDeviation="${10 * s}" flood-color="${COLORS.moon}" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Warm brown background -->
  <rect width="${size}" height="${size}" fill="url(#bgGrad)" rx="${80 * s}" ry="${80 * s}"/>

  <!-- Warm golden stars -->
  <circle cx="${180 * s}" cy="${200 * s}" r="${5 * s}" fill="${COLORS.stars}" opacity="0.7"/>
  <circle cx="${280 * s}" cy="${130 * s}" r="${3.5 * s}" fill="${COLORS.stars}" opacity="0.55"/>
  <circle cx="${750 * s}" cy="${170 * s}" r="${4 * s}" fill="${COLORS.stars}" opacity="0.6"/>
  <circle cx="${860 * s}" cy="${320 * s}" r="${3.5 * s}" fill="${COLORS.stars}" opacity="0.5"/>
  <circle cx="${140 * s}" cy="${380 * s}" r="${3 * s}" fill="${COLORS.stars}" opacity="0.5"/>
  <circle cx="${620 * s}" cy="${120 * s}" r="${3 * s}" fill="${COLORS.stars}" opacity="0.45"/>
  <circle cx="${420 * s}" cy="${160 * s}" r="${2.5 * s}" fill="${COLORS.stars}" opacity="0.4"/>
  <circle cx="${900 * s}" cy="${450 * s}" r="${2.5 * s}" fill="${COLORS.stars}" opacity="0.35"/>

  <!-- Moon glow -->
  <circle cx="${620 * s}" cy="${310 * s}" r="${200 * s}" fill="url(#moonGlow)"/>

  <!-- Crescent Moon -->
  <g filter="url(#moonShadow)">
    <circle cx="${620 * s}" cy="${310 * s}" r="${125 * s}" fill="url(#moonGrad)"/>
    <circle cx="${675 * s}" cy="${272 * s}" r="${105 * s}" fill="url(#bgGrad)"/>
  </g>

  <!-- Cloud -->
  <g filter="url(#cloudShadow)">
    <!-- Base -->
    <ellipse cx="${512 * s}" cy="${640 * s}" rx="${290 * s}" ry="${82 * s}" fill="${COLORS.cloud}"/>
    <!-- Puffs -->
    <circle cx="${370 * s}" cy="${575 * s}" r="${105 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${500 * s}" cy="${520 * s}" r="${135 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${640 * s}" cy="${548 * s}" r="${112 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${710 * s}" cy="${595 * s}" r="${82 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${310 * s}" cy="${610 * s}" r="${72 * s}" fill="${COLORS.cloud}"/>
    <!-- Warm beige depth -->
    <ellipse cx="${512 * s}" cy="${650 * s}" rx="${270 * s}" ry="${50 * s}" fill="${COLORS.cloudBeige}" opacity="0.4"/>
    <!-- Highlight -->
    <circle cx="${455 * s}" cy="${515 * s}" r="${85 * s}" fill="white" opacity="0.5"/>
    <circle cx="${560 * s}" cy="${535 * s}" r="${65 * s}" fill="white" opacity="0.3"/>
  </g>
</svg>`;
}

function createAdaptiveIconSVG(size) {
  const s = size / 1024;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="moonGlow2" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="${COLORS.moonGlow}" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="${COLORS.moon}" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="${COLORS.moon}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="moonGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.moonLight}"/>
      <stop offset="100%" stop-color="${COLORS.moon}"/>
    </linearGradient>
    <linearGradient id="bgRef" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7A3E14"/>
      <stop offset="50%" stop-color="${COLORS.bgMid}"/>
      <stop offset="100%" stop-color="${COLORS.bgDark}"/>
    </linearGradient>
    <filter id="cloudShadow2" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="${5 * s}" stdDeviation="${12 * s}" flood-color="${COLORS.bgDark}" flood-opacity="0.2"/>
    </filter>
    <filter id="moonShadow2" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="${3 * s}" stdDeviation="${8 * s}" flood-color="${COLORS.moon}" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Transparent background -->
  <rect width="${size}" height="${size}" fill="transparent"/>

  <!-- Golden stars -->
  <circle cx="${230 * s}" cy="${270 * s}" r="${5 * s}" fill="${COLORS.stars}" opacity="0.7"/>
  <circle cx="${340 * s}" cy="${200 * s}" r="${3.5 * s}" fill="${COLORS.stars}" opacity="0.55"/>
  <circle cx="${730 * s}" cy="${230 * s}" r="${4 * s}" fill="${COLORS.stars}" opacity="0.6"/>
  <circle cx="${810 * s}" cy="${370 * s}" r="${3 * s}" fill="${COLORS.stars}" opacity="0.45"/>
  <circle cx="${190 * s}" cy="${420 * s}" r="${3 * s}" fill="${COLORS.stars}" opacity="0.5"/>

  <!-- Moon glow -->
  <circle cx="${620 * s}" cy="${340 * s}" r="${175 * s}" fill="url(#moonGlow2)"/>

  <!-- Crescent Moon -->
  <g filter="url(#moonShadow2)">
    <circle cx="${620 * s}" cy="${340 * s}" r="${115 * s}" fill="url(#moonGrad2)"/>
    <circle cx="${670 * s}" cy="${305 * s}" r="${96 * s}" fill="url(#bgRef)"/>
  </g>

  <!-- Cloud -->
  <g filter="url(#cloudShadow2)">
    <ellipse cx="${512 * s}" cy="${645 * s}" rx="${265 * s}" ry="${75 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${390 * s}" cy="${595 * s}" r="${95 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${510 * s}" cy="${548 * s}" r="${120 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${635 * s}" cy="${568 * s}" r="${102 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${695 * s}" cy="${608 * s}" r="${74 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${335 * s}" cy="${620 * s}" r="${66 * s}" fill="${COLORS.cloud}"/>
    <ellipse cx="${512 * s}" cy="${655 * s}" rx="${245 * s}" ry="${45 * s}" fill="${COLORS.cloudBeige}" opacity="0.35"/>
    <circle cx="${465 * s}" cy="${540 * s}" r="${78 * s}" fill="white" opacity="0.45"/>
  </g>
</svg>`;
}

function createFaviconSVG(size) {
  const s = size / 48;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bgGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7A3E14"/>
      <stop offset="100%" stop-color="${COLORS.bgDark}"/>
    </linearGradient>
    <linearGradient id="moonGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.moonLight}"/>
      <stop offset="100%" stop-color="${COLORS.moon}"/>
    </linearGradient>
  </defs>

  <!-- Warm brown background -->
  <rect width="${size}" height="${size}" fill="url(#bgGrad3)" rx="${4 * s}" ry="${4 * s}"/>

  <!-- Simplified Moon -->
  <circle cx="${30 * s}" cy="${14 * s}" r="${8 * s}" fill="url(#moonGrad3)"/>
  <circle cx="${33 * s}" cy="${11 * s}" r="${6.5 * s}" fill="url(#bgGrad3)"/>

  <!-- Simplified Cloud -->
  <ellipse cx="${24 * s}" cy="${32 * s}" rx="${16 * s}" ry="${5 * s}" fill="${COLORS.cloud}"/>
  <circle cx="${20 * s}" cy="${28 * s}" r="${6 * s}" fill="${COLORS.cloud}"/>
  <circle cx="${27 * s}" cy="${26 * s}" r="${8 * s}" fill="${COLORS.cloud}"/>
  <circle cx="${33 * s}" cy="${29 * s}" r="${5.5 * s}" fill="${COLORS.cloud}"/>
</svg>`;
}

function createSplashIconSVG(size) {
  const s = size / 512;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="moonGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.moonLight}"/>
      <stop offset="100%" stop-color="${COLORS.moon}"/>
    </linearGradient>
    <filter id="moonShadow4" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="${2 * s}" stdDeviation="${8 * s}" flood-color="${COLORS.moon}" flood-opacity="0.4"/>
    </filter>
    <filter id="cloudShadow4" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="${3 * s}" stdDeviation="${8 * s}" flood-color="${COLORS.cloudShadow}" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- Crescent Moon -->
  <g filter="url(#moonShadow4)">
    <circle cx="${310 * s}" cy="${140 * s}" r="${72 * s}" fill="url(#moonGrad4)"/>
    <circle cx="${342 * s}" cy="${113 * s}" r="${60 * s}" fill="${COLORS.splashBg}"/>
  </g>

  <!-- Cloud -->
  <g filter="url(#cloudShadow4)">
    <ellipse cx="${256 * s}" cy="${335 * s}" rx="${185 * s}" ry="${58 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${175 * s}" cy="${290 * s}" r="${68 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${260 * s}" cy="${255 * s}" r="${88 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${348 * s}" cy="${278 * s}" r="${72 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${395 * s}" cy="${308 * s}" r="${52 * s}" fill="${COLORS.cloud}"/>
    <circle cx="${140 * s}" cy="${312 * s}" r="${48 * s}" fill="${COLORS.cloud}"/>
    <ellipse cx="${256 * s}" cy="${345 * s}" rx="${170 * s}" ry="${35 * s}" fill="${COLORS.cloudBeige}" opacity="0.3"/>
    <circle cx="${230 * s}" cy="${250 * s}" r="${58 * s}" fill="white" opacity="0.35"/>
  </g>
</svg>`;
}

function createNotificationIconSVG(size) {
  // Android notification icons must be monochrome white on transparent
  const s = size / 96;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <!-- Transparent background -->
  <rect width="${size}" height="${size}" fill="transparent"/>

  <!-- Crescent Moon (white) -->
  <circle cx="${58 * s}" cy="${28 * s}" r="${18 * s}" fill="white"/>
  <circle cx="${64 * s}" cy="${23 * s}" r="${15 * s}" fill="transparent"/>

  <!-- Cloud (white) -->
  <ellipse cx="${48 * s}" cy="${62 * s}" rx="${32 * s}" ry="${10 * s}" fill="white"/>
  <circle cx="${38 * s}" cy="${54 * s}" r="${12 * s}" fill="white"/>
  <circle cx="${50 * s}" cy="${48 * s}" r="${16 * s}" fill="white"/>
  <circle cx="${62 * s}" cy="${52 * s}" r="${13 * s}" fill="white"/>
  <circle cx="${68 * s}" cy="${58 * s}" r="${9 * s}" fill="white"/>
  <circle cx="${32 * s}" cy="${58 * s}" r="${8 * s}" fill="white"/>
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

  // 5. Notification icon (96x96, monochrome white on transparent)
  const notifSVG = createNotificationIconSVG(96);
  await sharp(Buffer.from(notifSVG)).resize(96, 96).png().toFile(path.join(assetsDir, "notification-icon.png"));
  console.log("  notification-icon.png (96x96)");

  console.log("\nAll icons generated successfully!");
}

generateIcons().catch(console.error);
