const express = require('express');
const router = express.Router();
const termuxController = require('../controllers/termux');

// System & Connectivity
router.get('/battery', termuxController.getBatteryStatus);
router.get('/wifi', termuxController.getWifiInfo);
router.get('/wifi/scan', termuxController.getWifiScanInfo);
router.post('/wifi/enable', termuxController.setWifiEnabled);
router.get('/location', termuxController.getLocation);
router.get('/info', termuxController.getDeviceInfo);
router.get('/telephony/device', termuxController.getTelephonyDeviceInfo);
router.get('/telephony/cell', termuxController.getTelephonyCellInfo);

// Media & Sensors
router.get('/audio', termuxController.getAudioInfo);
router.get('/camera', termuxController.getCameraInfo);
router.get('/sensors', termuxController.getSensors);
router.get('/sensors/:sensor', termuxController.getSensorData);

// Hardware Control
router.post('/brightness', termuxController.setBrightness);
router.post('/torch', termuxController.setTorch);
router.post('/vibrate', termuxController.vibrate);
router.get('/volume', termuxController.getVolume);
router.post('/volume', termuxController.setVolume);

// Communications
router.get('/contacts', termuxController.getContacts);
router.get('/sms', termuxController.getSMS);
router.post('/sms/send', termuxController.sendSMS);
router.get('/call-log', termuxController.getCallLog);

// Interaction & UI
router.get('/clipboard', termuxController.getClipboard);
router.post('/clipboard', termuxController.setClipboard);
router.post('/toast', termuxController.showToast);
router.post('/tts', termuxController.ttsSpeak);
router.post('/wallpaper', termuxController.setWallpaper);
router.post('/media/player', termuxController.mediaPlayer);
router.post('/microphone/record', termuxController.recordMicrophone);
router.post('/download', termuxController.downloadFile);

// Notifications
router.get('/notifications', termuxController.listNotifications);
router.post('/notification', termuxController.sendNotification);
router.post('/notification/remove', termuxController.removeNotification);

module.exports = router;
