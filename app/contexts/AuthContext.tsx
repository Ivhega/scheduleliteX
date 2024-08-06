import React, { createContext, useContext, useState } from 'react';

interface User {
  name: string;
  email: string;
  id?: string;
}

interface AuthContextType {
  user: User | null;
  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
  setUserId: (id: string) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const setUserName = (name: string) => {
    console.log('Setting user name:', name);
    setUser(prevUser => (prevUser ? { ...prevUser, name } : { name, email: '' })); // Handle case where user is null
  };

  const setUserEmail = (email: string) => {
    console.log('Setting user email:', email);
    setUser(prevUser => (prevUser ? { ...prevUser, email } : { name: '', email })); // Handle case where user is null
  };

  const setUserId = (id: string) => {
    console.log('Setting user ID:', id);
    setUser(prevUser => (prevUser ? { ...prevUser, id } : { name: '', email: '', id })); // Handle case where user is null
  };

  console.log('AuthProvider user state:', user);

  return (
    <AuthContext.Provider value={{ user, setUserName, setUserEmail, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
