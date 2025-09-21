// screens/Landlord/MyPropertiesScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Switch,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { propertyService } from '../../services/propertyService';

interface Property {
  _id: string;
  title: string;
  description: string;
  location: string;
  address: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  type?: string;
  images?: string[];
  owner?: string;
  available: boolean;
}

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'landlord' | 'tenant';
  phoneNumber?: string;
}

const MyPropertiesScreen: React.FC<NativeStackScreenProps<any>> = ({
  navigation,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [userData, setUserData] = useState<User | null>(null);

  const fetchProperties = async () => {
    try {
      const properties = await propertyService.getLandlordProperties();
      setProperties(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      Alert.alert('Error', 'Failed to load properties.');
    }
  };

  const toggleIsActive = async (propertyId: string, currentStatus: boolean) => {
    try {
      await propertyService.updateProperty(propertyId, {
        available: !currentStatus
      });
      fetchProperties();
      Alert.alert(
        'Success', 
        `Property ${currentStatus ? 'deactivated' : 'activated'} successfully`
      );
    } catch (err) {
      console.error('Failed to toggle status:', err);
      Alert.alert('Error', 'Failed to update property status.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const userDataStr = await AsyncStorage.getItem('userData');
          if (!userDataStr) {
            Alert.alert('Error', 'Please sign in to view your properties');
            return;
          }

          const userData = JSON.parse(userDataStr);
          setUserData(userData);
          fetchProperties();
        } catch (error) {
          console.error('Error loading data:', error);
          Alert.alert('Error', 'Failed to load user data');
        }
      };

      loadData();
    }, [])
  );

  const renderItem = ({ item }: { item: Property }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('PropertyDetailScreen', { propertyId: item._id })
      }
      style={styles.propertyCard}
      activeOpacity={0.95}
    >
      <View style={styles.imageContainer}>
        {item?.images?.[0] ? (
          <Image
            source={{ uri: item.images[0] }}
            style={styles.propertyImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <View style={styles.imageOverlay} />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>₹{item.price}</Text>
        </View>
      </View>

      <View style={styles.propertyInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.propertyTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate('EditProperty', { propertyId: item._id })
            }
          >
            <AntDesign name="edit" size={30} color="#19323C" />
          </TouchableOpacity>
        </View>

        <View style={styles.locationContainer}>
          <Icon name="place" size={25} color="#A4303F" />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.address}
          </Text>
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.statusText}>
            {item.available ? 'Active' : 'Inactive'}
          </Text>
          <Switch
            value={item.available}
            onValueChange={() => toggleIsActive(item._id, item.available)}
            trackColor={{ false: '#D1D5DB', true: '#C2C5BB' }}
            thumbColor={item.available ? '#88AB75' : '#F4F3F4'}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Icon name="home" size={40} color="#A4303F" />
      <Text style={styles.emptyStateTitle}>No properties listed yet</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigation.navigate('SearchScreen')}
      >
        <Icon name="search" size={25} color="#FFFFFF" />
        <Text style={styles.searchText}>Search Properties</Text>
      </TouchableOpacity>

      <FlatList
        data={properties}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('ListProperty')}
        style={styles.addButton}
      >
        <Icon name="add" size={20} color="white" />
        <Text style={styles.addText}>ADD</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyPropertiesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    borderRadius: 8,
    backgroundColor: '#88AB75',
    marginBottom: 20,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: '100%',
  },
  searchText: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 50,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  propertyTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 26,
  },
  editButton: {
    padding: 4,
  },

  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
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
  addText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  toggleRow: {
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Nunito_500Medium',
    color: '#1F2937',
    marginRight: 5,
  },
  propertyCard: {
    backgroundColor: '#EAF4F4',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#A4C3B2',
    marginBottom: 12,
    paddingBottom: 10,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'Nunito_500Medium',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  priceTag: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#88AB75',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  propertyInfo: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  locationText: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Nunito_500Medium',
    flex: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Nunito_500Medium',
  },
});
