import { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { shortlistService } from '../../services/shortlistService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ShortlistScreen: React.FC<NativeStackScreenProps<any>> = ({
  navigation,
}) => {
  const [UID, setUID] = useState<string | null>(null);
  const [shortlistedProperties, setShortlistedProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const checkUser = async () => {
        try {
          const userDataString = await AsyncStorage.getItem('userData');
          if (userDataString) {
            const userData = JSON.parse(userDataString);
            setUID(userData._id);
            await getShortlistedProperties();
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error checking user:', error);
          setIsLoading(false);
        }
      };

      checkUser();
    }, [])
  );

  const getShortlistedProperties = async () => {
    try {
      setIsLoading(true);
      const properties = await shortlistService.getShortlistedProperties();

      setShortlistedProperties(properties);
    } catch (error) {
      Alert.alert('Error', 'Failed to load shortlisted properties');
      console.error('Fetch shortlist error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (propertyId: string) => {
    Alert.alert(
      'Remove Property',
      'Are you sure you want to remove this property from your shortlist?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await shortlistService.removeFromShortlist(propertyId);
              setShortlistedProperties((prev) =>
                prev.filter((property) => property.id !== propertyId)
              );

              Alert.alert('Success', 'Property removed from your shortlist');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove property');
              console.error('Remove shortlist error:', error);
            }
          },
        },
      ]
    );
  };

  const PropertyItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.propertyCard}
      onPress={() =>
        navigation.navigate('PropertyDetailScreen', { property: item })
      }
      activeOpacity={0.95}
    >
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.propertyImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Icon name="home" size={32} color="#9CA3AF" />
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <View style={styles.imageOverlay} />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>${item.price}</Text>
        </View>
      </View>

      <View style={styles.propertyInfo}>
        <View style={{ width: '60%' }}>
          <Text style={styles.propertyTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.locationContainer}>
            <Icon name="place" size={18} color="#A4303F" />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemove(item.id)}
          >
            <Icon name="delete-outline" size={25} color="#A4303F" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Icon name="favorite-border" size={64} color="#A4303F" />
      <Text style={styles.emptyStateTitle}>No Saved Properties</Text>
      <Text style={styles.emptyStateSubtitle}>
        Start browsing properties and add them to your shortlist to see them
        here.
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('SearchScreen')}
      >
        <Text style={styles.browseButtonText}>Browse Properties</Text>
        <Icon name="arrow-forward" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A4303F" />
        <Text style={styles.loadingText}>Loading your shortlist...</Text>
      </View>
    );
  }

  if (!UID) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Icon name="account-circle" size={64} color="#A4303F" />
          <Text style={styles.emptyStateTitle}>Login Required</Text>
          <Text style={styles.emptyStateSubtitle}>
            Please log in to view and manage your shortlisted properties.
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('SignInScreen')}
          >
            <Text style={styles.browseButtonText}>Login</Text>
            <Icon name="login" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.subHeaderContainer}>
        <Text style={styles.subHeaderSubtitle}>
          {shortlistedProperties.length}{' '}
          {shortlistedProperties.length === 1 ? 'property' : 'properties'} saved
        </Text>
      </View>

      <FlatList
        data={shortlistedProperties}
        keyExtractor={(item) => item.id}
        renderItem={PropertyItem}
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
  subHeaderContainer: {
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  subHeaderTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    color: '#1F2937',
  },
  subHeaderSubtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_500Medium',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  separator: {
    height: 16,
  },
  propertyCard: {
    backgroundColor: '#EAF4F4',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#A4C3B2',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
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
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
    marginTop: 4,
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
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(164, 48, 63, 1)',
  },
  propertyInfo: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  propertyTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 26,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Nunito_500Medium',
    flex: 1,
    marginLeft: 6,
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Nunito_500Medium',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(164, 48, 63, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A4303F',
    alignSelf: 'flex-start',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    fontFamily: 'Nunito_500Medium',
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A4303F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default ShortlistScreen;
