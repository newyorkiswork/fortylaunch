import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Debug: Verify API key is loaded
const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;
console.log('🚀 FortyLaunch Starting...');
console.log('🔑 Gemini API Key configured:', !!apiKey);
if (!apiKey) {
  console.warn('⚠️ No API key found. AI features will use demo/fallback mode.');
  console.warn('ℹ️ To enable Gemini AI: Add GEMINI_API_KEY to .env.local and restart the dev server.');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
