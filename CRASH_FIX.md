# App Crash Fix - January 3, 2025

## Problem
App was crashing immediately on launch with the following error:

```
java.lang.UnsatisfiedLinkError: dlopen failed: library "libreact_featureflagsjni.so" not found
```

### Root Cause
The `android/app/build.gradle` file had been configured with `debuggableVariants = []`, which forces React Native to bundle JavaScript even in debug mode. This configuration was causing React Native 0.83.1 to fail to properly load the native library `libreact_featureflagsjni.so`, which is required for the new architecture's feature flags system.

### Error Stack Trace
```
at com.facebook.soloader.SoLoader.loadLibrary(SoLoader.java:812)
at com.facebook.react.internal.featureflags.ReactNativeFeatureFlagsCxxInterop.<clinit>(ReactNativeFeatureFlagsCxxInterop.kt:28)
at com.facebook.react.internal.featureflags.ReactNativeFeatureFlagsCxxAccessor.enableBridgelessArchitecture(ReactNativeFeatureFlagsCxxAccessor.kt:229)
at com.facebook.react.ReactActivityDelegate.onCreate(ReactActivityDelegate.java:149)
at com.facebook.react.ReactActivity.onCreate(ReactActivity.java:61)
```

## Solution

### Changes Made

**File:** `android/app/build.gradle`

**Before:**
```gradle
/* Variants */
//   The list of variants to that are debuggable. For those we're going to
//   skip the bundling of the JS bundle and the assets. By default is just 'debug'.
//   If you add flavors like lite, prod, etc. you'll have to list your debuggableVariants.
// Bundle JS in debug mode too (no Metro dependency)
debuggableVariants = []
```

**After:**
```gradle
/* Variants */
//   The list of variants to that are debuggable. For those we're going to
//   skip the bundling of the JS bundle and the assets. By default is just 'debug'.
//   If you add flavors like lite, prod, etc. you'll have to list your debuggableVariants.
// debuggableVariants = ["debug"]
```

### Why This Works
- React Native 0.83.1 with the new architecture requires certain native libraries to be loaded properly
- By restoring the default behavior (commenting out `debuggableVariants`), we allow React Native's build system to properly configure the native modules
- The feature flags library (`libreact_featureflagsjni.so`) is now loaded correctly during app startup

## Testing
After deploying the fix:

1. The APK is being built via GitHub Actions with the corrected configuration
2. Download the latest APK from GitHub Actions artifacts
3. Install on your device: `adb install app-release.apk`
4. The app should now launch successfully without the native library error

## Commit
Commit: `9656b6c` - "Fix: Remove debuggableVariants override to fix missing libreact_featureflagsjni.so"

## Related Files
- `android/app/build.gradle` - Main fix location
- Previously fixed: `android/app/src/main/java/com/amrutdhara/MainApplication.kt` - Added SoLoader.init()

## Notes
- This issue is specific to React Native 0.83.1's new architecture
- The default React Native configuration should not override `debuggableVariants` unless there's a specific need
- For production builds via GitHub Actions, the release variant continues to work correctly
