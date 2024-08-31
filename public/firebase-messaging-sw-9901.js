// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// ============================= 9901 =============================
const firebaseConfig = {
  apiKey: 'AIzaSyCfbNZneslQIrPl-TfywKT1Y6jSQZu1wRI',
  authDomain: 'h5-b9ddc.firebaseapp.com',
  projectId: 'h5-b9ddc',
  storageBucket: 'h5-b9ddc.appspot.com',
  messagingSenderId: '128962921159',
  appId: '1:128962921159:web:30f3995e79c44669c574e2',
};
const appIcon = './variant/9901/icon512_rounded.png';

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
