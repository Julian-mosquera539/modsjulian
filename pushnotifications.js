// Requiere configuración de Firebase SDK y FCM
const messaging = firebase.messaging();

function requestPermission() {
    return Notification.requestPermission().then(function(permission) {
        if (permission === 'granted') {
            return messaging.getToken();
        } else {
            console.log('Permiso denegado para notificaciones');
        }
    });
}

messaging.onMessage(function(payload) {
    console.log('Mensaje recibido: ', payload);
    // Aquí puedes manejar la notificación si la app está en primer plano
});
