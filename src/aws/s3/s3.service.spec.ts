import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { S3Service } from '@aws/s3/s3.service';

const mockConfigService = {
  get: jest.fn(),
};

describe('S3Service', () => {
  let s3Service: S3Service;
  let configService: typeof mockConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();
    s3Service = module.get<S3Service>(S3Service);
    configService = module.get(ConfigService);
  });

  test('should be defined', () => {
    expect(s3Service).toBeDefined();
  });

  describe('uploadToS3', () => {
    test('should get location ', async () => {
        
    });
  });
});
