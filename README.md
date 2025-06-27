# CSES Companion Extension

A Firefox extension that enhances the CSES (Code Submission Evaluation System) competitive programming experience.

## Features

- **Direct Code Submission**: Submit code directly from CSES problem pages
- **Multiple Input Methods**: Support for both textarea input and file upload

## Planned Features

- **GitHub Integration**: Automatically push accepted solutions to your GitHub repository
- **Solution Management**: Track and organize your solved problems
- **Performance Analytics**: View submission statistics and performance metrics

## Installation

### From Source (Development)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ItsTHEAvro/cses-companion-firefox.git
   cd cses-companion-firefox
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the extension**:
   ```bash
   npm run build
   ```

4. **Load in Firefox**:
   - Open Firefox and go to `about:debugging`
   - Click "This Firefox" in the left sidebar
   - Click "Load Temporary Add-on"
   - Navigate to the project directory and select the `manifest.json` file

### For Development/Testing

1. **Run in development mode**:
   ```bash
   npm start
   ```
   This will start Firefox with the extension loaded automatically.

2. **Lint the extension**:
   ```bash
   npm run lint
   ```

## Usage

1. **Navigate to any CSES problem page** (e.g., `https://cses.fi/problemset/task/1068`)

2. **The extension automatically adds a submission form** below the problem statement with:
   - Language selector dropdown
   - Code textarea for direct input
   - File upload option
   - Submit button

3. **Submit your solution**:
   - **Option 1**: Paste your code in the textarea and click Submit
   - **Option 2**: Use the file upload to select your source code file
   - The extension will automatically detect the language based on file extension

4. **Language preferences** are automatically saved and will be restored on subsequent visits

## Project Structure

```
cses-companion-firefox/
├── manifest.json          # Extension manifest
├── cses-companion.js      # Main content script
├── package.json          # Node.js dependencies and scripts
├── icons/
│   └── border-48.png     # Extension icon
└── README.md            # This file
```

## Development

### Scripts

- `npm run build` - Build the extension using web-ext
- `npm start` - Run Firefox with the extension loaded
- `npm run lint` - Lint the extension code

### Key Functions

- [`isTaskPage()`](cses-companion.js) - Detects if current page is a CSES task page
- [`getProblemId()`](cses-companion.js) - Extracts problem ID from URL or page elements
- [`submitCodeFile()`](cses-companion.js) - Handles code submission to CSES servers
- [`createFormInContentDiv()`](cses-companion.js) - Dynamically creates the submission form

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Browser Compatibility

- **Firefox**: 45.0+
- **Chrome/Edge**: Planned

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Jyotirmoy Avro**
- GitHub: [@ItsTHEAvro](https://github.com/ItsTHEAvro)

## Issues and Support

If you encounter any issues or have feature requests, please [open an issue](https://github.com/ItsTHEAvro/cses-companion-firefox/issues) on GitHub.

## Acknowledgments

- [CSES](https://cses.fi/) for providing an excellent competitive programming platform
- Firefox WebExtensions API documentation
- The competitive programming community

---

**Note**: This extension is not officially affiliated with CSES. Use responsibly and in accordance with CSES terms of service.