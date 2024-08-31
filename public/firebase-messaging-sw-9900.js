// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// ============================= 9900 =============================
const firebaseConfig = {
  apiKey: 'AIzaSyCxFwlq2yJaVs9C-z54dqHEgFypjm5sHso',
  authDomain: 'nine-games-h5.firebaseapp.com',
  projectId: 'nine-games-h5',
  storageBucket: 'nine-games-h5.appspot.com',
  messagingSenderId: '263452916475',
  appId: '1:263452916475:web:f93b084681278dfd8a0e5e',
};
const appIcon = './variant/9900/icon512_rounded.png';

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
