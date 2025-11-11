import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SuperTest, Test as SuperTestTest } from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let agent: SuperTest<SuperTestTest>; 
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    agent = request(app.getHttpServer());
  });
  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', async () => {
    const response = await agent.get('/').expect(200) as { text: string };
    expect(response.text).toBe('Hello World!');
  });

  it('/invalid-route (GET) should return 404', async () => {
    try {
      await agent.get('/invalid-route').expect(404);
    } catch (err) {
      const error = err as { status: number; response: { text: string } };
      expect(error.status).toBe(404);
      expect(error.response.text).toContain('Not Found');
    }
  });
});