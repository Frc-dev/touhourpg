<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validación del idioma
    |--------------------------------------------------------------------------
    |
    | Las siguientes líneas de idioma contienen los mensajes de error predeterminados utilizados por
    | La clase validadora. Algunas de estas reglas tienen múltiples versiones tales
    | como las reglas de tamaño. Siéntase libre de modificar cada uno de estos mensajes aquí.
    |
    */

    'accepted' => 'El :attribute debe ser aceptado.',
    'active_url' => 'El :attribute no es una URL valida.',
    'after' => 'El :attribute debe ser una fecha posterior a :date.',
    'after_or_equal' => 'El :attribute debe ser a fecha posterior o igual a :date.',
    'alpha' => 'El :attribute solo puede contener letras.',
    'alpha_dash' => 'El :attribute solo puede contener letras, numeros, guiones y barras bajas.',
    'alpha_num' => 'El :attribute solo puede contener letras y numeros.',
    'array' => 'El :attribute debe ser un array.',
    'before' => 'El :attribute debe ser una fecha anterior a :date.',
    'before_or_equal' => 'El :attribute debe ser una fecha anterior o igual a :date.',
    'between' => [
        'numeric' => 'El :attribute debe ser entre :min y :max.',
        'file' => 'El :attribute debe ser entre :min y :max kilobytes.',
        'string' => 'El :attribute debe ser entre :min y :max characters.',
        'array' => 'El :attribute debe have entre :min y :max items.',
    ],
    'boolean' => 'El :attribute debe ser verdadero o falso.',
    'confirmed' => 'El :attribute confirmado no coincide.',
    'date' => 'El :attribute no es una fecha valida.',
    'date_equals' => 'El :attribute debe ser una fecha igual a :date.',
    'date_format' => 'El :attribute no coincide con el formato :format.',
    'different' => 'El :attribute y :other deben ser diferentes.',
    'digits' => 'El :attribute debe ser :digits digitos.',
    'digits_between' => 'El :attribute debe ser entre :min y :max digitos.',
    'dimensions' => 'El :attribute tiene unas dimensiones invalidas.',
    'distinct' => 'El :attribute tiene un valor ya existente.',
    'email' => 'El :attribute debe ser una direccion de correo valida.',
    'ends_with' => 'El :attribute debe terminar con uno de los siguientes valores: :values.',
    'exists' => 'El selected :attribute no es valido.',
    'file' => 'El :attribute debe ser un archivo.',
    'filled' => 'El :attribute debe tener un valor.',
    'gt' => [
        'numeric' => 'El :attribute debe ser mayor que :value.',
        'file' => 'El :attribute debe ser mayor que :value kilobytes.',
        'string' => 'El :attribute debe ser mayor que :value caracteres.',
        'array' => 'El :attribute debe tener mas de :value items.',
    ],
    'gte' => [
        'numeric' => 'El :attribute debe ser mayor que o igual a :value.',
        'file' => 'El :attribute debe ser mayor que o igual a :value kilobytes.',
        'string' => 'El :attribute debe ser mayor que o igual a :value characters.',
        'array' => 'El :attribute debe tener :value items o mas.',
    ],
    'image' => 'El :attribute debe ser una imagen.',
    'in' => 'El :attribute seleccionado no es valido.',
    'in_array' => 'El :attribute no existe en la lista :other.',
    'integer' => 'El :attribute debe ser un numero.',
    'ip' => 'El :attribute debe ser una direccion IP valida.',
    'ipv4' => 'El :attribute debe ser una direccion IPv4 valida.',
    'ipv6' => 'El :attribute debe ser una direccion IPv6 valida.',
    'json' => 'El :attribute debe ser una cadena JSON valida.',
    'lt' => [
        'numeric' => 'El :attribute debe ser menor que :value.',
        'file' => 'El :attribute debe ser menor que :value kilobytes.',
        'string' => 'El :attribute debe ser menor que :value characters.',
        'array' => 'El :attribute debe tener menos de :value items.',
    ],
    'lte' => [
        'numeric' => 'El :attribute debe ser menor que o igual a :value.',
        'file' => 'El :attribute debe ser menor que o igual a :value kilobytes.',
        'string' => 'El :attribute debe ser menor que o igual a :value characters.',
        'array' => 'El :attribute debe no tener mas de :value items.',
    ],
    'max' => [
        'numeric' => 'El :attribute no puede ser mayor que :max.',
        'file' => 'El :attribute no puede ser mayor que :max kilobytes.',
        'string' => 'El :attribute no puede ser mayor que :max characters.',
        'array' => 'El :attribute no puede have more que :max items.',
    ],
    'mimes' => 'El :attribute debe ser un archivo de tipo: :values.',
    'mimetypes' => 'El :attribute debe ser un archivo de tipo: :values.',
    'min' => [
        'numeric' => 'El :attribute debe ser por lo menos :min.',
        'file' => 'El :attribute debe ser por lo menos :min kilobytes.',
        'string' => 'El :attribute debe tener al menos :min caracteres.',
        'array' => 'El :attribute debe tener al menos :min items.',
    ],
    'not_in' => 'El :attribute seleccionado no es valido.',
    'not_regex' => 'El formato de :attribute no es valido.',
    'numeric' => 'El :attribute debe ser un numero.',
    'password' => 'La contrasena es incorrecta.',
    'present' => 'El :attribute debe estar presente.',
    'regex' => 'El formato del :attribute no es valido.',
    'required' => 'El campo :attribute es requerido.',
    'required_if' => 'El campo :attribute es requerido cuando el campo :other es :value.',
    'required_unless' => 'El campo :attribute es requerido a menos que :other esté presente en :values.',
    'required_with' => 'El campo :attribute es requerido cuando :values está presente.',
    'required_with_all' => 'El campo :attribute es requerido cuando :values está presente.',
    'required_without' => 'El campo :attribute es requerido cuando :values no está presente.',
    'required_without_all' => 'El campo :attribute es requerido cuando ningún :values está presente.',
    'same' => 'El campo :attribute y :other debe coincidir.',
    'size' => [
        'numeric' => 'El campo :attribute debe ser :size.',
        'file' => 'El campo :attribute debe tener :size kilobytes.',
        'string' => 'El campo :attribute debe tener :size caracteres.',
        'array' => 'El campo :attribute debe contener :size elementos.',
    ],
    'starts_with' => 'El :attribute debe empezar con uno de los siguientes valores :values',
    'string' => 'El campo :attribute debe ser una cadena.',
    'timezone' => 'El campo :attribute debe ser una zona válida.',
    'unique' => 'El campo :attribute ya ha sido tomado.',
    'uploaded' => 'El campo :attribute no ha podido ser cargado.',
    'uppercase' => 'El :attribute debe estar en mayúsculas',
    'url' => 'El formato de :attribute no es válido.',
    'ulid' => 'El :attribute debe ser un ULID valido.',
    'uuid' => 'El :attribute debe ser un UUID valido.',

    /*
    |--------------------------------------------------------------------------
    | Validación del idioma personalizado
    |--------------------------------------------------------------------------
    |
    |   Aquí puede especificar mensajes de validación personalizados para atributos utilizando el
    | convención "attribute.rule" para nombrar las líneas. Esto hace que sea rápido
    | especifique una línea de idioma personalizada específica para una regla de atributo dada.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Atributos de validación personalizados
    |--------------------------------------------------------------------------
    |
    | Las siguientes líneas de idioma se utilizan para intercambiar los marcadores de posición de atributo.
    | con algo más fácil de leer, como la dirección de correo electrónico.
    | de "email". Esto simplemente nos ayuda a hacer los mensajes un poco más limpios.
    |
    */

    'attributes' => [],

];
