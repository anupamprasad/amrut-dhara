import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../hooks/useAuth';

// Screens (to be created)
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import NewOrderScreen from '../screens/NewOrderScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import {Order} from '../types';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  NewOrder: undefined;
  OrderHistory: undefined;
  OrderDetails: {order: Order};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const {user, loading} = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="NewOrder"
              component={NewOrderScreen}
              options={{headerShown: true, title: 'New Order'}}
            />
            <Stack.Screen
              name="OrderHistory"
              component={OrderHistoryScreen}
              options={{headerShown: true, title: 'Order History'}}
            />
            <Stack.Screen
              name="OrderDetails"
              component={OrderDetailsScreen}
              options={{headerShown: true, title: 'Order Details'}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
