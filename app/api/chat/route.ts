import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDRy8xDLPtEMQe9TBroZOFQtsFYKPTeNLY');

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    // Debug: Tüm environment variables'ları kontrol et
    console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
    console.log('GEMINI_API_KEY var mı:', !!process.env.GEMINI_API_KEY);
    console.log('GEMINI_API_KEY uzunluğu:', process.env.GEMINI_API_KEY?.length || 0);
    console.log('GEMINI_API_KEY ilk 10 karakter:', process.env.GEMINI_API_KEY?.substring(0, 10) || 'YOK');
    console.log('GEMINI_API_KEY tam değer:', process.env.GEMINI_API_KEY || 'YOK');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Tüm env keys:', Object.keys(process.env).filter(key => key.includes('GEMINI')));
    console.log('===================================');

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Geçerli bir mesaj gönderilmelidir' },
        { status: 400 }
      );
    }

    // API key kontrolü
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY bulunamadı!');
      return NextResponse.json(
        { 
          error: 'Gemini API key bulunamadı. Lütfen .env.local dosyasını kontrol edin.',
          response: 'Üzgünüm, AI servisi şu anda kullanılamıyor. API key eksik.'
        },
        { status: 500 }
      );
    }

    // Get Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Create system prompt for Turkish AI assistant
    const systemPrompt = `Sen Türkçe konuşan bir AI asistanısın. Kullanıcılara yardımcı olmak için buradasın. 
    Cevaplarını Türkçe ver, samimi ve yardımsever ol. 
    HidLight MedyaTech hakkında bilgi verebilir, genel soruları yanıtlayabilir ve kullanıcılara rehberlik edebilirsin.
    Kısa ve öz cevaplar ver, gereksiz uzunluktan kaçın.`;

    const fullPrompt = `${systemPrompt}\n\nKullanıcı: ${message}\n\nAsistan:`;

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // For now, we'll return text only
    // In the future, we can add TTS integration here
    return NextResponse.json({
      response: text,
      audioUrl: null // Placeholder for future TTS integration
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Check if it's a Gemini API error
    if (error instanceof Error && error.message.includes('403')) {
      return NextResponse.json(
        { 
          error: 'Gemini API key geçersiz veya eksik. Lütfen API key\'i kontrol edin.',
          response: 'Üzgünüm, AI servisi şu anda kullanılamıyor. API key sorunu var.'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'AI servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
        response: 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. Lütfen daha sonra tekrar deneyin.'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Chat API endpoint',
    status: 'active',
    model: 'gemini-2.0-flash-exp'
  });
}
