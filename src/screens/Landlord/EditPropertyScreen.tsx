import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { propertyService } from '../../services/propertyService';
import Icon from 'react-native-vector-icons/Ionicons';
import { uploadImageToCloudinary } from './ListPropertyScreen';

const EditPropertyScreen = ({ route, navigation }: any) => {
  const { propertyId } = route.params;
  const [property, setProperty] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    images: [''],
  });
  const [newImage, setNewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await propertyService.getPropertyById(propertyId);
        if (data) {
          setProperty({
            title: data.title,
            description: data.description,
            price: data.price.toString(),
            address: data.address,
            images: data.images || [''],
          });
        } else {
          Alert.alert('Error', 'Property not found.');
        }
      } catch (error) {
        console.error('Error loading property:', error);
        Alert.alert('Error', 'Failed to load property.');
      }
    };
    fetchProperty();
  }, [propertyId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setNewImage(result.assets[0].uri);
    }
  };

  const deleteOldImage = async () => {
    // With Cloudinary, we don't need to manually delete old images
    // They can be managed through the Cloudinary dashboard or
    // automatically deleted based on your storage settings
    return;
  };

  const handleUpdate = async () => {
    const { title, description, price, address } = property;

    if (!title || !description || !price || !address) {
      Alert.alert('Validation Error', 'Please fill all fields.');
      return;
    }

    try {
      setUploading(true);

      let updatedImageUrl = property.images[0];
      if (newImage) {
        await deleteOldImage();
        updatedImageUrl = await uploadImageToCloudinary(newImage);
      }

      await propertyService.updateProperty(propertyId, {
        ...property,
        price: parseFloat(price),
        images: [updatedImageUrl],
      });

      Alert.alert('Success', 'Property updated.');
      navigation.goBack();
    } catch (error) {
      console.error('Update failed:', error);
      Alert.alert('Error', 'Update failed.');
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
          <Icon name="create-outline" size={32} color="#A4303F" />
          <Text style={styles.subtitle}>Edit Your Property</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Property name"
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
                placeholder="Property description"
                value={property.description}
                onChangeText={(text) =>
                  setProperty({ ...property, description: text })
                }
                multiline
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
                value={property.address}
                onChangeText={(text) =>
                  setProperty({ ...property, address: text })
                }
              />
            </View>
          </View>

          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.buttonText}>Choose New Image</Text>
          </TouchableOpacity>

          {(property.images[0] || newImage) && (
            <Image
              source={{ uri: newImage || property.images[0] }}
              style={styles.imagePreview}
            />
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, uploading && { backgroundColor: '#ccc' }]}
          onPress={handleUpdate}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>
            {uploading ? 'Updating...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EditPropertyScreen;

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
