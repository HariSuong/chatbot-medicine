import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import envConfig from 'src/shared/config/config';

@Injectable()
export class AIService {
  private readonly genAI: GoogleGenerativeAI;

  constructor() {
    // Khởi tạo client Google AI với API key của bạn
    this.genAI = new GoogleGenerativeAI(envConfig.GOOGLE_API_KEY);
  }

  /**
   * Gửi một đoạn prompt đến Gemini và nhận lại câu trả lời.
   * @param prompt Nội dung bạn muốn hỏi AI.
   * @returns Chuỗi văn bản do AI tạo ra.
   */
  async generateText(prompt: string): Promise<string> {
    console.log('--- AI_SERVICE: Đang gửi prompt đến Google Gemini ---');
    console.log('Prompt:', prompt);
    try {
      // Chọn model, ví dụ 'gemini-1.5-flash' là model mới, nhanh và hiệu quả
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      console.log('--- AI_SERVICE: Đã nhận được text từ Gemini ---');
      console.log('Response Text:', text);
      return text;
    } catch (error) {
      console.error(
        '--- LỖI AI_SERVICE: Lỗi khi gọi đến Gemini API ---',
        error,
      );
      throw new Error('Không thể nhận phản hồi từ AI.');
    }
  }
}
