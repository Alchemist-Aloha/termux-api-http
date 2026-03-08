# Termux Backend Design & Structure

A Node.js backend providing an HTTP API to interact with Termux API commands on Android.

## Tech Stack
- **Runtime**: Node.js (v24.13.0+)
- **Framework**: Express.js
- **Execution**: Child process execution of `termux-*` commands.

## Architecture
The backend maps RESTful endpoints to specific Termux API commands.
Responses are returned as JSON, usually parsing the output from Termux API commands which are often JSON-formatted themselves.

## Project Structure
```text
termux-backend/
├── GEMINI.md          # Project design and documentation
├── package.json       # Node.js dependencies and scripts
├── server.js          # Entry point, initializes Express
├── routes/
│   └── api.js         # Endpoint definitions
└── controllers/
    └── termux.js      # Logic for executing termux-api commands
```

## Endpoints (Examples)
- `GET /api/battery`: Returns output of `termux-battery-status`.
- `GET /api/wifi`: Returns output of `termux-wifi-connectioninfo`.
- `GET /api/location`: Returns output of `termux-location`.
- `POST /api/toast`: Displays a toast using `termux-toast`.

## Security Considerations
- Access control via API key (to be implemented).
- Command injection prevention by sanitizing or avoiding user input in shell commands.
- Restricted to local network or via specific port forwarding.

## Dependencies
- `express`: Web framework.
- `cors`: Enable cross-origin requests.
- `dotenv`: Manage environment variables.
