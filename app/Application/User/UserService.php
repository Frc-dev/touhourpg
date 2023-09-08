<?php

namespace App\Application\User;

use App\ValueObjects\Username;

class UserService
{
    public function __construct(
        private readonly UserRepository $userRepository
    )
    {
    }

    public function validateUsername(string $username): string
    {
        $message = "";
        !empty($username) ?: $message = trans("Username cannot be empty.");

        try {
            $username = Username::fromString($username);
        } catch (\Exception $e) {
            $message = $e->getMessage();
        }

        !$this->userRepository->findAnyWithName($username->toString()) || ($message = trans("The user already exists."));
        return $message;
    }
}
