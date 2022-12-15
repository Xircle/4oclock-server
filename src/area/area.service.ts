import { Injectable } from '@nestjs/common';
import { AreaRepository } from './repositories/area.repository';

@Injectable()
export class AreaService {
  constructor(private areaRepository: AreaRepository) {}
  public async getAreas() {
    try {
      const areas = await this.areaRepository.find({ is_closed: false });
      return { ok: true, areas: areas };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
