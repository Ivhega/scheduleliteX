import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/app/contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const Logout = () => {
  const { logout } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    };

    performLogout();
  }, [navigation, logout]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Logging out...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#EFB509',
  },
});

export default Logout;