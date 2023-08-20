<?php

namespace Tests\Unit;

use GuzzleHttp\Client;
use PHPUnit\Framework\TestCase;

class WelcomeTest extends TestCase
{
    public function setClient(): Client
    {
        return new Client([
            env('APP_URL'), [
                'request.options' => [
                    'exceptions' => false
                ]
            ]
        ]);
    }

    /**
     * @test
     * @dataProvider welcomeRoutesProvider
     */
    public function testWelcomeRoute($route)
    {
        $client = $this->setClient();

        $request = $client->get($route);
        $response = $request->send();

        $this->assertEquals(201, $response->getStatusCode());
    }

    public function welcomeRoutesProvider(): array
    {
        return [
            ['/'],
            ['/welcome']
        ];
    }
}
