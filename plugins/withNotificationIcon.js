const { withAndroidManifest, AndroidConfig } = require("expo/config-plugins");
const { readFileSync } = require("fs");
const { copyFileSync, mkdirSync, existsSync } = require("fs");
const path = require("path");
const sharp = require !== undefined ? null : null; // not needed at prebuild time

/**
 * Custom Expo config plugin to set the FCM notification icon and color.
 * Works alongside @react-native-firebase/messaging without manifest conflicts.
 *
 * Usage in app.json plugins:
 *   ["./plugins/withNotificationIcon", { "icon": "./assets/notification-icon.png", "color": "#FF7617" }]
 */

const { withDangerousMod } = require("expo/config-plugins");
const { resolve } = require("path");

// Android drawable DPI buckets and their notification icon sizes
const DPIS = [
  { folder: "drawable-mdpi", size: 24 },
  { folder: "drawable-hdpi", size: 36 },
  { folder: "drawable-xhdpi", size: 48 },
  { folder: "drawable-xxhdpi", size: 72 },
  { folder: "drawable-xxxhdpi", size: 96 },
];

function withNotificationIcon(config, { icon, color = "#FFFFFF" } = {}) {
  // Step 1: Copy the notification icon to Android res/drawable-* folders
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      if (!icon) return config;

      const projectRoot = config.modRequest.projectRoot;
      const resDir = path.join(
        projectRoot,
        "android",
        "app",
        "src",
        "main",
        "res"
      );

      const iconSource = resolve(projectRoot, icon);

      // Try to use sharp for resizing, fallback to direct copy
      let sharpModule;
      try {
        sharpModule = require("sharp");
      } catch {
        // sharp not available, copy the icon as-is to all DPI folders
      }

      for (const { folder, size } of DPIS) {
        const destDir = path.join(resDir, folder);
        if (!existsSync(destDir)) {
          mkdirSync(destDir, { recursive: true });
        }
        const destFile = path.join(destDir, "notification_icon.png");

        if (sharpModule) {
          await sharpModule(iconSource)
            .resize(size, size)
            .png()
            .toFile(destFile);
        } else {
          copyFileSync(iconSource, destFile);
        }
      }

      // Write the notification color as an Android color resource
      const valuesDir = path.join(resDir, "values");
      if (!existsSync(valuesDir)) {
        mkdirSync(valuesDir, { recursive: true });
      }
      const colorsFile = path.join(valuesDir, "notification_colors.xml");
      const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="notification_icon_color">${color}</color>
</resources>
`;
      require("fs").writeFileSync(colorsFile, colorsXml);

      return config;
    },
  ]);

  // Step 2: Add meta-data to AndroidManifest with tools:replace to avoid conflicts
  config = withAndroidManifest(config, (config) => {
    const mainApp = config.modResults.manifest.application?.[0];
    if (!mainApp) return config;

    if (!mainApp["meta-data"]) {
      mainApp["meta-data"] = [];
    }

    // Ensure tools namespace is declared
    if (!config.modResults.manifest.$["xmlns:tools"]) {
      config.modResults.manifest.$["xmlns:tools"] =
        "http://schemas.android.com/tools";
    }

    // Helper to set or replace a meta-data entry
    function setMetaData(name, resourceValue) {
      const existing = mainApp["meta-data"].find(
        (m) => m.$["android:name"] === name
      );
      if (existing) {
        existing.$["android:resource"] = resourceValue;
        existing.$["tools:replace"] = "android:resource";
      } else {
        mainApp["meta-data"].push({
          $: {
            "android:name": name,
            "android:resource": resourceValue,
            "tools:replace": "android:resource",
          },
        });
      }
    }

    if (icon) {
      setMetaData(
        "com.google.firebase.messaging.default_notification_icon",
        "@drawable/notification_icon"
      );
    }

    if (color) {
      setMetaData(
        "com.google.firebase.messaging.default_notification_color",
        "@color/notification_icon_color"
      );
    }

    return config;
  });

  return config;
}

module.exports = withNotificationIcon;
