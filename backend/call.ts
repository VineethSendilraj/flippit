import express from 'express';
import fetch from 'node-fetch';
import type { Request, Response } from 'express';
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: true, // Allow all origins for now - you can restrict this later
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

const VAPI_PRIVATE_KEY = '183f4df8-2934-4f53-809c-01c8dc655573';

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'ArbiAI Backend API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'ArbiAI Backend API is healthy',
    timestamp: new Date().toISOString()
  });
});

interface CallResponse {
  id: string;
}

interface CallStatusResponse {
  status: string;
  error?: string;
  artifact?: {
    messages: any[];
  };
  transcript?: string;
  analysis?: {
    summary: string;
    successEvaluation: string;
  };
}

async function waitForCallEnd(callId: string): Promise<CallStatusResponse> {
  console.log(`Starting to monitor call ${callId}...`);
  let attempts = 0;
  
  while (true) {
    attempts++;
    console.log(`Checking call status (attempt ${attempts})...`);
    
    const statusResponse = await fetch(`https://api.vapi.ai/call/${callId}`, {
      headers: {
        'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`
      }
    });

    if (!statusResponse.ok) {
      const errorData = await statusResponse.text();
      console.error(`Failed to check call status: ${errorData}`);
      throw new Error(`Failed to check call status: ${errorData}`);
    }

    const statusData = await statusResponse.json() as CallStatusResponse;
    console.log(`Current call status: ${statusData.status}`);
    
    if (statusData.status === 'ended' || statusData.status === 'failed') {
      console.log('Call has ended. Final status:', statusData.status);
      if (statusData.analysis) {
        console.log('Call summary:', statusData.analysis.summary);
      }
      if (statusData.transcript) {
        console.log('Transcript available');
      }
      return statusData;
    }

    // Wait 5 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

// Route to initiate a call and wait for completion
app.post('/api/call', async (req: Request, res: Response) => {
  try {
    console.log('Initiating new call...');
    const response = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        assistantId: '419b4682-1648-4686-8b8c-668a83270b16',
        customer: {
          number: '+19455239319'
        },
        phoneNumberId: '82126eaa-ed35-4510-b1f2-5ec2b8283729'
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Failed to initiate call:', errorData);
      throw new Error(`Failed to initiate call: ${errorData}`);
    }

    const callData = await response.json() as CallResponse;
    console.log('Call initiated successfully. Call ID:', callData.id);
    
    // Wait for the call to end and get the final data
    const finalData = await waitForCallEnd(callData.id);
    
    res.json({
      success: true,
      status: finalData.status,
      summary: finalData.analysis?.summary,
      transcript: finalData.transcript
    });
  } catch (error: any) {
    console.error('Error making outbound call:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export the app for Vercel serverless functions
export default app;

// Start server for local development
if (process.env.NODE_ENV !== 'production' && require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 ArbiAI Backend running on http://localhost:${PORT}`);
    console.log(`📞 VAPI Call endpoint: http://localhost:${PORT}/api/call`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  });
}