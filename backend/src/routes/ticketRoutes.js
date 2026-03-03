const express = require('express');
const rateLimit = require('express-rate-limit');
const ticketController = require('../controllers/ticketController');
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

router.get('/', ticketController.getAll);
router.get('/:id', ticketController.getById);
router.get('/:id/history', ticketController.getHistory);

router.post('/', writeLimiter, ticketController.create);
router.put('/:id', writeLimiter, ticketController.update);
router.put('/:id/status', writeLimiter, ticketController.changeStatus);
router.put('/:id/assign', writeLimiter, ticketController.assign);
router.put('/:id/request-close', writeLimiter, ticketController.requestClose);
router.put('/:id/close-request', writeLimiter, ticketController.handleCloseRequest);

module.exports = router;
