import { MessageService } from './message.service';
import { Test } from '@nestjs/testing';
import { RoomService } from '@room/room.service';
import { Repository } from 'typeorm';
import { User, UserRole } from '@user/entities/user.entity';
import { Room } from '@room/entities/room.entity';
import { Message } from './entities/message.entity';
import { UserRepository } from '@user/repositories/user.repository';
import { RoomRepository } from '@room/repository/room.repository';
import { MessageRepository } from './repository/message.repository';
import { InternalServerErrorException } from '@nestjs/common';

const mockRoomServiceFn = () => ({
  getRoomByIdWithLoadedUser: jest.fn(),
});
const mockUserRepository = {
  findOne: jest.fn(),
};
const mockRoomRepository = {
  create: jest.fn(),
  save: jest.fn(),
};
const mockMessageRepository = {
  getRoomsMessages: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('MessageService', () => {
  let messageService: MessageService;
  const mockRoomService = mockRoomServiceFn();
  let roomService: typeof mockRoomService;
  let userRepository: MockRepository<User>;
  let roomRepository: MockRepository<Room>;
  let messageRepository: MockRepository<Message> & typeof mockMessageRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: RoomService,
          useValue: mockRoomServiceFn(),
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: RoomRepository,
          useValue: mockRoomRepository,
        },
        {
          provide: MessageRepository,
          useValue: mockMessageRepository,
        },
      ],
    }).compile();
    messageService = module.get<MessageService>(MessageService);
    roomService = module.get(RoomService);
    userRepository = module.get(UserRepository);
    roomRepository = module.get(RoomRepository);
    messageRepository = module.get(MessageRepository);
  });

  test('should be defined', () => {
    expect(MessageService).toBeDefined();
  });

  const userArgs = {
    id: '1',
    email: 'she_lock@naver.com',
    role: UserRole.Client,
  };
  describe('getRoomsMessages', () => {
    const roomId = '64';

    test('should return ok, if roomId is 0', async () => {
      const result = await messageService.getRoomsMessages(
        userArgs,
        '0',
        expect.any(String),
        expect.any(Number),
        expect.any(Number),
      );
      expect(result).toMatchObject({
        ok: true,
        messages: [],
      });
    });

    test('should return false, if room does not exist', async () => {
      roomService.getRoomByIdWithLoadedUser.mockResolvedValue(undefined);
      const result = await messageService.getRoomsMessages(
        userArgs,
        roomId,
        expect.any(String),
        expect.any(Number),
        expect.any(Number),
      );
      expect(result).toMatchObject({
        ok: false,
        error: '권한이 없습니다.',
      });
    });

    test('should return false, if user does not have authority', async () => {
      const existingRoom = {
        id: roomId,
        users: [
          { id: '100', email: '3donny@naver.com', role: UserRole.Client },
          { id: '2', email: '2donny@naver.com', role: UserRole.Client },
        ],
      };
      roomService.getRoomByIdWithLoadedUser.mockResolvedValue(existingRoom);
      const result = await messageService.getRoomsMessages(
        userArgs,
        roomId,
        expect.any(String),
        expect.any(Number),
        expect.any(Number),
      );
      expect(result).toMatchObject({
        ok: false,
        error: '권한이 없습니다.',
      });
    });

    test('should return messages', async () => {
      const existingRoom = {
        id: roomId,
        users: [
          { ...userArgs },
          { id: '2', email: '2donny@naver.com', role: UserRole.Client },
        ],
      };
      const response = {
        ok: true,
        messages: [],
        meta: {
          totalItems: expect.any(Number),
          totalPages: expect.any(Number),
          currentPage: expect.any(Number),
          hasMore: expect.any(Boolean),
        },
      };
      roomService.getRoomByIdWithLoadedUser.mockResolvedValue(existingRoom);
      messageRepository.getRoomsMessages.mockResolvedValue(response);
      const result = await messageService.getRoomsMessages(
        userArgs,
        roomId,
        expect.any(String),
        expect.any(Number),
        expect.any(Number),
      );
      expect(roomService.getRoomByIdWithLoadedUser).toHaveBeenCalledTimes(1);
      expect(roomService.getRoomByIdWithLoadedUser).toHaveBeenCalledWith(
        roomId,
      );
      expect(messageRepository.getRoomsMessages).toHaveBeenCalledTimes(1);
      expect(messageRepository.getRoomsMessages).toHaveBeenCalledWith(
        userArgs,
        roomId,
        expect.any(String),
        expect.any(Number),
        expect.any(Number),
      );
      expect(result).toMatchObject(response);
    });

    test('should fail on exception', async () => {
      roomService.getRoomByIdWithLoadedUser.mockRejectedValue(new Error());
      expect(
        messageService.getRoomsMessages(
          userArgs,
          roomId,
          expect.any(String),
          expect.any(Number),
          expect.any(Number),
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('sendMessage', () => {
    test('should get location ', async () => {});
  });
});
