import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';

const PostDetails = ({ route }) => {
  const { post } = route.params;
  const navigation = useNavigation();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: comments.length + 1,
        text: commentText.trim(),
        user: 'Current User',  // Replace with the current user's name
        profileImage: 'https://via.placeholder.com/50',  // Replace with the current user's profile image
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      };
      setComments([...comments, newComment]);
      setCommentText('');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#2b189e', '#5d4add', '#a38ef9']} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerText}>BEYOND⁺</Text>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.profileHead}>
          <Image source={{ uri: post.image || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
          <Text style={styles.user}>By: {post.user}</Text>
        </View>
        <Text style={styles.title}>{post.title}</Text>

        {post.image && (
          <Image source={{ uri: post.image }} style={styles.image} />
        )}
        <Text style={styles.review}>{post.review}</Text>

        <View style={styles.footer}>
          <View style={styles.rating}>
            <Ionicons name="star" size={18} color="gold" />
            <Text style={styles.ratingText}>{post.rating}</Text>
          </View>
          <View style={styles.icons}>
            <Ionicons name="heart-outline" size={24} color="grey" style={styles.icon} />
            <Ionicons name="share-outline" size={24} color="grey" style={styles.icon} />
          </View>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsHeader}>Comments</Text>
          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity onPress={handleAddComment}>
              <Ionicons name="send" size={24} color="#7B68EE" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Image source={{ uri: item.profileImage }} style={styles.commentProfileImage} />
                <View style={styles.commentContent}>
                  <Text style={styles.commentUser}>{item.user}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                  <Text style={styles.commentDate}>{item.date} {item.time}</Text>
                </View>
              </View>
            )}
          />
          
        </View>
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingTop: 10,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    top: 40,
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginBottom: 20,
    padding: 20,
  },
  content: {
    padding: 20,
  },
  profileHead: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  user: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7B68EE',
    marginTop: 5,
  },
  review: {
    fontSize: 16,
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 18,
    marginLeft: 4,
  },
  icons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
  },
  commentsSection: {
    marginTop: 20,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  commentProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 16,
    marginBottom: 4,
  },
  commentDate: {
    fontSize: 12,
    color: 'grey',
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
});

export default PostDetails;
