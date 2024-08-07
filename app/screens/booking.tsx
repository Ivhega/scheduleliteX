import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/app/contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

type Booking = {
  id: string;
  date: string;
  instructorId: string;
  time: string;
  category: string;
  studentName: string;
  instructorName: string;
};

const BookingList = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      // Fetch bookings from MockAPI
      axios.get('https://668e9654bf9912d4c92eede2.mockapi.io/tasks/bookings')
        .then(response => {
          const userBookings = response.data.filter(booking => booking.studentName.toLowerCase() === user?.name.toLowerCase());
          setBookings(userBookings);
        })
        .catch(error => {
          console.error('Error fetching bookings:', error);
        });
    }, [user])
  );

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
                <Text style={styles.bookingText}>Instructor ID: {booking.instructorId}</Text>
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
    fontSize: 35,
    fontWeight: 'bold',
    color: '#EFB509',
    marginVertical: 20,
    marginTop: 60,
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