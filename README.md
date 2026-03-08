# Termux Backend

A Node.js backend for interacting with Android system features through the Termux:API. This project provides a REST API to trigger Termux commands and retrieve system information remotely or locally.

## Features

- **Battery Status**: Get current battery level, health, and state.
- **WiFi Info**: Retrieve network details like SSID and signal strength.
- **Location**: Get the device's GPS or network-based coordinates.
- **Notifications**: Send system notifications or display toast messages.
- **System Control**: Trigger device vibration.
- **Device Information**: Fetch comprehensive details about the Android device.
- **Communication**: Access contacts, SMS messages, and call logs.
- **Clipboard**: Read from and write to the Android system clipboard.

## Prerequisites

1.  **Termux**: Installed on your Android device.
2.  **Termux:API App**: Install the [Termux:API](https://f-droid.org/en/packages/com.termux.api/) add-on from F-Droid or Google Play.
3.  **Termux:API Package**: Inside Termux, run:
    ```bash
    pkg install termux-api
    ```
4.  **Node.js**: Install Node.js in Termux:
    ```bash
    pkg install nodejs
    ```

## Installation

1.  Clone this repository or copy the files to your Termux directory.
2.  Navigate to the project directory:
    ```bash
    cd termux-backend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

## Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
BIND_IP=0.0.0.0
API_KEY=your_secret_api_key_here
```

- `PORT`: The port the server will listen on.
- `BIND_IP`: The IP address to bind to.
- `API_KEY`: A unique string used to authenticate requests.

## Authentication

All `/api/*` endpoints require authentication using the `X-API-Key` header or an `api_key` query parameter.

**Example using Header (Recommended):**
```bash
curl -H "X-API-Key: your_secret_api_key_here" http://localhost:3000/api/battery
```

**Example using Query Parameter:**
```bash
curl http://localhost:3000/api/battery?api_key=your_secret_api_key_here
```

## Reverse Proxy Compatibility

The server is configured with `app.set('trust proxy', 1)`, making it compatible with reverse proxies like Nginx, Caddy, or Apache. This ensures that features like IP logging and protocol detection work correctly when the server is sitting behind another layer.

## Usage

Start the server:
```bash
node server.js
```

The server will be available at `http://<your-device-ip>:3000`.

## API Endpoints

### System Information

- **GET `/api/battery`**: Returns battery status.
- **GET `/api/wifi`**: Returns WiFi connection information.
- **GET `/api/location`**: Returns device location coordinates.
- **GET `/api/info`**: Returns detailed device information.

### Interactions

- **POST `/api/toast`**: Display a toast message.
  - Body: `{ "text": "Your message here" }`
- **POST `/api/vibrate`**: Trigger device vibration.
  - Body: `{ "duration": 500 }` (Duration in milliseconds)
- **POST `/api/notification`**: Send a system notification.
  - Body: `{ "title": "Hello", "content": "This is a notification" }`

### Data Access

- **GET `/api/contacts`**: Returns the device contact list.
- **GET `/api/sms`**: Returns recent SMS messages.
  - Query Param: `?limit=10`
- **GET `/api/call-log`**: Returns recent call logs.
  - Query Param: `?limit=10`

### Clipboard

- **GET `/api/clipboard`**: Returns the current content of the clipboard.
- **POST `/api/clipboard`**: Sets the system clipboard content.
  - Body: `{ "text": "Text to copy" }`

## Security

Currently, this API does not have built-in authentication. It is recommended to use it only within a trusted local network. Avoid exposing this server to the public internet without implementing an API key or other security measures.

## License

ISC
