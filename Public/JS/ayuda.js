document.addEventListener('DOMContentLoaded', function () {
    const chatBubble = document.getElementById('chatBubble');
    const chatWidget = document.getElementById('chatWidget');
    const closeChat = document.getElementById('closeChat');
    const sendWhatsApp = document.getElementById('sendWhatsApp');
    const sendEmail = document.getElementById('sendEmail');
    const chatMessage = document.getElementById('chatMessage');

    // Mostrar u ocultar el widget del chat al hacer clic en la burbuja
    chatBubble.addEventListener('click', function (e) {
        e.stopPropagation(); // Evitar que el clic cierre el chat
        if (chatWidget.style.display === 'block') {
            closeChatWidget(); // Si el chat está abierto, se cierra
        } else {
            chatWidget.style.display = 'block';
            chatWidget.classList.remove('closing');
        }
    });

    // Cerrar el widget del chat al hacer clic en el botón de cierre
    closeChat.addEventListener('click', function () {
        closeChatWidget();
    });

    // Cerrar el widget del chat al hacer clic en cualquier parte de la página
    document.addEventListener('click', function (e) {
        if (!chatWidget.contains(e.target) && e.target !== chatBubble) {
            closeChatWidget();
        }
    });

    // Función para cerrar el chat con animación
    function closeChatWidget() {
        chatWidget.classList.add('closing');
        setTimeout(() => {
            chatWidget.style.display = 'none';
            chatWidget.classList.remove('closing');
        }, 300); // Duración de la animación (0.3s)
    }

    // Enviar mensaje por WhatsApp
    sendWhatsApp.addEventListener('click', function () {
        const message = encodeURIComponent(chatMessage.value.trim());
        const whatsappUrl = `https://wa.me/5521726585?text=${message}`;
        sendWhatsApp.href = whatsappUrl;
    });

    // Enviar mensaje por correo
    sendEmail.addEventListener('click', function () {
        const message = encodeURIComponent(chatMessage.value.trim());
        const emailUrl = `mailto:rafael_torres@yolotech.com.mx?subject=Consulta&body=${message}`;
        sendEmail.href = emailUrl;
    });
});