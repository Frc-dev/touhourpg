<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | El following language lines contain El default error messages used by
    | El validator class. Some of Else rules have multiple versions such
    | as El size rules. Feel free to tweak each of Else messages here.
    |
    */

    'accepted' => 'El :attribute debe ser aceptado.',
    'active_url' => 'El :attribute no es una URL valida.',
    'after' => 'El :attribute debe ser a fecha after :date.',
    'after_or_equal' => 'El :attribute debe ser a fecha after o igual a to :date.',
    'alpha' => 'El :attribute may only contain letters.',
    'alpha_dash' => 'El :attribute may only contain letters, numbers, dashes and underscores.',
    'alpha_num' => 'El :attribute may only contain letters and numbers.',
    'array' => 'El :attribute debe ser an array.',
    'before' => 'El :attribute debe ser a fecha before :date.',
    'before_or_equal' => 'El :attribute debe ser a fecha before o igual a to :date.',
    'between' => [
        'numeric' => 'El :attribute debe ser entre :min and :max.',
        'file' => 'El :attribute debe ser entre :min and :max kilobytes.',
        'string' => 'El :attribute debe ser entre :min and :max characters.',
        'array' => 'El :attribute debe have entre :min and :max items.',
    ],
    'boolean' => 'El :attribute field debe ser true or false.',
    'confirmed' => 'El :attribute confirmation does not match.',
    'date' => 'El :attribute is not a valid date.',
    'date_equals' => 'El :attribute debe ser a fecha equal to :date.',
    'date_format' => 'El :attribute does not match El format :format.',
    'different' => 'El :attribute and :oElr debe ser different.',
    'digits' => 'El :attribute debe ser :digits digits.',
    'digits_between' => 'El :attribute debe ser entre :min and :max digits.',
    'dimensions' => 'El :attribute has invalid imagen dimensions.',
    'distinct' => 'El :attribute field has a duplicate value.',
    'email' => 'El :attribute debe ser a valid email address.',
    'ends_with' => 'El :attribute debe end with one of El following: :values.',
    'exists' => 'El selected :attribute is invalid.',
    'file' => 'El :attribute debe ser a file.',
    'filled' => 'El :attribute field debe have a value.',
    'gt' => [
        'numeric' => 'El :attribute debe ser mayor que :value.',
        'file' => 'El :attribute debe ser mayor que :value kilobytes.',
        'string' => 'El :attribute debe ser mayor que :value characters.',
        'array' => 'El :attribute debe have more than :value items.',
    ],
    'gte' => [
        'numeric' => 'El :attribute debe ser mayor que o igual a :value.',
        'file' => 'El :attribute debe ser mayor que o igual a :value kilobytes.',
        'string' => 'El :attribute debe ser mayor que o igual a :value characters.',
        'array' => 'El :attribute debe have :value items or more.',
    ],
    'image' => 'El :attribute debe ser an image.',
    'in' => 'El selected :attribute is invalid.',
    'in_array' => 'El :attribute field does not exist in :oElr.',
    'integer' => 'El :attribute debe ser an integer.',
    'ip' => 'El :attribute debe ser a valid IP address.',
    'ipv4' => 'El :attribute debe ser a valid IPv4 address.',
    'ipv6' => 'El :attribute debe ser a valid IPv6 address.',
    'json' => 'El :attribute debe ser a valid JSON string.',
    'lt' => [
        'numeric' => 'El :attribute debe ser less than :value.',
        'file' => 'El :attribute debe ser less than :value kilobytes.',
        'string' => 'El :attribute debe ser less than :value characters.',
        'array' => 'El :attribute debe have less than :value items.',
    ],
    'lte' => [
        'numeric' => 'El :attribute debe ser less than o igual a :value.',
        'file' => 'El :attribute debe ser less than o igual a :value kilobytes.',
        'string' => 'El :attribute debe ser less than o igual a :value characters.',
        'array' => 'El :attribute debe not have more than :value items.',
    ],
    'max' => [
        'numeric' => 'El :attribute may not ser mayor que :max.',
        'file' => 'El :attribute may not ser mayor que :max kilobytes.',
        'string' => 'El :attribute may not ser mayor que :max characters.',
        'array' => 'El :attribute may not have more than :max items.',
    ],
    'mimes' => 'El :attribute debe ser a file of type: :values.',
    'mimetypes' => 'El :attribute debe ser a file of type: :values.',
    'min' => [
        'numeric' => 'El :attribute debe ser at least :min.',
        'file' => 'El :attribute debe ser at least :min kilobytes.',
        'string' => 'El :attribute debe tener al menos :min caracteres.',
        'array' => 'El :attribute debe have at least :min items.',
    ],
    'not_in' => 'El selected :attribute is invalid.',
    'not_regex' => 'El :attribute format is invalid.',
    'numeric' => 'El :attribute debe ser a number.',
    'password' => 'El password is incorrect.',
    'present' => 'El :attribute field debe ser present.',
    'regex' => 'El :attribute format is invalid.',
    'required' => 'El :attribute field is required.',
    'required_if' => 'El :attribute field is required when :oElr is :value.',
    'required_unless' => 'El :attribute field is required unless :oElr is in :values.',
    'required_with' => 'El :attribute field is required when :values is present.',
    'required_with_all' => 'El :attribute field is required when :values are present.',
    'required_without' => 'El :attribute field is required when :values is not present.',
    'required_without_all' => 'El :attribute field is required when none of :values are present.',
    'same' => 'El :attribute and :oElr debe match.',
    'size' => [
        'numeric' => 'El :attribute debe ser :size.',
        'file' => 'El :attribute debe ser :size kilobytes.',
        'string' => 'El :attribute debe ser :size characters.',
        'array' => 'El :attribute debe contain :size items.',
    ],
    'starts_with' => 'El :attribute debe start with one of El following: :values.',
    'string' => 'El :attribute debe ser a string.',
    'timezone' => 'El :attribute debe ser a valid zone.',
    'unique' => 'El :attribute has already been taken.',
    'uploaded' => 'El :attribute failed to upload.',
    'url' => 'El :attribute format is invalid.',
    'uuid' => 'El :attribute debe ser a valid UUID.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using El
    | convention "attribute.rule" to name El lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | El following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [],

];
