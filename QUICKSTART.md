# 🚀 Quick Start Guide - Amrut-Dhara B2B App

This guide will help you get the app running in under 10 minutes!

## ⚡ Fast Track Setup

### Step 1: Dependencies (2 minutes)
```bash
cd /Users/anupamprasad/Documents/Projects/Amrut-Dhara/AmrutDhara
npm install
```

### Step 2: Supabase Setup (3 minutes)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Wait for database to be ready

2. **Run SQL Setup**
   - Go to SQL Editor in Supabase Dashboard
   - Copy entire contents of `supabase-setup.sql`
   - Paste and click "Run"
   - ✅ Tables and security are now set up!

3. **Enable Email Auth**
   - Go to Authentication > Providers
   - Enable "Email" provider
   - Save

4. **Get API Keys**
   - Go to Project Settings > API
   - Copy your project URL
   - Copy your anon/public key

### Step 3: Configure App (1 minute)

Edit `.env` file:
```env
SUPABASE_URL=<paste-your-project-url>
SUPABASE_ANON_KEY=<paste-your-anon-key>
```

### Step 4: Create Test User (1 minute)

In Supabase Dashboard:
1. Go to Authentication > Users
2. Click "Add User" > "Create New User"
3. Email: `test@amrutdhara.com`
4. Password: `test123456`
5. Click "Create User"

### Step 5: Run App (2 minutes)

#### For Android:
```bash
npm run android
```

#### For iOS (macOS only):
```bash
cd ios
bundle install
bundle exec pod install
cd ..
npm run ios
```

### Step 6: Test the App! 🎉

1. **Login**
   - Email: `test@amrutdhara.com`
   - Password: `test123456`

2. **Create an Order**
   - Click "New Order"
   - Fill in the form:
     - Company: "Test Company"
     - Contact: "Your Name"
     - Mobile: "9876543210"
     - Bottle Type: 20L
     - Quantity: 10
     - Address: "123 Test Street"
     - Date: Tomorrow
   - Submit!

3. **View Order History**
   - Go back to Home
   - Click "Order History"
   - See your order!
   - Tap on it to view details

## ✅ Success Checklist

- [ ] App launches without errors
- [ ] Login screen appears
- [ ] Can log in with test credentials
- [ ] Home screen shows welcome message
- [ ] Can navigate to New Order form
- [ ] Can submit an order
- [ ] Can view order in Order History
- [ ] Can see order details

## 🐛 Quick Troubleshooting

### "Cannot connect to Supabase"
- ✅ Check your `.env` file has correct credentials
- ✅ Run `npm start -- --reset-cache`
- ✅ Rebuild the app

### "Login failed"
- ✅ Verify you created the test user in Supabase
- ✅ Check Email provider is enabled in Supabase
- ✅ Try resetting the user's password

### "Orders table not found"
- ✅ Make sure you ran the SQL setup script
- ✅ Check the orders table exists in Supabase Table Editor

### Metro bundler issues
```bash
# Clear cache and restart
npm start -- --reset-cache
```

### Android build issues
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS build issues (macOS)
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

## 📱 App Features to Explore

### 1. Authentication
- ✅ Email/password login
- ✅ Session persistence (stays logged in)
- ✅ Logout from home screen

### 2. Home Dashboard
- ✅ Welcome message with user email
- ✅ Quick access cards for main features
- ✅ Support contact information

### 3. New Order Form
- ✅ All required fields with validation
- ✅ Mobile number format checking
- ✅ Date picker for delivery date
- ✅ Multiple bottle size options
- ✅ Optional notes field
- ✅ Success/error feedback

### 4. Order History
- ✅ List of all orders
- ✅ Pull-to-refresh
- ✅ Color-coded status badges
- ✅ Empty state for new users
- ✅ Tap to view details

### 5. Order Details
- ✅ Complete order information
- ✅ Status badge
- ✅ All contact and delivery details
- ✅ Timestamp information

## 🎯 Next Steps

1. **Customize the App**
   - Update app name and colors in theme
   - Add your logo
   - Customize email templates in Supabase

2. **Add More Features**
   - Order cancellation
   - Order editing
   - Push notifications
   - Multiple delivery addresses
   - Payment integration

3. **Prepare for Production**
   - Update app icons and splash screen
   - Configure proper email templates
   - Set up proper security rules
   - Add analytics
   - Create release builds

## 📚 Documentation

- Full setup guide: `SETUP.md`
- Technical checklist: `../technical-todo.md`
- Supabase SQL: `supabase-setup.sql`

## 🆘 Need Help?

- Check the full `SETUP.md` for detailed instructions
- Review Supabase docs: https://supabase.com/docs
- React Native docs: https://reactnative.dev/docs/getting-started

---

**Happy Coding! 🎉**
