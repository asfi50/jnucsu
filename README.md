# JnUCSU - Jagannath University Student Union Platform

JnUCSU is a modern, interactive platform designed to empower student leaders at Jagannath University. It provides a comprehensive digital space for students to discover candidates, engage with their profiles, and participate in university democratic processes.

![JnUCSU Homepage](https://github.com/user-attachments/assets/24d31498-51d9-40fa-947f-502fbf88a9d5)

## 📚 Table of Contents

- [🚀 Features Overview](#-features-overview)
- [🛠️ Technology Stack](#️-technology-stack)
- [📦 Installation & Setup](#-installation--setup)
- [📁 Project Structure](#-project-structure)
- [🎯 Key Features in Detail](#-key-features-in-detail)
- [🌟 UI/UX Design](#-uiux-design)
- [⚡ Performance Features](#-performance-features)
- [🔐 Security & Authentication](#-security--authentication)
- [🤝 Contributing](#-contributing)

## 🚀 Features Overview

### 🗳️ **Candidate Profiles & Discovery**
- **Comprehensive Candidate Profiles**: Students can create detailed profiles showcasing their qualifications, experience, and vision
- **Interactive Candidate Directory**: Advanced search and filtering system to discover candidates by department, position, or keywords
- **Verification System**: Admin-verified profiles ensure authenticity before public access
- **Student Information**: Detailed candidate information including student ID, department, academic year, and role aspirations

![Candidate Directory](https://github.com/user-attachments/assets/95026db7-d036-4855-b40a-b66c52790dba)

### 📱 **QR Code Integration**
- **Unique QR Codes**: Each candidate receives a personalized QR code linked to their profile
- **Easy Profile Sharing**: Instant profile access through QR code scanning
- **Mobile-Optimized**: Seamless experience across all devices

### 🗳️ **Interactive Voting System**
- **Real-time Voting**: Students can upvote their preferred candidates
- **Vote Tracking**: Live vote counts with secure, one-vote-per-user system
- **Engagement Analytics**: Track candidate popularity and engagement metrics

### 💬 **Community Engagement**
- **Comment System**: Users can leave comments and feedback on candidate profiles
- **Real-time Updates**: Instant comment posting with user avatars and timestamps
- **Content Moderation**: Built-in flagging system for inappropriate content
- **Reply Threading**: Organized comment discussions with reply support

![Candidate Profile with QR Code](https://github.com/user-attachments/assets/c92abdd5-e8a8-4152-98d1-29777a6c9b45)

### 📝 **Blog & Content Platform**
- **Article Publishing**: Students and leaders can write and share blog posts
- **Content Categories**: Organized content by topics like Leadership, Technology, Community, Environment
- **Interactive Features**: Like and comment functionality for blog posts
- **Content Discovery**: Featured articles, trending posts, and personalized recommendations

![Blog Section](https://github.com/user-attachments/assets/a471a79e-43aa-4f51-b2f8-639d9cbc242e)

### 🎨 **Work Gallery & Portfolios**
- **Visual Portfolios**: Candidates can showcase their work through image galleries
- **Achievement Showcase**: Highlight past projects, initiatives, and accomplishments
- **Future Plans**: Detailed sections for candidates to outline their post-election vision

### 🔍 **Advanced Search & Filtering**
- **Multi-criteria Search**: Filter candidates by department, position, year, and keywords
- **Smart Sorting**: Sort by popularity, recent activity, or alphabetical order
- **Real-time Results**: Instant search results as users type

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 15.5.4**: Modern React framework with App Router and Turbopack
- **React 19.1.0**: Latest React features and optimizations
- **TypeScript**: Type-safe development experience
- **Tailwind CSS 4**: Latest utility-first CSS framework for responsive design
- **Lucide React**: Beautiful, customizable icons

### **Backend & Data**
- **Mock Data**: Structured sample data for development and demonstration
- **QR Code Generation**: Dynamic QR code creation for candidate profiles
- **Placeholder Images**: Generated images using placeholder services

### **Development Tools**
- **ESLint**: Code linting and quality assurance
- **Turbopack**: Fast build system for development

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/asfi50/jnucsu.git
   cd jnucsu
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```
   *Note: Development server uses Turbopack for faster builds*

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application

### Build for Production
```bash
npm run build
npm start
```
*Note: Build process uses Turbopack for optimized performance*

## 📁 Project Structure

```
jnucsu/
├── app/                    # Next.js App Router pages
│   ├── candidates/         # Candidate-related pages
│   ├── blog/              # Blog and articles
│   ├── auth/              # Authentication pages
│   ├── developers/        # Developer/team information page
│   └── layout.tsx         # Root layout component
├── components/            # Reusable React components
│   ├── candidates/        # Candidate-specific components
│   ├── blog/              # Blog-related components
│   ├── home/              # Homepage components
│   ├── layout/            # Layout components
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions and data
│   ├── data/              # Mock data and sample content
│   ├── types/             # TypeScript type definitions
│   ├── utils.ts           # Helper functions
│   └── seo.ts             # SEO utilities
└── public/                # Static assets
```

## 🎯 Key Features in Detail

### Candidate Management
- **Profile Creation**: Comprehensive form for candidate information including student ID, department, role, and future plans
- **Verification Process**: Admin review and approval workflow to ensure profile authenticity
- **Profile Links**: Shareable candidate profile URLs with unique QR codes for easy mobile access
- **Status Tracking**: Draft, pending review, verified, and published states
- **Work Gallery**: Visual portfolio showcase with responsive image galleries
- **Real-time Statistics**: Live vote counts and engagement metrics

### Community Features  
- **Trending Candidates**: Algorithm-based trending candidate display using vote velocity and engagement
- **Interactive Voting**: One-click upvoting system with real-time vote count updates
- **Comment System**: Threaded comments with user avatars, timestamps, and reply functionality
- **Content Moderation**: Community-driven flagging and reporting system for inappropriate content
- **Newsletter Integration**: Email subscription system for platform updates and announcements

### Blog & Content Platform
- **Rich Text Publishing**: Full-featured blog post creation and editing
- **Category System**: Organized content taxonomy (Leadership, Technology, Community, Environment, etc.)
- **Engagement Features**: Like buttons, comment sections, and social sharing
- **Content Discovery**: Featured articles, trending posts, and search functionality
- **Reading Time Calculation**: Automatic estimation of article reading time
- **Author Profiles**: Linked author information with avatar and bio

### Advanced Search & Filtering
- **Multi-parameter Search**: Filter by department, position, academic year, and keywords
- **Real-time Search**: Instant results with debounced input handling
- **Smart Sorting**: Multiple sort options including popularity, recency, and alphabetical
- **Faceted Navigation**: Category-based filtering with result counts
- **Search Analytics**: Track popular search terms and user behavior

## 🌟 UI/UX Design

### Design Philosophy
- **ProductHunt-inspired Interface**: Clean, modern design following industry-leading UX patterns
- **Consistent Color Scheme**: Orange accent colors (#F97316) for brand consistency
- **Typography**: Clean, readable fonts with proper hierarchy
- **Card-based Layout**: Intuitive information organization with visual cards

### Responsive Design
- **Mobile-first Approach**: Optimized for smartphones and tablets
- **Flexible Layouts**: CSS Grid and Flexbox for adaptable content
- **Touch-friendly Interface**: Appropriate button sizes and spacing for mobile interaction
- **Cross-browser Compatibility**: Tested across major browsers

### Accessibility Features
- **Semantic HTML**: Proper heading structure and landmark elements
- **Alt Text**: Descriptive alternative text for all images
- **Keyboard Navigation**: Full keyboard accessibility support
- **Color Contrast**: WCAG AA compliant color combinations

## ⚡ Performance Features

### Optimization
- **Next.js Image Optimization**: Automatic image compression and WebP conversion
- **Code Splitting**: Route-based code splitting for faster initial loads
- **Static Generation**: Pre-rendered pages for improved performance
- **Caching Strategy**: Optimized caching for static assets

### Development Experience
- **Hot Reload**: Instant updates during development with Turbopack
- **TypeScript Integration**: Full type safety throughout the application
- **ESLint Configuration**: Consistent code quality and formatting
- **Component Architecture**: Reusable, modular component design

## 🔐 Security & Authentication

### Planned Authentication Features
- **Email Authentication**: Secure email-based user registration and login
- **Google OAuth**: Integration with Google Sign-In for convenient access
- **Session Management**: Secure session handling and user state management
- **Role-based Access**: Different permission levels for students, candidates, and administrators

### Content Security
- **Input Validation**: Server-side validation for all user inputs
- **Content Moderation**: Community-driven flagging system for inappropriate content
- **XSS Protection**: Built-in protection against cross-site scripting attacks
- **CSRF Protection**: Cross-site request forgery prevention measures

We welcome contributions from the community! Please feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

© 2025 JnUCSU. All rights reserved.

---

**Developed and maintained by [JnU CSE Club](https://github.com/asfi50/jnucsu)**

*Empowering student leaders at Jagannath University through democratic participation and innovative technology.*
