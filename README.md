# SQL on FHIR Playground

A web application for testing SQL on FHIR ViewDefinitions against FHIR servers. This playground allows you to create, edit, and execute ViewDefinitions with support for multiple output formats and direct resource processing.

**[Live Demo](https://sof-client-ts.vercel.app/)**

## Features

- Support for multiple FHIR servers
- Direct resource processing via "Use direct resources" checkbox - allows testing ViewDefinitions with custom FHIR resources
- Multiple output formats: JSON, NDJSON, CSV
- Request/response trace debugging
- Real-time error feedback

## Getting Started

This project uses [Bun](https://bun.sh) as the JavaScript runtime and package manager.

### Install Bun

If you don't have Bun installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Install Dependencies

```bash
bun install
```

### Run the Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Build for Production

```bash
bun run build
```

### Run Production Server

```bash
bun run start
```

## Technology Stack

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime and package manager
- **Framework**: [Next.js 15](https://nextjs.org/docs) - React framework with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel with GitHub Actions

## Adding New FHIR Servers

The playground supports multiple FHIR servers with different capabilities. You can easily add new servers to test SQL on FHIR ViewDefinitions against different implementations.

### Step-by-Step Guide

1. **Edit the Server Configuration File**

   Open `src/lib/server-config.ts` and add your server to the `serverConfigs` array:

   ```typescript
   export const serverConfigs: ServerConfig[] = [
     // ... existing servers ...
     {
       id: 'my-server',                          // Unique identifier (lowercase, no spaces)
       name: 'My FHIR Server',                   // Display name shown in the server dropdown
       url: 'https://my-server.com/fhir',        // FHIR server base URL
       description: 'My custom FHIR server'      // Optional: shown as help text in dropdown
     }
   ];
   ```

2. **Test Your Configuration**

   ```bash
   # Run the development server
   bun run dev
   ```

   Open http://localhost:3000 and verify:
   - Your server appears in the server dropdown
   - The description is displayed correctly

3. **Deploy Your Changes**

   ```bash
   git add src/lib/server-config.ts
   git commit -m "Add [Your Server Name] to server configuration"
   git push
   ```

   The changes will automatically deploy to production via GitHub Actions.

### Configuration Fields Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Unique identifier for the server (used in URLs and code) |
| `name` | string | ✓ | Display name shown in the server dropdown |
| `url` | string | ✓ | FHIR server base URL (should support SQL on FHIR) |
| `description` | string | | Optional help text displayed in the server dropdown |

### Currently Configured Servers

1. **Aidbox** (`aidbox`)
   - URL: `https://niquola77.edge.aidbox.app/fhir`
   - Type: Standard FHIR server with SQL on FHIR support

2. **Helios Software** (`helios`)
   - URL: `https://sof.heliossoftware.com`
   - Type: Supports direct resource processing via `$run` operation

## Deploy on Vercel

This project uses GitHub Actions for automatic deployment to Vercel on every push to the `main` branch.

### Automatic Deployment Setup

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to Vercel. To enable automatic deployments, you need to configure the following GitHub repository secrets:

1. **VERCEL_TOKEN**: Your Vercel authentication token
   - Get it from [Vercel Account Settings > Tokens](https://vercel.com/account/tokens)

2. **VERCEL_ORG_ID**: Your Vercel organization ID
   - Found in `.vercel/project.json` (value: `team_4nvOpzKfZPO3DhNzJx3eNgUJ`)

3. **VERCEL_PROJECT_ID**: Your Vercel project ID
   - Found in `.vercel/project.json` (value: `prj_yjA8dnKYXxqdsKLqhivWtpquv8me`)

To add these secrets:
1. Go to your GitHub repository settings
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret" and add each of the three secrets above

### Manual Deployment

You can also deploy manually using the Vercel CLI:

```bash
bunx vercel --prod
```

For more information, check out the [Vercel deployment documentation](https://vercel.com/docs).
