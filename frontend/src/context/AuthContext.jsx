import React, { createContext, useState, useEffect } from 'react';
import axios from '../utils/axios'; // Ensure this is properly set up

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify the token by calling a protected route
      axios.get('http://localhost:3000/api/protected', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setUser(response.data.user); // Ensure response format contains { user: ... }
        })
        .catch(() => {
          localStorage.removeItem('token'); // Remove token if there was an error
        })
        .finally(() => {
          setLoading(false); // Set loading to false whether successful or not
        });
    } else {
      setLoading(false); // No token, stop loading
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/login', { email, password });
      const { token, user: loggedInUser } = response.data; // Destructure user from response

      if (!token) {
        console.error('Token not received:', response.data);
        return; // Exit if no token
      }

      localStorage.setItem('token', token);
      setUser(loggedInUser); // Update user state with logged in user
    } catch (error) {
      console.error('Login error:', error); // Log any errors
    }
  };

  const register = async (username, email, password, userType) => {
    try {
      const response = await axios.post('http://localhost:3000/api/register', { username, email, password, userType });
      const { token, user: registeredUser } = response.data; // Destructure user from response

      if (!token) {
        console.error('Token not received:', response.data);
        return; // Exit if no token
      }

      localStorage.setItem('token', token);
      setUser(registeredUser); // Update user state with registered user
    } catch (error) {
      console.error('Register error:', error); // Log any errors
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // Clear token from storage
    setUser(null); // Reset user state
  };

  // Render children only if loading is complete
  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children} {/* Render children only when loading is false */}
    </AuthContext.Provider>
  );
};
console.log("inside auth"); // Debugging log
export { AuthContext, AuthProvider };
