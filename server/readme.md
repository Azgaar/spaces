# SPACES: server-sede application

## CURL

If using PowerShell, install `curl` and type `remove-item alias:\curl` to use actual curl and not the Window's one.

```sh

curl -X POST http://localhost:3001/register -H "Content-Type: application/json" -d '{\"email\":\"test@yandex.com\",\"firstName\":\"Max\",\"lastName\":\"Surny\",\"password\":\"Secret123\",\"passwordRepeat\":\"Secret123\"}'

```
