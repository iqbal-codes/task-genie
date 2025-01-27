# Task Genie

A modern task management application built with Next.js that helps you organize and track your tasks efficiently.

## About

Task Genie is a powerful task management application that allows you to:
- Create and organize tasks in customizable lists
- Track tasks with different views (Today, Upcoming, Completed)
- Add task descriptions and icons for better organization
- Real-time updates and modern UI interface

## Tech Stack

- **Frontend Framework**: Next.js 15 with App Router
- **UI Components**: Tailwind CSS with Shadcn/ui
- **State Management**: React Query for server state, Zustand for client state
- **Authentication**: Supabase Auth
- **Database**: Supabase
- **Form Handling**: React Hook Form with Zod validation
- **TypeScript**: For type safety and better developer experience

## Project Structure

```
src/
├── app/              # Next.js app router pages and layouts
│   ├── (auth)/       # Authentication related pages
│   ├── (tasks)/      # Task management pages
│   └── actions/      # Server actions
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── ...          # Feature-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries and configurations
├── schema/          # Zod validation schemas
├── types/           # TypeScript type definitions
└── utils/           # Helper utilities
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- Yarn package manager
- Supabase account for backend services

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd task-genie
```

2. Install dependencies
```bash
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase](https://supabase.com/docs)
- [React Query](https://tanstack.com/query/latest)

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
