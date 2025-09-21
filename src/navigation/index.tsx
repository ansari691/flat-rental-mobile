import React, { useEffect, useState } from "react";
import LandlordStack from "./LandlordStack";
import TenantStack from "./TenantStack";
import WelcomeStack from "./WelcomeStack";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#10ac84" />
  </View>
);

const RootNavigation = () => {
  const { user, loadUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadUser();
        if(!user) {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (loading) return <LoadingScreen />;
  if (!user) return <WelcomeStack />;
  
  return user.userType === "landlord" ? <LandlordStack /> : <TenantStack />;
};

export default RootNavigation;
