import { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/auth.api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  // 🔐 TOKEN STATE (moved inside provider)
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🧠 Check login on refresh
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        try {
          const response = await authApi.getMe();

          if (response.success) {
            setUser(response.user);
            setIsAuthenticated(true);
            setToken(storedToken);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          logout();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // 🔑 LOGIN
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authApi.login(email, password);

      if (!response.success) {
        toast.error(response.message || 'Login failed');
        return null;
      }

      const { token: newToken, user } = response;

      if (!newToken || !user) {
        toast.error("Invalid response from server");
        return null;
      }

      localStorage.setItem('token', newToken);
      setToken(newToken);   // 🔥 important

      setUser(user);
      setIsAuthenticated(true);

      toast.success(response.message || 'Login successful!');
      return user;

    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 📝 REGISTER
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authApi.register(userData);

      if (response.success) {
        const { token: newToken, user } = response;
        const finalToken = newToken || response.data?.token;
        const finalUser = user || response.data?.user;

        if (!finalToken) {
          toast.error("Invalid response from server");
          return null;
        }

        localStorage.setItem('token', finalToken);
        setToken(finalToken);   // 🔥 important

        setUser(finalUser);
        setIsAuthenticated(true);

        toast.success(response.message || 'Registration successful!');
        return finalUser;
      }

      toast.error(response.message || 'Registration failed');
      return null;

    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out');
  };

  // 🧠 Update user helper
  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,           // 🔥 expose token for roadmap API
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};



// import { createContext, useState, useEffect, useContext } from 'react';
// import { authApi } from '../api/auth.api';
// import toast from 'react-hot-toast';

// const AuthContext = createContext(null);

// const [token, setToken] = useState(localStorage.getItem("token"));

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Check if user is logged in on mount
//   useEffect(() => {
//     const initAuth = async () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           const response = await authApi.getMe();
//           if (response.success) {
//             setUser(response.user);
//             setIsAuthenticated(true);
//           } else {
//             // Token invalid
//             logout();
//           }
//         } catch (error) {
//           console.error("Auth check failed:", error);
//           logout();
//         }
//       }
//       setLoading(false);
//     };

//     initAuth();
//   }, []);

//   const login = async (email, password) => {
//   setLoading(true);
//   try {
//     const response = await authApi.login(email, password);

//     if (!response.success) {
//       toast.error(response.message || 'Login failed');
//       return null;
//     }

//     const { token, user } = response;

//     if (!token || !user) {
//       toast.error("Invalid response from server");
//       return null;
//     }
    

//     localStorage.setItem('token', token);
//     // localStorage.setItem('user', JSON.stringify(user));

//     localStorage.setItem('token', token);
// setToken(token);   // 👈 ADD THIS


//     setUser(user);
//     setIsAuthenticated(true);

//     toast.success(response.message || 'Login successful!');
//     return user;
//   } catch (error) {
//     toast.error(error.response?.data?.message || 'Login failed');
//     throw error;
//   } finally {
//     setLoading(false);
//   }
// };

//   const register = async (userData) => {
//     setLoading(true);
//     try {
//       const response = await authApi.register(userData);
//       if (response.success) {
//         // Same fix for register
//         const { token, user } = response;
//         const finalToken = token || response.data?.token;
//         const finalUser = user || response.data?.user;
//         localStorage.setItem('token', finalToken);
// setToken(finalToken);   // 👈 ADD THIS


//         if (finalToken) {
//            localStorage.setItem('token', finalToken);
//             // localStorage.setItem('user', JSON.stringify(user));
//            setUser(finalUser);
//            setIsAuthenticated(true);
//            toast.success(response.message || 'Registration successful!');
//            return user;
//         } else {
//            console.error("Token missing in response", response);
//            toast.error("Invalid response from server");
//            return null;
//         }
//       }
//       toast.error(response.message || 'Registration failed');
//       return null;
//     } catch (error) {
//       const msg = error.response?.data?.message || 'Registration failed';
//       toast.error(msg);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     setIsAuthenticated(false);
//     toast.success('Logged out');


//     setToken(null);
//   };


//   // Helper to update user state (e.g. after onboarding)
//   const updateUser = (updatedData) => {
//     setUser(prev => ({ ...prev, ...updatedData }));
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       loading, 
//       isAuthenticated, 
//       login, 
//       register, 
//       token,
      
//       logout,
//       updateUser
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
