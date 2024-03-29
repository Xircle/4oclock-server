// import { Repository } from 'typeorm';
// import { InternalServerErrorException } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import { User, UserRole } from '@user/entities/user.entity';
// import { Message } from '@message/entities/message.entity';
// import { RoomService } from './room.service';
// import { Room } from './entities/room.entity';
// import { UserRepository } from '@user/repositories/user.repository';
// import { MessageRepository } from '@message/repository/message.repository';
// import { RoomRepository } from './repository/room.repository';
// const mockUserRepository = {
//   getRoomsOrderByRecentMessage: jest.fn(),
// };
// const mockMessageRepository = {
//   findOne: jest.fn(),
// };
// const mockRoomRepository = {
//   findOne: jest.fn(),
// };
// type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
// describe('RoomService', () => {
//   let roomService: RoomService;
//   let userRepository: MockRepository<User>;
//   let messageRepository: MockRepository<Message>;
//   let roomRepository: MockRepository<Room>;

//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       providers: [
//         RoomService,
//         {
//           provide: UserRepository,
//           useValue: mockUserRepository,
//         },
//         {
//           provide: MessageRepository,
//           useValue: mockMessageRepository,
//         },
//         {
//           provide: RoomRepository,
//           useValue: mockRoomRepository,
//         },
//       ],
//     }).compile();
//     roomService = module.get<RoomService>(RoomService);
//     userRepository = module.get(UserRepository);
//     messageRepository = module.get(MessageRepository);
//     roomRepository = module.get(RoomRepository);
//   });

//   const placeId = '64';
//   const authUserArgs = {
//     id: '1',
//     email: 'she_lock@naver.com',
//     role: UserRole.Client,
//   };
//   const makeReservationArgs = {
//     placeId: '31',
//     isVaccinated: true,
//   };
//   describe('getRoomByIdWithLoadedUser', () => {
//     test('should fail, if place is closed', async () => {
//       placeService.GetPlaceByIdAndcheckPlaceException.mockResolvedValue({
//         id: '31',
//         isClosed: true,
//       });
//       const result = await reservationService.makeReservation(
//         authUserArgs,
//         makeReservationArgs,
//       );
//       expect(result).toMatchObject({
//         ok: false,
//         error: '이미 마감된 모임입니다.',
//       });
//     });

//     test('should make reservation, if user reserved first time', async () => {
//       const reservationEntity = {
//         id: '1',
//         placeId: makeReservationArgs.placeId,
//         user_id: authUserArgs.id,
//         isCanceled: false,
//         isVaccinated: makeReservationArgs.isVaccinated,
//       };
//       placeService.GetPlaceByIdAndcheckPlaceException.mockResolvedValue({
//         id: '42',
//         isClosed: false,
//       });
//       reservationRepository.findOne.mockResolvedValue(undefined);
//       reservationRepository.create.mockReturnValue(reservationEntity);
//       reservationRepository.save.mockResolvedValue(reservationEntity);

//       const result = await reservationService.makeReservation(
//         authUserArgs,
//         makeReservationArgs,
//       );

//       expect(reservationRepository.findOne).toHaveBeenCalledTimes(1);
//       expect(reservationRepository.findOne).toHaveBeenCalledWith({
//         where: {
//           place_id: makeReservationArgs.placeId,
//           user_id: authUserArgs.id,
//         },
//       });
//       expect(reservationRepository.create).toHaveBeenCalledTimes(1);
//       expect(reservationRepository.create).toHaveBeenCalledWith({
//         place_id: makeReservationArgs.placeId,
//         user_id: authUserArgs.id,
//         isCanceled: false,
//         isVaccinated: makeReservationArgs.isVaccinated,
//       });
//       expect(reservationRepository.save).toHaveBeenCalledTimes(1);
//       expect(reservationRepository.save).toHaveBeenCalledWith(
//         reservationEntity,
//       );
//       expect(result).toMatchObject({ ok: true });
//     });

//     test('should update reservation, if user have reserved before', async () => {
//       const reservationEntity = {
//         id: '1',
//         placeId: makeReservationArgs.placeId,
//         user_id: authUserArgs.id,
//         isCanceled: true,
//         isVaccinated: makeReservationArgs.isVaccinated,
//       };
//       placeService.GetPlaceByIdAndcheckPlaceException.mockResolvedValue({
//         id: '42',
//         isClosed: false,
//       });
//       reservationRepository.findOne.mockResolvedValue(reservationEntity);

//       const result = await reservationService.makeReservation(
//         authUserArgs,
//         makeReservationArgs,
//       );

//       expect(reservationRepository.update).toHaveBeenCalledTimes(1);
//       expect(reservationRepository.update).toHaveBeenCalledWith(
//         {
//           user_id: authUserArgs.id,
//           place_id: makeReservationArgs.placeId,
//         },
//         {
//           isVaccinated: makeReservationArgs.isVaccinated,
//           isCanceled: false,
//           cancelReason: null,
//           detailReason: null,
//         },
//       );
//       expect(result).toMatchObject({ ok: true });
//     });

//     test('should fail, if user already reserved ', async () => {
//       const reservationEntity = {
//         id: '1',
//         placeId: makeReservationArgs.placeId,
//         user_id: authUserArgs.id,
//         isCanceled: false,
//         isVaccinated: makeReservationArgs.isVaccinated,
//       };
//       placeService.GetPlaceByIdAndcheckPlaceException.mockResolvedValue({
//         id: '42',
//         isClosed: false,
//       });
//       reservationRepository.findOne.mockResolvedValue(reservationEntity);

//       const result = await reservationService.makeReservation(
//         authUserArgs,
//         makeReservationArgs,
//       );

//       expect(result).toMatchObject({
//         ok: false,
//         error: '이미 신청하셨습니다.',
//       });
//     });

//     test('should fail, on exception', async () => {
//       placeService.GetPlaceByIdAndcheckPlaceException.mockRejectedValue(
//         new Error(),
//       );
//       expect(
//         reservationService.makeReservation(authUserArgs, makeReservationArgs),
//       ).rejects.toThrow(InternalServerErrorException);
//     });
//   });

//   describe('getRooms', () => {
//     test('should return participants Number', async () => {
//       placeService.GetPlaceByIdAndcheckPlaceException.mockResolvedValue(
//         undefined,
//       );

//       reservationRepository.count.mockResolvedValue(1);

//       const result = await reservationService.getReservationParticipantNumber(
//         placeId,
//       );
//       expect(reservationRepository.count).toHaveBeenCalledTimes(1);
//       expect(reservationRepository.count).toHaveBeenCalledWith({
//         where: {
//           place_id: placeId,
//           isCanceled: false,
//         },
//       });
//       expect(result).toMatchObject({
//         ok: true,
//         participantsNumber: 1,
//       });
//     });

//     test('should fail on exception', async () => {
//       reservationRepository.count.mockRejectedValue(new Error());
//       expect(
//         reservationService.getReservationParticipantNumber(placeId),
//       ).rejects.toThrow(InternalServerErrorException);
//     });
//   });

// });
