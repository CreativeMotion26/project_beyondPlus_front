import React, { useState, useEffect, useReducer } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal, TextInput, TouchableWithoutFeedback, Keyboard, Button, FlatList,ScrollView } from 'react-native';
import TimeTableView, { genTimeBlock } from 'react-native-timetable';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { differenceInWeeks, format } from 'date-fns';
import { ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment-timezone';


const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const initialState = {
  currentDate: moment.tz('Australia/Sydney').toDate(),
  currentWeek: 1,
  isDatePickerVisible: false,
  isMonthPickerVisible: false,
  isModalVisible: false,
  // selectedMonth: 'August',
  selectedMonth: moment().tz('Australia/Sydney').format('MMMM'),
  
  events: [
    {
      title: '',
      day: '',
      startTime: '',
      endTime: '',
      location: '',
      extra_descriptions: ["Kim", "Lee"],
      color: "#e1bee7",
    },
  ],
  newEvent: {
    title: '',
    day: '',
    startTime: '',
    endTime: '',
    location: '',
  },
  selectedDay: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_DATE':
      return { ...state, currentDate: action.payload };
    case 'SET_WEEK':
      return { ...state, currentWeek: action.payload };
    case 'TOGGLE_DATE_PICKER':
      return { ...state, isDatePickerVisible: !state.isDatePickerVisible };
    case 'TOGGLE_MONTH_PICKER':
      return { ...state, isMonthPickerVisible: !state.isMonthPickerVisible };
    case 'SET_MONTH':
      return { ...state, selectedMonth: action.payload };
    case 'TOGGLE_MODAL':
      return { ...state, isModalVisible: !state.isModalVisible };
    case 'SET_NEW_EVENT':
      return { ...state, newEvent: { ...state.newEvent, ...action.payload } };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload], isModalVisible: false, newEvent: initialState.newEvent };
    case 'SET_SELECTED_DAY':
      return { ...state, selectedDay: action.payload };
    default:
      return state;
  }
}

const getSydneyDate = (date) => {
  const sydneyDate = moment(date).tz('Australia/Sydney').toDate();
  return sydneyDate;
};

const calculateCurrentWeek = (startDate, currentDate) => {
  const weeks = Math.ceil(differenceInWeeks(currentDate, startDate) + 1);
  return weeks;
};

