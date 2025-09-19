import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";

const Stack = createNativeStackNavigator();

const WelcomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="SignInScreen" screenOptions={{headerShown: false}}>
      <Stack.Screen component={SignInScreen} name="SignInScreen"/>
      <Stack.Screen component={SignUpScreen} name="SignUpScreen" />
    </Stack.Navigator>
  );
};

export default WelcomeStack;
