<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Model\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Contracts\Validation\Validator as ContractsValidator;

class RegisterController extends Controller
{
    use RegistersUsers;
    protected string $redirectTo = RouteServiceProvider::HOME;

    public function __construct(
    )
    {
        $this->middleware('guest');
    }

    protected function validator(array $data): ContractsValidator
    {
        return Validator::make($data, [
            'nick' => ['required', 'string', 'min:3', 'max:16', 'unique:users'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:4'],
        ]);
    }

    protected function create(array $data): User
    {
        return User::create([
            'nick' => $data['nick'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'created_at' => date(now())
        ]);
    }

    public function validateField(): void
    {
        //validate specific field and send error message in case it's not valid
        $value = $_POST['value'];
        $field = $_POST['field'];

        $validator = $this->validator([$field => $value]);

        if ($validator->fails()) {
            echo json_encode($validator->errors());
        }
    }
}
