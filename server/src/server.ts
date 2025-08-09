import 'dotenv/config';
import app from './app';

// Validate critical environment variables
const validateEnvironment = () => {
  const requiredVars = ['ACCESS_TOKEN_SECRET'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    console.error('Please set these variables before starting the server');
    process.exit(1);
  }
  
  // Warn about missing optional variables
  if (!process.env.CORS_ORIGIN) {
    console.warn('Warning: CORS_ORIGIN not set. This may cause CORS issues in production.');
  }
  
  console.log('Environment validation passed');
};

validateEnvironment();

const PORT: number = parseInt(process.env.PORT || '8080', 10);

app.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});