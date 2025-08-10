# Open Course Platform

This project is an e-commerce platform where users can create, sell, and buy online courses. A unique feature of this platform is that course creators can use materials from the internet to build their course content. The application is built with Next.js and utilizes a PostgreSQL database with Prisma for data management, Stripe for secure payments, and NextAuth.js for authentication.

## Features

-   **Course Creation:** Allows users to create courses, add modules, and upload course materials.
-   **E-commerce Functionality:** Users can buy and sell courses, with Stripe integration for payment processing.
-   **User Authentication:** Secure user authentication with email/password and Google OAuth, managed by NextAuth.js.
-   **User Profiles:** Users have profiles where they can manage their courses and view their purchase history.
-   **Featured Courses:** The homepage showcases a selection of featured courses.

## How to Use

### For Course Creators

1.  Sign in to the platform.
2.  Navigate to your profile and create a Stripe account to be able to receive payments.
3.  Start creating courses by adding modules, descriptions, and links to your course materials.

### For Students

1.  Browse the available courses on the platform.
2.  Add courses to your bucket and proceed to checkout.
3.  After a successful purchase, the course will be available in your inventory.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v20 or later)
-   npm, yarn, or pnpm
-   PostgreSQL

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/syed-minhaj/open-course.git
    cd open-course
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up the database:**

    -   Ensure your PostgreSQL server is running.
    -   Create a `.env` file by copying `.env.example` and fill in your database connection string and other environment variables.
    -   Run the database migrations:
        ```bash
        npx prisma migrate dev
        ```

### Environment Variables

This project requires the following environment variables to be set in a `.env` file:

-   `APP_URL`: The base URL of your application.
-   `DATABASE_URL`: The connection string for your PostgreSQL database.
-   `DIRECT_URL`: The direct connection string for your PostgreSQL database.
-   `GOOGLE_Client_ID`: Your Google OAuth client ID.
-   `GOOGLE_Client_secret`: Your Google OAuth client secret.
-   `NEXTAUTH_SECRET`: A secret key for NextAuth.js.
-   `NEXT_PUBLIC_SUPABASE_URL`: The URL of your Supabase project.
-   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anonymous key for your Supabase project.
-   `FEATURED_COURSE_1_ID` to `FEATURED_COURSE_4_ID`: IDs of the courses to be featured on the homepage.
-   `STRIPE_SECRET_KEY`: Your secret key for the Stripe API.
-   `STRIPE_WEBHOOK_SECRET`: Your secret for the Stripe webhook.
-   `NEXT_PUBLIC_SITE_URL`: The public URL of your site.

Refer to the `.env.example` file for a complete list of required variables.

### Running the Development Server

To start the development server, run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Key Technologies

-   **Framework:** [Next.js](https://nextjs.org/)
-   **Database:** [PostgreSQL](https://www.postgresql.org/)
-   **ORM:** [Prisma](https://www.prisma.io/)
-   **Authentication:** [NextAuth.js](https://next-auth.js.org/) & [Supabase](https://supabase.io/)
-   **Payments:** [Stripe](https://stripe.com/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)

## Technical Details

-   **Image Handling:** The application uses a custom utility to resize images on the client-side before uploading them to Supabase Storage. This optimizes image sizes and improves performance.
-   **API and Webhooks:** Next.js API routes are used to handle the Stripe webhook for payment processing and to manage user authentication.
-   **Styling:** The project uses a custom theme with Tailwind CSS, which is defined in the `tailwind.config.ts` file. This allows for a consistent and customizable design system.

## Project Structure

```
my-app/
├── app/                  # Main application code (Next.js App Router)
│   ├── api/              # API routes
│   ├── components/       # Shared React components
│   ├── lib/              # Library files (Prisma, Supabase)
│   └── (routes)/         # Different pages/routes of the application
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets
├── .env.example          # Example environment variables
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies and scripts
└── tailwind.config.ts    # Tailwind CSS configuration
```