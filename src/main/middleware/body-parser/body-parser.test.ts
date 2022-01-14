import request from 'supertest';
import { Request, Response } from 'express';

import app from '../../config/app';

describe('Body Parser', () => {
  test('should parser body as json', async () => {
    app.post('/test_body_parser', (req: Request, res: Response) => {
      res.send({ name: 'Maria' });
    });

    const { body } = await request(app)
      .post('/test_body_parser')
      .send({ name: 'Maria' });

    expect(body).toEqual({ name: 'Maria' });
  });
});
