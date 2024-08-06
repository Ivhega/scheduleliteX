import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars'; // Import DateData for typing
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import { useAuth } from '@/contexts/AuthContext';

type ClassType = 'Academic Tutoring' | 'Language Learning' | 'Skill Development';

interface Schedule {
  [key: string]: { classType: ClassType; hours: string };
}

export default function Instructors() {
  const { user } = useAuth(); // Access user from context
  const [schedule, setSchedule] = React.useState<Schedule>({});
  const [selectedDate, setSelectedDate] = React.useState<string>('');
  const [startHour, setStartHour] = React.useState<Date | null>(null);
  const [endHour, setEndHour] = React.useState<Date | null>(null);
  const [classType, setClassType] = React.useState<ClassType>('Academic Tutoring');
  const [isStartHourPickerVisible, setStartHourPickerVisibility] = React.useState(false);
  const [isEndHourPickerVisible, setEndHourPickerVisibility] = React.useState(false);
  const [isCalendarVisible, setCalendarVisible] = React.useState(false);

  const handleSave = () => {
    if (selectedDate && startHour && endHour) {
      const formattedStartHour = moment(startHour).format('HH:mm');
      const formattedEndHour = moment(endHour).format('HH:mm');
      setSchedule({
        ...schedule,
        [selectedDate]: { classType, hours: `${formattedStartHour}-${formattedEndHour}` },
      });
      // Reset form fields
      setSelectedDate('');
      setStartHour(null);
      setEndHour(null);
      setClassType('Academic Tutoring');
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
                onDayPress={(day: DateData) => { // Specify type DateData for day
                  setSelectedDate(day.dateString);
                  setCalendarVisible(false); // Hide calendar after selection
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
          <TouchableOpacity
            style={styles.input}
            onPress={() => setEndHourPickerVisibility(true)}
          >
            <Text style={styles.inputText}>{endHour ? moment(endHour).format('HH:mm') : 'End Time'}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isEndHourPickerVisible}
            mode="time"
            onConfirm={(date) => {
              setEndHour(date);
              setEndHourPickerVisibility(false);
            }}
            onCancel={() => setEndHourPickerVisibility(false)}
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

