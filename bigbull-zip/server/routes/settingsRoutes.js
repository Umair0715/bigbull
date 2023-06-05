const { createSettings , getSettings } = require('../controllers/settingsController');

const router = require('express').Router();

router.route('/')
    .post(createSettings)
    .get(getSettings);

module.exports = router;