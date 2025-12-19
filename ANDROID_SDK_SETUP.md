# 🔧 Android SDK Setup Required

## The Issue
Your Android build is failing because the Android SDK is not installed. This is required to build React Native apps for Android.

## ✅ Solution: Install Android Studio

### Step 1: Install Android Studio

**Option A: Using Homebrew (Recommended)**
```bash
brew install --cask android-studio
```

**Option B: Manual Download**
Download from: https://developer.android.com/studio

### Step 2: Set Up Android Studio

1. **Open Android Studio** (first launch will take a few minutes)
2. Click **"More Actions"** → **"SDK Manager"**
3. In **SDK Platforms** tab, check:
   - ✅ Android 14.0 (API 34)
   - ✅ Android 13.0 (API 33)
4. In **SDK Tools** tab, check:
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Command-line Tools
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
5. Click **"Apply"** and wait for installation (this takes 5-10 minutes)

### Step 3: Set Environment Variables

Add these to your `~/.zshrc` file:

```bash
# Open the file
nano ~/.zshrc

# Add these lines at the end:
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# Save: Ctrl+O, Enter, Ctrl+X
```

Then reload your shell:
```bash
source ~/.zshrc
```

### Step 4: Verify Installation

```bash
echo $ANDROID_HOME
# Should show: /Users/anupamprasad/Library/Android/sdk

which adb
# Should show path to adb

sdkmanager --list | head -20
# Should show installed SDK packages
```

### Step 5: Create local.properties (Quick Fix)

If you just installed Android Studio, run this:

```bash
cd /Users/anupamprasad/Documents/Projects/Amrut-Dhara/AmrutDhara/android
echo "sdk.dir=/Users/anupamprasad/Library/Android/sdk" > local.properties
```

### Step 6: Try Building Again

```bash
cd /Users/anupamprasad/Documents/Projects/Amrut-Dhara/AmrutDhara
npm run android
```

---

## 🚀 Quick Alternative: Use Expo (No Android Studio Required)

If you want to test the app quickly without installing Android Studio:

### Install Expo Go App on Your Phone

1. Download **Expo Go** from Google Play Store
2. Run this in your project:
```bash
# Install expo
npm install -g expo-cli

# This won't work directly with your current setup, but you could migrate to Expo
```

**Note:** Your current app is built with React Native CLI, not Expo, so this would require some refactoring.

---

## ⏱️ Time Estimates

- **Install Android Studio:** 10-15 minutes
- **Download SDK packages:** 5-10 minutes  
- **Configure and build:** 5 minutes
- **Total:** ~30 minutes

---

## 🎯 Recommended Path

**For Development:** Install Android Studio (full control, better debugging)

**For Quick Testing:** 
1. Ask someone with Android Studio to build you an APK
2. Or use a cloud build service like EAS Build (Expo)

---

## 📱 After Android Studio is Set Up

Once everything is installed:

**Terminal 1 - Start Metro:**
```bash
cd /Users/anupamprasad/Documents/Projects/Amrut-Dhara/AmrutDhara
npm start
```

**Terminal 2 - Run on Phone:**
```bash
cd /Users/anupamprasad/Documents/Projects/Amrut-Dhara/AmrutDhara
adb devices  # Check phone is connected
npm run android
```

---

## 🆘 Still Having Issues?

### Error: "SDK location not found"
→ Make sure `local.properties` file exists with correct path

### Error: "Could not find or load main class org.gradle.wrapper.GradleWrapperMain"
→ Run: `cd android && ./gradlew wrapper && cd ..`

### Error: "Installed Build Tools revision X is corrupted"
→ In Android Studio SDK Manager, uninstall and reinstall Build Tools

---

## 💡 Want to Generate APK Without Installing Android Studio?

You can use **GitHub Actions** to build your APK in the cloud! I can set that up for you if you prefer.

Would you like me to:
1. ✅ Help you install Android Studio (recommended)
2. 🌐 Set up cloud building with GitHub Actions (no local setup needed)
3. 📦 Create a Docker container for building (advanced)

Let me know which approach you prefer!
