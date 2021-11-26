import { Place } from '@place/entities/place.entity';

export class PlacesWithMetadata {
  places: Place[];
  metadata: PlaceMetaData;
}

export class PlaceMetaData {
  totalPages: number;
  page: number;
}
