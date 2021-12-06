import { UserService } from './user.service';
import { Test } from '@nestjs/testing';

describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();
    service = module.get(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it.todo('findUserById');
  // it.todo('me');
  // it.todo('seeRandomProfile');
  // it.todo('seeUserById');
  // it.todo('getMyPlace');
  // it.todo('editProfile');
});
