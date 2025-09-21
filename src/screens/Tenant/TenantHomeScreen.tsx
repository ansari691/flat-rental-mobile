import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchScreen from '../Shared/SearchScreen';
import MapScreen from './MapScreen';
import ShortlistScreen from './ShortListScreen';
import MyRequestsScreen from './MyRequestsScreen';
import { TouchableOpacity, Text } from 'react-native';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const Tab = createBottomTabNavigator();

const TenantHomeScreen = () => {
  const { handleSignOut } = useAuth();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#0D1B2A',
        tabBarInactiveTintColor: '#E0E1DD',
        headerStyle: {
          backgroundColor: '#EAF4F4',
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={handleSignOut}
            style={{ flexDirection: 'row', padding: 15 }}
          >
            <Text
              style={{
                fontFamily: 'Nunito_600SemiBold',
                fontSize: 14,
                paddingRight: 8,
              }}
            >
              Logout
            </Text>
            <Icon name="logout" size={25} color="black" />
          </TouchableOpacity>
        ),
        headerTintColor: 'black',
        headerTitleStyle: {
          fontFamily: 'Nunito_700Bold',
        },
      }}
    >
      <Tab.Screen
        name="Search Properties"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" size={size} color={color} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Map Screen"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="map" size={size} color={color} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Shortlist"
        component={ShortlistScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="favorite" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="My Requests"
        component={MyRequestsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="send" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TenantHomeScreen;
