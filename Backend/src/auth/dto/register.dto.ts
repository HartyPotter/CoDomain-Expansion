import { IsString, IsInt, IsEmail } from 'class-validator';

export class RegisterUserDto {
    @IsString()
    first_name: string

    @IsString()
    last_name: string

    @IsInt()
    age: number;
    
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}