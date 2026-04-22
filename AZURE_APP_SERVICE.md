# Azure App Service Production Deployment

## Target

This repo is prepared for Azure App Service on Linux with Azure SQL.

## Production Build

Generate the Azure-ready package:

```powershell
npm.cmd run build
```

This creates:

```text
.output/azure
```

That folder contains only the files needed to run the API in Azure.

## What To Deploy

Deploy the contents of `.output/azure` to Azure App Service.

Important:

- Do not deploy your local `.env`
- Configure all secrets in App Service environment variables
- Use Linux App Service for the simplest Node deployment path

## Required Azure App Settings

Set these in Azure:

- `NODE_ENV=production`
- `DB_SERVER=ziratdb.database.windows.net`
- `DB_NAME=handicraft`
- `DB_INTEGRATED_SECURITY=false`
- `DB_USER=ziraatdbadmin`
- `DB_PASSWORD=...`
- `DB_PORT=1433`
- `DB_ENCRYPT=true`
- `DB_TRUST_CERTIFICATE=false`
- `DB_CONNECTION_TIMEOUT=30000`

## Recommended Startup Command

Set the startup command to:

```text
pm2 start ecosystem.config.js --no-daemon
```

## Azure CLI Example

Create the app:

```powershell
az webapp up `
  --name YOUR_APP_NAME `
  --resource-group YOUR_RESOURCE_GROUP `
  --runtime "NODE|22-lts" `
  --os-type Linux
```

Set the startup command:

```powershell
az webapp config set `
  --resource-group YOUR_RESOURCE_GROUP `
  --name YOUR_APP_NAME `
  --startup-file "pm2 start ecosystem.config.js --no-daemon"
```

Deploy a ZIP package created from `.output/azure`:

```powershell
az webapp deploy `
  --resource-group YOUR_RESOURCE_GROUP `
  --name YOUR_APP_NAME `
  --src-path azure-deploy.zip
```

## Notes

- `msnodesqlv8` is only needed for Windows integrated SQL auth.
- Azure App Service with SQL login should use the regular `mssql` path.
- The app already listens on `PORT`.
