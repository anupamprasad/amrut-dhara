import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Platform, Alert} from 'react-native';
import {
  TextInput,
  Button,
  HelperText,
  SegmentedButtons,
  Text,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useAuth} from '../hooks/useAuth';
import {orderService} from '../services/orderService';
import {BottleType} from '../types';
import DateTimePicker from '@react-native-community/datetimepicker';

type NewOrderScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'NewOrder'
>;

const NewOrderScreen = () => {
  const navigation = useNavigation<NewOrderScreenNavigationProp>();
  const {user} = useAuth();

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [bottleType, setBottleType] = useState<BottleType>('20L');
  const [quantity, setQuantity] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);

  const bottleOptions = [
    {value: '20L', label: '20L'},
    {value: '10L', label: '10L'},
    {value: '5L', label: '5L'},
    {value: '2L', label: '2L'},
    {value: '1L', label: '1L'},
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    }

    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (!quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      newErrors.quantity = 'Please enter a valid quantity';
    }

    if (!deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to place an order');
      return;
    }

    setLoading(true);

    const orderData = {
      company_name: companyName,
      contact_name: contactName,
      mobile_number: mobileNumber,
      bottle_type: bottleType,
      quantity: Number(quantity),
      delivery_address: deliveryAddress,
      delivery_date: deliveryDate.toISOString().split('T')[0],
      notes: notes.trim() || undefined,
    };

    const result = await orderService.createOrder(user.id, orderData);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Success',
        'Order placed successfully!',
        [
          {
            text: 'Go to Order History',
            onPress: () => navigation.navigate('OrderHistory'),
          },
          {
            text: 'Place Another Order',
            onPress: () => {
              // Reset form
              setCompanyName('');
              setContactName('');
              setMobileNumber('');
              setBottleType('20L');
              setQuantity('');
              setDeliveryAddress('');
              setDeliveryDate(new Date());
              setNotes('');
              setErrors({});
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      Alert.alert('Error', result.error || 'Failed to place order');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDeliveryDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.content}>
        <TextInput
          label="Company Name *"
          value={companyName}
          onChangeText={setCompanyName}
          mode="outlined"
          style={styles.input}
          error={!!errors.companyName}
          disabled={loading}
        />
        {errors.companyName && (
          <HelperText type="error">{errors.companyName}</HelperText>
        )}

        <TextInput
          label="Contact Person Name *"
          value={contactName}
          onChangeText={setContactName}
          mode="outlined"
          style={styles.input}
          error={!!errors.contactName}
          disabled={loading}
        />
        {errors.contactName && (
          <HelperText type="error">{errors.contactName}</HelperText>
        )}

        <TextInput
          label="Mobile Number *"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          mode="outlined"
          keyboardType="phone-pad"
          maxLength={10}
          style={styles.input}
          error={!!errors.mobileNumber}
          disabled={loading}
        />
        {errors.mobileNumber && (
          <HelperText type="error">{errors.mobileNumber}</HelperText>
        )}

        <Text variant="bodyMedium" style={styles.label}>
          Bottle Type *
        </Text>
        <SegmentedButtons
          value={bottleType}
          onValueChange={value => setBottleType(value as BottleType)}
          buttons={bottleOptions}
          style={styles.segmentedButtons}
        />

        <TextInput
          label="Quantity *"
          value={quantity}
          onChangeText={setQuantity}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          error={!!errors.quantity}
          disabled={loading}
        />
        {errors.quantity && (
          <HelperText type="error">{errors.quantity}</HelperText>
        )}

        <TextInput
          label="Delivery Address *"
          value={deliveryAddress}
          onChangeText={setDeliveryAddress}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          error={!!errors.deliveryAddress}
          disabled={loading}
        />
        {errors.deliveryAddress && (
          <HelperText type="error">{errors.deliveryAddress}</HelperText>
        )}

        <Text variant="bodyMedium" style={styles.label}>
          Preferred Delivery Date *
        </Text>
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
          disabled={loading}>
          {deliveryDate.toLocaleDateString()}
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={deliveryDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        <TextInput
          label="Notes (Optional)"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          disabled={loading}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}>
          Submit Order
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  input: {
    marginBottom: 8,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  dateButton: {
    marginBottom: 16,
    justifyContent: 'flex-start',
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 8,
  },
});

export default NewOrderScreen;
