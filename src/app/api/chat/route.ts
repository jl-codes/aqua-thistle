import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Redirect to FastAPI backend - all AI processing happens there now
    return NextResponse.json({
      success: false,
      error: "This endpoint is deprecated. Use the streaming endpoint at http://localhost:8001/api/chat/stream instead.",
      redirect: `http://localhost:8001/api/chat/stream?message=${encodeURIComponent(message)}`,
    }, { status: 301 });
    
  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json({
      success: false,
      error: "API error occurred. Please use the backend streaming endpoint.",
    }, { status: 500 });
  }
}

// Add CORS headers for development
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
