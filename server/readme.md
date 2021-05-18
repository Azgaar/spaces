# SPɅCES: Workspace Reservation System

Server-side Express application with data validation, cookies-based authentification and password encryption.

## Dependencies

- `express`: node.js framework
- `express-session`: cookies middleware
- `mongodb`: no-SQL database
- `mongoose`: ODM for MongoDB
- `joi`: data validation
- `bcryptjs`: password encryption
- `http-status`: http statuses helper
- `winston`: logger

## CURL

If you are using PowerShell, install `curl` and type `remove-item alias:\curl` to use real curl and not the Window's one.

### Register:

```sh
curl -v -X POST http://localhost:3001/users -H "Content-Type: application/json" -d '{\"email\":\"test@gmail.com\",\"firstName\":\"John\",\"lastName\":\"Doe\",\"password\":\"Secret123\",\"passwordRepeat\":\"Secret123\"}' | ConvertFrom-Json | ConvertTo-Json

```

### Login:

```sh
curl -v -X POST http://localhost:3001/login -H "Content-Type: application/json" -d '{\"email\":\"test@gmail.com\",\"password\":\"Secret123\"}' | ConvertFrom-Json | ConvertTo-Json
```

### Logout:

```sh
curl -v -X POST http://localhost:3001/logout -H "Content-Type: application/json" --cookie 'sid=s%3AzauotU-OJZYu8TDVqs3awuWA78JKtGlf.RBHMZV7WRswKKpO8o6gKxy0DownQO8cVS6hvNR%2BpSgo' | ConvertFrom-Json | ConvertTo-Json

```
