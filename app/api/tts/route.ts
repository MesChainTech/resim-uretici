import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyArvP0_ZVMZmLrcx3IRq_WmXUsHzNHlxf8');

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Geçerli bir metin gönderilmelidir' },
        { status: 400 }
      );
    }

    // API key kontrolü
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY bulunamadı!');
      return NextResponse.json(
        { 
          error: 'Gemini API key bulunamadı. Lütfen .env.local dosyasını kontrol edin.'
        },
        { status: 500 }
      );
    }

    // Get Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Create system prompt for Turkish AI assistant
    const systemPrompt = `Sen Türkçe konuşan bir AI asistanısın. Kullanıcılara yardımcı olmak için buradasın. 
    Cevaplarını Türkçe ver, samimi ve yardımsever ol. 
    MesChain hakkında bilgi verebilir, genel soruları yanıtlayabilir ve kullanıcılara rehberlik edebilirsin.
    Kısa ve öz cevaplar ver, gereksiz uzunluktan kaçın.`;

    const fullPrompt = `${systemPrompt}\n\nKullanıcı: ${text}\n\nAsistan:`;

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const responseText = response.text();

    // For now, we'll return text only
    // In the future, we can add TTS integration here
    return NextResponse.json({
      response: responseText,
      audioUrl: null // Placeholder for future TTS integration
    });

  } catch (error) {
    console.error('TTS API Error:', error);
    
    // Check if it's a Gemini API error
    if (error instanceof Error && error.message.includes('403')) {
      return NextResponse.json(
        { 
          error: 'Gemini API key geçersiz veya eksik. Lütfen API key\'i kontrol edin.'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'TTS servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'TTS API endpoint',
    status: 'active',
    model: 'gemini-2.0-flash-exp'
  });
}
