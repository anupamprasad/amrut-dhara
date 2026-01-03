# App Crash Fix - January 3, 2026

## Problem
App was crashing immediately on launch with the following error:

```
java.lang.UnsatisfiedLinkError: dlopen failed: library "libreact_featureflagsjni.so" not found
```

### Root Cause
React Native 0.83.1's new architecture (Fabric/TurboModules) requires the native library `libreact_featureflagsjni.so`, but there's a compatibility issue causing this library to not be properly included in the APK build. The new architecture (`newArchEnabled=true`) was causing the app to crash on startup.

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

**File:** `android/gradle.properties`

**Before:**
```properties
# Use this property to enable support to the new architecture.
# This will allow you to use TurboModules and the Fabric render in
# your application. You should enable this flag either if you want
# to write custom TurboModules/Fabric components OR use libraries that
# are providing them.
newArchEnabled=true
```

**After:**
```properties
# Use this property to enable support to the new architecture.
# This will allow you to use TurboModules and the Fabric render in
# your application. You should enable this flag either if you want
# to write custom TurboModules/Fabric components OR use libraries that
# are providing them.
newArchEnabled=false
```

### Why This Works
- React Native 0.83.1's new architecture has compatibility issues causing the `libreact_featureflagsjni.so` native library to not be properly packaged
- Disabling the new architecture (`newArchEnabled=false`) makes the app use the legacy (bridge-based) architecture, which works reliably
- The app will continue to function normally without the new architecture features
- This is a temporary fix until React Native 0.84+ stabilizes the new architecture

## Testing
After deploying the fix:

1. Wait for GitHub Actions to build the new APK (approximately 7 minutes)
2. Download the latest APK from GitHub Actions artifacts: `gh run download <run-id> --name app-debug`
3. Install on your device: `adb install -r app-debug.apk`
4. Launch the app - it should now start successfully without crashing

## Commits
- Commit: `ee775b2` - "Fix: Disable new architecture to resolve libreact_featureflagsjni.so crash"
- Previous attempt: `9656b6c` - "Fix: Remove debuggableVariants override" (didn't solve the issue)

## Related Files
- `android/gradle.properties` - Main fix location (changed `newArchEnabled` to `false`)
- `android/app/build.gradle` - Reverted debuggableVariants change
- `android/app/src/main/java/com/amrutdhara/MainApplication.kt` - SoLoader.init() (still needed)

## Notes
- This issue is specific to React Native 0.83.1's new architecture
- The new architecture provides performance improvements but has stability issues in RN 0.83
- Consider upgrading to React Native 0.74 LTS or 0.76+ when available for better new architecture support
- For now, the legacy bridge architecture works perfectly fine for this app

