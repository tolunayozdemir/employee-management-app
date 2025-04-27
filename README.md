# Employee Management Application

A modern web application built using Lit Elements for managing employee records. This project showcases front-end development skills with web components, state management, routing, and internationalization.

## Features

- **Employee Listing**: View all employees in a responsive table
- **Employee Management**: Add, view, and potentially edit employee records
- **Search Functionality**: Filter employees by name or other attributes
- **Pagination**: Navigate through multiple pages of employee records
- **Internationalization**: Support for multiple languages (English and Turkish)
- **Responsive Design**: Works on mobile and desktop devices
- **Form Validation**: Client-side validation for employee data

## Technology Stack

- **Lit**: Modern, lightweight library for building fast web components
- **Redux**: For state management across the application
- **Vaadin Router**: For client-side routing
- **Web Components**: Using native web standards
- **ES Modules**: Modern JavaScript module system

## Project Structure

```
src/
├── components/        # Reusable web components
│   ├── dialog/        # Modal and confirmation dialogs
│   ├── employee-list/ # Employee listing component
│   ├── employee-table/# Table display for employees
│   ├── form/          # Form components for employee data
│   ├── nav/           # Navigation components
│   ├── not-found/     # 404 page component
│   ├── pagination/    # Pagination controls
│   └── search-bar/    # Search functionality
├── i18n/              # Internationalization
│   └── translations/  # Language files
├── pages/             # Application pages
├── store/             # Redux store configuration
│   ├── actions.js     # Redux actions
│   ├── reducers.js    # Redux reducers
│   └── store.js       # Store configuration
├── styles/            # Global styles
└── utils/             # Helper utilities
    ├── formatters.js  # Data formatting utilities
    └── validators.js  # Form validation utilities
```

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm (v6 or later)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run serve
```

The application will be available at `http://localhost:8000`.

### Testing

Run all tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Build and Deployment

Build for production:

```bash
npm run serve:prod
```
