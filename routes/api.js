const express = require('express');
const router = express.Router();
const termuxController = require('../controllers/termux');

router.get('/battery', termuxController.getBatteryStatus);
router.get('/wifi', termuxController.getWifiInfo);
router.get('/location', termuxController.getLocation);
router.post('/toast', termuxController.showToast);
router.post('/vibrate', termuxController.vibrate);
router.get('/contacts', termuxController.getContacts);
router.get('/sms', termuxController.getSMS);
router.get('/call-log', termuxController.getCallLog);
router.get('/info', termuxController.getDeviceInfo);
router.get('/clipboard', termuxController.getClipboard);
router.post('/clipboard', termuxController.setClipboard);
router.post('/notification', termuxController.sendNotification);

module.exports = router;
