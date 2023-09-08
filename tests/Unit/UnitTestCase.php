<?php

namespace Tests\Unit;

use App\Application\User\UserRepository;
use App\Model\User;
use PHPUnit\Framework\MockObject\MockObject;
use Tests\TestCase;

class UnitTestCase extends TestCase
{
    //add mocks and stuff
    public function userRepositoryMock(): MockObject|UserRepository
    {
        return $this->createMock(UserRepository::class);
    }

    public function userRepositoryShouldReturnUser($userRepository, string $username, ?User $user = null): void
    {
        $userRepository->expects($this->once())
            ->method('findAnyWithName')
            ->with($username)
            ->willReturn($user);
    }
}
