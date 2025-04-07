# SaasMote - AI Model Image Generator

SaasMote is a web application that allows users to generate AI-enhanced images by combining clothing items with different model backgrounds.

## Features

- Upload clothing items to overlay on models
- Select from multiple male and female models
- AI-powered image generation and enhancement
- Background customization options

## Technologies Used

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js (for file uploads)
- AI Services: Gemini API

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Gemini API key:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

## Usage

1. Run the development server
2. Open the application in your browser
3. Upload a clothing item image
4. Select a model and background
5. Generate and download the enhanced image

## Project Structure

- `public/`: Static assets and model images
- `server/`: Backend file upload handling
- `src/`: Frontend React application
  - `components/`: Reusable UI components
  - `pages/`: Main application pages
  - `services/`: API service integrations

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
