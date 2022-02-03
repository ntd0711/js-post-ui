import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export const toast = {
    success(message) {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            style: {
                background: '#2e7d32',
            },
        }).showToast()
    },

    error(message) {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            style: {
                background: '#c62828',
            },
        }).showToast()
    },

    info(message) {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            style: {
                background: '#1565c0',
            },
        }).showToast()
    },
}
