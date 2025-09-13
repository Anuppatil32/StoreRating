const { body } = require('express-validator');

const registerUserValidation = () => [
  body('name').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password')
    .isLength({ min: 8, max: 16 })
    .matches(/^(?=.*[A-Z])(?=.*\W)/),
  body('role').optional().isIn(['user', 'admin', 'owner']),
];

const loginValidation = () => [
  body('email').isEmail(),
  body('password').exists(),
];

module.exports = {
  registerUserValidation,
  loginValidation,
};
