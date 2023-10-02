<?php

return [
    'welcome' => [
        'author' => 'por Francis Rodriguez'
    ],
    'auth' => [
        'password' => [
            'singular_entity' => 'Contraseña',
            'reset' => 'Reiniciar contraseña',
            'confirm' => 'Confirmar contraseña',
            'empty' => 'La contraseña no puede estar vacía',
            'short' => 'La contraseña es demasiado corta',
            'mismatch' => 'Las contraseñas no coinciden',
            'forgot' => '¿Olvidaste tu contraseña?',
            'reset_link' => 'Envíar enlace para reiniciar contraseña',
            'email' => 'Recuerda que debes haber enlazado tu cuenta a una dirección de correo para usar esta opción.',
            'reset_short' => 'La contraseña debe tener 4 caracteres mínimo'
        ],
        'email' => [
            'singular_entity' => 'Dirección de correo',
            'optional' => 'La dirección de correo es opcional, pero la necesitaremos si olvidas tu contraseña. Prometemos no enviarte correo basura.',
            'empty' => 'La dirección de correo no puede estar vacía',
            'invalid' => 'Dirección de correo no válida',
            'exists' => 'Esta dirección ya está en uso',
        ],
        'user' => [
            'name' => 'Nombre de usuario',
            'empty' => 'El usuario no puede estar vacío',
            'invalid_length' => 'Longitud de usuario no permitida',
            'exists' => 'El usuario ya está en uso'
        ],
        'login_remember' => 'Recuérdame',
        'register' => [
            'title' => 'Registro',
            'confirm' => 'Confirmar registro'
        ]
    ],
    'header' => [
        'home' => 'Inicio',
        'login' => 'Iniciar sesión',
        'logout' => 'Cerrar sesión',
        'register' => 'Registrarse',
    ],
    'mail' => [
        'rights' => 'Todos los derechos reservados',
        'copy_link' => 'Si tienes problemas para acceder al botón de ":actionText", copia y pega la URL de abajo',
        'web_browser' => 'en tu navegador:',
        'salute_formal' => 'Saludos',
        'salute' => 'Hola',
        'change_password_text' => 'Estas recibiendo este correo porque has olvidado tu contraseña, clica en este botón para cambiarla',
    ]
];
