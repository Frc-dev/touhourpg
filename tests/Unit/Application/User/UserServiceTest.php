<?php

namespace Application\User;

use Factory\User\UserServiceMockFactory;
use Tests\Unit\UnitTestCase;

class UserServiceTest extends UnitTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->userServiceMockFactory = new UserServiceMockFactory();
        $this->userFactory = new UserFactory();
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

    /** @test
     *  @dataProvider invalidUsernamesProvider
     */
    public function shouldNotAllowInvalidUsername($username)
    {
        $userService = $this->userServiceMockFactory->create();

        $message = $userService->validateUsername($username);;
        $this->assertNotEmpty($message);
    }

    /** @test */
    public function shouldNotAllowDuplicateUsername($username)
    {
        $userRepositoryMock = $this->userRepositoryMock();
        $user = $this->userFactory->create($username);
        $this->userRepositoryShouldReturnUser($userRepositoryMock, $username, $user);
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

    public function invalidUsernamesProvider()
    {
        return [
            ['<script></script>'],
            ['al'],
            ['']
        ];
    }
}
