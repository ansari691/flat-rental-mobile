import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signUp } from '../../config/userAuthentication';
import styles from '../../styles/AppStyles';

const SignUpScreen: React.FC<NativeStackScreenProps<any>> = ({
  navigation,
}) => {
  const userRole = ['landlord', 'tenant'];
  const [userObject, setUserObject] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'tenant',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    error: '',
  });

  async function onSignUp() {
    const { email, password, confirmPassword, role, firstName, lastName, phoneNumber } = userObject;

    if (!email || !password || !confirmPassword || !firstName || !lastName || !phoneNumber) {
      setUserObject({
        ...userObject,
        error: '* Please fill out all mandatory fields.',
      });
      return;
    }

    if (password !== confirmPassword) {
      setUserObject({ ...userObject, error: '* Passwords do not match.' });
      return;
    }

    try {
      await signUp({
        email,
        password,
        userType: role,
        firstName,
        lastName,
        phoneNumber,
      });
    } catch (err: any) {
      console.log(err);
      setUserObject({ ...userObject, error: err.message });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Welcome to RentHub</Text>
      <Text style={styles.subtitle}>Create a new account</Text>

      <TextInput
        style={styles.inputStyle}
        value={userObject.firstName}
        onChangeText={(text) => setUserObject({ ...userObject, firstName: text })}
        placeholder="First Name"
        placeholderTextColor="#8395a7"
        autoCorrect={false}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.inputStyle}
        value={userObject.lastName}
        onChangeText={(text) => setUserObject({ ...userObject, lastName: text })}
        placeholder="Last Name"
        placeholderTextColor="#8395a7"
        autoCorrect={false}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.inputStyle}
        value={userObject.email}
        onChangeText={(text) => setUserObject({ ...userObject, email: text })}
        placeholder="Your email"
        placeholderTextColor="#8395a7"
        keyboardType="email-address"
        autoCorrect={false}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.inputStyle}
        value={userObject.phoneNumber}
        onChangeText={(text) => setUserObject({ ...userObject, phoneNumber: text })}
        placeholder="Phone Number"
        placeholderTextColor="#8395a7"
        keyboardType="phone-pad"
        autoCorrect={false}
      />

      <TextInput
        style={styles.inputStyle}
        value={userObject.password}
        onChangeText={(text) =>
          setUserObject({ ...userObject, password: text })
        }
        placeholder="Password"
        placeholderTextColor="#8395a7"
        secureTextEntry={true}
        keyboardType="default"
        maxLength={12}
        autoCorrect={false}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.inputStyle}
        value={userObject.confirmPassword}
        onChangeText={(text) =>
          setUserObject({ ...userObject, confirmPassword: text })
        }
        placeholder="Confirm Password"
        placeholderTextColor="#8395a7"
        secureTextEntry={true}
        keyboardType="default"
        maxLength={12}
        autoCorrect={false}
        autoCapitalize="none"
      />

      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Select Role:</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 16,
            marginTop: 8,
          }}
        >
          {userRole.map((role, index) => (
            <TouchableOpacity
              key={index}
              style={styles.radioItem}
              onPress={() => setUserObject({ ...userObject, role })}
            >
              <View style={styles.radioCircle}>
                {userObject.role === role && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {!!userObject.error && (
        <Text style={styles.errorText}>{userObject.error}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={onSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.altAuthOption}
        onPress={() => navigation.navigate('SignInScreen')}
      >
        <Text style={[styles.buttonText, { textDecorationLine: 'underline' }]}>
          Already have an account? Sign in
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;
