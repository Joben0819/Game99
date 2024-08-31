// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// ============================= 9908 =============================
const firebaseConfig = {
  apiKey: "AIzaSyBipSnYPOy5_umRWNuQv5ZJ553XkmOHY2I",
  authDomain: "h5-fcm-9908-b8b13.firebaseapp.com",
  projectId: "h5-fcm-9908-b8b13",
  storageBucket: "h5-fcm-9908-b8b13.appspot.com",
  messagingSenderId: "872227677097",
  appId: "1:872227677097:web:fba11a6d2087f8434c5ab8"
};
const appIcon = './variant/9908/icon512_rounded.png';

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
