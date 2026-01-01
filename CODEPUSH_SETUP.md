# CodePush Setup Guide for Amrut Dhara

## Overview
CodePush enables over-the-air (OTA) updates for your React Native app without requiring users to reinstall the APK. This means you can push JavaScript and asset updates directly to users' devices.

## 🚀 What's Already Configured

✅ CodePush package installed
✅ Android native code configured
✅ App.tsx wrapped with CodePush HOC
✅ npm scripts for deployment ready

## 📋 Setup Steps

### 1. Install App Center CLI
```bash
npm install -g appcenter-cli
```

### 2. Create Microsoft App Center Account
1. Go to https://appcenter.ms
2. Sign up with your Microsoft account or GitHub
3. Create a new organization (optional) or use your personal account

### 3. Create App in App Center

#### For Android:
```bash
appcenter apps create -d AmrutDhara-Android -o Android -p React-Native
```

This creates an app with two default deployments:
- **Staging**: For testing updates before going live
- **Production**: For live app updates

### 4. Get Deployment Keys

```bash
# Get Production deployment key
appcenter codepush deployment list -a <YOUR_USERNAME>/AmrutDhara-Android -k

# Example output:
# Production: abc123def456...
# Staging: xyz789uvw456...
```

### 5. Update Android Configuration

Edit `android/app/src/main/res/values/strings.xml`:
```xml
<resources>
    <string name="app_name">AmrutDhara</string>
    <string moduleConfig="true" name="CodePushDeploymentKey">YOUR_PRODUCTION_KEY_HERE</string>
</resources>
```

Replace `YOUR_PRODUCTION_KEY_HERE` with your actual Production deployment key from step 4.

### 6. Build and Release APK

After adding the deployment key, build a new APK:

```bash
cd android
./gradlew assembleRelease
cd ..
```

Distribute this APK to users. This is the **last time** you'll need to build and distribute an APK for JavaScript changes!

## 📦 Deploying Updates

### Update package.json Scripts

Edit the `codepush:android` scripts in package.json:
```json
{
  "scripts": {
    "codepush:android": "appcenter codepush release-react -a YOUR_USERNAME/AmrutDhara-Android -d Production",
    "codepush:android:staging": "appcenter codepush release-react -a YOUR_USERNAME/AmrutDhara-Android -d Staging"
  }
}
```

Replace `YOUR_USERNAME` with your App Center username.

### Deploy Updates

#### To Production (Live Users):
```bash
npm run codepush:android
```

#### To Staging (Testing):
```bash
npm run codepush:android:staging
```

#### With Custom Description:
```bash
appcenter codepush release-react -a YOUR_USERNAME/AmrutDhara-Android -d Production -m --description "Fixed notification bug"
```

#### Mandatory Update (Force users to update):
```bash
appcenter codepush release-react -a YOUR_USERNAME/AmrutDhara-Android -d Production -m
```

## 🔄 How It Works

The app is configured to:
1. **Check for updates**: When app resumes from background
2. **Install mode**: Updates install on next app resume (not immediately)
3. **Background duration**: Waits 60 seconds after app goes to background before checking

Users will:
1. Open the app normally
2. App checks for updates in the background
3. If update found, downloads silently
4. Next time user opens app, update is applied

## 🎯 What Can Be Updated via CodePush

✅ **JavaScript code changes**
✅ **TypeScript code changes**
✅ **Asset updates** (images, fonts, etc.)
✅ **Styling changes**
✅ **Bug fixes**
✅ **New features** (JS-only)

❌ **Cannot update via CodePush:**
- Native code changes (Kotlin/Java)
- New native modules
- AndroidManifest.xml changes
- Gradle configuration changes
- Native dependencies

For native changes, you still need to build and distribute a new APK.

## 📊 Monitor Updates

Check deployment status:
```bash
appcenter codepush deployment list -a YOUR_USERNAME/AmrutDhara-Android
```

View deployment history:
```bash
appcenter codepush deployment history Production -a YOUR_USERNAME/AmrutDhara-Android
```

## 🔐 Security Best Practices

1. **Use Staging First**: Always test updates in Staging before Production
2. **Rollback if Needed**: CodePush supports rollbacks
   ```bash
   appcenter codepush rollback Production -a YOUR_USERNAME/AmrutDhara-Android
   ```
3. **Monitor Metrics**: Check App Center for update installation rates
4. **Version Targeting**: Target specific app versions if needed
   ```bash
   appcenter codepush release-react -a YOUR_USERNAME/AmrutDhara-Android -t "1.0.0"
   ```

## 🚨 Troubleshooting

### Updates Not Installing
- Check deployment key in strings.xml
- Verify app is wrapped with CodePush HOC
- Check network connectivity
- Review logs: `adb logcat | grep CodePush`

### App Crashes After Update
```bash
# Rollback immediately
appcenter codepush rollback Production -a YOUR_USERNAME/AmrutDhara-Android
```

### Clear CodePush Cache
```bash
appcenter codepush deployment clear Production -a YOUR_USERNAME/AmrutDhara-Android
```

## 📝 Example Workflow

1. **Make code changes** (fix notification bug)
2. **Test locally**: `npm run android`
3. **Deploy to Staging**: `npm run codepush:android:staging`
4. **Test staging build** on test device
5. **Deploy to Production**: `npm run codepush:android`
6. **Monitor metrics** in App Center
7. Users get update automatically! 🎉

## 💡 Pro Tips

- Use descriptive messages for each release
- Keep deployment keys secure (don't commit to git)
- Test updates thoroughly in Staging
- Use mandatory updates sparingly
- Monitor rollout metrics
- Consider gradual rollouts for major changes

## 📚 Additional Resources

- [CodePush Documentation](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/)
- [App Center CLI Reference](https://docs.microsoft.com/en-us/appcenter/cli/)
- [React Native CodePush GitHub](https://github.com/microsoft/react-native-code-push)

---

**Note**: This setup is for Android. For iOS, you'll need to configure iOS-specific settings in Xcode and use a separate App Center app for iOS.
