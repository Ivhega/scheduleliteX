/* import { ScrollView, StyleSheet, Text, View, Alert, TextInput, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);

  useEffect(() => {
    // Fetch bookings from MockAPI
    axios.get('https://668e9654bf9912d4c92eede2.mockapi.io/tasks/bookings')
      .then(response => {
        setBookings(response.data);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
      });
  }, []);

  const handleSearch = () => {
    if (studentName) {
      const filtered = bookings.filter(booking => booking.studentName.toLowerCase() === studentName.toLowerCase());
      setFilteredBookings(filtered);
    } else {
      Alert.alert('Error', 'Please enter a name to search.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.main}>
          <Text style={styles.heading}>Booking Information</Text>
          
          <TextInput
            style={styles.textInput}
            placeholder="Enter your name"
            value={studentName}
            onChangeText={setStudentName}
          />
          
          <Pressable style={styles.press} onPress={handleSearch}>
            <Text style={styles.pressText}>Search</Text>
          </Pressable>

          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <View key={index} style={styles.bookingContainer}>
                <Text style={styles.bookingText}>Date: {booking.date}</Text>
                <Text style={styles.bookingText}>Instructor Name: {booking.instructorName}</Text>
                <Text style={styles.bookingText}>Instructor: {booking.instructorId}</Text>
                <Text style={styles.bookingText}>Time: {booking.time}</Text>
                <Text style={styles.bookingText}>Category: {booking.category}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noBookingText}>No bookings found for the entered name.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default BookingList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16253D',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EFB509',
    marginVertical: 20,
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
    width: '80%',
  },
  press: {
    height: 40,
    width: '60%',
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: '#EFB509',
    justifyContent: 'center',
    marginVertical: 10,
  },
  pressText: {
    fontSize: 18,
    color: '#16253D',
    textAlign: 'center',
  },
  bookingContainer: {
    backgroundColor: '#EFB509',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: '80%',
  },
  bookingText: {
    color: '#16253D',
    fontSize: 16,
    marginBottom: 5,
  },
  noBookingText: {
    color: '#EFB509',
    fontSize: 18,
    marginTop: 20,
  },
}); */

import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/app/contexts/AuthContext';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch bookings from MockAPI
    axios.get('https://668e9654bf9912d4c92eede2.mockapi.io/tasks/bookings')
      .then(response => {
        const userBookings = response.data.filter(booking => booking.studentName.toLowerCase() === user?.name.toLowerCase());
        setBookings(userBookings);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
      });
  }, [user]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.main}>
          <Text style={styles.heading}>Booking Information</Text>

          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <View key={index} style={styles.bookingContainer}>
                <Text style={styles.bookingText}>Date: {booking.date}</Text>
                <Text style={styles.bookingText}>Instructor Name: {booking.instructorName}</Text>
                <Text style={styles.bookingText}>Instructor: {booking.instructorId}</Text>
                <Text style={styles.bookingText}>Time: {booking.time}</Text>
                <Text style={styles.bookingText}>Category: {booking.category}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noBookingText}>No bookings found for your name.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default BookingList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16253D',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EFB509',
    marginVertical: 20,
  },
  bookingContainer: {
    backgroundColor: '#EFB509',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: '80%',
  },
  bookingText: {
    color: '#16253D',
    fontSize: 16,
    marginBottom: 5,
  },
  noBookingText: {
    color: '#EFB509',
    fontSize: 18,
    marginTop: 20,
  },
});