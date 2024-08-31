// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js');

// ============================= 9906 =============================
const firebaseConfig = {
  apiKey: 'AIzaSyCmNLRskBMW0FPF6gk_Bhb4JpxLSwTWQw8',
  authDomain: 'h5-eb462.firebaseapp.com',
  projectId: 'h5-eb462',
  storageBucket: 'h5-eb462.appspot.com',
  messagingSenderId: '440869783911',
  appId: '1:440869783911:web:98f8d42e4bb3d7b13b87c2',
};
const appIcon = './variant/9906/icon512_rounded.png';

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
