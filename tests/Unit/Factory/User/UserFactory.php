<?php

namespace App\Unit\Factory\User;

use App\Model\User;

class UserFactory
{
    public function create(
        ?string $username = null
    ) {
        return new User
        ([
            'nick' => $username ?: ,

            ]);
    }
}
