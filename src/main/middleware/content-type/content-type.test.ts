import request from 'supertest';
import { Request, Response } from 'express';

import app from '../../config/app';

describe('Content Type Middleware', () => {
  test('should content type json default', async () => {
    app.get('/test_content_type', (req: Request, res: Response) => {
      res.send();
    });

    const { header } = await request(app).get('/test_content_type').send();

    expect(header['content-type']).toContain('json');
  });
});
