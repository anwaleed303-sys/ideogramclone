# Ideogram Clone - AI Content Generator

A modern, responsive web application for generating AI-powered content including social media posts, templates, and images. Built with Next.js 14, TypeScript, and Material-UI.

![Ideogram Clone Screenshot](./public/screenshot.png)

## 🚀 Features

- **AI Content Generation**: Create posts, templates, and images using OpenAI API
- **Multiple Content Types**:
  - Social media posts
  - Custom templates
  - AI-generated images (multiple sizes)
- **Local Storage**: Automatically save all generated content
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Real-time Generation**: Instant content creation and display
- **Download & Share**: Export your generated content
- **Search & Filter**: Find your saved items easily

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Material-UI (MUI) + Tailwind CSS
- **State Management**: React Hooks + Local Storage
- **Icons**: Material-UI Icons

### Backend

- **API**: Next.js API Routes (Serverless Functions)
- **AI Integration**: OpenAI API
- **Image Generation**: OpenAI DALL-E + Pollination AI support

### Deployment

- **Platform**: Vercel
- **Environment**: Node.js 18+

## 📁 Project Structure

```
ideogram-clone/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── globals.css        # Global styles
│   │   └── api/               # API routes (Backend)
│   ├── components/            # React components
│   │   ├── AppBar.tsx         # Navigation bar
│   │   ├── GeneratorForm.tsx  # Content generation form
│   │   ├── GenerationResult.tsx # Result display
│   │   ├── SavedItems.tsx     # Saved content management
│   │   ├── HeroSection.tsx    # Landing section
│   │   ├── TabPanel.tsx       # Tab container
│   │   └── Toaster.tsx        # Notification system
│   ├── providers/             # Context providers
│   │   └── ThemeProvider.tsx  # Theme management
│   ├── hooks/                 # Custom hooks
│   │   └── useLocalStorage.ts # Local storage management
│   ├── services/              # API services
│   │   └── api.ts             # API client
│   ├── styles/                # Theme configuration
│   │   └── theme.ts           # MUI theme
│   ├── types/                 # TypeScript types
│   │   └── index.ts           # Type definitions
│   └── utils/                 # Utility functions
│       ├── dateUtils.ts       # Date formatting
│       └── idUtils.ts         # ID generation
├── public/                    # Static assets
├── package.json               # Dependencies
├── tsconfig.json             # TypeScript config
├── next.config.js            # Next.js config
├── tailwind.config.js        # Tailwind CSS config
├── vercel.json               # Vercel deployment config
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ideogram-clone.git
   cd ideogram-clone
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API keys:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   POLLINATION_API_KEY=your_pollination_api_key_here (optional)
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable              | Description                                  | Required |
| --------------------- | -------------------------------------------- | -------- |
| `OPENAI_API_KEY`      | OpenAI API key for text and image generation | ✅       |
| `POLLINATION_API_KEY` | Alternative image generation API             | ❌       |
| `NEXT_PUBLIC_APP_URL` | Application URL for production               | ❌       |

### Image Sizes

- **Small**: 256x256px - Fast generation
- **Medium**: 512x512px - Balanced quality and speed
- **Large**: 1024x1024px - High quality

## 📱 Usage

1. **Choose Content Type**: Select between Post, Template, or Image
2. **Enter Prompt**: Describe what you want to generate
3. **Generate**: Click the generate button
4. **Save Automatically**: Content is saved to local storage
5. **Manage Items**: View, search, filter, and delete saved items

### Example Prompts

**Posts:**

- "Create a motivational post about productivity"
- "Write a post announcing a new product launch"

**Templates:**

- "Create a template for weekly newsletter"
- "Design a template for event announcements"

**Images:**

- "A futuristic cityscape with flying cars"
- "Abstract geometric patterns in blue and purple"

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard

3. **Deploy**
   - Vercel will automatically deploy your app
   - Get your live URL

### Environment Variables in Vercel

Add these in your Vercel dashboard:

- `OPENAI_API_KEY`: Your OpenAI API key
- `POLLINATION_API_KEY`: (Optional) Alternative image API

## 🔥 Features in Detail

### Content Generation

- **Smart Prompting**: Optimized prompts for different content types
- **Multiple Sizes**: Various image generation sizes
- **Real-time Results**: Instant generation and display

### Local Storage

- **Auto-save**: All content saved automatically
- **Persistent**: Data persists across browser sessions
- **Export**: Download individual items or bulk export

### User Experience

- **Responsive**: Mobile-first design
- **Accessible**: WCAG compliant
- **Fast**: Optimized performance
- **Intuitive**: Clean, modern interface

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for AI capabilities
- [Next.js](https://nextjs.org/) for the framework
- [Material-UI](https://mui.com/) for components
- [Vercel](https://vercel.com/) for hosting

## 📧 Support

If you have any questions or need help:

- Create an issue on GitHub
- Check the documentation
- Contact the development team

---

**Made with ❤️ using Next.js, TypeScript, and AI**
