import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const SignIn = ({ navigation }) => {
  return (
    <LinearGradient colors={['rgba(43,24,158,1)', 'rgba(93,74,221,1)', 'rgba(163,142,249,1)']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Student Email"
          placeholderTextColor="#fff"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#fff"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Name of University"
          placeholderTextColor="#fff"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Degree"
          placeholderTextColor="#fff"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Major"
          placeholderTextColor="#fff"
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-google" size={24} color="#f0f0f0" />
          <Text style={styles.socialButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-apple" size={24} color="#000" />
          <Text style={styles.socialButtonText}>Sign in with Apple</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signUpText}>Go to Login</Text>
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
    marginBottom: 30,
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 110,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#A4508B',
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '48%',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: 14,
    color: '#A4508B',
    marginLeft: 10,
  },
  signUpText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 20,
  },
});

export default SignIn;
