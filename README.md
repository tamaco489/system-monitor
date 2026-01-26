# System Monitor

A lightweight desktop application for real-time CPU and memory usage monitoring, built with Tauri, React, and Rust.

[日本語版 README](./README.ja.md)

![System Monitor](./docs/sample.png)

## Features

- **Real-time CPU Monitoring**
  - Overall CPU usage percentage
  - Per-core usage with visual progress bars
  - Color-coded indicators (blue to red based on load)

- **Real-time Memory Monitoring**
  - Memory usage percentage
  - Used / Total / Free memory display
  - Visual progress bar with dynamic colors

- **Historical Data Visualization**
  - Line charts showing the last 60 seconds of data
  - Smooth animations and responsive design
  - 1-second update interval

- **Modern UI**
  - Dark theme optimized for system monitoring
  - Built with shadcn/ui components
  - Responsive grid layout

## Screenshots

The application displays two main cards:

- **CPU Usage Card**: Shows overall percentage, historical graph, and per-core breakdown
- **Memory Usage Card**: Shows usage percentage, historical graph, and detailed memory statistics

## Tech Stack

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI component library
- **Recharts** - Charting library for data visualization

### Backend

- **Rust** - Systems programming language
- **Tauri v2** - Desktop application framework
- **sysinfo** - Cross-platform system information library

### Architecture Diagram

![System Monitor Architecture](./docs/system-monitor-architecture.png)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- Platform-specific dependencies for Tauri:
  - **macOS**: Xcode Command Line Tools
  - **Windows**: Microsoft Visual Studio C++ Build Tools
  - **Linux**: See [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites/#setting-up-linux)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/tamaco489/system-monitor.git
   cd system-monitor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server with hot-reload:

```bash
npm run tauri dev
```

This will:

- Start the Vite dev server for the frontend
- Compile the Rust backend
- Launch the application window

## Building

Create a production build:

```bash
npm run tauri build
```

The built application will be located in:

- **macOS**: `src-tauri/target/release/bundle/dmg/`
- **Windows**: `src-tauri/target/release/bundle/msi/`
- **Linux**: `src-tauri/target/release/bundle/deb/` or `appimage/`

## Project Structure

```
system-monitor/
├── src/                          # React frontend
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # Entry point
│   ├── index.css                 # Global styles & Tailwind config
│   ├── components/
│   │   ├── Chart.tsx             # Recharts line chart wrapper
│   │   ├── CpuMonitor.tsx        # CPU monitoring card
│   │   ├── MemoryMonitor.tsx     # Memory monitoring card
│   │   └── ui/
│   │       └── card.tsx          # shadcn/ui Card component
│   └── lib/
│       └── utils.ts              # Utility functions (cn helper)
├── src-tauri/                    # Rust backend
│   ├── src/
│   │   ├── main.rs               # Application entry point
│   │   └── lib.rs                # Tauri commands & system info logic
│   ├── Cargo.toml                # Rust dependencies
│   └── tauri.conf.json           # Tauri configuration
├── components.json               # shadcn/ui configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Node.js dependencies
```

## API Reference

### Tauri Commands

#### `get_cpu_usage`

Returns current CPU usage information.

**Response:**

```typescript
interface CpuInfo {
  overall: number; // Overall CPU usage (0-100)
  per_core: number[]; // Per-core usage array (0-100 each)
}
```

#### `get_memory_usage`

Returns current memory usage information.

**Response:**

```typescript
interface MemoryInfo {
  used: number; // Used memory in bytes
  total: number; // Total memory in bytes
  percentage: number; // Usage percentage (0-100)
}
```

## Configuration

### Window Settings

Edit `src-tauri/tauri.conf.json` to customize:

```json
{
  "app": {
    "windows": [
      {
        "title": "System Monitor",
        "width": 900,
        "height": 700,
        "minWidth": 600,
        "minHeight": 500
      }
    ]
  }
}
```

### Update Interval

Modify the interval in `src/App.tsx`:

```typescript
const interval = setInterval(fetchData, 1000); // Change 1000 to desired ms
```

### History Length

Adjust the number of data points shown in the chart:

```typescript
const HISTORY_LENGTH = 60; // Number of seconds to display
```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri Extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## License

MIT License
