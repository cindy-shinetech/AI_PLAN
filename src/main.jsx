import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from 'react-oidc-context';
 
 const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_qlXqYDUBU",
  client_id: "5o5ef6kl1bmb37t41kvqmpe7ek",
  redirect_uri: "http://localhost:5173",
  response_type: "code",
  scope: "email openid phone",
};
 
 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
)