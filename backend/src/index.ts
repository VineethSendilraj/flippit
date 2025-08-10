import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Flippit Backend API', 
    version: '1.0.0',
    status: 'running' 
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Temporary stub for voice-call integration used by the frontend
// Replace with real provider integration when available
app.post('/api/call', (req, res) => {
  const company = (req.body && req.body.company) || null;
  if (!company || typeof company !== 'object') {
    return res.status(400).json({ success: false, error: 'Missing or invalid company payload' });
  }

  const transcript = `Called ${company.name} at ${company.phone_number}. Representative confirmed availability and offered a price.`;
  const summaryPrice = '9500';

  return res.json({
    success: true,
    status: 'ended',
    transcript,
    summary: summaryPrice,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Flippit Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

