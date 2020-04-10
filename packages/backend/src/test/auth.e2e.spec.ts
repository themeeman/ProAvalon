import { Test } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as request from 'supertest';
import { TypegooseModule } from 'nestjs-typegoose';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

import { AuthController } from '../auth/auth.controller';
import { LocalStrategy } from '../auth/local.strategy';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JWT_SECRET } from '../getEnvVars';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

// Allow extra time for mongodb-memory-server to download if needed
jest.setTimeout(600000);

describe('Auth', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    // Set up database
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();

    const moduleRef = await Test.createTestingModule({
      // mock dependencies that are coming from AuthModule
      imports: [
        PassportModule,
        JwtModule.register({
          secret: JWT_SECRET,
          signOptions: { expiresIn: '60s' },
        }),
        TypegooseModule.forRoot(mongoUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }),
        UsersModule,
        AuthModule,
      ],
      controllers: [AuthController],
      providers: [LocalStrategy, JwtStrategy],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await mongoServer.stop();
    await app.close();
  });

  it('user able to login after signup', async () => {
    // Good signup
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'test_user',
        password: 'test_password',
        emailAddress: 'test@gmail.com',
      })
      .expect(HttpStatus.CREATED)
      .expect('Signed up username: test_user.');

    // Good login
    let AUTH_KEY;
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'test_user',
        password: 'test_password',
      })
      .expect(HttpStatus.CREATED)
      .then((key) => {
        AUTH_KEY = key.body.accessToken;
      });

    // Good auth key provided
    await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${AUTH_KEY}`)
      .expect(HttpStatus.OK)
      .expect({
        username: 'test_user',
      });
  });

  it('should not create user if username or email exists', async () => {
    // Good signup
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'test_user',
        password: 'test_password',
        emailAddress: 'test@gmail.com',
      })
      .expect(HttpStatus.CREATED)
      .expect('Signed up username: test_user.');

    // Bad signup if username exists
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'test_user',
        password: 'test_password',
        emailAddress: 'test@gmail.com',
      })
      .expect(HttpStatus.CREATED)
      .expect('Username already exists: test_user.');

    // Bad signup if email exists
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'test_user2',
        password: 'test_password',
        emailAddress: 'test@gmail.com',
      })
      .expect(HttpStatus.CREATED)
      .expect('Email already exists: test@gmail.com.');
  });

  it('should not create user on bad input', async () => {
    // Bad signup
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'test_user',
        password: 'test_password',
        // Missing email address
      })
      .expect(HttpStatus.BAD_REQUEST);

    // Bad signup
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'test_user',
        // missing password
        emailAddress: 'test@gmail.com',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should not login user on bad password', async () => {
    // Good signup
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'test_user',
        password: 'test_password',
        emailAddress: 'test@gmail.com',
      })
      .expect(HttpStatus.CREATED)
      .expect('Signed up username: test_user.');

    // Bad login
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'test_user',
        password: 'bad_password',
      })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should not get profile if auth key is not provided', async () => {
    // No auth key provided
    await request(app.getHttpServer())
      .get('/auth/profile')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should not give the profile if auth key is incorrect', async () => {
    // Good signup
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'test_user',
        password: 'test_password',
        emailAddress: 'test@gmail.com',
      })
      .expect(HttpStatus.CREATED)
      .expect('Signed up username: test_user.');

    // Good login
    let AUTH_KEY;
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'test_user',
        password: 'test_password',
      })
      .expect(HttpStatus.CREATED)
      .then((key) => {
        AUTH_KEY = key.body.accessToken;
      });

    // Bad auth key provided
    await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${AUTH_KEY}asdf`)
      .expect(HttpStatus.UNAUTHORIZED);
  });
});