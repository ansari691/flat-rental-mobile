import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { requestService } from '../../services/requestService';
import { userAuthentication } from '../../config/userAuthentication';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MyRequestsScreen = ({ navigation }: any) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = userAuthentication();

  const getMyRequests = async () => {
    setLoading(true);

    try {
      const reqList = await requestService.getTenantRequests();
      setRequests(reqList);
    } catch (error) {
      console.error('Error fetching your requests:', error);
      Alert.alert('Error', 'Could not load your rental requests.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user?._id) {
        getMyRequests();
      }
    }, [user?._id])
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return '#88AB75';
      case 'denied':
        return '#A4303F';
      case 'pending':
      default:
        return '#F59E0B';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'check-circle';
      case 'denied':
        return 'cancel';
      case 'pending':
      default:
        return 'schedule';
    }
  };

  const RequestItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PropertyDetailScreen', { propertyId: item.propertyId._id })} style={styles.requestCard} activeOpacity={0.95}>
      <View style={styles.cardHeader}>
        <View style={styles.propertyTitleContainer}>
          <Icon name="home" size={20} color="#A4303F" />
          <Text style={styles.propertyTitle} numberOfLines={2}>
            {item.propertyId.title || 'Unknown Property'}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Icon name={getStatusIcon(item.status)} size={16} color="#FFFFFF" />
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        {/* <View style={styles.detailRow}>
          <Icon name="phone" size={18} color="#6B7280" />
          <Text style={styles.detailText}>{item.tenantPhone}</Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="email" size={18} color="#6B7280" />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.tenantEmail}
          </Text>
        </View> */}

        <View style={styles.messageContainer}>
          <Icon name="message" size={18} color="#6B7280" />
          <Text style={styles.messageText} numberOfLines={3}>
            {item.message}
          </Text>
        </View>

        {item.createdAt && (
          <View style={styles.dateContainer}>
            <Icon name="schedule" size={16} color="#9CA3AF" />
            <Text style={styles.dateText}>
              Sent on{' '}
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Icon name="inbox" size={64} color="#A4303F" />
      <Text style={styles.emptyStateTitle}>No Requests Yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        You haven't submitted any rental requests yet. Browse properties and
        send your first request!
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A4303F" />
        <Text style={styles.loadingText}>Loading your requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.requestCount}>
          {requests.length} request{requests.length !== 1 ? 's' : ''} submitted
        </Text>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={RequestItem}
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default MyRequestsScreen;

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
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  requestCount: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Nunito_500Medium',
    padding: 5,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  separator: {
    height: 16,
  },
  requestCard: {
    backgroundColor: '#EAF4F4',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#A4C3B2',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 12,
  },
  propertyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  propertyTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
    lineHeight: 24,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Nunito_500Medium',
    marginLeft: 12,
    flex: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  messageText: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Nunito_500Medium',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Nunito_500Medium',
    marginLeft: 8,
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
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Nunito_500Medium',
  },
});
