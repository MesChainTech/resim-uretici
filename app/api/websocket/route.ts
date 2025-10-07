import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyArvP0_ZVMZmLrcx3IRq_WmXUsHzNHlxf8');

export async function GET(request: NextRequest) {
  try {
    // WebSocket connection için header kontrolü
    const upgrade = request.headers.get('upgrade');
    const connection = request.headers.get('connection');
    
    if (upgrade !== 'websocket' || !connection?.includes('Upgrade')) {
      return NextResponse.json(
        { error: 'WebSocket connection required' },
        { status: 400 }
      );
    }

    // API key kontrolü
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key bulunamadı' },
        { status: 500 }
      );
    }

    // WebSocket connection response
    return new NextResponse(null, {
      status: 101,
      headers: {
        'Upgrade': 'websocket',
        'Connection': 'Upgrade',
        'Sec-WebSocket-Accept': 'websocket-accept-key'
      }
    });

  } catch (error) {
    console.error('WebSocket API Error:', error);
    return NextResponse.json(
      { error: 'WebSocket servisi şu anda kullanılamıyor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { audioData, sessionId } = await request.json();

    if (!audioData) {
      return NextResponse.json(
        { error: 'Audio data gönderilmelidir' },
        { status: 400 }
      );
    }

    // API key kontrolü
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key bulunamadı' },
        { status: 500 }
      );
    }

    // Get Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Create system prompt for Turkish AI assistant
    const systemPrompt = `Sen Türkçe konuşan bir AI asistanısın. Kullanıcılara yardımcı olmak için buradasın. 
    Cevaplarını Türkçe ver, samimi ve yardımsever ol. 
    MesTech Sync hakkında bilgi verebilir, genel soruları yanıtlayabilir ve kullanıcılara rehberlik edebilirsin.
    Kısa ve öz cevaplar ver, gereksiz uzunluktan kaçın.`;

    // Audio data'yı text'e çevir (placeholder)
    // Gerçek implementasyonda Google Speech-to-Text API kullanılacak
    const audioText = "Sesli mesaj alındı"; // Placeholder

    const fullPrompt = `${systemPrompt}\n\nKullanıcı: ${audioText}\n\nAsistan:`;

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const responseText = response.text();

    return NextResponse.json({
      response: responseText,
      audioUrl: null, // Placeholder for future TTS integration
      sessionId: sessionId
    });

  } catch (error) {
    console.error('WebSocket Audio API Error:', error);
    return NextResponse.json(
      { error: 'Audio işleme servisi şu anda kullanılamıyor' },
      { status: 500 }
    );
  }
}
