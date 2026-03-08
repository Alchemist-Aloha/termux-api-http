const { exec } = require('child_process');

const executeTermuxCommand = (command, res) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ error: 'Internal Server Error', details: stderr });
    }
    try {
      // Many termux commands return JSON
      const data = JSON.parse(stdout);
      res.json(data);
    } catch (e) {
      // If not JSON, return as plain text or handle accordingly
      res.json({ message: stdout.trim() });
    }
  });
};

exports.getBatteryStatus = (req, res) => {
  executeTermuxCommand('termux-battery-status', res);
};

exports.getWifiInfo = (req, res) => {
  executeTermuxCommand('termux-wifi-connectioninfo', res);
};

exports.getLocation = (req, res) => {
  // Use a timeout as location can take time
  executeTermuxCommand('termux-location -p network -r once', res);
};

exports.showToast = (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  // Escape potential malicious characters (very basic)
  const safeText = text.replace(/["';]/g, '');
  executeTermuxCommand(`termux-toast "${safeText}"`, res);
};

exports.vibrate = (req, res) => {
  const duration = req.body.duration || 500;
  executeTermuxCommand(`termux-vibrate -d ${duration}`, res);
};

exports.getContacts = (req, res) => {
  executeTermuxCommand('termux-contact-list', res);
};

exports.getSMS = (req, res) => {
  const limit = req.query.limit || 10;
  executeTermuxCommand(`termux-sms-list -l ${limit}`, res);
};

exports.getCallLog = (req, res) => {
  const limit = req.query.limit || 10;
  executeTermuxCommand(`termux-call-log -l ${limit}`, res);
};

exports.getDeviceInfo = (req, res) => {
  executeTermuxCommand('termux-info', res);
};

exports.getClipboard = (req, res) => {
  executeTermuxCommand('termux-clipboard-get', res);
};

exports.setClipboard = (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  const safeText = text.replace(/["';]/g, '');
  executeTermuxCommand(`termux-clipboard-set "${safeText}"`, res);
};

exports.sendNotification = (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });
  const safeTitle = title.replace(/["';]/g, '');
  const safeContent = content.replace(/["';]/g, '');
  executeTermuxCommand(`termux-notification -t "${safeTitle}" -c "${safeContent}"`, res);
};
