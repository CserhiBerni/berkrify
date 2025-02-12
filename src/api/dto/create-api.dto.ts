import { IsString } from "class-validator";

export class CreateApiDto {
    @IsString()
    model: String
    

}
