// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js');

// ============================= 9907 =============================
const firebaseConfig = {
  apiKey: 'AIzaSyA5_JUGwLIQcePBD8AwCo7F3nQEwZvaxvw',
  authDomain: 'h5-fcm-9907.firebaseapp.com',
  projectId: 'h5-fcm-9907',
  storageBucket: 'h5-fcm-9907.appspot.com',
  messagingSenderId: '711461373662',
  appId: '1:711461373662:web:64e545341132df57c3e44f',
};
const appIcon = './variant/9907/icon512_rounded.png';

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.data.title || 'Default Title';
  const notificationOptions = {
    body: payload.data.content || 'Default message body',
    icon: appIcon, // Update the icon path as needed
    data: { ...payload.data },
  };
  if (payload.data?.notificationType === 'NOTIFICATION') {
    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});

self.addEventListener('notificationclick', function (event) {
  console.log('[firebase-messaging-sw.js] Notification clicked ', event);
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          client.postMessage({
            type: 'BG_NOTIFICATION_CLICKED',
            data: event.notification.data,
          });
          return;
        }
      }
    }),
  );
});
