# CBT System (Computer-Based Testing)

## Overview

This is a comprehensive Computer-Based Testing (CBT) system designed for Impetus Dominion Academy. The application allows teachers to create and manage exams while providing students with a secure examination interface. The system supports multiple question types including multiple choice, true/false, fill-in-the-blank, checkbox, image-based, and subjective questions. It features exam timing, password protection, grade management, and result viewing capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React + TypeScript**: Modern frontend using React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **State Management**: TanStack Query for server state management with local storage fallback
- **Styling**: Tailwind CSS with custom design system and CSS variables for theming

### Backend Architecture
- **Express.js**: Node.js server framework with TypeScript
- **Development Setup**: Vite for development with hot module replacement
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Database**: Drizzle ORM configured for PostgreSQL with schema-first approach
- **File Structure**: Monorepo structure with shared types between client and server

### Data Storage Solutions
- **Primary Database**: PostgreSQL configured through Drizzle ORM
- **Session Storage**: PostgreSQL-based sessions via connect-pg-simple
- **Local Storage**: Browser localStorage for exam data, results, and session persistence
- **Schema Management**: Drizzle migrations in `/migrations` directory
- **In-Memory Fallback**: MemStorage implementation for development/testing

### Authentication and Authorization
- **Password-based Access**: Exam-specific student passwords and grade passwords
- **Session Management**: Express sessions for maintaining user state
- **Role-based Access**: Separate interfaces for teachers and students
- **Exam Security**: Timer enforcement and session validation

### Key Components
- **Exam Builder**: Dynamic question creation with multiple question types
- **Timer System**: Real-time countdown with automatic submission
- **Navigation**: Question navigator showing answered/current/unvisited states
- **Grading System**: Automatic scoring with manual review capabilities
- **Results Dashboard**: Comprehensive statistics and individual result viewing

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Neon database connection for PostgreSQL
- **drizzle-orm** and **drizzle-kit**: Database ORM and migration tools
- **express**: Web server framework
- **vite**: Build tool and development server

### UI and Component Libraries
- **@radix-ui/***: Headless UI components (30+ components)
- **@tanstack/react-query**: Server state management
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: CSS variant management
- **lucide-react**: Icon library

### Form and Validation
- **react-hook-form** and **@hookform/resolvers**: Form management
- **zod**: Schema validation
- **drizzle-zod**: Database schema to Zod validation bridge

### Development and Build Tools
- **typescript**: Type checking
- **@vitejs/plugin-react**: React support for Vite
- **@replit/vite-plugin-***: Replit-specific development plugins
- **esbuild**: Fast bundler for production builds

### Utilities
- **date-fns**: Date manipulation
- **clsx** and **tailwind-merge**: Conditional CSS classes
- **nanoid**: Unique ID generation
- **wouter**: Lightweight routing