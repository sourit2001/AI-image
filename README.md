# AI Photo Studio

A professional AI-powered image editing web application built with Next.js and Replicate API.

## Project Overview

AI Photo Studio is a comprehensive web application that provides advanced AI image editing capabilities through an intuitive user interface. Users can perform various image processing tasks including text removal, emoji generation, background removal, image upscaling, and professional headshot creation.

## Features

### Core Functionality
- **Text Removal**: Intelligently detect and remove text/watermarks from images
- **Emoji Generation**: Transform images into Apple iOS-style emojis
- **Background Removal**: One-click background removal with transparent PNG output
- **Image Upscaling**: AI-powered high-resolution image enhancement (2x/4x)
- **Haircut & Color Change**: Modify hairstyles and hair colors using AI
- **Professional Headshots**: Generate professional portrait photos

### User Interface
- **Modern Landing Page**: Clean card-based layout showcasing all features
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Processing**: Live status updates during AI processing
- **User Authentication**: Login/Register buttons ready for implementation
- **Pricing Display**: Three-tier subscription plans ($0, $4.99, $14.99/month)

## Technology Stack

- **Frontend**: Next.js (React), Tailwind CSS
- **Backend**: Next.js API Routes
- **AI Services**: Replicate API
  - flux-kontext-apps/text-removal
  - flux-kontext-apps/kontext-emoji-maker
  - flux-kontext-apps/professional-headshot
  - flux-kontext-apps/change-haircut
  - TopazLabs/RealESRGAN (upscaling)
- **Deployment**: Ready for Vercel deployment

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI-img
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file with the following variables:
   ```
   REPLICATE_API_TOKEN=your_replicate_api_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REPLICATE_API_TOKEN` | Your Replicate API token for AI model access | Yes |

## Project Structure

```
AI-img/
├── pages/
│   ├── index.js                 # Landing page with feature cards
│   ├── remove-text.js           # Text removal functionality
│   ├── emoji-maker.js           # Emoji generation functionality
│   ├── professional-headshot.js # Professional headshot generation
│   ├── background-removal.js    # Background removal functionality
│   ├── upscale.js              # Image upscaling functionality
│   ├── haircut-change.js       # Haircut modification functionality
│   └── api/
│       └── process.js          # Unified API endpoint for all AI operations
├── .env.local                  # Environment variables (create this)
├── package.json               # Project dependencies
└── README.md                  # This file
```

## API Endpoints

### POST /api/process
Unified endpoint for all AI image processing operations.

**Request Body:**
```json
{
  "action": "remove_text|emoji_maker|professional_headshot|...",
  "image": "base64_encoded_image_data",
  "params": {
    "prompt": "optional_text_prompt",
    "background": "optional_background_setting",
    // ... other action-specific parameters
  }
}
```

**Response:**
```json
{
  "id": "prediction_id",
  "status": "starting|processing|succeeded|failed"
}
```

### GET /api/process?id=prediction_id
Check the status of a processing task.

**Response:**
```json
{
  "status": "succeeded",
  "output": "https://output-image-url.com/result.png"
}
```

## Pricing Plans

- **Free Plan**: $0/month - 5 free processes per month
- **Professional Plan**: $4.99/month - 100 processes per month, all features
- **Enterprise Plan**: $14.99/month - Unlimited processes, API access, batch processing

## Usage Examples

1. **Text Removal**: Upload an image with text/watermarks, and the AI will intelligently remove them while preserving the background
2. **Emoji Generation**: Upload any image and transform it into an Apple iOS-style emoji with the default prompt
3. **Professional Headshots**: Upload a casual photo and generate professional business portraits
4. **Background Removal**: Get clean transparent PNG files for product photos or portraits

## Development Status

✅ **Completed Features:**
- Landing page with feature cards and pricing
- Text removal functionality
- Emoji generation functionality
- All feature pages with consistent UI/UX
- Unified backend API with error handling
- Image upload and processing pipeline
- Real-time status polling
- Responsive design

🔄 **Ready for Enhancement:**
- User authentication system
- Payment integration (Stripe)
- User dashboard and processing history
- API rate limiting
- Database integration for user management

## Contributing

This project is ready for production deployment and further feature development. The architecture supports easy addition of new AI models and features through the unified API structure.

## License

[Add your license information here]

## Support

For technical support or feature requests, please contact the development team.
