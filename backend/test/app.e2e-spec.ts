import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/')
      .expect(200) as { text: string }; // 明确响应类型断言
    expect(response.text).toBe('Hello World!');
  });

  it('should handle error', async () => {
    try {
      await request(app.getHttpServer())
        .get('/invalid-route')
        .expect(404);
    } catch (err) {
        const error = err as { status: number; text: string }; // 明确错误类型断言
        expect(error.status).toBe(404);
        expect(error.text).toContain('Not Found');
    }
  });
});