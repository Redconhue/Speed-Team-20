import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
// 明确导入supertest类型，解决类型推断问题
import { SuperTest, Test as SuperTestTest } from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let agent: SuperTest<SuperTestTest>; // 声明测试代理的类型

  // 初始化应用（异步处理，确保类型安全）
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    // 初始化supertest代理，绑定应用的HTTP服务器
    agent = request(app.getHttpServer());
  });

  // 测试结束后关闭应用，释放资源
  afterEach(async () => {
    await app.close();
  });

  // 测试根路由GET请求（使用async/await明确异步流程）
  it('/ (GET)', async () => {
    // 发送请求并显式断言响应类型，解决no-unsafe-member-access
    const response = await agent.get('/').expect(200) as { text: string };
    // 验证响应内容
    expect(response.text).toBe('Hello World!');
  });

  // 可选：添加一个测试404路由的用例（演示错误处理的类型安全）
  it('/invalid-route (GET) should return 404', async () => {
    try {
      // 发送请求到不存在的路由
      await agent.get('/invalid-route').expect(404);
    } catch (err) {
      // 明确错误类型，解决no-unsafe-assignment
      const error = err as { status: number; response: { text: string } };
      expect(error.status).toBe(404);
      expect(error.response.text).toContain('Not Found');
    }
  });
});