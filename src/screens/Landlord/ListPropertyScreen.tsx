import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { userAuthentication } from '../../config/userAuthentication';
import { propertyService } from '../../services/propertyService';
import Icon from 'react-native-vector-icons/Ionicons';

export const uploadImageToCloudinary = async (uri: string) => {
  
    try {
      // For iOS, we need to prepend 'file://' to the URI
      const formData = new FormData();
      const file = {
        uri: Platform.OS === 'ios' ? `file://${uri}` : uri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      } as unknown as Blob;
      
      formData.append('file', file);
      formData.append('upload_preset', process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET); // Create this in Cloudinary dashboard
      
      const response = await fetch(
        process.env.EXPO_PUBLIC_CLOUDINARY_URL,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

const ListPropertyScreen = () => {
  const { user } = userAuthentication();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [property, setProperty] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleListProperty = async () => {
    const { title, description, price, location } = property;

    if (!title || !description || !price || !location || !imageUri) {
      Alert.alert(
        'Validation Error',
        'Please fill all fields and upload an image.'
      );
      return;
    }

    if (!user?._id) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadImageToCloudinary(imageUri);

      await propertyService.createProperty({
        title,
        description,
        price: parseFloat(price),
        address: location,
        bedrooms: 0, // These can be added to the form later
        bathrooms: 0,
        location: {
          type: 'Point',
          coordinates: [0, 0], // These can be added to the form later
        },
        images: [imageUrl],
      });

      setProperty({ title: '', description: '', price: '', location: '' });
      setImageUri(null);
      Alert.alert('Success', 'Property listed successfully!');
    } catch (error) {
      console.error('Listing failed:', error);
      Alert.alert('Error', 'Failed to list property.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View style={styles.headerContainer}>
          <Icon name="add-circle" size={32} color="#A4303F" />
          <Text style={styles.subtitle}>List Your New Property</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Add property name"
                value={property.title}
                onChangeText={(text) =>
                  setProperty({ ...property, title: text })
                }
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <View style={[styles.inputContainer, styles.messageInputContainer]}>
              <TextInput
                style={[styles.input, styles.messageInput]}
                placeholder="Add Description"
                value={property.description}
                onChangeText={(text) =>
                  setProperty({ ...property, description: text })
                }
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Price"
                keyboardType="numeric"
                value={property.price}
                onChangeText={(text) =>
                  setProperty({ ...property, price: text })
                }
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Location"
                value={property.location}
                onChangeText={(text) =>
                  setProperty({ ...property, location: text })
                }
              />
            </View>
          </View>

          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.buttonText}>Choose Property Image</Text>
          </TouchableOpacity>

          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          )}
        </View>
        <TouchableOpacity
          style={[styles.button, uploading && { backgroundColor: '#ccc' }]}
          onPress={handleListProperty}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>
            {uploading ? 'Uploading...' : 'Submit Property'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ListPropertyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
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
    padding: 15,
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
  uploadButton: {
    backgroundColor: '#88AB75',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 6,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
