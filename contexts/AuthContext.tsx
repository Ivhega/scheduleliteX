import React, { createContext, useContext, useState } from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const setUserName = (name: string) => {
    console.log('Setting user name:', name);
    setUser(prevUser => ({ ...prevUser, name } as User));
  };

  const setUserEmail = (email: string) => {
    console.log('Setting user email:', email);
    setUser(prevUser => ({ ...prevUser, email } as User));
  };

  console.log('AuthProvider user state:', user);

  return (
    <AuthContext.Provider value={{ user, setUserName, setUserEmail }}>
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
