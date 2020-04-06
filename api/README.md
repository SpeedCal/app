# React Calendar - API

This API has 2 purposes: to create snapshots of a calendar config using Puppeteer, and to serve existing snapshots and cache the request.

## Usage

Run in dev mode:

```
npm run api:debug
```

Make requests:

```
# Generate snap, store in ../snapshots/image.png
curl http://localhost:3001/

# Render existing snapshot
curl http://localhost:3001/calendar.png

# View system stats about the process (`| jq` for nice presentation)
curl http://localhost:3001/stats
```
