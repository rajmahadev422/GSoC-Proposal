# Dev-Doc

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open-blue?style=for-the-badge&logo=vercel&logoColor=white)](https://rajmahadev422.github.io/Dev-Doc/)

A lightweight documentation tool that allows you to embed code snippets and file contents directly into your documentation using custom syntax.

## ✨ Features

- **Code Block Embedding**: Use `:::code ... :::` syntax to embed code blocks with syntax highlighting
- **File Inclusion**: Include external file contents using `:::include{file_path.ext#L1-Ln}` syntax
- **Organized Documentation**: Structure your documentation using a JSON configuration file
- **Live Demo**: See your documentation rendered in real-time
- **Clean UI**: Styled documentation viewer for better readability

## 📋 Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Basic text editor for editing documentation
- No server-side dependencies – pure HTML/CSS/JavaScript

## 🚀 How to Use

### 1. Clone the Repository

```bash
git clone https://github.com/rajmahadev422/Dev-Doc.git
cd Dev-Doc
```

### 2.Open the Documentation
Simply open index.html in your web browser to view the documentation.

### 3. Configure Your Documentation
Create a JSON configuration file (e.g., docs.json) to organize your content:
```json
{
  "tutorials": [
    {
      "title": "For showing Image",
      "url": "path/to/file_from_index.html/code.ext"
    }
  ],
  "introduction": [],
  "other_folders": []
}
```
### 4. Write Documentation Files
Use the special syntax in your .md files:

**Code Block Syntax**
```markdown
:::code
console.log('Hello, World!');
:::
```
**File Inclusion Syntax**
```markdown
:::include{path/to/file.js#L10-L20}
```
> This will include lines 10-20 from file.js in your documentation.

## Project Structure
```text
Dev-Doc/
├── index.html          # Main documentation viewer
├── docs/               # Documentation files
├── public/             # Static assets
├── src/                # Source JavaScript files
│   └── toc.js         # Table of contents functionality
└── README.md          # This file
```
## Customization
- Styling: Modify CSS files in the public/ directory
- Functionality: Extend features by editing JavaScript in the src/ directory
- Structure: Update your JSON configuration to add new sections

## Example
To include a code snippet from a file:

```markdown
## Installation Example

To install dependencies, run:

:::include{package.json#L5-L12}
```
> This will display lines 5-12 from package.json in your documentation.

## Contributing
- Fork the repository
- Create a feature branch (git checkout -b feature/amazing-feature)
- Commit your changes (git commit -m 'Add amazing feature')
- Push to the branch (git push origin feature/amazing-feature)
- Open a Pull Request

## License
This project is open source and available under the MIT License.
