# Concert Manager

A full-stack concert management application built with Next.js 16, featuring user authentication, concert creation, and reservation management. Administrators can create and manage concerts, while users can browse published concerts and make reservations.

## Features

### User Features
- **Authentication**: Secure login with NextAuth
- **Concert Browsing**: View all published concerts
- **Reservations**: Make reservations for concerts
- **Reservation Management**: View and manage your reservations

### Admin Features
- **Concert Management**: Create, update, and publish concerts
- **Dashboard Overview**: View statistics (total seats, reserved, cancelled)
- **Reservation History**: View all reservations and their status
- **Concert Publishing**: Control which concerts are visible to users

## Technologies Used

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[HeroUI v2](https://heroui.com/)** - Component library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[NextAuth](https://next-auth.js.org/)** - Authentication library
- **[Axios](https://axios-http.com/)** - HTTP client
- **[Day.js](https://day.js.org/)** - Date manipulation library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management
- **[Lucide React](https://lucide.dev/)** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd concert-app
```

2. Install dependencies:

Using `npm`:
```bash
npm install
```

Using `yarn`:
```bash
yarn install
```

Using `pnpm`:
```bash
pnpm install
```

**Note for pnpm users**: Add the following to your `.npmrc` file:
```bash
public-hoist-pattern[]=*@heroui/*
```

Then run `pnpm install` again.

### Environment Setup

Create a `.env.local` file in the root directory and configure the following environment variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# API Configuration
NEXT_PUBLIC_API_URL=your-api-url-here
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Build the application for production:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Linting

Run ESLint to check for code issues:

```bash
npm run lint
```

## Project Structure

```
concert-app/
├── app/                    # Next.js app directory
│   ├── (admin)/           # Admin routes
│   │   ├── admin/         # Admin dashboard
│   │   └── history/       # Reservation history
│   ├── (main)/            # Main user routes
│   │   └── main/          # User concert browsing
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── published-concerts/  # Published concerts API
│   │   └── reservations/  # Reservations API
│   └── page.tsx           # Login page
├── api/                   # API service layer
│   ├── concerts/          # Concert API services
│   ├── reservations/      # Reservation API services
│   └── users/             # User API services
├── components/            # React components
│   ├── admin/             # Admin components
│   ├── main/              # Main user components
│   └── common/            # Shared components
├── config/                # Configuration files
├── constants/             # Application constants
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Authentication

The application uses NextAuth for authentication with credential-based login. Users are redirected to different dashboards based on their role:
- **Admin users**: Redirected to `/admin`
- **Regular users**: Redirected to `/main`

## API Integration

The application integrates with a backend API for:
- Concert management (CRUD operations)
- Reservation management
- User authentication
- Publishing/unpublishing concerts

API services are organized in the `api/` directory and use Axios for HTTP requests.

## License

Licensed under the [MIT license](./LICENSE).

## Acknowledgments

Built with [HeroUI](https://heroui.com/) components and powered by [Next.js](https://nextjs.org/).
