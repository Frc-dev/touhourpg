<?php

namespace App\Application\User;

use App\Model\User;

class UserRepository
{
    public function findAnyWithName($nick): ?User
    {
        return User::where('nick', $nick)->first();
    }
}
