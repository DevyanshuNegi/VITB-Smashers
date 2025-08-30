# NotesHub - Study Notes Marketplace 📚

A comprehensive note selling platform built with modern web technologies, designed to help students find and purchase high-quality study materials organized by batch, branch, semester, and type.

## ✨ Features

- **🏠 Homepage** - Browse all available notes with advanced search and filtering
- **🔍 Smart Search** - Filter notes by batch, branch, semester, type, and keywords
- **📄 Product Pages** - Detailed note information with Razorpay payment integration
- **💳 Secure Payments** - Complete Razorpay integration with payment verification
- **📂 Category System** - Organized browsing by academic categories
- **👤 User Dashboard** - Manage purchases and account information
- **🛒 E-commerce Flow** - Complete purchase system with order tracking
- **📱 Responsive Design** - Works seamlessly on desktop and mobile
- **🔐 Authentication** - Secure login with multiple providers

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://prisma.io)
- **API**: [tRPC](https://trpc.io) for end-to-end type safety
- **Authentication**: [NextAuth.js](https://next-auth.js.org)
- **Payments**: [Razorpay](https://razorpay.com) integration
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Deployment**: Ready for [Vercel](https://vercel.com)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd notes-selling-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your database URL and authentication secrets:
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/noteshub"
   AUTH_SECRET="your-secret-key"
   
   # OAuth provider credentials
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Razorpay payment gateway
   RAZORPAY_KEY_ID="your_razorpay_key_id"
   RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
   NEXT_PUBLIC_RAZORPAY_KEY_ID="your_razorpay_key_id"
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma generate
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── _components/        # Reusable UI components
│   ├── product/[id]/       # Dynamic product pages
│   ├── category/[type]/[id]/ # Category pages
│   ├── dashboard/          # User dashboard
│   └── categories/         # Category listing
├── server/                 # Backend API logic
│   ├── api/               # tRPC routers
│   └── auth/              # Authentication config
└── styles/                # Global styles

prisma/
├── schema.prisma          # Database schema
└── seed.ts               # Sample data
```

## 🗃️ Database Schema

The platform uses a comprehensive schema with:

- **Products** - Study notes with pricing and metadata
- **Categories** - Batches, Branches, Semesters, Types
- **Users** - User accounts and authentication
- **Purchases** - Order tracking and payment status
- **Relations** - Proper foreign key relationships

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

## 🎨 Key Components

- **ProductCard** - Displays note information with purchase options
- **RazorpayPayment** - Integrated payment component with Razorpay checkout
- **SearchFilters** - Advanced filtering interface
- **Header** - Navigation with authentication
- **Dashboard** - User purchase management

## 🔐 Authentication

The platform supports multiple authentication providers:
- Google OAuth
- Discord OAuth
- Email/Password (configurable)

## 💰 Razorpay Payment Integration

The platform now includes fully integrated Razorpay payment processing with:

### Features
- **Secure Payment Processing** - Complete Razorpay checkout integration
- **Payment Verification** - Server-side signature validation
- **Order Management** - Automatic order creation and tracking
- **Purchase History** - View all completed transactions
- **Test Mode** - Full testing environment with test cards

### Razorpay Setup

1. **Create Razorpay Account**
   - Visit [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Complete registration and KYC verification
   - Navigate to Settings → API Keys

2. **Get Test Credentials**
   ```
   Test Key ID: rzp_test_xxxxxxxxx
   Test Secret: your_test_secret_key
   ```

3. **Configure Environment Variables**
   ```bash
   RAZORPAY_KEY_ID="rzp_test_xxxxxxxxx"
   RAZORPAY_KEY_SECRET="your_test_secret_key"
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxxxx"
   ```

### Payment Flow

1. **Product Selection** - User browses and selects notes
2. **Purchase Initiation** - Click "Purchase Now" button
3. **Order Creation** - Server creates Razorpay order
4. **Payment Checkout** - Razorpay modal opens for payment
5. **Payment Processing** - User enters payment details
6. **Verification** - Server verifies payment signature
7. **Purchase Completion** - Access granted to purchased notes

### Testing Payments

Use these test card numbers:

**Successful Payments:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failed Payments:**
- Card: `4000 0000 0000 0002`

**UPI Testing:**
- UPI ID: `success@razorpay`
- UPI ID: `failure@razorpay`

### Security Features

- ✅ Server-side payment signature verification
- ✅ Encrypted API communication
- ✅ Order amount validation
- ✅ Duplicate payment prevention
- ✅ Error handling and logging

### API Endpoints

- `POST /api/razorpay/create-order` - Create payment order
- `POST /api/razorpay/verify-payment` - Verify payment signature
- `POST /api/trpc/product.verifyRazorpayPayment` - Complete purchase

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set environment variables**
4. **Deploy**

### Other Platforms

The app can be deployed to any platform supporting Node.js:
- Railway
- Render
- DigitalOcean App Platform
- AWS
- Google Cloud

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [T3 Stack](https://create.t3.gg/)
- UI components inspired by modern design systems
- Sample data for educational purposes

---

**Made with ❤️ for students, by students**
