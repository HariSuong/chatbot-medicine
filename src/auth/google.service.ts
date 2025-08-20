import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { CompaniesRepository } from 'src/admin/companies/companies.repo';
import { GoogleAuthStateType } from 'src/auth/auth.model';

import { AuthRepository } from 'src/auth/auth.repo';
import { AuthService } from 'src/auth/auth.service';

import { RoleService } from 'src/auth/role.service';
import envConfig from 'src/shared/config/config';
import { GoogleUserInfoError } from 'src/shared/constains/exception.constains';

import { HasingService } from 'src/shared/services/hasing.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GoogleService {
  private outh2Client: OAuth2Client;
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly authService: AuthService,

    private readonly roleService: RoleService,
    private readonly hasingService: HasingService,
    private readonly companiesRepo: CompaniesRepository,
  ) {
    this.outh2Client = new google.auth.OAuth2(
      envConfig.GOOGLE_CLIENT_ID,
      envConfig.GOOGLE_CLIENT_SECRET,
      envConfig.GOOGLE_REDIRECT_URI,
    );
  }

  getAuthorizationUrl({ ipAddress, userAgent }: GoogleAuthStateType) {
    const scope = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    // Chuyển Object sang string base64 an toàn bỏ lên url
    const stateString = Buffer.from(
      JSON.stringify({ ipAddress, userAgent }),
    ).toString('base64');

    const url = this.outh2Client.generateAuthUrl({
      access_type: 'offline',
      scope,
      include_granted_scopes: true,
      state: stateString,
    });

    return { url };
  }

  async googleCallback({ code, state }: { code: string; state: string }) {
    try {
      let userAgent = 'Unknown';
      let ip = 'Unknown';

      // 1. Lấy state từ URL
      try {
        if (state) {
          const clientInfo = JSON.parse(
            Buffer.from(state, 'base64').toString(),
          ) as GoogleAuthStateType;

          userAgent = clientInfo.userAgent ?? 'Unknown';
          ip = clientInfo.ipAddress ?? 'Unknown';

          console.log('userAgent', userAgent);
          console.log('ip', ip);
        }
      } catch (error) {
        console.error('Error parsing state', error);
      }
      // 2. Dùng code để lấy token
      const { tokens } = await this.outh2Client.getToken(code);
      console.log('tokens', tokens);
      this.outh2Client.setCredentials(tokens);

      // 3. Lấy thông tin google user
      const oauth2 = google.oauth2({
        auth: this.outh2Client,
        version: 'v2',
      });

      const { data } = await oauth2.userinfo.get();
      console.log('data', data);
      if (!data.email) {
        throw GoogleUserInfoError;
      }

      let user = await this.authRepository.findUniqueUserIncludeRole({
        email: data.email,
      });
      // Nếu không có user tức là người mới, vậy nên sẽ tiến hành đăng ký
      if (!user) {
        // --- SỬA LẠI Ở ĐÂY ---
        // 1. Tìm "Công ty Mặc định"
        const defaultCompany =
          await this.companiesRepo.findByName('Default Company');
        if (!defaultCompany) {
          throw new Error(
            'Default Company not found. Please run the seed script.',
          );
        }

        // 2. Tạo user mới và gán companyId
        const clientRoleId = await this.roleService.getUserRoleId(); // <-- Sửa tên hàm
        const hashedPassword = await this.hasingService.hash(uuidv4());
        user = await this.authRepository.createUserIncludeRole(
          {
            email: data.email,
            name: data.name ?? '',
            phoneNumber: '',
            password: hashedPassword,
            roleId: clientRoleId,
            avatarUrl: data.picture ?? null, // <-- Sửa 'avatar' thành 'avatarUrl'
          },
          defaultCompany.id, // <-- Truyền companyId vào
        );
      }

      const device = await this.authRepository.createDevice({
        ipAddress: ip, // <-- Sửa 'ip' thành 'ipAddress'
        userAgent: userAgent,
        userId: user.id,
      });

      const authTokens = await this.authService.generateTokens({
        deviceId: device.id,
        roleId: user.roleId,
        roleName: user.name,
        userId: user.id,
        companyId: user.companyId,
      });

      return authTokens;
    } catch (error) {
      console.error('Error in google Callback', error);
    }
  }
}
