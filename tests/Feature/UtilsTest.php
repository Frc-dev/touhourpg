<?php

namespace Tests\Feature;

use Tests\TestCase;

class UtilsTest extends TestCase
{
    /**
     * @test
     * @dataProvider localeRoutesProvider
     */
    public function testSetLocaleRoute($route)
    {
        //this test only checks 302, which is a redirect, not whether the session would have changed to a valid locale, which is responsibility of a unit test
        $response = $this->get($route);
        $response->assertStatus(302);
    }

    public function localeRoutesProvider(): array
    {
        return [
            ['/locale/es'],
            ['/locale/en'],
            ['/locale/jp']
        ];
    }
}
