import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import './Login.css';
import UserPool from '../components/UserPool';
import { useAuth } from '../components/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = new CognitoUser({
            Username: email,
            Pool: UserPool,
        });

        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
        });

        user.authenticateUser(authDetails, {
            onSuccess: (result) => {
                console.log('Login successful:', result);
                const idToken = result.getIdToken().getJwtToken();
                const accessToken = result.getAccessToken().getJwtToken();
                const refreshToken = result.getRefreshToken().getToken();

                // Save tokens to local storage or context
                localStorage.setItem('idToken', idToken);
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                login(); // Update auth context if necessary
                navigate('/dashboard'); // Navigate to the dashboard
            },
            onFailure: (err) => {
                console.error('Login failed:', err);
            },
            newPasswordRequired: (data) => {
                console.log('New password required:', data);
            },
        });
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/SignUp">Sign Up</Link></p>
        </div>
    );
};

export default Login;
