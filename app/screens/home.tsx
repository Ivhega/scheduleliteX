
import { ScrollView, StyleSheet, Text, View, Image, Alert, TextInput, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

type Booking = {
  id: string;
  date: string;
  instructorId: string;
  time: string;
  category: string;
  studentName: string;
};

type Instructor = {
  id: string;
  name: string;
  category: string;
  availability: { date: string; times: string[] }[];
};

const Home = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch instructors from MockAPI
    axios.get('https://668e9654bf9912d4c92eede2.mockapi.io/tasks/instructors')
      .then(response => {
        setInstructors(response.data);
      })
      .catch(error => {
        console.error('Error fetching instructors:', error);
      });

    // Fetch bookings from MockAPI
    axios.get('https://668e9654bf9912d4c92eede2.mockapi.io/tasks/bookings')
      .then(response => {
        setBookings(response.data);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
      });
  }, []);

  useEffect(() => {
    // Update marked dates based on selected instructor
    if (selectedInstructor) {
      const instructor = instructors.find(inst => inst.id === selectedInstructor);
      if (instructor) {
        const availability = instructor.availability.reduce((acc, { date }) => {
          acc[date] = { available: true, marked: true, dotColor: '#EFB509' };
          return acc;
        }, {});
        setMarkedDates(availability);
      }
    } else {
      setMarkedDates({});
    }
  }, [selectedInstructor, instructors]);

  const handleBooking = () => {

    const selectedInstructorData = instructors.find(inst => inst.id === selectedInstructor);

    if (selectedDate && selectedInstructor && selectedTime && selectedInstructorData) {
      const isBooked = bookings.some(
        booking => booking.date === selectedDate && booking.instructorId === selectedInstructor && booking.time === selectedTime
      );

      if (isBooked) {
        Alert.alert('Error', 'This time slot is already booked for the selected date.');
      } else {
        axios.post('https://668e9654bf9912d4c92eede2.mockapi.io/tasks/bookings', {
          date: selectedDate,
          instructorId: selectedInstructor,
          instructorName: selectedInstructorData.name,
          time: selectedTime,
          category: selectedCategory,
          studentName: user?.name || 'Unknown',
        })
        .then(response => {
          Alert.alert('Success', 'Your booking has been made.');
          setBookings([...bookings, response.data]);
        })
        .catch(error => {
          console.error('Error making booking:', error);
          Alert.alert('Error', 'There was a problem making your booking.');
        });
      }
    } else {
      Alert.alert('Error', 'Please fill out all fields.');
    }
  };

  const filteredInstructors = instructors.filter(instructor => instructor.category === selectedCategory);
  const selectedInstructorData = instructors.find(inst => inst.id === selectedInstructor);
  const availableTimes = selectedInstructorData?.availability.find(a => a.date === selectedDate)?.times || [];

  const selectedInstructorName = selectedInstructorData?.name || '';

  return (
    <ScrollView>
      <View style={styles.main}>
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/images/schedulelite.jpg')} style={styles.logoImage} />
          <Text style={styles.heading1}>Welcome to SchedulElite!</Text>
        </View>

        <Text style={styles.normalText}>We're excited to help assist you with your studies!</Text>

        <Text style={styles.normalText}>Please let us know what kind of service you're looking for:</Text>

        <RNPickerSelect
          onValueChange={(value) => setSelectedCategory(value)}
          items={[
            { label: 'Academic Tutoring', value: 'Academic Tutoring' },
            { label: 'Language Learning', value: 'Language Learning' },
            { label: 'Skill Development', value: 'Skill Development' },
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select an option...', value: '' }}
        />

        <Text style={styles.normalText}>Select an Instructor:</Text>

        <RNPickerSelect
          onValueChange={(value) => setSelectedInstructor(value)}
          items={filteredInstructors.map(instructor => ({
            label: instructor.name,
            value: instructor.id,
          }))}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select an instructor...', value: '' }}
        />

        <Text style={styles.normalText}>
          Please select an available day for {selectedCategory} with {selectedInstructorName}:
        </Text>
        <Text style={styles.normalText}>
          (available days are highlighted by a yellow dot)
        </Text>

        <Calendar
          current={new Date().toISOString().split('T')[0]}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              selected: true,
              selectedColor: '#002C54',
            },
          }}
          onDayPress={(day) => {
            const dateString = day.dateString;
            if (markedDates[dateString]?.available) {
              setSelectedDate(dateString);
            } else {
              Alert.alert('Error', 'This date is not available for the selected instructor.');
            }
          }}
          monthFormat={'yyyy MM'}
          hideArrows={false}
          hideExtraDays={true}
          hideDayNames={false}
          showWeekNumbers={false}
          onPressArrowLeft={(subtractMonth) => subtractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          style={styles.calendar}
        />

        <Text style={styles.normalText}>Select a Time:</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedTime(value)}
          items={availableTimes.map(time => ({ label: time, value: time }))}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select a time...', value: '' }}
        />

        <Pressable style={styles.press} onPress={handleBooking}>
          <Text style={styles.pressText}>Book</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#16253D',
    paddingHorizontal: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
  },
  heading1: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#EFB509',
  },
  calendar: {
    marginTop: 30,
    marginBottom: 40,
  },
  selectedValue: {
    marginTop: 10,
    fontSize: 16,
    color: '#EFB509',
  },
  normalText: {
    fontSize: 20,
    color: '#EFB509',
    marginTop: 20,
    textAlign: 'center',
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#EFB509',
    margin: 5,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  press: {
    height: 50,
    width: 120,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: '#EFB509',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pressText: {
    fontSize: 20,
    color: '#16253D',
    textAlign: 'center',
  }
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
    marginBottom: 10,
    marginTop: 20,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
    marginBottom: 10,
    marginTop: 20,
  },
};