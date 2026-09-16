# Android APK Packaging Guide for Calculator

This project has been fully configured for Android packaging using **Capacitor** (native Android project) and **Web App Manifest** (PWA / TWA).

---

## What Has Been Prepared

1. **Native Android Project Directory (`/android`)**:
   - Ready-to-compile Android Studio project.
   - Includes `build.gradle`, `app/build.gradle`, `AndroidManifest.xml`, Gradle wrapper (`gradlew` and `gradlew.bat`), and native launcher configurations.
2. **Capacitor Configuration (`capacitor.config.json`)**:
   - App ID: `com.calculator.app`
   - App Name: `Calculator`
   - Web Asset Directory: `dist`
3. **App Icons & Web App Manifest**:
   - `public/manifest.json`: Standalone display, dark theme `#020617`, portrait orientation, maskable and standard icons.
   - `public/icon.svg`: Vector icon optimized for mobile app launchers.
4. **Convenient NPM Scripts (`package.json`)**:
   - `npm run cap:sync`: Builds the web bundle and syncs all HTML/JS/CSS assets into the Android native assets folder.
   - `npm run cap:open`: Opens the `/android` folder in Android Studio automatically.

---

## Option 1: Build the APK with Android Studio (Recommended)

### Prerequisites:
- Download & install [Android Studio](https://developer.android.com/studio).
- Export this project (via the Settings menu -> **Export to ZIP** or **GitHub**).

### Step-by-Step Instructions:

1. **Extract and Open the Project**:
   - Unzip the exported archive.
   - In your terminal inside the project root, make sure the web build is up to date:
     ```bash
     npm install
     npm run cap:sync
     ```
2. **Open in Android Studio**:
   - Open Android Studio.
   - Click **Open** (or File > Open) and select the **`android`** folder inside your project.
   - Allow Gradle to sync dependencies (Android Studio will automatically download the necessary Android SDK components).
3. **Build the APK**:
   - In the top menu, go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
   - Once the build finishes, a notification will appear in the bottom-right corner: *"Build APK(s): APK(s) generated successfully."*
   - Click **locate** to find your APK file.
   - The file will be at:
     ```text
     android/app/build/outputs/apk/debug/app-debug.apk
     ```
4. **Install on Your Phone**:
   - Transfer `app-debug.apk` to your Android device via USB, Google Drive, or email.
   - Tap the file to install (enable "Install unknown apps" if prompted).

---

## Option 2: Build the APK from Terminal / Command Line (Without opening Android Studio)

If you have the Android SDK command-line tools and Java JDK installed:

```bash
# 1. Update the web build and sync assets to Android
npm run cap:sync

# 2. Enter the android directory
cd android

# 3. Build the debug APK using the Gradle wrapper
# On macOS / Linux:
./gradlew assembleDebug

# On Windows:
.\gradlew.bat assembleDebug
```

Your compiled APK is immediately output to:
```text
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Option 3: Generate APK via PWABuilder (No Android Studio or SDK required)

Because this app now contains a compliant `manifest.json` and standalone PWA support:

1. Deploy your app to Cloud Run or host it on your custom domain / URL.
2. Go to [PWABuilder.com](https://www.pwabuilder.com).
3. Enter your live app URL and click **Start**.
4. Click **Package for Stores** and choose **Android**.
5. PWABuilder will automatically compile and download a signed **APK / AAB** package for you.
