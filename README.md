# SQL on FHIR Playground

A web application for testing SQL on FHIR ViewDefinitions against FHIR servers. This playground allows you to create, edit, and execute ViewDefinitions with support for multiple output formats and direct resource processing.

**[Live Demo](https://sof-client-ts.vercel.app/)**

## Features

- Support for multiple FHIR servers with different capabilities
- Direct resource processing for servers that support the `$run` operation with resources parameter
- Multiple output formats: JSON, NDJSON, CSV
- Request/response trace debugging
- Real-time error feedback

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Server Configuration

The application supports multiple FHIR servers with different capabilities. Server configurations are managed in `/src/lib/server-config.ts`.

### Adding a New Server

To add a new server, edit the `serverConfigs` array in `/src/lib/server-config.ts`:

```typescript
export const serverConfigs: ServerConfig[] = [
  // ... existing servers ...
  {
    id: 'my-server',                       // Unique identifier
    name: 'My FHIR Server',                // Display name in dropdown
    url: 'https://my-server.com/fhir',     // Server base URL
    supportsDirectResources: true,          // Whether server supports direct resource input
    description: 'Optional description'     // Optional description shown in dropdown
  }
];
```

### Server Capabilities

- **Standard FHIR Servers**: Set `supportsDirectResources: false`. These servers will query their own data store when executing ViewDefinitions.

- **Servers with Direct Resource Support**: Set `supportsDirectResources: true`. When selected, a "Resources" input field appears where you can provide FHIR resources directly. This is useful for servers that support the `resources` parameter in the `$run` operation, allowing you to process arbitrary FHIR resources without storing them on the server.

### Current Servers

1. **Aidbox (niquola77)**: Standard FHIR server implementation
   - URL: `https://niquola77.edge.aidbox.app/fhir`
   - Direct resources: Not supported

2. **Helios Software**: Supports direct resource processing
   - URL: `https://sof.heliossoftware.com`
   - Direct resources: Supported via `$run` operation

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
