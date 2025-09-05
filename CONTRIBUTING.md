# Contributing to EPG Manager

We welcome contributions to the EPG Manager project! This guide will help you get started with contributing to the codebase.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue on GitHub with:

- **Clear title** describing the bug
- **Detailed description** of the problem
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Environment details** (OS, browser, version)
- **Screenshots** if applicable

### Suggesting Features

We love feature suggestions! When suggesting a feature:

- **Use a clear title** for the feature request
- **Provide a detailed description** of the feature
- **Explain the use case** and why it's valuable
- **Consider including mockups** or examples
- **Discuss implementation ideas** if you have them

### Code Contributions

We accept code contributions via Pull Requests. Here's how to get started:

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** or yarn package manager
- **Git** for version control
- **GitHub account** for contributions

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Fork the repository on GitHub
   # Clone your fork locally
   git clone https://github.com/YOUR_USERNAME/epg-builder.git
   cd epg-builder
   ```

2. **Set up upstream remote**
   ```bash
   git remote add upstream https://github.com/shihan84/epg-builder.git
   git fetch upstream
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database configuration
   ```

5. **Set up database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style

- **TypeScript**: Use strict TypeScript typing
- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Code formatting (if configured)
- **Comments**: Add meaningful comments for complex logic

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── auth/          # Authentication routes
│   │   ├── channels/      # Channel management
│   │   ├── programs/      # Program management
│   │   ├── schedules/     # Schedule management
│   │   └── setup/         # Setup utilities
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── setup/            # Setup page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
└── lib/                  # Utilities and configurations
    ├── db.ts            # Database client
    ├── utils.ts         # Helper functions
    └── socket.ts        # WebSocket setup
```

### Component Guidelines

- **Functional Components**: Prefer functional components with hooks
- **TypeScript Props**: Define interfaces for component props
- **Accessibility**: Use semantic HTML and ARIA attributes
- **Responsive Design**: Ensure components work on all screen sizes
- **Error Boundaries**: Add error handling where appropriate

### API Guidelines

- **RESTful Design**: Follow REST principles for API design
- **Error Handling**: Return appropriate HTTP status codes
- **Validation**: Validate input data on server-side
- **Security**: Use proper authentication and authorization
- **Documentation**: Add JSDoc comments for API functions

### Database Guidelines

- **Prisma Schema**: Use the existing schema patterns
- **Migrations**: Use `prisma db push` for development
- **Queries**: Optimize database queries with Prisma
- **Relations**: Use proper foreign key relationships
- **Indexes**: Add indexes for frequently queried fields

## 🔄 Git Workflow

### Branch Strategy

- **main**: Production-ready code (protected)
- **develop**: Integration branch for features
- **feature/**: Feature branches
- **hotfix/**: Critical bug fixes

### Creating a Feature Branch

```bash
# Create and switch to feature branch
git checkout -b feature/your-feature-name develop

# Make your changes
# Add tests if applicable
# Update documentation

# Commit your changes
git commit -m "feat: add your feature description"

# Push to your fork
git push origin feature/your-feature-name
```

### Creating a Hotfix Branch

```bash
# Create and switch to hotfix branch
git checkout -b hotfix/your-hotfix-name main

# Make your changes
# Test thoroughly

# Commit your changes
git commit -m "fix: describe the hotfix"

# Push to your fork
git push origin hotfix/your-hotfix-name
```

### Pull Request Process

1. **Update your fork** with latest changes:
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout feature/your-feature-name
   git rebase develop
   ```

2. **Create Pull Request**:
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your feature branch
   - Compare to `develop` (or `main` for hotfixes)
   - Fill in the PR template

3. **PR Description**:
   - **Clear title** describing the change
   - **Detailed description** of what you did and why
   - **Related issues** (fixes #123)
   - **Testing instructions**
   - **Screenshots** if applicable

4. **Code Review**:
   - Respond to review comments promptly
   - Make requested changes
   - Keep PR history clean

### Commit Message Convention

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build process or auxiliary tool changes

**Examples:**
```
feat: add channel management API endpoints
fix: resolve authentication redirect issues
docs: update deployment guide
style: format code with Prettier
refactor: optimize database queries
test: add unit tests for user service
chore: update dependencies
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test path/to/test/file.test.ts

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database operations
- **E2E Tests**: Test user workflows (if applicable)
- **Test Coverage**: Aim for 80%+ coverage

### Test Structure

```
tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
├── e2e/              # End-to-end tests
└── fixtures/         # Test data
```

## 📦 Building and Deployment

### Local Build

```bash
# Build for production
npm run build

# Start production server locally
npm start
```

### Deployment

- **Vercel**: Automatic deployment on merge to main
- **Other Platforms**: Follow platform-specific deployment guides

### Environment Variables

Never commit sensitive information. Use environment variables:

```env
# Database
DATABASE_URL=postgresql://...

# Application
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-domain.com
```

## 🐛 Debugging

### Common Issues

**Database Connection Errors:**
- Check `DATABASE_URL` environment variable
- Ensure database server is running
- Verify network connectivity

**Build Errors:**
- Check TypeScript errors
- Verify dependencies are installed
- Check environment variables

**Authentication Issues:**
- Verify middleware configuration
- Check cookie settings
- Verify database user records

### Debug Tools

- **Browser DevTools**: Console, Network, Application tabs
- **Vercel Logs**: Function logs and error tracking
- **Database Logs**: Query performance and errors
- **Network Tab**: API request debugging

## 📝 Documentation

### Updating Documentation

- **README.md**: Project overview and quick start
- **DEPLOYMENT_STATUS.md**: Current deployment status
- **CHANGELOG.md**: Version history and changes
- **Code Comments**: Inline documentation for complex logic

### Documentation Standards

- **Clear and Concise**: Use simple language
- **Up-to-date**: Keep documentation current with code
- **Examples**: Provide code examples where helpful
- **Screenshots**: Include screenshots for UI changes

## 🤝 Community Guidelines

### Code of Conduct

- **Be Respectful**: Treat all contributors with respect
- **Be Constructive**: Provide helpful feedback
- **Be Inclusive**: Welcome contributors from all backgrounds
- **Be Patient**: Help newcomers learn the project

### Communication

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For general questions and discussions
- **Pull Requests**: For code contributions
- **Email**: For private or security-related issues

## 🏆 Recognition

Contributors will be recognized in:
- **README.md**: Contributors section
- **Release Notes**: For significant contributions
- **GitHub Stars**: For valuable contributions

## 📞 Getting Help

### Resources

- **Documentation**: Check project README and docs
- **GitHub Issues**: Search existing issues before creating new ones
- **GitHub Discussions**: Ask questions and share ideas
- **Code Reviews**: Learn from feedback on your contributions

### Contact

For private or security-related issues:
- **Email**: [your-email@example.com]
- **GitHub Security**: Use GitHub's security reporting features

---

Thank you for contributing to EPG Manager! 🎉

*Last Updated: September 2025*