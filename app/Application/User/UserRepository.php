<?php

namespace App\Application\User;

use App\Model\User;

class UserRepository
{
    public function findAnyWithName($nick): ?User
    {
        dd('you shouldnt enter here');
        return User::where('nick', $nick)->first();
    }
}
