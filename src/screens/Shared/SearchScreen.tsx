import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { propertyService } from '../../services/propertyService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchScreen: React.FC<NativeStackScreenProps<any>> = ({
  navigation,
}) => {
  const [searchText, setSearchText] = useState('');
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const properties = await propertyService.searchProperties({});
        setAllProperties(properties);
        setFilteredProperties(properties);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = allProperties.filter(
      (p) =>
        p.title?.toLowerCase().includes(text.toLowerCase()) ||
        p.address?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProperties(filtered);
  };

  const clearSearch = () => {
    setSearchText('');
    setFilteredProperties(allProperties);
  };

  const renderProperty = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.propertyCard}
      onPress={() =>
        navigation.navigate('PropertyDetailScreen', { propertyId: item._id })
      }
      activeOpacity={0.95}
    >
      <View style={styles.imageContainer}>
        {item.images[0] ? (
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
        <Text style={styles.propertyTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.locationContainer}>
          <Icon name="place" size={25} color="#A4303F" />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Icon name="home" size={25} color="#A4303F" />
      <Text style={styles.emptyStateTitle}>No Properties Found</Text>
      <Text style={styles.emptyStateSubtitle}>
        Try adjusting your search criteria or browse all available properties.
      </Text>
      {searchText.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
          <Text style={styles.clearButtonText}>Clear Search</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A4303F" />
        <Text style={styles.loadingText}>Loading property list...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.numberAvailable}>
          {filteredProperties.length} properties available
        </Text>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={25} color="#1F2937" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title or location..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={handleSearch}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={clearSearch}
              style={styles.clearIconContainer}
            >
              <Icon name="clear" size={30} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item._id}
        renderItem={renderProperty}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default SearchScreen;

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
  numberAvailable: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Nunito_500Medium',
    marginBottom: 5,
    padding: 5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 52,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Nunito_500Medium',
  },
  clearIconContainer: {
    padding: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
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
    padding: 20,
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
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  clearButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});
