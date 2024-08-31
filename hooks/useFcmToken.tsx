// 'use client';

// import { useEffect, useState } from 'react';
// import { getMessaging, getToken } from 'firebase/messaging';
// import firebaseApp from '@/utils/firebase';

// const { VAPID_KEY } = require('../server/' + process.env.SITE);

// let timesRepeated = 0;
// const useFcmToken = () => {
//   const [token, setToken] = useState('');
//   const [notificationPermissionStatus, setNotificationPermissionStatus] = useState('');

//   useEffect(() => {
//     const retrieveToken = async () => {
//       timesRepeated++;
//       try {
//         if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
//           const messaging = getMessaging();

//           // Retrieve the notification permission status
//           const permission = await Notification.requestPermission();
//           setNotificationPermissionStatus(permission);

//           // Check if permission is granted before retrieving the token
//           if (permission === 'granted') {
//             const currentToken = await getToken(messaging, {
//               vapidKey: VAPID_KEY,
//             }).then((token) => {
//               console.log('@@@token', token);
//               return token;
//             });
//             if (currentToken) {
//               setToken(currentToken);
//             } else {
//               console.log('No registration token available. Request permission to generate one.');
//             }
//           }
//         }
//       } catch (error) {
//         timesRepeated <= 10 && retrieveToken();
//         console.log('An error occurred while retrieving token:', error);
//       }
//     };

//     retrieveToken();
//   }, []);

//   return { fcmToken: token, notificationPermissionStatus };
// };

// export default useFcmToken;
