import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signIn } from '../../config/userAuthentication';
import styles from '../../styles/AppStyles';
import { useAuth } from '../../context/AuthContext';

const SignInScreen: React.FC<NativeStackScreenProps<any>> = ({
  navigation,
}) => {
  const { setUser } = useAuth();
  const [userObject, setUserObject] = useState({
    email: '',
    password: '',
    error: '',
  });

  async function onSignIn() {
    const { email, password } = userObject;

    if (!email || !password) {
      setUserObject({
        ...userObject,
        error: 'Email and Password are required!',
      });
      return;
    }

    try {
      const data = await signIn(email, password);
      setUser(data.user);
    } catch (err: any) {
      console.log(err);
      setUserObject({ ...userObject, error: err.message });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Welcome to RentHub</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

      <TextInput
        style={styles.inputStyle}
        value={userObject.email}
        onChangeText={(text) => setUserObject({ ...userObject, email: text })}
        placeholder="Enter email (e.g: name@gmail.com)"
        placeholderTextColor="#8395a7"
        keyboardType="email-address"
        autoCorrect={false}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.inputStyle}
        value={userObject.password}
        onChangeText={(text) =>
          setUserObject({ ...userObject, password: text })
        }
        placeholder="Enter password"
        placeholderTextColor="#8395a7"
        secureTextEntry={true}
        keyboardType="default"
        maxLength={12}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {!!userObject.error && (
        <Text style={styles.errorText}>{userObject.error}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={onSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.altAuthOption}
        onPress={() => navigation.navigate('SignUpScreen')}
      >
        <Text style={[styles.buttonText, { textDecorationLine: 'underline' }]}>
          Don't have an account? Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInScreen;
