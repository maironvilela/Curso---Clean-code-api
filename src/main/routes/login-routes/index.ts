import { Request, Router, Response } from 'express';

export default (router: Router): void => {
  router.post('/login', (req: Request, res: Response) => {
    res.status(203).json({ message: 'OK' });
  });
};
