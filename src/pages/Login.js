// src/pages/Login.js
import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';

const Login = ({ signOut, user }) => {
  return (
    <div>
      <h1>Welcome, {user.username}</h1>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default withAuthenticator(Login);
