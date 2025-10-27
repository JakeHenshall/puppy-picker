# Puppy Picker

AI-powered dog breed recommendation app built with Next.js 16, React, TypeScript, and OpenAI GPT-3.5-turbo.

## Features

- 🎯 Interactive wizard with clickable card-based selections
- 🤖 AI-powered breed recommendations using OpenAI GPT-3.5-turbo
- 📊 Progress tracking through the questionnaire
- 🎨 Modern UI with Tailwind CSS v4
- ⚡ Server-side API route for AI integration
- 🔒 Input validation and security best practices
- ♿ Full accessibility (ARIA labels, keyboard navigation)
- ✨ Smooth animations and transitions

## How It Works

1. **Wizard Interface**: Users go through 7 questions about their lifestyle, preferences, and experience
2. **AI Analysis**: Responses are validated and analysed by OpenAI's GPT-3.5-turbo model
3. **Personalised Recommendation**: Get the ONE best dog breed specifically matched to your preferences with detailed explanations

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS v4
- **AI**: OpenAI GPT-3.5-turbo (fast and cost-effective)
- **Deployment**: Vercel-ready

## Key Improvements & Security

- ✅ Full TypeScript type safety with shared types
- ✅ Input validation on both client and server
- ✅ Proper error handling and user feedback
- ✅ No memory leaks (proper cleanup of timeouts)
- ✅ Accessible UI with ARIA labels
- ✅ Optimised React with useCallback hooks
- ✅ Security: Input sanitisation before sending to AI
- ✅ Proper API error handling without exposing internals
- ✅ SEO optimised with comprehensive metadata

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd puppy-picker
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```
OPENAI_API_KEY=sk-your-actual-openai-api-key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
puppy-picker/
├── app/
│   ├── api/
│   │   └── analyze/          # OpenAI API integration with validation
│   ├── page.tsx              # Main wizard interface
│   ├── layout.tsx            # Root layout with SEO metadata
│   ├── globals.css           # Global styles
│   └── types.ts              # Shared TypeScript types
├── public/                   # Static assets
└── package.json              # Dependencies
```

## Security Features

- Input validation and sanitisation
- No exposure of internal error details to clients
- Proper environment variable handling
- Type-safe API responses

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly
- Focus management

## Performance

- Optimised React components with useCallback
- Client-side wizard (no unnecessary re-renders)
- Fast API responses using GPT-3.5-turbo
- Automatic cleanup to prevent memory leaks

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your `OPENAI_API_KEY` in the Vercel project settings (Environment Variables)
4. Deploy!

### Manual Deployment

```bash
npm run build
npm start
```

## API Route

The app includes an API route at `/api/analyze` that:

- Validates all incoming user data
- Sanitises inputs before sending to OpenAI
- Uses GPT-3.5-turbo for fast, cost-effective responses
- Returns personalised breed recommendations
- Handles errors gracefully without exposing internals

## License

MIT

## Author

Built with ❤️ using Next.js, TypeScript, and OpenAI
