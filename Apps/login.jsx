import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore for token storage

const Login = () => {
  const navigation = useNavigation();
  const [emailPrefix, setEmailPrefix] = useState('');
  const [code, setCode] = useState(new Array(6).fill(''));
  const [codeSent, setCodeSent] = useState(false);
  const inputs = useRef([]);

  const sendVerificationCode = async () => {
    if (emailPrefix) {
      const email = `${emailPrefix}@student.uts.edu.au`;
      try {
        const response = await fetch('http://localhost:3000/login/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });

        const responseText = await response.text();
        try {
          const data = JSON.parse(responseText);
          if (response.ok) {
            setCodeSent(true);
            Alert.alert('Verification', 'A verification code has been sent to your email.');
          } else {
            Alert.alert('Error', data.message || 'Failed to send verification code');
          }
        } catch (jsonError) {
          console.error('Failed to parse JSON from response:', responseText);
          Alert.alert('Error', 'Server response was not in JSON format');
        }
      } catch (error) {
        console.error('Error sending verification code:', error);
        Alert.alert('Error', 'Failed to connect to the server');
      }
    } else {
      Alert.alert('Invalid Email', 'Please enter your student ID before the domain.');
    }
  };

  const verifyCode = async () => {
    const email = `${emailPrefix}@student.uts.edu.au`;
    const verificationCode = code.join('');
    const password = "1234";
    console.log(verificationCode);
    try {
      const response = await fetch('http://localhost:3000/login/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, verificationCode, password })
      });
      const data = await response.text();

      if (response.ok) {
        const token = response.headers.get('authorization').split(' ')[1];

        // Store token securely using SecureStore
        await SecureStore.setItemAsync('access_token', token);

        Alert.alert('Verification Success', 'You have been successfully logged in!');
        navigation.navigate('Main');
      } else {
        Alert.alert('Invalid verification code, please try again.');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      Alert.alert('Error', 'Failed to connect to the server');
    }
  };

  const focusNext = (index, value) => {
    setCode(code.map((c, i) => (i === index ? value : c)));
    if (index < 5 && value) {
      inputs.current[index + 1].focus();
    }
  };

  const main = () => {
    navigation.navigate('Main');
  };

  const goBackToEmailInput = () => {
    setCodeSent(false); // Reset the state to show the email input screen again
    setCode(new Array(6).fill('')); // Clear the code input field
  };

  return (
    <LinearGradient
      colors={['#2b189e', '#5d4add', '#a38ef9']}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
      </View>

      {!codeSent ? (
        <View style={styles.inputContainer}>
          <View style={styles.emailInputContainer}>
            <TextInput
              placeholder="Student ID"
              value={emailPrefix}
              onChangeText={setEmailPrefix}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.domainText}>@student.uts.edu.au</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={sendVerificationCode}>
            <Text style={styles.buttonText}>Send Verification Code</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
        <TouchableOpacity style={styles.button} onPress={goBackToEmailInput}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
          <View style={styles.codeContainer}>
            {code.map((_, index) => (
              <TextInput
                key={index}
                ref={(ref) => inputs.current[index] = ref}
                style={styles.codeInput}
                maxLength={1}
                keyboardType="numeric"
                onChangeText={(text) => focusNext(index, text)}
                value={code[index]}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={verifyCode}>
            <Text style={styles.buttonText}>Verify Code</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={goBackToEmailInput}>
        <Text style={styles.buttonText}>Test login</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 110,
  },
  inputContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 8,
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    backgroundColor: 'white',
  },
  domainText: {
    fontSize: 16,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  codeInput: {
    width: 40,
    height: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: 24,
    marginRight: 6,
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#7B68EE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default Login;
