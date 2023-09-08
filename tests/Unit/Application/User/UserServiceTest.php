<?php

namespace Application\User;

use App\Application\User\UserRepository;
use App\Application\User\UserService;
use PHPUnit\Framework\TestCase;
use Tests\Unit\UnitTestCase;

class UserServiceTest extends UnitTestCase
{
    /** @test
     *  @dataProvider validUsernamesProvider
     * */
    public function shouldAllowValidUsername($username)
    {
        $userRepositoryMock = $this->userRepositoryMock();
        $this->shouldReturnUser($userRepositoryMock, $username);

        $userService = new UserService($userRepositoryMock);

        $message = $userService->validateUsername($username);
        $this->assertEmpty($message);
    }

    public function validUsernamesProvider(): array
    {
        return [
            ['alyssa'],
            ['username'],
            ['random123']
        ];
    }
}
