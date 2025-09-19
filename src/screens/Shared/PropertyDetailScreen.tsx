import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { propertyService } from '../../services/propertyService';
import { shortlistService } from '../../services/shortlistService';
import { requestService } from '../../services/requestService';
import { authService } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Property {
  _id: string;
  title: string;
  description: string;
  address: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  type?: string;
  images?: string[];
  owner?: string;
}

interface Request {
  _id: string;
  propertyId: string;
  status: 'pending' | 'approved' | 'rejected';
  tenantId: string;
}

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'landlord' | 'tenant';
  phoneNumber?: string;
}

const PropertyDetailScreen = ({ route, navigation }: any) => {
  const propertyId = route.params?.propertyId;

  const [property, setProperty] = useState<Property | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [ownerData, setOwnerData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [hasActiveRequest, setHasActiveRequest] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          // Get user data from AsyncStorage
          const userDataStr = await AsyncStorage.getItem('userData');
          if (!userDataStr) {
            throw new Error('User data not found');
          }

          const userData = JSON.parse(userDataStr) as User;
          setUserData(userData);

          // Fetch property details
          if (propertyId) {
            const [propertyData, isPropertyShortlisted] = await Promise.all([
              propertyService.getPropertyById(propertyId),
              shortlistService.isShortlisted(propertyId)
            ]);

            setProperty(propertyData);
            setIsShortlisted(isPropertyShortlisted);

            // Fetch owner data if property has owner
            if (propertyData.landlordId) {
              // const owner = await authService.getUserById(propertyData.owner);
              setOwnerData(propertyData.landlordId);
            }

            // Check for active requests if user is tenant
            if (userData.userType === 'tenant') {
              const requests = await requestService.getTenantRequests();
              const activeRequest = requests.find((req: Request) => 
                req.propertyId === propertyId && ['pending', 'approved'].includes(req.status)
              );
              setHasActiveRequest(!!activeRequest);
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          Alert.alert('Error', 'Failed to load property details. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [propertyId])
  );

  const handleShortlist = async () => {
    try {
      if (!property?._id) return;

      if (isShortlisted) {
        await shortlistService.removeFromShortlist(property._id);
        Alert.alert('Success', 'Property removed from your shortlist.');
      } else {
        await shortlistService.addToShortlist(property._id);
        Alert.alert('Success', 'Property added to your shortlist.');
      }
      
      setIsShortlisted(!isShortlisted);
    } catch (error) {
      console.error('Error updating shortlist:', error);
      Alert.alert('Error', 'Failed to update shortlist. Please try again.');
    }
  };

  const renderPropertyImage = () => {
    if (!property) return null;
    
    return (
      <View style={styles.imageContainer}>
        {property?.images?.[0] ? (
          <Image
            source={{ uri: property.images[0] }}
            style={styles.propertyImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Icon name="home" size={48} color="#9CA3AF" />
            <Text style={styles.placeholderText}>No Image Available</Text>
          </View>
        )}
        <View style={styles.imageOverlay} />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>₹{property.price}</Text>
        </View>
      </View>
    );
  };

  const renderPropertyInfo = () => {
    if (!property) return null;

    return (
      <View style={styles.propertyInfoContainer}>
        <Text style={styles.propertyTitle}>{property.title}</Text>

        <View style={styles.locationContainer}>
          <Icon name="place" size={20} color="#A4303F" />
          <Text style={styles.locationText}>{property.address}</Text>
        </View>

        {/* {property.bedrooms && property.bathrooms && (
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Text style={styles.featureText}>{property.bedrooms} bedrooms</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureText}>
                {property.bathrooms} bathrooms
              </Text>
            </View>
          </View>
        )} */}
      </View>
    );
  };

  const renderDetailCard = (icon: string, label: string, value: string) => (
    <View style={styles.detailCard}>
      <View style={styles.detailHeader}>
        <Icon name={icon} size={20} color="#A4303F" />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  const renderPropertyDetails = () => {
    if (!property) return null;

    return (
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Property Information</Text>

        {renderDetailCard('description', 'Description', property.description)}
        {renderDetailCard(
          'email',
          'Owner Email',
          ownerData?.email || 'Unavailable'
        )}
        {ownerData?.phoneNumber &&
          renderDetailCard('phone', 'Owner Phone', ownerData.phoneNumber)}
        {property.area &&
          renderDetailCard('square-foot', 'Area', `${property.area} sq ft`)}
        {property.type &&
          renderDetailCard('home', 'Property Type', property.type)}
      </View>
    );
  };

  const renderTenantActions = () => (
    <View style={styles.actionsContainer}>
      <Text style={styles.sectionTitle}>Actions</Text>

      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.primaryButton,
          hasActiveRequest && styles.buttonDisabled,
        ]}
        onPress={() =>
          navigation.navigate('RequestScreen', {
            property,
            userData,
            ownerData,
          })
        }
        disabled={hasActiveRequest}
        activeOpacity={0.95}
      >
        <Icon
          name={hasActiveRequest ? 'check-circle' : 'send'}
          size={20}
          color="#FFFFFF"
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>
          {hasActiveRequest ? 'Request Sent' : 'Send Request'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.secondaryButton,
          isShortlisted && styles.buttonDisabled,
        ]}
        onPress={handleShortlist}
        disabled={isShortlisted}
        activeOpacity={0.95}
      >
        <Icon
          name={isShortlisted ? 'favorite' : 'favorite-border'}
          size={20}
          color={isShortlisted ? '#9CA3AF' : '#A4303F'}
          style={styles.buttonIcon}
        />
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          {isShortlisted ? 'Shortlisted' : 'Add to Shortlist'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('ShortlistScreen')}
      >
        <Text style={styles.linkButtonText}>View My Shortlist</Text>
        <Icon name="arrow-forward" size={16} color="#A4303F" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFBFC" />
        <ActivityIndicator size="large" color="#A4303F" />
        <Text style={styles.loadingText}>Loading property details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBFC" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderPropertyImage()}
        {renderPropertyInfo()}
        {renderPropertyDetails()}
        {userData?.userType === 'tenant' && renderTenantActions()}
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
    backgroundColor: '#FFFBFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Nunito_500Medium',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#EAF4F4',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#0D1F2D',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    position: 'relative',
    height: 280,
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  propertyImage: {
    width: '100%',
    height: '100%',
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
    marginTop: 8,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  priceText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  propertyInfoContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  propertyTitle: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 34,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 18,
    color: '#1F2937',
    fontFamily: 'Nunito_500Medium',
    marginLeft: 8,
    flex: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  featureText: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Nunito_500Medium',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  detailCard: {
    backgroundColor: '#EAF4F4',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(164, 195, 178, 0.3)',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Nunito_500Medium',
    lineHeight: 24,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: '#A4303F',
    borderColor: '#A4303F',
  },
  secondaryButton: {
    backgroundColor: '#EAF4F4',
    borderColor: '#A4C3B2',
  },
  buttonDisabled: {
    backgroundColor: '#E5E7EB',
    borderColor: '#E5E7EB',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#1F2937',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  linkButtonText: {
    fontSize: 16,
    color: '#A4303F',
    fontFamily: 'Nunito_600SemiBold',
    marginRight: 4,
  },
});

export default PropertyDetailScreen;
