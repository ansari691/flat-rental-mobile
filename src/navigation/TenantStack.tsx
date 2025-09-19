import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import PropertyDetailScreen from "../screens/Shared/PropertyDetailScreen";
import TenantHomeScreen from "../screens/Tenant/TenantHomeScreen";
import ShortlistScreen from "../screens/Tenant/ShortListScreen";
import SearchScreen from "../screens/Shared/SearchScreen";
import RequestScreen from "../screens/Tenant/RequestScreen";
import { TouchableOpacity, Text } from "react-native";
import { authService } from "../services/authService";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

const TenantStack = () => {
  const { handleSignOut } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#EAF4F4",
        },

        headerTintColor: "black",
        headerTitleStyle: {
          fontFamily: "Nunito_700Bold",
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={handleSignOut}
            style={{ flexDirection: "row", padding: 15 }}
          >
            <Text
              style={{
                fontFamily: "Nunito_600SemiBold",
                fontSize: 14,
                paddingRight: 8,
              }}
            >
              Logout
            </Text>
            <Icon name="logout" size={25} color="black" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="TenantHome"
        component={TenantHomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PropertyDetailScreen"
        component={PropertyDetailScreen}
        options={{ title: "Property Details" }}
      />
      <Stack.Screen
        name="ShortlistScreen"
        component={ShortlistScreen}
        options={{ title: "Shortlisted Properties" }}
      />

      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ title: "Search Properties" }}
      />
      <Stack.Screen
        name="RequestScreen"
        component={RequestScreen}
        options={{ title: "Send Request" }}
      />
    </Stack.Navigator>
  );
};

export default TenantStack;
