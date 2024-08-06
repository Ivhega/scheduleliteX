
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome } from 'react-native-vector-icons';
import { useAuth } from '@/app/contexts/AuthContext';
import Home from '@/app/screens/home';
import Instructors from '@/app/screens/instructors';
import Booking from '@/app/screens/booking';
import Logout from '@/app/screens/logout';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              return <Ionicons name={iconName} size={size} color={color} />;
            case 'Instructors':
              iconName = 'book';
              return <FontAwesome name={iconName} size={size} color={color} />;
            case 'Booking':
              iconName = 'book';
              return <Ionicons name="book" size={24} color="black" />;
            case 'Logout':
              iconName = 'logout';
              return <MaterialCommunityIcons name="logout" size={24} color="black" />;
            default:
              return null;
          }
        },
        tabBarActiveTintColor: '#16253D',
        tabBarInactiveTintColor: '#000000',
        tabBarStyle: {
          backgroundColor: '#EFB509',
        },
        headerShown: false, 
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Instructors" component={Instructors} />
      <Tab.Screen name="Booking" component={Booking} />
      <Tab.Screen name="Logout" component={Logout} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
