import { Injectable } from '@nestjs/common';
import { AIService } from 'src/shared/services/ai.service';

@Injectable()
export class AppService {
  constructor(private readonly aiService: AIService) {} // <-- Inject AIService

  getHello(): string {
    return 'Hello World!';
  }

  // Thêm hàm mới để test AI
  async testAI(): Promise<string> {
    const prompt = 'Viết một câu chào mừng ngắn gọn cho chatbot về thú cưng.';
    return this.aiService.generateText(prompt);
  }
}
