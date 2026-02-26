const authService = require('../services/authService');
const logger = require('../utils/logger');

const authController = {
  async login(req, res) {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    logger.info('User logged in', { userId: result.user.id, email: result.user.email });

    res.json({
      success: true,
      data: result,
    });
  },

  async me(req, res) {
    const user = await authService.getProfile(req.user.id);

    res.json({
      success: true,
      data: user,
    });
  },
};

module.exports = authController;
