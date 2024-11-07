import React, { createContext, useContext, useState } from 'react';
import {CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js';
import UserPool from './UserPool';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userToken, setUserToken] = useState(null);

    const login = (user) => {
        setIsAuthenticated(true);
        getUserDetails(user);
        getUserRole(user);
        getUserToken(user);
    };

    const logout = () => {
        const user = UserPool.getCurrentUser();
        if (user) {
            user.signOut();
        }
        setIsAuthenticated(false);
        setUserDetails(null);
        setUserRole(null);
        setUserToken(null);
        // Clear tokens or perform any other logout actions
        localStorage.removeItem('token');
    };

    const getUserDetails = (user) => {
        if (user) {
            user.getUserAttributes((err, result) => {
                if (err) {
                    console.error('Error fetching user attributes:', err);
                    return;
                }
                const attributes = result.map(attr => ({ [attr.Name]: attr.Value }));
                setUserDetails(Object.assign({}, ...attributes));
            });
        }
    };

    const getUserRole = (user) => {
        if (user) {
            user.getUserAttributes((err, result) => {
                if (err) {
                    console.error('Error fetching user role:', err);
                    return;
                }
                const roleAttribute = result.find(attr => attr.Name === 'custom:role');
                setUserRole(roleAttribute ? roleAttribute.Value : null);
            });
        }
    };

    const getUserToken = (user) => {
        if (user) {
            user.getSession((err, session) => {
                if (err) {
                    console.error('Error fetching user token:', err);
                    return;
                }
                setUserToken(session.getIdToken().getJwtToken());
            });
        }
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            login, 
            logout, 
            userDetails, 
            userRole, 
            userToken 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;