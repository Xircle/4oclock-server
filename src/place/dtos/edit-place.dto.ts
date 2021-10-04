import { CreatePlaceInput } from './create-place.dto';
import { PartialType } from '@nestjs/swagger';

export class EditPlaceInput extends PartialType(CreatePlaceInput) {}
