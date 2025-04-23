# StreamX - Modern Streaming Platform

StreamX is a modern streaming platform built with Next.js, Mantine UI, Firebase, and Stripe. It provides a seamless experience for users to browse, watch, and manage their favorite content.

## Features

- 🎥 High-quality video streaming
- 🔐 Secure authentication with Firebase
- 💳 Subscription management with Stripe
- 📱 Responsive design for all devices
- 🌙 Dark/Light theme support
- 📊 User analytics and recommendations
- 🔔 Notifications and email updates
- 🌍 Multi-language support

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **UI**: Mantine UI, Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Payments**: Stripe
- **Deployment**: Vercel

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/streamx.git
   cd streamx
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your environment variables:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── billing/           # Billing and subscription pages
│   ├── content/           # Content pages
│   ├── profile/           # User profile pages
│   └── settings/          # User settings pages
├── components/            # Reusable components
├── contexts/              # React contexts
├── hooks/                 # Custom hooks
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── styles/                # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@streamx.com or join our Slack channel. 