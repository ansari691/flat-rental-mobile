import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { propertyService } from '../../services/propertyService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const MapScreen: React.FC<NativeStackScreenProps<any>> = ({ navigation }) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [region, setRegion] = useState<any>(null);

  const geocodeAddress = async (address: string) => {
    try {
      const results = await Location.geocodeAsync(address);
      if (results.length > 0) {
        return {
          lat: results[0].latitude,
          lng: results[0].longitude,
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding failed:', error);
      return null;
    }
  };

  const fetchProperties = async () => {
    try {
      const propertiesList = await propertyService.searchProperties({});

      const geocodedProps: any[] = [];

      for (const property of propertiesList) {
        if (property.location) {
          const geo = await geocodeAddress(property.location);
          if (geo) {
            geocodedProps.push({
              ...property,
              latitude: geo.lat,
              longitude: geo.lng,
            });
          }
        }
      }

      setProperties(geocodedProps);
    } catch (error) {
      console.error('Error fetching properties:', error);
      Alert.alert('Error', 'Could not load properties.');
    }
  };

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  useEffect(() => {
    getUserLocation();
    fetchProperties();
  }, []);

  if (!region) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A4303F" />
        <Text style={styles.loadingText}>Loading map data...</Text>
      </View>
    );
  }

  return (
    <MapView style={styles.map} region={region} showsUserLocation>
      {properties.map((property) => (
        <Marker
          key={property.id}
          coordinate={{
            latitude: property.latitude,
            longitude: property.longitude,
          }}
          title={property.title}
          description={property.address}
          onPress={() =>
            navigation.navigate('PropertyDetailScreen', { property })
          }
        />
      ))}
    </MapView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  map: {
    flex: 1,
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
});
