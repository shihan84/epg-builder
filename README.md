# 📺 EPG Manager - Electronic Program Guide Management System

A comprehensive web application for managing Electronic Program Guides (EPG) for TV channels and streaming services. Built specifically for Indian language channels with support for schedule copying, program management, and multi-channel operations.

## ✨ Features

### 🎯 Core Functionality
- **📺 Channel Management** - Add, edit, and organize TV channels with language and category support
- **🎬 Program Library** - Manage program content with metadata, duration, and categorization
- **📅 Schedule Management** - Create and manage program schedules with recurring support
- **🔄 Schedule Copying** - Copy schedules between channels with smart time adjustments
- **📋 Program Copying** - Duplicate programs between channels with conflict resolution
- **👥 User Authentication** - Secure login system for multiple clients

### 🌐 Indian Language Support
- **Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Oriya, Assamese, English**
- **Language-based filtering and categorization**
- **Cultural calendar integration ready**

### 🎨 User Interface
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- **Intuitive Navigation** - Clean dashboard with easy access to all features
- **Real-time Updates** - Instant feedback for all operations

## 🚀 Technology Stack

### 🎯 Core Framework
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Utility-first CSS framework

### 🧩 UI Components
- **🧩 shadcn/ui** - High-quality accessible components
- **🎯 Lucide React** - Beautiful icon library
- **📊 TanStack Table** - Powerful data tables

### 🗄️ Database & Backend
- **🗄️ Prisma** - Modern ORM with SQLite
- **🔐 bcryptjs** - Password hashing
- **🌐 REST API** - Clean API endpoints

## 🎯 Use Cases

### For TV Channel Operators
- **Multi-channel Management** - Manage multiple channels from a single dashboard
- **Schedule Planning** - Create weekly/monthly program schedules
- **Template Reuse** - Save schedule patterns for repeated use
- **Bulk Operations** - Copy schedules between similar channels

### For Streaming Services
- **Content Organization** - Manage program libraries with rich metadata
- **Schedule Automation** - Set up recurring program schedules
- **Channel Branding** - Customize channel information and logos
- **Multi-language Support** - Handle content in various Indian languages

### For Content Distributors
- **Client Management** - Multiple client accounts with isolated data
- **Schedule Sharing** - Copy proven schedules between client channels
- **Program Duplication** - Quickly populate new channels with existing content
- **Reporting** - Track channel and program statistics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd epg-manager

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Initialize database
npm run db:push

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Application (optional)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── auth/          # Authentication routes
│   │   ├── channels/      # Channel management
│   │   ├── programs/      # Program management
│   │   ├── schedules/     # Schedule management
│   │   └── dashboard/     # Dashboard stats
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── page.tsx           # Landing page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
└── lib/                  # Utilities and configurations
    ├── db.ts            # Database client
    ├── utils.ts         # Helper functions
    └── socket.ts        # WebSocket setup
```

## 🎨 Key Features Explained

### Channel Management
- **Multi-language Support** - Add channels in various Indian languages
- **Categorization** - Organize channels by type (Entertainment, News, Sports, etc.)
- **Metadata Management** - Channel logos, descriptions, and streaming URLs
- **Active/Inactive Toggle** - Enable/disable channels without deletion

### Program Library
- **Rich Metadata** - Title, description, duration, category, genre, rating
- **Image Support** - Program thumbnails and posters
- **Content Organization** - Filter by category, genre, and language
- **Status Management** - Active/inactive program status

### Schedule Management
- **Flexible Scheduling** - One-time and recurring schedules
- **Recurring Patterns** - Select specific days for weekly programs
- **Time Management** - Precise start/end time controls
- **Conflict Detection** - Built-in overlap prevention

### Copy Features
- **Schedule Copying** - Copy schedules between channels with date adjustment
- **Program Copying** - Duplicate programs with automatic conflict resolution
- **Bulk Operations** - Select multiple items for batch copying
- **Smart Time Calculation** - Automatic time offset adjustments

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect Repository** - Link your GitHub repository to Vercel
2. **Configure Environment** - Set up environment variables in Vercel dashboard
3. **Deploy** - Automatic deployment on every push to main branch

```bash
# Build for production
npm run build

# Start production server
npm start
```

### GitHub Pages
1. **Build Project** - `npm run build`
2. **Deploy** - Push `out` folder to GitHub Pages branch
3. **Configure** - Set up custom domain in repository settings

### Other Platforms
- **Netlify** - Connect repository and configure build settings
- **Railway** - Deploy with one-click from GitHub template
- **Digital Ocean** - Use App Platform for seamless deployment

## 🔧 Development

### Database Management
```bash
# Push schema changes to database
npm run db:push

# View database (optional)
npm run db:studio
```

### Code Quality
```bash
# Run linting
npm run lint

# Type checking
npm run type-check
```

### API Endpoints
- **Authentication**: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`
- **Channels**: `/api/channels` (GET, POST), `/api/channels/[id]` (PUT, DELETE)
- **Programs**: `/api/programs` (GET, POST), `/api/programs/[id]` (PUT, DELETE)
- **Schedules**: `/api/schedules` (GET, POST), `/api/schedules/[id]` (PUT, DELETE)
- **Copy Operations**: `/api/schedules/copy`, `/api/programs/copy`

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub for bug reports or feature requests
- **Discussions**: Use GitHub Discussions for general questions

---

Built with ❤️ for the Indian TV broadcasting community. Streamline your EPG management with modern web technology.
