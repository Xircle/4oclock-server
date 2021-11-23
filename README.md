# 네시모해, Xircle

This project is source code of `4o'clock` server.

> `4o'clock` is a meeting reservation platform for university students. It provides you with lots of places where you can make any kinds of networks. Feel free to make a network in 4o'clock

Website link: https://www.4oclock.kr

## Project Stack

Following items are core backend technologies used in this project:

- NestJs
- TypeScript
- TypeORM
- PostgreSQL
- AWS
  - Lambda
  - CloudFront
  - S3

### Infra

- Heroku for server
- AWS S3 for static image
- AWS Cloudfront for S3 origin

## Upcoming Feature

- [x] Chatting
- [x] Review other participants, After meeting

## Challenge

- [x] CloudFront on S3 image origin
- [x] Thumbnail image resizing with Lambda@Edge
- [ ] Docker compose for production
- [ ] AWS ECS fargate for container-based infra
- [ ] Microservice NestJs server
- [ ] Test code (50% coverage)
