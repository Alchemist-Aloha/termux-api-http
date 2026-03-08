const { exec } = require('child_process');

const executeTermuxCommand = (command, res, options = {}) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ error: 'Internal Server Error', details: stderr.trim() || error.message });
    }
    
    if (options.raw) {
      return res.json({ output: stdout.trim() });
    }

    try {
      // Many termux commands return JSON
      const data = JSON.parse(stdout);
      res.json(data);
    } catch (e) {
      // If not JSON, return as plain text
      res.json({ output: stdout.trim() });
    }
  });
};

// --- System Info & Status ---

exports.getBatteryStatus = (req, res) => {
  executeTermuxCommand('termux-battery-status', res);
};

exports.getWifiInfo = (req, res) => {
  executeTermuxCommand('termux-wifi-connectioninfo', res);
};

exports.getWifiScanInfo = (req, res) => {
  executeTermuxCommand('termux-wifi-scaninfo', res);
};

exports.setWifiEnabled = (req, res) => {
  const { enabled } = req.body;
  const state = enabled ? 'true' : 'false';
  executeTermuxCommand(`termux-wifi-enable ${state}`, res);
};

exports.getLocation = (req, res) => {
  const provider = req.query.provider || 'network';
  const request = req.query.request || 'once';
  executeTermuxCommand(`termux-location -p ${provider} -r ${request}`, res);
};

exports.getDeviceInfo = (req, res) => {
  executeTermuxCommand('termux-info', res);
};

exports.getTelephonyDeviceInfo = (req, res) => {
  executeTermuxCommand('termux-telephony-deviceinfo', res);
};

exports.getTelephonyCellInfo = (req, res) => {
  executeTermuxCommand('termux-telephony-cellinfo', res);
};

// --- Media & Sensors ---

exports.getAudioInfo = (req, res) => {
  executeTermuxCommand('termux-audio-info', res);
};

exports.getCameraInfo = (req, res) => {
  executeTermuxCommand('termux-camera-info', res);
};

exports.getSensors = (req, res) => {
  executeTermuxCommand('termux-sensor -l', res);
};

exports.getSensorData = (req, res) => {
  const sensor = req.params.sensor;
  // Get a single reading
  executeTermuxCommand(`termux-sensor -n 1 -s "${sensor}"`, res);
};

// --- Hardware Control ---

exports.setBrightness = (req, res) => {
  const { value } = req.body; // 0-255 or 'auto'
  if (value === undefined) return res.status(400).json({ error: 'Brightness value is required' });
  executeTermuxCommand(`termux-brightness ${value}`, res);
};

exports.setTorch = (req, res) => {
  const { enabled } = req.body;
  const state = enabled ? 'on' : 'off';
  executeTermuxCommand(`termux-torch ${state}`, res);
};

exports.vibrate = (req, res) => {
  const duration = req.body.duration || 500;
  executeTermuxCommand(`termux-vibrate -d ${duration}`, res);
};

exports.getVolume = (req, res) => {
  executeTermuxCommand('termux-volume', res);
};

exports.setVolume = (req, res) => {
  const { stream, volume } = req.body; // streams: alarm, music, notification, ring, system, voice_call
  if (!stream || volume === undefined) return res.status(400).json({ error: 'Stream and volume are required' });
  executeTermuxCommand(`termux-volume ${stream} ${volume}`, res);
};

// --- Communications ---

exports.getContacts = (req, res) => {
  executeTermuxCommand('termux-contact-list', res);
};

exports.getSMS = (req, res) => {
  const limit = req.query.limit || 10;
  executeTermuxCommand(`termux-sms-list -l ${limit}`, res);
};

exports.sendSMS = (req, res) => {
  const { number, text } = req.body;
  if (!number || !text) return res.status(400).json({ error: 'Number and text are required' });
  const safeText = text.replace(/["';]/g, '');
  executeTermuxCommand(`termux-sms-send -n ${number} "${safeText}"`, res);
};

exports.getCallLog = (req, res) => {
  const limit = req.query.limit || 10;
  executeTermuxCommand(`termux-call-log -l ${limit}`, res);
};

// --- Interaction & UI ---

exports.showToast = (req, res) => {
  const { text, short } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  const duration = short ? '-s' : '';
  const safeText = text.replace(/["';]/g, '');
  executeTermuxCommand(`termux-toast ${duration} "${safeText}"`, res);
};

exports.getClipboard = (req, res) => {
  executeTermuxCommand('termux-clipboard-get', res, { raw: true });
};

exports.setClipboard = (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  const safeText = text.replace(/["';]/g, '');
  executeTermuxCommand(`termux-clipboard-set "${safeText}"`, res);
};

exports.ttsSpeak = (req, res) => {
  const { text, rate, pitch, engine } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  let cmd = `termux-tts-speak "${text.replace(/["';]/g, '')}"`;
  if (rate) cmd += ` -r ${rate}`;
  if (pitch) cmd += ` -p ${pitch}`;
  if (engine) cmd += ` -e ${engine}`;
  executeTermuxCommand(cmd, res);
};

// --- Notifications ---

exports.sendNotification = (req, res) => {
  const { title, content, id, priority, sound, vibrate, lights } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });
  
  let cmd = `termux-notification -t "${title.replace(/["';]/g, '')}" -c "${content.replace(/["';]/g, '')}"`;
  if (id) cmd += ` -i "${id}"`;
  if (priority) cmd += ` --priority ${priority}`;
  if (sound) cmd += ` --sound`;
  if (vibrate) cmd += ` --vibrate ${vibrate}`;
  if (lights) cmd += ` --led-color ${lights}`;
  
  executeTermuxCommand(cmd, res);
};

exports.listNotifications = (req, res) => {
  executeTermuxCommand('termux-notification-list', res);
};

exports.removeNotification = (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Notification ID is required' });
  executeTermuxCommand(`termux-notification-remove "${id}"`, res);
};

// --- Other ---

exports.setWallpaper = (req, res) => {
  const { url, lockscreen } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });
  const target = lockscreen ? '-l' : '';
  executeTermuxCommand(`termux-wallpaper ${target} -u "${url}"`, res);
};

exports.mediaPlayer = (req, res) => {
  const { action, file } = req.body; // play, pause, resume, stop, info
  if (!action) return res.status(400).json({ error: 'Action is required' });
  let cmd = `termux-media-player ${action}`;
  if (file) cmd += ` "${file}"`;
  executeTermuxCommand(cmd, res);
};

exports.recordMicrophone = (req, res) => {
  const { action, file, limit, encoder } = req.body; // info, start, stop, quit
  if (!action) return res.status(400).json({ error: 'Action is required' });
  let cmd = `termux-microphone-record -a ${action}`;
  if (file) cmd += ` -f "${file}"`;
  if (limit) cmd += ` -l ${limit}`;
  if (encoder) cmd += ` -e ${encoder}`;
  executeTermuxCommand(cmd, res);
};

exports.downloadFile = (req, res) => {
  const { url, title, description } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });
  let cmd = `termux-download "${url}"`;
  if (title) cmd += ` -t "${title.replace(/["';]/g, '')}"`;
  if (description) cmd += ` -d "${description.replace(/["';]/g, '')}"`;
  executeTermuxCommand(cmd, res);
};
