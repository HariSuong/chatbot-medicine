// src/chat/chat.service.ts

import { Injectable } from '@nestjs/common';
import { ChatRepository } from 'src/chat/chat.repo';
import { KnowledgeBaseRepository } from 'src/knowledge-base/knowledge-base.repo';
import { ConversationAccessException } from 'src/shared/constains/exception.constains';
import { AIService } from 'src/shared/services/ai.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepo: ChatRepository,
    private readonly aiService: AIService,
    private readonly kbRepo: KnowledgeBaseRepository, // <-- Inject repo mới
  ) {}

  /**
   * Bắt đầu một cuộc hội thoại mới cho user
   */
  async startConversation(userId: string) {
    return this.chatRepo.createConversation(userId);
  }

  /**
   * Lấy tất cả các cuộc hội thoại của một user
   */
  async getConversations(userId: string) {
    return this.chatRepo.findConversationsByUserId(userId);
  }

  /**
   * Xử lý khi người dùng gửi một tin nhắn mới
   */
  async sendMessage(params: {
    conversationId: string;
    userId: string;
    content: string;
  }) {
    console.log('--- 2. SERVICE: Bắt đầu xử lý tin nhắn (phiên bản RAG)---');
    const { conversationId, userId, content } = params;

    // 1. Kiểm tra xem user có quyền truy cập vào cuộc hội thoại này không
    console.log('--- 2A. SERVICE: Kiểm tra quyền truy cập ---');
    const conversation =
      await this.chatRepo.findConversationById(conversationId);

    if (!conversation || conversation.userId !== userId) {
      console.error('--- LỖI: Người dùng không có quyền truy cập. ---');
      throw ConversationAccessException;
    }
    console.log('--- 2A. SERVICE: Quyền truy cập hợp lệ. ---');

    console.log('--- 2B. SERVICE: Chuẩn bị lưu tin nhắn của người dùng. ---');
    // 2. Lưu tin nhắn của người dùng vào DB
    await this.chatRepo.createMessage({
      conversationId,
      role: 'user',
      content,
    });
    console.log('--- 2B. SERVICE: Đã lưu tin nhắn của người dùng vào DB. ---');

    // --- BƯỚC MỚI: LẤY LỊCH SỬ TRÒ CHUYỆN ---
    console.log('--- . SERVICE: Lấy lịch sử trò chuyện...');
    const historyMessages =
      await this.chatRepo.findMessagesByConversationId(conversationId);
    // Định dạng lại lịch sử để đưa vào prompt, đảo ngược để có thứ tự đúng
    const history = historyMessages
      .reverse() // Đảo ngược mảng để có thứ tự từ cũ đến mới
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n');
    console.log('--- . SERVICE: Đã có lịch sử:', history);

    // --- BƯỚC RAG 1: TÌM KIẾM (RETRIEVAL) ---
    console.log('--- 2C. SERVICE: Bắt đầu tìm kiếm kiến thức liên quan...');
    const relevantChunks = await this.kbRepo.findRelevantChunks(content);
    const context = relevantChunks
      .map((chunk) => chunk.content)
      .join('\n\n---\n\n');
    console.log(
      '--- 2C. SERVICE: Đã tìm thấy ngữ cảnh:',
      context.substring(0, 200) + '...',
    );

    // --- BƯỚC RAG 2: BỔ SUNG (AUGMENTATION) ---
    console.log('--- 2D. SERVICE: Tạo prompt tăng cường...');
    const augmentedPrompt = `
     **VAI TRÒ VÀ TÔNG GIỌNG:**
      Bạn là một nhân viên tư vấn thân thiện, chuyên nghiệp và am hiểu tại một phòng khám thú y. Hãy trả lời như thể bạn đang trò chuyện trực tiếp với một khách hàng đang lo lắng. Sử dụng giọng văn tự nhiên, gần gũi và cảm thông (ví dụ: "Dạ, bé cún nhà mình...", "Chào bạn, mình hiểu bạn đang lo lắng...").

      **QUY TẮC BẮT BUỘC:**
      1.  **Đóng vai một con người:** Tuyệt đối không được nhắc đến việc bạn là AI, chatbot, hay đề cập đến "tài liệu", "thông tin được cung cấp". Hãy xem "THÔNG TIN CHUYÊN MÔN" là kiến thức của chính bạn.
      2.  **Trả lời trực tiếp:** Nếu người dùng hỏi về một trường hợp cụ thể (ví dụ "7 tuần tuổi") và thông tin có một khoảng tương ứng ("6-8 tuần tuổi"), hãy tự tin trả lời trực tiếp cho trường hợp đó (ví dụ: "Dạ, với bé cún 7 tuần tuổi thì mình nên...").
      3.  **Xử lý khi thiếu thông tin:** Nếu không có thông tin để trả lời, hãy trả lời một cách khéo léo, ví dụ: "Dạ, về vấn đề này để chắc chắn nhất thì bạn nên cho bé đến phòng khám để bác sĩ kiểm tra trực tiếp ạ. Bạn có muốn mình hỗ trợ đặt lịch không?".
      4.  **Định dạng:** Luôn trả lời bằng định dạng Markdown để dễ đọc (sử dụng gạch đầu dòng, in đậm...).

      **THÔNG TIN CHUYÊN MÔN ĐỂ BẠN SỬ DỤNG:**
      """
      ${context}
      """

      **LỊCH SỬ TRÒ CHUYỆN (gần nhất):**
      """
      ${history}
      """
      
      **CÂU HỎI CUỐI CÙNG CỦA KHÁCH HÀNG:**
      "${content}"
    `;

    // --- BƯỚC RAG 3: TẠO CÂU TRẢ LỜI (GENERATION) ---
    console.log('--- 2E. SERVICE: Gửi prompt tăng cường đến AI...');
    const aiResponseContent =
      await this.aiService.generateText(augmentedPrompt);

    console.log('--- 2F. SERVICE: Chuẩn bị lưu tin nhắn của AI. ---');
    const aiMessage = await this.chatRepo.createMessage({
      conversationId,
      role: 'assistant',
      content: aiResponseContent,
    });

    console.log('--- 2F. SERVICE: Đã lưu tin nhắn của AI vào DB. ---');

    console.log('--- 3. SERVICE: Hoàn tất, trả về tin nhắn của AI. ---');
    // 5. Trả về tin nhắn của AI cho người dùng
    return aiMessage;
  }
}
