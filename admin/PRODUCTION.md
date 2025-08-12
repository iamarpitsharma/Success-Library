# Admin Panel - Production Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Backend server running and accessible
- Environment variables configured

## Environment Configuration

1. Create a `.env` file in the admin directory:
```bash
# API Configuration
VITE_API_BASE_URL=https://your-backend-domain.com

# Environment
NODE_ENV=production

# Build Configuration
VITE_APP_TITLE=Library Management System - Admin Panel
```

## Production Build

1. Install dependencies:
```bash
npm install
```

2. Build for production:
```bash
npm run build
```

3. The built files will be in the `dist/` directory.

## Deployment Options

### Option 1: Static File Server (Recommended)
Serve the `dist/` folder using a static file server:

```bash
# Using serve
npm install -g serve
serve -s dist -l 5174

# Using nginx
# Copy dist/ contents to your nginx web root
```

### Option 2: Using the Preview Server
```bash
npm run start
```

### Option 3: Docker Deployment
Create a Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5174

CMD ["npm", "run", "start"]
```

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **CORS**: Ensure backend CORS is configured for your domain
3. **Environment Variables**: Never commit `.env` files
4. **API Security**: Ensure backend has proper authentication
5. **Rate Limiting**: Implement rate limiting on the backend

## Performance Optimization

1. **CDN**: Use a CDN for static assets
2. **Caching**: Implement proper caching headers
3. **Compression**: Enable gzip compression
4. **Monitoring**: Set up error monitoring and analytics

## Troubleshooting

### Common Issues:

1. **API Connection Errors**: Check `VITE_API_BASE_URL` configuration
2. **CORS Errors**: Verify backend CORS settings
3. **Build Failures**: Ensure all dependencies are installed
4. **Authentication Issues**: Verify JWT token handling

### Logs:
- Check browser console for client-side errors
- Check server logs for backend errors
- Verify network requests in browser dev tools

## Maintenance

1. **Regular Updates**: Keep dependencies updated
2. **Security Patches**: Apply security updates promptly
3. **Backup**: Regular backups of configuration
4. **Monitoring**: Monitor application performance and errors
