import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Modal, TextInput, TouchableWithoutFeedback, Keyboard, Button, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


const Resume = () => {
  const navigation = useNavigation();

  const handleAccount = () => {
    navigation.navigate('Account');
  };


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [events, setEvents] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({ section: '', title: '', details: '' });
  const [activeSection, setActiveSection] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState({});

  const handleAddPress = (section) => {
    setModalVisible(true);
    setNewEvent({ section, title: '', details: '' });
  };


  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setDetailModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setDetailModalVisible(false);
  };

  // const handleAddEvent = async () => {
  //   if (newEvent.title && newEvent.details) {
  //     const newEventObj = {
  //       title: newEvent.title,
  //       details: newEvent.details,
  //     };

  //     try {
  //       const response = await fetch('http://localhost:3000/api/events', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(newEventObj),
  //       });

  //       if (response.ok) {
  //         const updatedEvents = { ...events };
  //         const sectionEvents = events[newEvent.section] || [];
  //         updatedEvents[newEvent.section] = [...sectionEvents, newEventObj];
  //         setEvents(updatedEvents);
  //         setActiveSection(newEvent.section);
  //         setModalVisible(false);
  //         setNewEvent({ section: '', title: '', details: '' });
  //       } else {
  //         Alert.alert('Error', 'Failed to add event. Please try again.');
  //       }
  //     } catch (error) {
  //       Alert.alert('Error', 'Something went wrong. Please try again.');
  //     }
  //   } else {
  //     Alert.alert('Error', 'Please fill in all fields.');
  //   }
  // };

  const handleAddEvent = () => {
    if (newEvent.title.trim() && newEvent.details.trim()) { // 여백만 있는 문자열 제외
      const sectionEvents = events[newEvent.section] || [];
      const updatedEvents = {
        ...events,
        [newEvent.section]: [...sectionEvents, newEvent]
      };
      setEvents(updatedEvents);
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Please fill in all fields.');
    }
  };
  
  const handleDeleteEvent = (section, index) => {
    const updatedSectionEvents = [...events[section]];
    updatedSectionEvents.splice(index, 1);
    setEvents({
      ...events,
      [section]: updatedSectionEvents
    });
  };
  const saveUserInfo = () => {
    console.log("Saving user info:", { name, email, mobile });
  };


  const sections = ['Introduction', 'Academic History', 'Work History', 'Skills', 'Extra Curriculum', 'Certificates'];
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2b189e', '#5d4add', '#a38ef9']}
        style={styles.header}
      >
        <Text style={styles.headerText}>BEYOND⁺</Text>
        <Text style={styles.headerCenterText}>Resume</Text>
        <TouchableOpacity style={styles.navItem} onPress={handleAccount}>
          <Ionicons name="person" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Modal 부분 */}
      <TouchableWithoutFeedback>
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Resume details</Text>
            <TextInput
              placeholder="Title"
              value={newEvent.title}
              onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
              style={styles.titleInput}
            />

            <TextInput
              placeholder="Details"
              value={newEvent.location}
              onChangeText={(text) => setNewEvent({ ...newEvent, details: text })}
              multiline={true}
              numberOfLines={5}  // 예를 들어 5줄의 높이를 가지도록 설정
              returnKeyType="default"
              style={styles.detailInput}
            />
            <View style={styles.buttonContainer}>
              <Button title="Save" onPress={handleAddEvent} />
              <Button title="Cancel" onPress={handleCloseModal} color="red" />
            </View>
          </View>
        </View>
      </Modal>
      </TouchableWithoutFeedback>

      <Modal
        visible={isDetailModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
            <Text style={styles.modalText}>{selectedEvent.details}</Text>
            <Button title="Close" onPress={handleCloseModal} />
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoSection}>
          <TextInput
            style={[styles.infoTextName, { fontSize: 20, marginBottom: 5 }]}
            onChangeText={setName}
            value={name}
            placeholder="Name"
            returnKeyType="done"
            onBlur={saveUserInfo}
          />
          <View style={styles.line}></View>
          <TextInput
            style={styles.infoInput}
            onChangeText={setEmail}
            value={email}
            placeholder="example@email.com"
            keyboardType="email-address"
            returnKeyType="done"
            onBlur={saveUserInfo}
          />
          <TextInput
            style={styles.infoInput}
            onChangeText={setMobile}
            value={mobile}
            placeholder="04xx xxx xxx"
            keyboardType="phone-pad"
            onBlur={saveUserInfo}
          />
        </View>
        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => setActiveSection(activeSection === section ? null : section)}>
              <Text style={styles.sectionTitle}>{section}</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => handleAddPress(section)}>
                <Ionicons name="add-circle-outline" size={25} color="#5d4add" />
              </TouchableOpacity>
            </TouchableOpacity>
            {activeSection === section && events[section] && (
              <View style={styles.eventList}>
                {events[section].map((event, idx) => (
                  <TouchableOpacity key={idx} onPress={() => handleEventClick(event)} style={styles.eventItem}>
                    <Text style={styles.eventText}>{event.title}</Text>
                    <TouchableOpacity onPress={() => handleDeleteEvent(section, idx)} style={styles.deleteButton}>
                      <Ionicons name="remove-circle-outline" size={25}/>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: '12%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerCenterText: {
    marginLeft: -28,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',

  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  infoSection: {
    paddingVertical: 30,
    paddingHorizontal: 15,
    marginBottom: 20,
    marginTop: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    width: '100%', // 필요한 경우에 따라 조정
    padding: 10,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    alignItems: 'center', // 내부 텍스트를 중앙 정렬
  },

  infoTextName: {
    fontSize: 20,
    marginBottom: 5,
  },

  infoInput: {
    fontSize: 15,
    height: 20,
    marginVertical: 0,
  },
  section: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 10,

  },
  line: {
    marginBottom: 3,
    width: '75%', // 선의 길이를 텍스트 길이의 50%로 조정
    height: 2,
    backgroundColor: 'grey',
  },
  headerContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 110,
    backgroundColor: '#7B68EE',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#7B68EE',
    flexDirection: 'row',
  },
  close: {
    marginTop: -45,
    marginLeft: 270,

  },
  modalText: {
    fontSize: 16,
    marginVertical: 10,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  detailInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    height: 250,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },

  eventList: {
    marginTop: 10,
  },
  eventText: {
    fontSize: 16,
    paddingLeft: 10,
    // fontWeight: 'bold',
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#efecff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  
  deleteButton: {
    padding: 10,
    marginRight : 0,
   
  },
});

export default Resume;
