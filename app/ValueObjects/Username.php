<?php

namespace App\ValueObjects;

use http\Exception\InvalidArgumentException;

class Username
{
    private const MIN_LENGTH = 3;
    private const MAX_LENGTH = 16;

    public function __construct(
        private readonly string $username
    )
    {
    }

    public static function fromString(string $username): self
    {
        if (empty($username))
        {
            throw new InvalidArgumentException(trans("Username cannot be empty."));
        }

        if (strlen($username) < 3 || strlen($username) > 16)
        {
            throw new InvalidArgumentException(trans('Invalid username length, must be 3-16 characters.'));
        }

        if (htmlspecialchars($username) != $username)
        {
            throw new InvalidArgumentException(trans('Username has invalid characters.'));
        }

        return new self($username);
    }

    public function toString(): string
    {
        return $this->username;
    }
}
