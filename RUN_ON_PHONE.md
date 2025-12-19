# 📱 Running Amrut-Dhara on Your Android Phone

## Quick Steps to Run on Physical Device

### Step 1: Enable Developer Options on Your Phone

1. Open **Settings** on your Android phone
2. Go to **About Phone**
3. Tap **Build Number** 7 times (you'll see "You are now a developer!")
4. Go back to Settings → **System** → **Developer Options**
5. Enable **USB Debugging**
6. Enable **Install via USB** (if available)

### Step 2: Connect Your Phone

1. Connect your phone to your Mac via USB cable
2. On your phone, when prompted, tap **Allow USB Debugging**
3. Check "Always allow from this computer"

### Step 3: Install Android Platform Tools (if not installed)

```bash
brew install --cask android-platform-tools
```

### Step 4: Verify Connection

```bash
cd /Users/anupamprasad/Documents/Projects/Amrut-Dhara/AmrutDhara
adb devices
```

You should see your device listed. If it says "unauthorized", check your phone for the USB debugging prompt.

### Step 5: Start Metro Bundler (in Terminal 1)

```bash
cd /Users/anupamprasad/Documents/Projects/Amrut-Dhara/AmrutDhara
npm start -- --reset-cache
```

**Keep this terminal open!** Metro needs to run continuously.

### Step 6: Run the App (in Terminal 2 - new terminal)

```bash
cd /Users/anupamprasad/Documents/Projects/Amrut-Dhara/AmrutDhara
npm run android
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "adb: command not found"

**Solution:**
```bash
brew install --cask android-platform-tools
```

Then restart your terminal and try again.

### Issue 2: Device not showing in adb devices

**Solutions:**
- Disconnect and reconnect USB cable
- Try a different USB cable or port
- On phone: Disable and re-enable USB debugging
- On phone: Select "File Transfer" or "PTP" mode in USB options
- Restart adb: `adb kill-server && adb start-server`

### Issue 3: "device offline" or "unauthorized"

**Solution:**
- Check your phone for USB debugging authorization popup
- Tap "Always allow" and "OK"
- Run: `adb kill-server && adb start-server && adb devices`

### Issue 4: App crashes immediately

**Common causes:**
1. **Supabase not configured** - Check `.env` file has correct credentials
2. **Metro bundler not running** - Make sure Terminal 1 is still open with Metro
3. **Cache issues** - Clear cache and rebuild:

```bash
cd /Users/anupamprasad/Documents/Projects/Amrut-Dhara/AmrutDhara
npm start -- --reset-cache
# In another terminal:
cd /Users/anupamprasad/Documents/Projects/Amrut-Dhara/AmrutDhara/android
./gradlew clean
cd ..
npm run android
```

### Issue 5: "Unable to load script"

**Solution:**
```bash
# Make sure you're in the project directory
cd /Users/anupamprasad/Documents/Projects/Amrut-Dhara/AmrutDhara

# Reverse the port for Metro
adb reverse tcp:8081 tcp:8081

# Restart Metro
npm start -- --reset-cache
```

### Issue 6: Red screen with "Network request failed"

**This means Supabase connection is failing**

**Solutions:**
1. Check `.env` file has correct Supabase credentials
2. Make sure your phone has internet connection
3. Check if Supabase URL is accessible (open in browser)
4. Rebuild the app: `npm run android`

---

## 📋 Complete Fresh Start (if nothing works)

If you're stuck, try this complete reset:

```bash
# Navigate to project
cd /Users/anupamprasad/Documents/Projects/Amrut-Dhara/AmrutDhara

# Clean everything
rm -rf node_modules
npm install

# Clean Android build
cd android
./gradlew clean
cd ..

# Clear Metro cache
npm start -- --reset-cache
```

Then in a **new terminal**:

```bash
cd /Users/anupamprasad/Documents/Projects/Amrut-Dhara/AmrutDhara
adb reverse tcp:8081 tcp:8081
npm run android
```

---

## 🧪 Test Your Setup

### 1. Check if Metro is running
You should see output like:
```
Welcome to Metro v0.80.x
Fast - Scalable - Integrated
```

### 2. Check device connection
```bash
adb devices
```
Should show:
```
List of devices attached
XXXXXXXX    device
```

### 3. Check app installation
After running `npm run android`, you should see:
```
info Successfully installed the app
```

---

## 📱 What to Expect

When the app launches successfully:

1. **First screen:** Login screen with Amrut-Dhara branding
2. **Login credentials:** Use the test user you created in Supabase
3. **After login:** Home screen with "New Order" and "Order History" cards

---

## 🔍 Debugging on Device

### View Live Logs
```bash
adb logcat | grep -i ReactNative
```

### Open Dev Menu
- **Shake your phone** or
- Run: `adb shell input keyevent 82`

### Reload App
From Dev Menu:
- Tap "Reload"
- Enable "Hot Reloading" for automatic updates

---

## ✅ Success Checklist

- [ ] USB debugging enabled on phone
- [ ] Phone connected and authorized
- [ ] `adb devices` shows your device
- [ ] Metro bundler running in one terminal
- [ ] App installed with `npm run android`
- [ ] App opens without crashing
- [ ] Login screen appears

---

## 🆘 Still Not Working?

**Get specific error:**
```bash
adb logcat | grep -i "ReactNative\|Error\|Exception"
```

**Common error patterns:**
- "Network request failed" → Supabase configuration issue
- "Unable to load script" → Metro bundler not running or port issue
- "Application has stopped" → Build or dependency issue

**Check Metro output** in Terminal 1 for bundling errors.

---

## 💡 Pro Tips

1. **Always run Metro first** before running the app
2. **Keep Metro terminal open** while developing
3. **Use two terminals**: One for Metro, one for commands
4. **Enable Hot Reloading** in Dev Menu for faster development
5. **Clear cache often** if you see weird behavior: `npm start -- --reset-cache`

---

**Need more help?** Share the specific error message you're seeing!
