# Datum Manager

A datum management system for CAD applications that provides static datum visualization and operations. The system implements core functionality for datum creation and offset management, with elevation view features supporting dimension lines.

## Features

- Static datum visualization with color-coded absolute (purple) and relative (blue dashed) datums
- Offset visualization and management with 5-foot grid intervals
- Elevation view with dimension lines
- Integrated datum list with raw offset values
- Relationship visualization tools
- Automatic relative datum updates

## Getting Started

### Prerequisites

- Node.js v20 or higher
- npm v7 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abrahamdrechsler/datum-manager.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the main branch. You can also manually trigger a deployment from the Actions tab in the GitHub repository.

#### Setting up GitHub Pages

1. In your repository settings, go to the Pages section
2. Set the source to "GitHub Actions"
3. Ensure the following secrets are set in your repository:
   - `VITE_API_URL`: The URL of your API server

The deployed application will be available at: `https://yourusername.github.io/datum-manager/`

#### Manual Deployment

To manually deploy the application:

1. Go to the Actions tab in your repository
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Choose the branch you want to deploy
5. Click "Run workflow"

## Usage

1. Create absolute datums as reference points
2. Add relative datums that reference existing datums
3. Use the elevation view to visualize relationships
4. Measure distances between datums using measurement tools

## Documentation

For detailed documentation, please visit:
- [API Reference](./api.md)
- [Component Documentation](./components.md)
- [User Guide](./user-guide.md)

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