const CustomHeader = ({ currentDate, selectedDay, onDayPress }) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const datesOfWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - date.getDay() + i + 1);
    return date;
  });

  return (
    <View style={styles.customHeaderContainer}>
      {daysOfWeek.map((day, index) => {
        const date = datesOfWeek[index];
        const isToday = date.toDateString() === getSydneyDate(new Date()).toDateString();
        const isSelected = selectedDay && date.toDateString() === selectedDay.toDateString();
        return (
          <TouchableOpacity key={index} style={styles.dayContainer} onPress={() => onDayPress(date)}>
            <Text style={[styles.dayText, isToday && styles.todayText, isSelected && styles.selectedDayText]}>{day}</Text>
            <Text style={[styles.dateText, isToday && styles.todayDateText, isSelected && styles.selectedDateText]}>{date.getDate()}</Text>
            {isToday && <View style={styles.todayIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const ScheduleScreen = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentDate, currentWeek, isDatePickerVisible, isMonthPickerVisible, isModalVisible, selectedMonth, events, setEvents, newEvent } = state;
  const [isEventModalVisible, setEventModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState([]);
  
  const navigation = useNavigation();
  const semesterStartDate = getSydneyDate(new Date('2024-07-01'));
  const totalWeeks = 12;
  const [selectedDay, setSelectedDay] = useState(currentDate);
  useEffect(() => {
    const sydneyToday = moment.tz('Australia/Sydney').startOf('day');
    const sydneyCurrent = moment(currentDate).tz('Australia/Sydney').startOf('day');
    const lastDayOfMonth = sydneyCurrent.clone().endOf('month').date();
    const currentWeek = calculateCurrentWeek(semesterStartDate, sydneyCurrent.toDate());

    if (sydneyCurrent.date() === lastDayOfMonth) {
      const newDate = sydneyCurrent.add(1, 'day').toDate();
      dispatch({ type: 'SET_DATE', payload: newDate });
      dispatch({ type: 'SET_MONTH', payload: months[newDate.getMonth()] });
    }

    dispatch({ type: 'SET_WEEK', payload: currentWeek > 12 ? currentWeek % 12 : currentWeek });
  }, [currentDate]);

  const handleMonthSelect = (month) => {
    const newDate = moment.tz('Australia/Sydney').set({
      'year': currentDate.getFullYear(),
      'month': months.indexOf(month),
      'date': 1
    }).toDate();
    dispatch({ type: 'SET_DATE', payload: newDate });
    dispatch({ type: 'SET_MONTH', payload: month });
    dispatch({ type: 'TOGGLE_MONTH_PICKER' });
  };

  const handleDayPress = (date) => {
    setSelectedDay(date);
    dispatch({ type: 'SET_DATE', payload: date });
  };

  const handleResetToToday = () => {
    const today = getSydneyDate(new Date());
    setSelectedDay(today);
    dispatch({ type: 'SET_DATE', payload: today });
    dispatch({ type: 'SET_MONTH', payload: months[today.getMonth()] });
  };

  // const handleAddEvent = () => {
  //   const { title, day, startTime, endTime, location } = newEvent;
  //   if (title && day && startTime && endTime && location) {
  //     const newEventObj = {
  //       title,
  //       startTime: genTimeBlock(day.toUpperCase(), parseInt(startTime)),
  //       endTime: genTimeBlock(day.toUpperCase(), parseInt(endTime)),
  //       location,
  //       extra_descriptions: [],
  //       color: '#f8bbd0',
  //     };
  //     dispatch({ type: 'ADD_EVENT', payload: newEventObj });
  //   } else {
  //     Alert.alert("Error", "Please fill in all fields.");
  //   }
  // };


  const handleCloseEventModal =() => {
    setEventModalVisible(false);
    setSelectedEvent(null);
  }

  const handleDeleteEvent = () => {
    Alert.alert(
      "Delete Event",
      `Are you sure you want to delete the event "${selectedEvent?.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              console.log(`Deleting event with id: ${selectedEvent.id}`); // Additional log
              const response = await fetch(`http://localhost:3000/api/events/${selectedEvent.id}`, {
                method: 'DELETE',
              });
  
              if (response.ok) {
                console.log('Event deleted successfully'); // Additional log
                setEvents(events.filter(event => event.id !== selectedEvent.id));
                
                handleCloseEventModal();
                updateTimetable(); 
              } else {
                console.error('Failed to delete event:', response.statusText); // Additional log
                Alert.alert('Error', 'Failed to delete event.');
              }
            } catch (error) {
              console.error('Something went wrong:', error); // Additional log
              Alert.alert('Error', 'Something went wrong. Please try again.');
            }
          }
        }
      ]
    );
  };
  

  // Handle submitting the new event
  const handleAddEvent = async () => {
    const { title, day, startTime, endTime, location } = newEvent;
    if (title && day && startTime && endTime && location) {
      const newEventObj = {
        title,
        day: day.toUpperCase(),
        startTime: genTimeBlock(day.toUpperCase(), parseInt(startTime)),
        endTime: genTimeBlock(day.toUpperCase(), parseInt(endTime)),
        location,
        extra_descriptions: [],
        color: '#f8bbd0',
      };
      dispatch({ type: 'ADD_EVENT', payload: newEventObj });
  
      try {
        // Make a POST request to your backend to store the event in the database
        const response = await fetch('http://localhost:3000/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEventObj),
        });
  
        if (response.ok) {
          // If the request was successful, add the event to the local state as well
          setEvents([...events, newEventObj]);
          setModalVisible(false);
          setNewEvent({
            title: '',
            day: '',
            startTime: '',
            endTime: '',
            location: '',
          });
        } else {
          // Handle error responses
          Alert.alert('Error', 'Failed to add event. Please try again.');
        }
      } catch (error) {
        // Handle network or other errors
        Alert.alert('Generated new event!');
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields.');
    }
  };
  
  const onEventPress = (evt) => {
    //Alert.alert("onEventPress", JSON.stringify(evt));
    setSelectedEvent(evt);
    setEventModalVisible(true);
  };

  const handleReview = () => {
    navigation.navigate('Review');
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#2b189e', '#5d4add', '#a38ef9']}
          style={styles.header}
        >
          <Text style={styles.headerText}>BEYOND⁺</Text>
          <View style={styles.headerCenter}>
            <TouchableOpacity onPress={() => dispatch({ type: 'TOGGLE_MONTH_PICKER' })}>
              <Text style={styles.headerCenterText}>{selectedMonth}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => dispatch({ type: 'TOGGLE_MODAL' })}>
              <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
              <Ionicons name="person" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Month Picker Modal */}
        <Modal
          visible={isMonthPickerVisible}
          animationType="slide"
          transparent={true}
        >
          <TouchableWithoutFeedback onPress={() => dispatch({ type: 'TOGGLE_MONTH_PICKER' })}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <FlatList 
                  data={months}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleMonthSelect(item)}>
                      <Text style={styles.modalItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
                <Button title="Close" onPress={() => dispatch({ type: 'TOGGLE_MONTH_PICKER' })} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Add Event Modal */}
        <Modal
          visible={isModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => dispatch({ type: 'TOGGLE_MODAL' })}
        >
          <TouchableWithoutFeedback onPress={() => dispatch({ type: 'TOGGLE_MODAL' })}>
            
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add New Event</Text>
                <ScrollView>
                <TextInput
                  placeholder="Title"
                  value={newEvent.title}
                  onChangeText={(text) => dispatch({ type: 'SET_NEW_EVENT', payload: { title: text } })}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Day (e.g., MON)"
                  value={newEvent.day}
                  onChangeText={(text) => dispatch({ type: 'SET_NEW_EVENT', payload: { day: text } })}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Start Time (Hour, e.g., 10)"
                  value={newEvent.startTime}
                  onChangeText={(text) => dispatch({ type: 'SET_NEW_EVENT', payload: { startTime: text } })}
                  style={styles.input}
                  keyboardType="numeric"
                />
                <TextInput
                  placeholder="End Time (Hour, e.g., 12)"
                  value={newEvent.endTime}
                  onChangeText={(text) => dispatch({ type: 'SET_NEW_EVENT', payload: { endTime: text } })}
                  style={styles.input}
                  keyboardType="numeric"
                />
                <TextInput
                  placeholder="Location"
                  value={newEvent.location}
                  onChangeText={(text) => dispatch({ type: 'SET_NEW_EVENT', payload: { location: text } })}
                  style={styles.input}
                />
                </ScrollView>
                <View style={styles.buttonContainer}>
                  <Button title="Add Event" onPress={handleAddEvent} />
                  <Button title="Cancel" onPress={() => dispatch({ type: 'TOGGLE_MODAL' })} color="red" />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Modal
          visible={isEventModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={handleCloseEventModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
               <TouchableOpacity style={styles.close} onPress={handleCloseEventModal}>
                    <Ionicons name="close" size={28} color="black" />
                </TouchableOpacity>
              <Text style={styles.modalText}>Subject Code: 41001</Text>
              <Text style={styles.modalText}>Subject Type: Tutorial</Text>
              <Text style={styles.modalText}>Subject Details: This A subject is a collection of topics that forms a coherent whole, intended to be taught by a faculty member. </Text>
              <Text style={styles.modalText}>Location: {selectedEvent?.location}</Text>
              <Button title="Lecture Review" onPress={handleReview} />
              <Button title="Delete" onPress={handleDeleteEvent} color="red" />
            </View>
          </View>
        </Modal>

        <View style={styles.progressContainer}>
          <TouchableOpacity onPress={handleResetToToday}>
            <Text style={styles.weekText}>Week {currentWeek} of {totalWeeks}</Text>
          </TouchableOpacity>
          <ProgressBar 
            progress={currentWeek / totalWeeks} 
            color="#7B68EE" 
            style={styles.progressBar}
          />
        </View>
        <CustomHeader 
          currentDate={currentDate} 
          selectedDay={selectedDay} 
          onDayPress={handleDayPress}
        />
        <TimeTableView
            events={events}
            pivotTime={9}
            pivotEndTime={20}
            pivotDate={genTimeBlock('mon')}
            nDays={7}
            onEventPress={onEventPress}
            locale="en"
            timeStep={60}
            styles={timetableStyles}
        />

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
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="share" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const timetableStyles = {
  container: {
    flex: 1,
  },
  eventCell: {
    borderRadius: 18,
    padding: 10,
  },
  eventTitle: {
    fontSize: 16,
    color: '#ffffff',
  },
  headerStyle: {
    backgroundColor: '#D5D6EA',
    height: 8,
    fontWeight: 'bold',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: '13%',
    backgroundColor: '#7B68EE',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 35,
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCenterText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
    paddingleft: 4,
  },
  customHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayText: {
    color: '#aaa',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  todayText: {
    fontWeight: 'bold',
    color: '#00aaff',
  },
  todayDateText: {
    color: '#00aaff',
  },
  todayIndicator: {
    width: 4,
    height: 4,
    backgroundColor: '#00aaff',
    borderRadius: 2,
    marginTop: 4,
  },
  selectedDayText: {
    fontWeight: 'bold',
    color: '#7B68EE', // 보라색으로 표시
  },
  selectedDateText: {
    color: '#7B68EE', // 보라색으로 표시
  },
  progressContainer: {
    padding: 8,
    backgroundColor: '#ffffff',
  },
  weekText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D3D3D3',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    width: '90%',
    backgroundColor: '#9986FF',
    borderRadius: 30,
    position: 'absolute',
    left: 24,
    right: 0,
    bottom: 20,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#7B68EE'
  },
  close: {
    marginTop: '-19%',
    marginLeft: '88%',

  },
  modalText: {
    fontSize: 14,
    marginVertical: 6,
  },
  modalItemText: {
    fontSize: 16,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ScheduleScreen;
