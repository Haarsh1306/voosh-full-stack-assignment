import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {GoogleOAuthProvider} from "@react-oauth/google";
import env from '../utils/env.js';
createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
        <App />
    </GoogleOAuthProvider>
)
