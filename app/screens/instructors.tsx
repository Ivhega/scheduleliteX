import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import { useAuth } from '@/app/contexts/AuthContext';

type ClassType = 'Academic Tutoring' | 'Language Learning' | 'Skill Development';

interface Schedule {
  [key: string]: { classType: ClassType; hours: string };
}

export default function Instructors() {
  const { user } = useAuth();
  const [schedule, setSchedule] = React.useState<Schedule>({});
  const [selectedDate, setSelectedDate] = React.useState<string>('');
  const [startHour, setStartHour] = React.useState<Date | null>(null);
  const [classType, setClassType] = React.useState<ClassType>('Academic Tutoring');
  const [isStartHourPickerVisible, setStartHourPickerVisibility] = React.useState(false);
  const [isCalendarVisible, setCalendarVisible] = React.useState(false);

  const handleSave = async () => {
    if (selectedDate && startHour) {
      const formattedStartHour = moment(startHour).format('HH:mm');
      const newAvailability = {
        date: selectedDate,
        times: [formattedStartHour],
      };
  
      try {
        const existingInstructorResponse = await fetch(`http://192.168.1.96:3000/instructors?id=${user?.id}`);
        const existingInstructors = await existingInstructorResponse.json();
  
        if (existingInstructors.length > 0) {
          const existingInstructor = existingInstructors[0];
  
          const availabilityIndex = existingInstructor.availability.findIndex(
            (av: any) => av.date === selectedDate
          );
  
          if (availabilityIndex !== -1) {
            existingInstructor.availability[availabilityIndex].times.push(formattedStartHour);
          } else {
            existingInstructor.availability.push(newAvailability);
          }
  
          const updateResponse = await fetch(`http://192.168.1.96:3000/instructors/${existingInstructor.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(existingInstructor),
          });
  
          if (updateResponse.ok) {
            alert('Updated successfully!');
          } else {
            alert('Failed to update');
          }
        } else {
          const response = await fetch('http://192.168.1.96:3000/instructors', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: user?.name || 'Unknown',
              id: user?.id,
              category: classType,
              availability: [newAvailability],
            }),
          });
  
          if (response.ok) {
            alert('Saved successfully!');
          } else {
            alert('Failed to save');
          }
        }
  
        setSchedule({
          ...schedule,
          [selectedDate]: { classType, hours: formattedStartHour },
        });
        setSelectedDate('');
        setStartHour(null);
        setClassType('Academic Tutoring');
      } catch (error) {
        console.error('Error saving data:', error);
        alert('Failed to save');
      }
    } else {
      alert('Please fill in all fields');
    }
  };  
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Offer Your Class, {user?.name}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Day:</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setCalendarVisible(true)}
          >
            <Text style={styles.inputText}>{selectedDate || 'Select a day'}</Text>
          </TouchableOpacity>
          {isCalendarVisible && (
            <View style={styles.calendarWrapper}>
              <Calendar
                current={new Date()}
                onDayPress={(day: DateData) => { 
                  setSelectedDate(day.dateString);
                  setCalendarVisible(false); 
                }}
                markedDates={{ [selectedDate]: { selected: true, selectedColor: '#EFB509' } }}
                style={styles.calendar}
                theme={{
                  selectedDayBackgroundColor: '#EFB509',
                  selectedDayTextColor: '#16253D',
                  arrowColor: '#EFB509',
                  monthTextColor: '#EFB509',
                  textSectionTitleColor: '#EFB509',
                  dayTextColor: '#EFB509',
                  todayTextColor: '#EFB509',
                  dotColor: '#EFB509',
                }}
              />
            </View>
          )}
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Hours:</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setStartHourPickerVisibility(true)}
          >
            <Text style={styles.inputText}>{startHour ? moment(startHour).format('HH:mm') : 'Start Time'}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isStartHourPickerVisible}
            mode="time"
            onConfirm={(date) => {
              setStartHour(date);
              setStartHourPickerVisibility(false);
            }}
            onCancel={() => setStartHourPickerVisibility(false)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Class Type:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={classType}
              style={styles.picker}
              onValueChange={(itemValue) => setClassType(itemValue as ClassType)}
            >
              <Picker.Item label="Academic Tutoring" value="Academic Tutoring" />
              <Picker.Item label="Language Learning" value="Language Learning" />
              <Picker.Item label="Skill Development" value="Skill Development" />
            </Picker>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          markedDates={Object.keys(schedule).reduce((acc, date) => {
            acc[date] = {
              customStyles: {
                container: {
                  backgroundColor: styles.button.backgroundColor,
                },
                text: {
                  color: styles.text.color,
                },
              },
            };
            return acc;
          }, {} as any)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#16253D',
  },
  form: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#CD7213',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EFB509',
    marginRight: 10,
    width: 120,
  },
  input: {
    borderWidth: 1,
    borderColor: '#EFB509',
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
    color: '#EFB509',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputText: {
    color: '#EFB509',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#EFB509',
    borderRadius: 4,
    flex: 1,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#EFB509',
  },
  button: {
    backgroundColor: '#CD7213',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 36,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  placeholder: {
    color: '#EFB509',
  },
  calendar: {
    flex: 1,
    marginTop: 10,
  },
  calendarContainer: {
    flex: 1,
    marginTop: 20,
  },
  calendarWrapper: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: '#16253D',
    borderRadius: 8,
    elevation: 4,
    zIndex: 1000,
  },
  text: {
    color: '#EFB509',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
});
