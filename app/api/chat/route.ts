import { NextRequest, NextResponse } from 'next/server';

// 动态导入OpenAI，避免在没有API密钥时出错
let openai: any = null;
if (process.env.OPENAI_API_KEY) {
  try {
    const OpenAI = require('openai').default;
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } catch (error) {
    console.warn('OpenAI package not available');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, imageUrl, mode } = await request.json();

    if (mode === 'parse_expense') {
      // 解析记账信息
      if (!openai) {
        // 如果没有API密钥，使用简单的规则解析
        return NextResponse.json({
          expense: parseExpenseSimple(message),
        });
      }

      const systemPrompt = `你是一个记账助手。从用户的消息中提取以下信息：
1. 日期（如果没有，使用今天）
2. 描述
3. 金额和货币（EUR/CHF/CNY）
4. 付款人（如果有提到）
5. 类别（如：餐饮、住宿、交通、滑雪装备等）

返回JSON格式：
{
  "date": "YYYY-MM-DD",
  "description": "描述",
  "amount": 数字,
  "currency": "EUR|CHF|CNY",
  "category": "类别"
}`;

      const messages: any[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ];

      if (imageUrl) {
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: '请识别这张账单图片中的信息并提取记账数据。' },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        });
      }

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4-vision-preview',
          messages,
          response_format: { type: 'json_object' },
        });

        const content = completion.choices[0].message.content;
        const expense = JSON.parse(content || '{}');

        return NextResponse.json({ expense });
      } catch (error) {
        console.error('OpenAI API error:', error);
        return NextResponse.json({
          expense: parseExpenseSimple(message),
        });
      }
    } else {
      // 普通聊天
      if (!openai) {
        return NextResponse.json({
          message: 'AI功能需要配置OPENAI_API_KEY环境变量。请在.env.local文件中添加你的OpenAI API密钥。',
        });
      }

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: '你是一个友好的滑雪记账助手。帮助用户记账、回答问题，并给出建议。',
            },
            { role: 'user', content: message },
          ],
        });

        return NextResponse.json({
          message: completion.choices[0].message.content,
        });
      } catch (error) {
        console.error('OpenAI API error:', error);
        return NextResponse.json({
          message: '抱歉，AI服务暂时不可用。请检查你的API密钥配置。',
        });
      }
    }
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat' },
      { status: 500 }
    );
  }
}

// 简单的规则解析（当没有OpenAI API时使用）
function parseExpenseSimple(message: string) {
  const today = new Date().toISOString().split('T')[0];
  const amountMatch = message.match(/(\d+\.?\d*)/);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
  
  let currency: 'EUR' | 'CHF' | 'CNY' = 'EUR';
  if (message.includes('€') || message.includes('欧元')) currency = 'EUR';
  else if (message.includes('CHF') || message.includes('瑞士法郎')) currency = 'CHF';
  else if (message.includes('¥') || message.includes('人民币') || message.includes('元')) currency = 'CNY';

  return {
    date: today,
    description: message,
    amount,
    currency,
    category: '其他',
  };
}

