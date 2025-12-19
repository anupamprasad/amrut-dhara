import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, Card, Button, Appbar, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useAuth} from '../hooks/useAuth';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {user, signOut} = useAuth();
  const theme = useTheme();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Amrut-Dhara" />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.welcomeContainer}>
          <Text variant="headlineSmall" style={styles.welcomeText}>
            Welcome!
          </Text>
          <Text variant="bodyLarge" style={styles.emailText}>
            {user?.email}
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleLarge" style={styles.cardTitle}>
                New Order
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                Place a new water bottle order
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('NewOrder')}
                style={styles.cardButton}>
                Create Order
              </Button>
            </Card.Actions>
          </Card>

          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleLarge" style={styles.cardTitle}>
                Order History
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                View your past orders and status
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('OrderHistory')}
                style={styles.cardButton}>
                View History
              </Button>
            </Card.Actions>
          </Card>
        </View>

        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            Need help? Contact us at:
          </Text>
          <Text variant="bodyMedium" style={styles.footerContact}>
            support@amrutdhara.com
          </Text>
          <Text variant="bodyMedium" style={styles.footerContact}>
            +91 1234567890
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  welcomeContainer: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  welcomeText: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emailText: {
    color: '#666',
  },
  cardsContainer: {
    marginBottom: 30,
  },
  card: {
    marginBottom: 20,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    color: '#666',
  },
  cardButton: {
    marginLeft: 'auto',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    marginBottom: 8,
  },
  footerContact: {
    fontWeight: '500',
    marginBottom: 4,
  },
});

export default HomeScreen;
