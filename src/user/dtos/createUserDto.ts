import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    username: string;

    @IsString()
    @Matches()
    password: string;
}