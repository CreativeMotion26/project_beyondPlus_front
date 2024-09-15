import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const Post = ({ route }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const newPost = {
      id: Date.now(),
      title: title, // This could be dynamic if you want users to add a title
      user: 'User', // This could be replaced by actual user data
      review: text,
      likes: 0,
      rating: 0, // Initially 0 or you can allow the user to add a rating
      image: image,
    };

    try {
      const response = await fetch('http://localhost:3000/posts/contents', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ newPost}) // Adjust according to your server's requirements
        });
      const data = await response.text();
      // const header = await response.headers();
      // const data = await response.json();
      // console.log(header);
      if (response.ok) {
        Alert.alert('Verification Success', 'You have been successfully logged in!');
        route.params.addPost(newPost);
        navigation.navigate('Review');
      } else {
        // Alert.alert('Verification Error', data.message || 'Invalid verification code, please try again.');
        Alert.alert('Invalid verification code, please try again.');

      }
    } catch (error) {
      console.error('Error verifying code:', error);
      Alert.alert('Error', 'Failed to connect to the server');
    }
   
    
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Write your review..."
        value={text}
        onChangeText={setText}
        multiline
      />
      <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>Pick an Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Post" onPress={handleSubmit} />
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    height: 150,
    textAlignVertical: 'top',
  },
  imagePicker: {
    backgroundColor: '#7B68EE',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default Post;
