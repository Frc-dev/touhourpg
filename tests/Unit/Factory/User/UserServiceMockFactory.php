<?php

namespace Factory\User;

use App\Application\User\UserService;
use PHPUnit\Framework\MockObject\MockObject;
use Tests\Unit\UnitTestCase;

class UserServiceMockFactory extends UnitTestCase
{
    //create userService with dependencies
    public function create(
        ?MockObject $userRepository = null
    ): UserService
    {
        return new UserService(
            $userRepository ?: $this->userRepositoryMock()
        );
    }
}
