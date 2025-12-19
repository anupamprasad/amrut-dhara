# Amrut-Dhara B2B Water Solutions App

A React Native mobile application for B2B water bottle ordering and management, built with TypeScript, Supabase, and React Native Paper.

## Features

- 🔐 **Email & Password Authentication**
- 🏠 **Home Dashboard** with quick access to key features
- 📝 **New Order Form** with comprehensive validation
- 📋 **Order History** with pull-to-refresh
- 📊 **Order Details** view with status tracking
- 🎨 **Material Design UI** using React Native Paper
- 🔒 **Secure Data** with Supabase Row Level Security

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **TypeScript** - Type-safe development
- **Supabase** - Backend as a Service (Auth + PostgreSQL)
- **React Navigation** - Navigation library
- **React Native Paper** - Material Design components
- **AsyncStorage** - Secure session persistence

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- React Native development environment:
  - For iOS: Xcode (macOS only)
  - For Android: Android Studio and JDK
- Supabase account

## Project Structure

```
AmrutDhara/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # App screens
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── NewOrderScreen.tsx
│   │   ├── OrderHistoryScreen.tsx
│   │   └── OrderDetailsScreen.tsx
│   ├── services/         # API and business logic
│   │   ├── supabase.ts
│   │   ├── authService.ts
│   │   └── orderService.ts
│   ├── hooks/            # Custom React hooks
│   │   └── useAuth.tsx
│   ├── navigation/       # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── types/            # TypeScript type definitions
│   │   ├── index.ts
│   │   └── env.d.ts
│   └── utils/            # Helper functions
├── App.tsx               # Root component
├── .env                  # Environment variables
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd AmrutDhara
npm install
```

### 2. Configure Supabase

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

#### Create Database Tables

Run this SQL in Supabase SQL Editor:

```sql
-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  bottle_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_date DATE NOT NULL,
  notes TEXT,
  order_status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

#### Enable Email Authentication
1. Go to Authentication > Providers in Supabase
2. Enable Email provider
3. Configure email templates (optional)

### 3. Configure Environment Variables

Edit the `.env` file with your Supabase credentials:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. iOS Setup (macOS only)

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

### 5. Run the App

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

## Testing the App

### Create Test User in Supabase

1. Go to Authentication > Users in Supabase Dashboard
2. Click "Add User" > "Create New User"
3. Enter email and password
4. Use these credentials to log into the app

### Sample Test Data

**Company Name:** ABC Enterprises  
**Contact Name:** John Doe  
**Mobile Number:** 9876543210  
**Bottle Type:** 20L  
**Quantity:** 50  
**Delivery Address:** 123 Main Street, City, State - 123456

## Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Key Features Walkthrough

### Authentication Flow
- Users log in with email and password
- Session is persisted securely with AsyncStorage
- Automatic session refresh handled by Supabase

### Order Creation
- Comprehensive form validation
- Date picker for delivery date
- Support for multiple bottle types (20L, 10L, 5L, 2L, 1L)
- Optional notes field

### Order History
- Pull-to-refresh functionality
- Color-coded status badges
- Empty state for new users
- Tap to view full order details

### Order Details
- Complete order information display
- Status tracking
- Delivery information
- Contact details

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own orders
- Secure session storage with AsyncStorage
- API keys stored in environment variables

## Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### iOS Build Issues
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
```

### Environment Variables Not Working
1. Clear Metro cache: `npm start -- --reset-cache`
2. Rebuild the app completely
3. Verify `.env` file is in the root directory

## Future Enhancements

- [ ] Push notifications for order updates
- [ ] Admin approval workflow
- [ ] Real-time order status tracking
- [ ] Analytics dashboard
- [ ] Multiple delivery addresses
- [ ] Order cancellation feature
- [ ] PDF invoice generation
- [ ] iOS build and App Store deployment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@amrutdhara.com or create an issue in the repository.

---

**Built with ❤️ for Amrut-Dhara Water Solutions**
