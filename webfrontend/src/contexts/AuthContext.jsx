import { createContext, useContext, useState, useCallback } from 'react';
import { gql, useMutation } from '@apollo/client';

const AuthContext = createContext(null);

// GraphQL Mutations
const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      message
      data {
        jwt
        user {
          _id
          username
          email
          firstName
          lastName
          role
        }
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      success
      message
      data {
        _id
        username
        email
        firstName
        lastName
        role
      }
    }
  }
`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Kiểm tra nếu có user data trong localStorage
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [login] = useMutation(LOGIN_MUTATION);
  const [register] = useMutation(REGISTER_MUTATION);

  const handleLogin = useCallback(async (username, password) => {
    try {
      const { data } = await login({
        variables: {
          input: { username, password }
        }
      });

      if (data.login.success) {
        const { jwt, user } = data.login.data;
        localStorage.setItem('auth_token', jwt);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      } else {
        return { success: false, message: data.login.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }, [login]);

  const handleRegister = useCallback(async (userData) => {
    try {
      const { data } = await register({
        variables: {
          input: userData
        }
      });

      if (data.register.success) {
        return { success: true };
      } else {
        return { success: false, message: data.register.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }, [register]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};