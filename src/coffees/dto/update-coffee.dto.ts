import { IsString } from "class-validator"

export class UpdateCoffeeDto {
    @IsString()
    readonly name?: string

    @IsString()
    readonly brand?: string

    @IsString()
    readonly flavours?: string[]
}
