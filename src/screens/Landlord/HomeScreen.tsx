import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import MyPropertiesScreen from "./MyPropertiesScreen";
import ViewRequestsScreen from "./ViewRequestsScreen";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const { handleSignOut } = useAuth();
  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <Tab.Navigator
          screenOptions={{
            headerShown: true,
            tabBarActiveTintColor: "#0D1B2A",
            tabBarInactiveTintColor: "#E0E1DD",
            headerStyle: {
              backgroundColor: "#EAF4F4",
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
            headerTintColor: "black",
            headerTitleStyle: {
              fontFamily: "Nunito_700Bold",
            },
          }}
        >
          <Tab.Screen
            name="MyPropertiesTab"
            component={MyPropertiesScreen}
            options={{
              title: "My Properties",
              tabBarIcon: ({ color, size }) => (
                <Icon name="home" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="RequestsTab"
            component={ViewRequestsScreen}
            options={{
              title: "Requests",
              tabBarIcon: ({ color, size }) => (
                <Icon name="inbox" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  tabsContainer: {
    flex: 1,
  },
});
