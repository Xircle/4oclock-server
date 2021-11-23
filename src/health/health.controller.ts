import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private diskHealthIndicator: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      () => this.typeOrmHealthIndicator.pingCheck('database'),
      // the process should not use more than 300MB memory
      () =>
        this.memoryHealthIndicator.checkHeap('memory heap', 300 * 1024 * 1024),
      // the used disk storage should not exceed the 50% of the available space
      () =>
        this.diskHealthIndicator.checkStorage('disk health', {
          thresholdPercent: 0.5,
          path: '/',
        }),
    ]);
  }
}
