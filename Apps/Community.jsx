import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const initialReviews = [
{
    id: 1,
    title: 'Beyond+',
    user: 'User',
    review: 'Beyond+ is a React Native application designed to manage and review class schedules, user activities, and settings. It provides a user-friendly interface for selecting times, viewing timetables, and managing user accounts. This project is optimized for efficiency and maintainability, ensuring a smooth user experience.',
    likes: 0,
    rating: 5.0,
    image: '',
    },
{
    id: 3,
    title: 'Design Thinking',
    user: 'Steven',
    review: 'Great class! Highly recommended.',
    likes: 18,
    rating: 4.8,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    title: 'Machine Learning',
    user: 'Charlie',
    review: 'Very informative but challenging.',
    likes: 12,
    rating: 4.5,
    image: 'https://via.placeholder.com/150', 
  },

];

const Community = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();


  const handlePost = () => {
    navigation.navigate('Post', {
      addPost: addPost,
    });
  };

  const addPost = (newPost) => {
    setReviews([newPost, ...reviews]);
    
  };

  const handleViewDetails = (post) => {
    navigation.navigate('PostDetails', { post });
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredReviews = reviews.filter(review => 
    review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#2b189e', '#5d4add', '#a38ef9']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <Text style={styles.headerText}>BEYOND⁺</Text>
            <View style={styles.headerTop}>
            <Ionicons name="notifications-outline" size={24} color="white" />
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
              <Ionicons name="person" size={24} color="white" />
            </TouchableOpacity>
            </View>
          </View>
          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            placeholderTextColor="#ccc"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <Text style={styles.headerText}></Text>
        </LinearGradient>
        
        <View style={styles.body}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.tabs}>
            <TouchableOpacity style={styles.tabItem}>
              <Text style={styles.tabText}>New</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem}>
              <Text style={styles.tabText}>Popular</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem}>
              <Text style={styles.tabText}>Trending</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem}>
              <Text style={styles.tabText}>Reviews</Text>
            </TouchableOpacity>
          </View>
          
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <TouchableOpacity key={review.id} onPress={() => handleViewDetails(review)}>
                  <View style={styles.reviewCard}>
                    <View style={styles.reviewContent}>
                      <View style={styles.reviewHead}>
                        <Image source={{ uri: review.image || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
                        <Text style={styles.reviewUser}> {review.user}</Text>
                        <Text style={styles.reviewDate}>{handlePost.date} {handlePost.time}</Text>
                      </View>
                      <Text style={styles.reviewTitle}>{review.title}</Text>
                      {review.image && (
                        <Image source={{ uri: review.image }} style={styles.reviewImage} />
                      )}
                      <Text style={styles.reviewText}>{review.review}</Text>
                      <View style={styles.reviewFooter}>
                        <View style={styles.rating}>
                          <Ionicons name="star" size={14} color="gold" />
                          <Text style={styles.ratingText}>{review.rating}</Text>
                        </View>
                        <View style={styles.icons}>
                          <Ionicons name="heart-outline" size={24} color="grey" style={styles.icon} />
                        </View>
                        <View style={styles.commentSection}>
                            <Ionicons name='chatbubble-outline' size={24} color="grey"/> 
                            <Text style={styles.commentCount}>0 Comments</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noResultsText}>No reviews yet.</Text>
            )}
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.fab} onPress={handlePost}>
          <Ionicons name="share" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Main')}>
            <Ionicons name="calendar" size={24} color="white" />
            <Text style={styles.navText}>Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Community')}>
            <Ionicons name="search" size={24} color="white" />
            <Text style={styles.navText}>Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Review')}>
            <Ionicons name="chatbubble" size={24} color="white" />
            <Text style={styles.navText}>Review</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Post')}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    paddingTop: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    top: 11,
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchBar: {
    backgroundColor: 'white',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    width: '90%',
    alignSelf: 'center',
    color: 'black',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  tabItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#7B68EE',
    borderRadius: 20,
  },
  tabText: {
    color: 'white',
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -25,
    paddingTop: 20,
  },
  content: {
    padding: 16,
  },
  reviewCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  reviewHead: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  reviewImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 18,
  },
  reviewContent: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reviewUser: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7B68EE',
    marginTop: 5,
  },
  reviewDate: {
    fontSize: 14,
    color: 'grey',
    marginTop: 30,
    marginLeft: -45,
  },
  reviewText: {
    fontSize: 18,
    marginBottom: 12,
    color: 'grey',
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  commentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  commentCount: {
    marginleft: 6,
    paddingLeft: 4,
    fontSize: 12,
    color: 'grey',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 16,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
    color: 'grey',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    backgroundColor: '#7B68EE',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#9986FF',
    borderRadius: 30,
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 20,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    color: 'white',
    fontSize: 12,
  },
});

export default Community;
