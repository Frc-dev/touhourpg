<?php

namespace Tests\Feature;

use Tests\TestCase;

class RegisterTest extends TestCase
{
    /** @test */
    public function testRegisterRoute()
    {
        $response = $this->get('register');
        $response->assertStatus(200);
    }

    /**
     * @test
     * @dataProvider validRegisterInputs
     */
    public function testRegisterValidationPass($nick, $email, $password)
    {
        $response = $this->post(
            'register',
            [
                'nick' => $nick,
                'email' => $email,
                'password' => $password,
                'password_confirmation' => $password
            ]
        );

        $response->assertStatus(200);
    }

    /**
     * @test
     * @dataProvider invalidRegisterInputs
     */
    public function testRegisterValidationFail($nick, $email, $password)
    {
        $response = $this->post(
            'register',
            [
                'nick' => $nick,
                'email' => $email,
                'password' => $password,
                'password_confirmation' => $password
            ]
        );

        $response->assertStatus(500);
    }

    public function validRegisterInputs(): array
    {
        return [
            [
                'nick' => 'AzuraSkies',
                'email' => '',
                'password' => 'mangledbeef'
            ],
            [
                'nick' => 'Anthoine_Griezz1',
                'email' => 'anthoine@gmail.com',
                'password' => 'sacrebleu'
            ],
            [
                'nick' => 'the-destroyer',
                'email' => '',
                'password' => 'nope'
            ],
            [
                'nick' => 'fbi',
                'email' => 'fbi@gov.com',
                'password' => 'iseeyou'
            ]
        ];
    }

    public function invalidRegisterInputs(): array
    {
        return [
            [
                'nick' => 'AzuraSkies',
                'email' => 'idontcareabouttheemail',
                'password' => 'mangledbeef'
            ],
            [
                'nick' => 'Anthoine_Griezmann1',
                'email' => 'anthoine@gmail.com',
                'password' => 'sacrebleu'
            ],
            [
                'nick' => '<?php echo?>>',
                'email' => '',
                'password' => 'nope'
            ],
            [
                'nick' => 'fbi',
                'email' => 'fbi@gov.com',
                'password' => 'aaa'
            ],
            [
                'nick' => 'no',
                'email' => 'fbi@gov.com',
                'password' => 'aaaa'
            ]
        ];
    }
}
