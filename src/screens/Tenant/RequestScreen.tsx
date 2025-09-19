import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { requestService } from '../../services/requestService';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RequestScreen = ({ route, navigation }: any) => {
  const { property, userData } = route.params;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (userData) {
      setFullName(userData.name || '');
      setPhone(userData.phone || '');
    }
  }, [userData]);

  const validateFields = () => {
    if (!fullName.trim() || !phone.trim() || !message.trim()) {
      Alert.alert('Missing Info', 'Please fill in all the fields.');
      return false;
    }
    return true;
  };

  const handleSendRequest = async () => {
    if (!validateFields()) return;

    setIsSending(true);

    try {
      await requestService.createRequest({
        propertyId: property._id,
        message,
      });

      Alert.alert(
        'Request Sent',
        'Your rental request has been sent to the landlord.'
      );
      navigation.goBack();
    } catch (error) {
      console.error('Error sending request:', error);
      Alert.alert('Error', 'Failed to send your request.');
    } finally {
      setIsSending(false);
    }
  };

  if (isSending) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A4303F" />
        <Text style={styles.loadingText}>Sending request...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Icon name="send" size={32} color="#A4303F" />
          <Text style={styles.subtitle}>
            Fill in your details to send a request for this property
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Icon name="person" size={20} color="#6B7280" />
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Icon name="phone" size={20} color="#6B7280" />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message to Landlord</Text>
            <View style={[styles.inputContainer, styles.messageInputContainer]}>
              <Icon
                name="message"
                size={20}
                color="#6B7280"
                style={styles.messageIcon}
              />
              <TextInput
                style={[styles.input, styles.messageInput]}
                value={message}
                onChangeText={setMessage}
                placeholder="Write something about your interest..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSendRequest}
            disabled={isSending}
            activeOpacity={0.95}
          >
            <Icon name="send" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Send Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Nunito_500Medium',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Nunito_500Medium',
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    backgroundColor: '#EAF4F4',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#A4C3B2',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    minHeight: 52,
  },
  messageInputContainer: {
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  messageIcon: {
    marginTop: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Nunito_500Medium',
    marginLeft: 12,
  },
  messageInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A4303F',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
});

export default RequestScreen;
