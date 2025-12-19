# 🤖 GitHub Actions - Cloud APK Building

Your Android APK will now build automatically in the cloud! No local Android Studio needed.

## ✅ What I Set Up

- **GitHub Actions workflow** that builds your APK on every push
- **Automatic releases** with downloadable APK files
- **No local setup required** - everything runs in GitHub's cloud

## 📱 How to Get Your APK

### Method 1: Download from GitHub Actions (Immediate)

1. Go to: https://github.com/anupamprasad/amrut-dhara/actions
2. Click on the latest workflow run (after you push the code)
3. Scroll down to **Artifacts**
4. Download **app-debug.apk**
5. Transfer to your phone and install!

### Method 2: Download from Releases (After First Build)

1. Go to: https://github.com/anupamprasad/amrut-dhara/releases
2. Download the latest **app-debug.apk**
3. Transfer to your phone and install!

## 🚀 Push the Code to Trigger Build

```bash
cd /Users/anupamprasad/Documents/Projects/Amrut-Dhara/AmrutDhara
git add .
git commit -m "Add GitHub Actions workflow for APK building"
git push origin main
```

**The build will start automatically!** 

## ⏱️ Build Time

- First build: ~8-10 minutes
- Subsequent builds: ~5-7 minutes (with caching)

## 📥 Installing APK on Your Phone

### Step 1: Download APK to Your Phone

**Option A: Direct Download**
- Open the GitHub releases page on your phone's browser
- Download the APK directly

**Option B: Transfer from Computer**
- Download APK on your computer
- Transfer via USB, email, or cloud storage (Google Drive, Dropbox)
- Or use: `adb install path/to/app-debug.apk`

### Step 2: Enable Installation from Unknown Sources

1. On your Android phone, go to **Settings**
2. Go to **Security** or **Apps**
3. Enable **Install unknown apps** for your browser or file manager
4. Tap the downloaded APK file
5. Tap **Install**

### Step 3: Trust the App

If prompted about "App not verified":
- Tap **More details** → **Install anyway**
- This is normal for APKs not from Play Store

## 🔄 How It Works

Every time you push code to GitHub:
1. ✅ GitHub Actions automatically starts
2. ✅ Installs Node.js, Java, and Android SDK
3. ✅ Installs your npm dependencies
4. ✅ Builds the APK
5. ✅ Uploads the APK as an artifact
6. ✅ Creates a release with the APK attached

## 📊 Monitor Your Build

Watch the build progress:
```
https://github.com/anupamprasad/amrut-dhara/actions
```

You'll see:
- ✅ Green checkmark = Build succeeded
- ❌ Red X = Build failed
- 🟡 Yellow dot = Building now

## 🎯 Quick Test

After pushing the code:

1. **Wait 8-10 minutes** for first build
2. **Check Actions tab** to see build progress
3. **Download APK** from Artifacts or Releases
4. **Install on phone** and test!

## 🔧 Troubleshooting

### Build Failed?
- Check the Actions tab for error logs
- Usually it's a dependency or configuration issue
- I can help fix it if you share the error

### APK Won't Install?
- Enable "Unknown sources" in phone settings
- Make sure you downloaded the complete file
- Check if you have enough storage space

### App Crashes After Install?
- Make sure you configured Supabase credentials in `.env`
- The APK will use the credentials from your code

## 🎨 Customizing Before Release

Before building, you might want to:

### 1. Update App Name
Edit `android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">Amrut-Dhara</string>
```

### 2. Update Package Name (Optional)
Currently: `com.amrutdhara`
Edit in `android/app/build.gradle` if needed

### 3. Update Version
Edit `android/app/build.gradle`:
```gradle
versionCode 1
versionName "1.0"
```

## 🚀 Production Build (Later)

For Google Play Store, you'll need a signed release APK:
1. Generate a signing key
2. Configure signing in `android/app/build.gradle`
3. Build release APK: `./gradlew assembleRelease`

For now, the debug APK works perfectly for testing!

## 📱 Next Steps

1. **Push the workflow file** (command above)
2. **Wait for build** to complete (~10 min)
3. **Download APK** from Actions or Releases
4. **Install on phone** and test
5. **Share with team** - they can download from GitHub releases!

---

**Build Status:** Check here: https://github.com/anupamprasad/amrut-dhara/actions

**Download APK:** https://github.com/anupamprasad/amrut-dhara/releases

Enjoy your cloud-built app! 🎉
