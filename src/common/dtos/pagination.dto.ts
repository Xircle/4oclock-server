import { CoreOutput } from '@common/common.interface';
export class PaginationInput {
  page: number;
}

export class PagincationOutput extends CoreOutput {
  totalPages?: number;
  totalResults?: number;
}
