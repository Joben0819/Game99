// firebase.js (or firebase.ts)
import { initializeApp } from 'firebase/app';
const { FIREBASE_CONFIG } = require('../server/' + process.env.SITE);

const firebaseConfig = FIREBASE_CONFIG;

const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
