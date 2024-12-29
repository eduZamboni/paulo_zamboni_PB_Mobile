import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: (email, password) => {},
  logout: () => {},
  signup: (email, password) => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setUser({ email: token });
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  const login = async (email, password) => {
    const stored = await AsyncStorage.getItem('users');
    let users = stored ? JSON.parse(stored) : [];
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      await AsyncStorage.setItem('token', email);
      setUser({ email });
      return true;
    }
    return false;
  };

  const signup = async (email, password) => {
    const stored = await AsyncStorage.getItem('users');
    let users = stored ? JSON.parse(stored) : [];
    const exists = users.find(u => u.email === email);
    if (exists) {
      return false;
    }
    users.push({ email, password });
    await AsyncStorage.setItem('users', JSON.stringify(users));
    await AsyncStorage.setItem('token', email);
    setUser({ email });
    return true;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);