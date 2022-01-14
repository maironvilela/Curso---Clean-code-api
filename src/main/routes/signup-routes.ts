import { Router } from 'express';

export default (router: Router): void => {
  router.post('/signup', (req, res) => {
    const { name, email, password, passwordConfirmation } = req.body;
    console.log('SIGNUP');
    res.status(201).json({ name, email, password, passwordConfirmation });
  });
};
