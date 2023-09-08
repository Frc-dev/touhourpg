<?php

namespace Application\User;

use App\Application\User\UserService;
use Tests\Unit\Factory\UserServiceMockFactory;
use Tests\Unit\UnitTestCase;

class UserServiceTest extends UnitTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->userServiceMockFactory = new UserServiceMockFactory();
    }

    /** @test
     *  @dataProvider validUsernamesProvider
     */
    public function shouldAllowValidUsername($username)
    {
        $userRepositoryMock = $this->userRepositoryMock();
        $this->userRepositoryShouldReturnUser($userRepositoryMock, $username);
        $userService = $this->userServiceMockFactory->create($userRepositoryMock);

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
