
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome } from 'react-native-vector-icons';
import { useAuth } from '@/app/contexts/AuthContext';
import Home from '@/app/screens/home';
import Instructors from '@/app/screens/instructors';


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
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
