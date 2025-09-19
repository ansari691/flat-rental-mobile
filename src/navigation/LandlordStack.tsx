import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import EditPropertyScreen from "../screens/Landlord/EditPropertyScreen";
import HomeScreen from "../screens/Landlord/HomeScreen";
import ListPropertyScreen from "../screens/Landlord/ListPropertyScreen";
import SearchScreen from "../screens/Shared/SearchScreen";
import PropertyDetailScreen from "../screens/Shared/PropertyDetailScreen";
import { TouchableOpacity, Text } from "react-native";
import { authService } from "../services/authService";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

const LandlordStack = () => {
  const { handleSignOut } = useAuth();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
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
        name="LandlordHome"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ListProperty"
        component={ListPropertyScreen}
        options={{ title: "List Property" }}
      />
      <Stack.Screen
        name="EditProperty"
        component={EditPropertyScreen}
        options={{ title: "Edit Property" }}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ title: "Search Properties" }}
      />

      <Stack.Screen
        name="PropertyDetailScreen"
        component={PropertyDetailScreen}
        options={{ title: "Details" }}
      />
    </Stack.Navigator>
  );
};

export default LandlordStack;
