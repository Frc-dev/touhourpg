<?php

namespace Tests\Feature;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class WelcomeTest extends TestCase
{
    /**
     * @test
     * @dataProvider welcomeRoutesProvider
     */
    public function testWelcomeRoute($route)
    {
        $response = $this->get($route);

        $response->assertStatus(200);
    }

    public function welcomeRoutesProvider(): array
    {
        return [
            ['/'],
            ['/welcome']
        ];
    }
}
