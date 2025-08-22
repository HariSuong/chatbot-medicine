// src/shared/services/google-calendar.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { google, calendar_v3 } from 'googleapis';
import envConfig from 'src/shared/config/config';
import { addMinutes } from 'date-fns';

@Injectable()
export class GoogleCalendarService {
  private readonly calendar: calendar_v3.Calendar;
  private readonly logger = new Logger(GoogleCalendarService.name);

  constructor() {
    // Xác thực với Google API
    const auth = new google.auth.OAuth2(
      envConfig.GOOGLE_CLIENT_ID,
      envConfig.GOOGLE_CLIENT_SECRET,
      envConfig.GOOGLE_REDIRECT_URI,
    );

    // Lưu ý: Trong một ứng dụng thực tế, bạn cần một luồng để lấy và lưu trữ
    // refresh_token của tài khoản bác sĩ.
    // Để test, chúng ta sẽ tạm thời bỏ qua bước này và giả định bạn đã có token.
    // Chúng ta sẽ hoàn thiện nó sau.

    this.calendar = google.calendar({ version: 'v3', auth });
  }

  /**
   * Tạo một sự kiện mới trên Google Calendar.
   * @param summary Tiêu đề của sự kiện.
   * @param description Mô tả của sự kiện.
   * @param startTime Thời gian bắt đầu.
   * @param attendees Danh sách email của người tham dự.
   * @returns ID của sự kiện vừa tạo.
   */
  async createEvent(
    summary: string,
    description: string,
    startTime: Date,
    attendees: string[],
  ): Promise<string | null> {
    try {
      this.logger.log(`Đang tạo sự kiện trên Google Calendar: ${summary}`);
      const event = await this.calendar.events.insert({
        calendarId: 'primary', // Dùng lịch chính của tài khoản bác sĩ
        requestBody: {
          summary,
          description,
          start: {
            dateTime: startTime.toISOString(),
            timeZone: 'Asia/Ho_Chi_Minh',
          },
          end: {
            // Giả sử mỗi cuộc hẹn kéo dài 30 phút
            dateTime: addMinutes(startTime, 30).toISOString(),
            timeZone: 'Asia/Ho_Chi_Minh',
          },
          attendees: attendees.map((email) => ({ email })),
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 }, // Nhắc qua email trước 24 giờ
              { method: 'popup', minutes: 30 }, // Nhắc trên giao diện trước 30 phút
            ],
          },
        },
      });

      this.logger.log('Tạo sự kiện thành công, ID:', event.data.id);
      return event.data.id ?? null;
    } catch (error) {
      this.logger.error('Lỗi khi tạo sự kiện Google Calendar:', error);
      // Trong ứng dụng thực tế, bạn nên xử lý lỗi này một cách cụ thể hơn
      return null;
    }
  }
}
