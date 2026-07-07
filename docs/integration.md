# Integrating Datum Manager

This guide explains how to integrate the Datum Manager component into your React application, specifically for abrahamdrechsler.com.

## Installation

1. Add the Datum Manager as a Git submodule:
```bash
git submodule add https://github.com/abrahamdrechsler/datum-manager.git
cd datum-manager
npm install
```

2. Install required peer dependencies in your main project:
```bash
npm install @tanstack/react-query @radix-ui/react-dialog @radix-ui/react-alert-dialog tailwindcss-animate
```

## Usage

### 1. Import the DatumManager Component

```tsx
import { DatumManager } from 'datum-manager/client/src/pages/DatumManager';
```

### 2. Set up Required Context Providers

Wrap your application with the necessary providers:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'datum-manager/client/src/components/ui/toaster';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DatumManager />
      <Toaster />
    </QueryClientProvider>
  );
}
```

### 3. Configure API Endpoint

Create a `.env` file in your project root:

```env
VITE_API_URL=http://your-api-endpoint
```

### 4. Include Styles

Add the required Tailwind CSS configuration:

```js
// tailwind.config.js
module.exports = {
  content: [
    // ... your existing content
    './datum-manager/client/src/**/*.{js,ts,jsx,tsx}',
  ],
  // ... rest of your config
}
```

### 5. Database Setup

Ensure your PostgreSQL database includes the required schema:

```sql
CREATE TABLE datums (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  is_absolute BOOLEAN NOT NULL DEFAULT true,
  z_offset DECIMAL(10,2) NOT NULL,
  parent_id INTEGER REFERENCES datums(id)
);
```

## Component API

The DatumManager component can be customized with the following props:

```typescript
interface DatumManagerProps {
  onDatumCreate?: (datum: Datum) => void;
  onDatumUpdate?: (datum: Datum) => void;
  onDatumDelete?: (datumId: number) => void;
  theme?: 'light' | 'dark';
  containerClassName?: string;
}
```

## Example Integration

Here's how to integrate the DatumManager into a specific page on abrahamdrechsler.com:

```tsx
import { DatumManager } from 'datum-manager/client/src/pages/DatumManager';

export function CADPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">CAD Tools</h1>
      <DatumManager
        theme="light"
        containerClassName="bg-white rounded-lg shadow-lg"
        onDatumCreate={(datum) => {
          console.log('New datum created:', datum);
        }}
      />
    </div>
  );
}
```

## Troubleshooting

1. If you encounter TypeScript errors, ensure your `tsconfig.json` includes the datum-manager path:

```json
{
  "compilerOptions": {
    "paths": {
      "datum-manager/*": ["./datum-manager/*"]
    }
  }
}
```

2. For styling issues, make sure your application's CSS includes the required Tailwind CSS base styles.

## Support

For issues and feature requests, please create an issue in the datum-manager repository.
