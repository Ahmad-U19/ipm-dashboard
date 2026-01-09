# Setup Guide

## Environment Variables Setup

This project uses environment variables to store sensitive information like API keys. These are **never** committed to version control.

### Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```
   Or on Windows PowerShell:
   ```powershell
   Copy-Item .env.example .env.local
   ```

2. **Edit `.env.local` and add your actual API keys:**
   ```env
   REACT_APP_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

3. **Restart your development server:**
   ```bash
   npm start
   ```

### Required Environment Variables

| Variable | Description | How to Get |
|----------|-------------|------------|
| `REACT_APP_OPENWEATHER_API_KEY` | OpenWeatherMap API key for weather data | [Sign up here](https://home.openweathermap.org/users/sign_up) |

### Important Notes

✅ **DO commit:** `.env.example` (template file)  
❌ **DON'T commit:** `.env.local`, `.env`, or any file with actual API keys

The `.gitignore` file is already configured to prevent committing environment files.

### Troubleshooting

**Error: "API key not configured"**
- Make sure you created `.env.local` (not just `.env`)
- Make sure the variable name starts with `REACT_APP_`
- Restart your development server after creating/updating `.env.local`
- Check that there are no spaces around the `=` sign

**The app works locally but not after deployment:**
- Environment variables need to be set in your hosting platform (Vercel, Netlify, etc.)
- Each platform has its own way to set environment variables
- Check your hosting platform's documentation for setting environment variables


