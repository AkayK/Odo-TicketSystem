const express = require('express');
const rateLimit = require('express-rate-limit');
const categoryController = require('../controllers/categoryController');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, error: 'Too many requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(verifyToken);

router.get('/', categoryController.getAll);
router.get('/departments', categoryController.getDepartments);
router.get('/:id', categoryController.getById);

router.post('/', requireRole('admin'), writeLimiter, categoryController.create);
router.put('/:id', requireRole('admin'), writeLimiter, categoryController.update);
router.delete('/:id', requireRole('admin'), writeLimiter, categoryController.toggleActive);

module.exports = router;
