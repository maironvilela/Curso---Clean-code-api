import request from 'supertest';
import { Request, Response } from 'express';

import app from '../../config/app';

describe('Cors Middleware', () => {
  test('should enable cors', async () => {
    app.get('/test_cors', (req: Request, res: Response) => {
      res.send();
    });

    const { header } = await request(app).get('/test_cors').send();

    expect(header['access-control-allow-origin']).toEqual('*');
    expect(header['access-control-allow-methods']).toEqual('*');
    expect(header['access-control-allow-headers']).toEqual('*');
  });
});
