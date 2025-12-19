# 📋 Command Reference - Amrut-Dhara B2B App

Quick reference for all commands you might need during development.

---

## 🚀 Running the App

### Start Metro Bundler
```bash
npm start
```

### Run on Android
```bash
npm run android
```

### Run on iOS (macOS only)
```bash
npm run ios
```

### Run on specific iOS device
```bash
npm run ios -- --simulator="iPhone 15"
```

---

## 🧹 Cleaning & Troubleshooting

### Clear Metro Cache
```bash
npm start -- --reset-cache
```

### Clean Android Build
```bash
cd android
./gradlew clean
cd ..
```

### Clean iOS Build (macOS only)
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Full Clean & Reinstall
```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install

# iOS: Reinstall pods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# Android: Clean gradle
cd android
./gradlew clean
cd ..

# Clear Metro cache
npm start -- --reset-cache
```

---

## 📦 Package Management

### Install New Package
```bash
npm install package-name
```

### Install Dev Package
```bash
npm install --save-dev package-name
```

### Update All Packages
```bash
npm update
```

### Check for Outdated Packages
```bash
npm outdated
```

---

## 🧪 Testing & Debugging

### Run Tests
```bash
npm test
```

### Run Linter
```bash
npm run lint
```

### Fix Linting Issues
```bash
npm run lint -- --fix
```

### Type Check
```bash
npx tsc --noEmit
```

---

## 📱 iOS Specific (macOS only)

### Install CocoaPods Dependencies
```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

### Update CocoaPods
```bash
cd ios
bundle exec pod update
cd ..
```

### Open iOS Project in Xcode
```bash
open ios/AmrutDhara.xcworkspace
```

---

## 🤖 Android Specific

### Create Debug APK
```bash
cd android
./gradlew assembleDebug
cd ..
```

### Create Release APK
```bash
cd android
./gradlew assembleRelease
cd ..
```

### List Connected Devices
```bash
adb devices
```

### Reverse Port for Metro
```bash
adb reverse tcp:8081 tcp:8081
```

### Check App Logs
```bash
# Android
adb logcat | grep ReactNative

# iOS
xcrun simctl spawn booted log stream --predicate 'processImagePath endswith "AmrutDhara"'
```

---

## 🔧 Development Utilities

### Reload App (in running app)
- **iOS:** Cmd + R
- **Android:** Double tap R or Cmd + M (open menu)

### Open Developer Menu
- **iOS:** Cmd + D
- **Android:** Cmd + M or shake device

### Enable Debug Mode
- **iOS:** Cmd + D → Enable Debug
- **Android:** Cmd + M → Debug

---

## 🗄️ Supabase Commands (via npx)

### Login to Supabase
```bash
npx supabase login
```

### Initialize Supabase Project
```bash
npx supabase init
```

### Start Local Supabase
```bash
npx supabase start
```

### Stop Local Supabase
```bash
npx supabase stop
```

---

## 📊 Git Commands

### Initialize Git
```bash
git init
```

### Stage All Changes
```bash
git add .
```

### Commit Changes
```bash
git commit -m "Your commit message"
```

### Create New Branch
```bash
git checkout -b feature/your-feature-name
```

### Push to Remote
```bash
git push origin main
```

---

## 🔐 Environment Setup

### Copy Environment Example
```bash
cp .env.example .env
```

### Edit Environment Variables
```bash
# macOS/Linux
nano .env

# Or use any text editor
code .env
```

---

## 📸 Screenshots & Assets

### Create App Icon
- Place in `android/app/src/main/res/mipmap-*`
- Place in `ios/AmrutDhara/Images.xcassets/AppIcon.appiconset`

### Create Splash Screen
```bash
# Install react-native-splash-screen if needed
npm install react-native-splash-screen
```

---

## 🚢 Release Build Commands

### Android Release Build
```bash
cd android
./gradlew bundleRelease
cd ..
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### iOS Release Build (macOS only)
```bash
# Open Xcode
open ios/AmrutDhara.xcworkspace

# Then: Product → Archive
```

---

## 📱 Device Management

### Android Emulator
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd YOUR_AVD_NAME
```

### iOS Simulator (macOS only)
```bash
# List available simulators
xcrun simctl list devices

# Boot specific simulator
xcrun simctl boot "iPhone 15"
```

---

## 🔍 Debugging Tools

### React Native Debugger
```bash
# Install React Native Debugger
brew install --cask react-native-debugger

# Or download from https://github.com/jhen0409/react-native-debugger
```

### Flipper (Meta's debugging platform)
```bash
# Install Flipper
brew install --cask flipper
```

### Network Debugging
- Open Developer Menu
- Enable "Debug JS Remotely"
- Open Chrome DevTools

---

## 📦 Build Size Analysis

### Android Bundle Size
```bash
cd android
./gradlew assembleRelease
cd ..
# Check: android/app/build/outputs/apk/release/app-release.apk
```

### Analyze Bundle
```bash
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android.bundle \
  --sourcemap-output android.map
```

---

## 🆘 Quick Fixes

### "Unable to load script" error
```bash
npm start -- --reset-cache
```

### "Could not connect to development server"
```bash
# Android
adb reverse tcp:8081 tcp:8081

# iOS - Check Metro is running
npm start
```

### Build fails after installing package
```bash
# iOS
cd ios && pod install && cd ..

# Android - usually automatic, but if needed:
cd android && ./gradlew clean && cd ..
```

### TypeScript errors
```bash
# Restart TypeScript server in VS Code
# Or
npx tsc --noEmit
```

---

## 📚 Documentation Commands

### Generate JSDoc
```bash
npx jsdoc -r src/
```

### Generate TypeDoc
```bash
npx typedoc --out docs src/
```

---

## 🎯 Quick Setup (First Time)

```bash
# 1. Install dependencies
npm install

# 2. iOS Setup (macOS only)
cd ios && bundle install && bundle exec pod install && cd ..

# 3. Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Run the app
npm run android  # or npm run ios
```

---

## 📞 Support Resources

- **React Native Docs:** https://reactnative.dev/docs/getting-started
- **Supabase Docs:** https://supabase.com/docs
- **React Navigation:** https://reactnavigation.org/docs/getting-started
- **React Native Paper:** https://callstack.github.io/react-native-paper/

---

**Keep this file handy for quick command reference! 🚀**
