# GrowEasy AI-Powered CSV Importer

## Assignment Overview
Built an AI-powered CSV Importer that intelligently extracts CRM lead information from any valid CSV format. The system allows users to upload CSVs with completely different column names, layouts, and structures, while accurately mapping and extracting the required CRM fields.

## Key Features
- **Intelligent Field Mapping**: Uses Gemini AI to intelligently map dynamic columns to the standard GrowEasy CRM format.
- **Robust Fallback Engine**: Includes a heuristic parsing fallback mechanism that catches API failures or invalid keys and processes the data locally without crashing.
- **Drag & Drop Upload**: Modern, interactive file upload interface using `react-dropzone`.
- **Live CSV Preview**: Instant, client-side preview of uploaded data using `papaparse` *before* hitting the backend.
- **Results Dashboard**: Toggleable views showing successfully imported records alongside cleanly categorized skipped records (e.g., missing both email and mobile).
- **Premium UI**: Responsive, modern design built with Next.js 14 App Router, Tailwind CSS, and Lucide React icons.

## Tech Stack
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Multer
- **AI Integration**: Google Generative AI SDK (Gemini 1.5 Flash)

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in the `backend` directory and add your Gemini API Key (ensure it is a valid Google AI Studio key starting with `AIzaSy`):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=4000
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Sample Data
A `test_leads.csv` file has been provided in the root of this repository. It contains various lead formats, including messy data with multiple phone numbers and missing emails, specifically designed to test the extraction and fallback capabilities of the engine.

## Submission Details
- **Position Applied For**: Software Developer (Full-Time)
- **Hosted Application URL**: [Insert your Vercel/Render link here]
- **GitHub Repository**: [Insert your GitHub repo URL here]
