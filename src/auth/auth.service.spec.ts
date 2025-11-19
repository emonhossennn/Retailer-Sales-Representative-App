import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

enum Role {
  ADMIN = 'ADMIN',
  SALES_REP = 'SALES_REP',
}

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    salesRep: {
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: 1,
        username: 'testuser',
        name: 'Test User',
        passwordHash: hashedPassword,
        role: Role.SALES_REP,
      };

      mockPrismaService.salesRep.findUnique.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.login({
        username: 'testuser',
        password: 'password123',
      });

      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.user.username).toBe('testuser');
    });

    it('should throw UnauthorizedException for invalid username', async () => {
      mockPrismaService.salesRep.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ username: 'invalid', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: 1,
        username: 'testuser',
        passwordHash: hashedPassword,
        role: Role.SALES_REP,
      };

      mockPrismaService.salesRep.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.login({ username: 'testuser', password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return user data for valid userId', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        name: 'Test User',
        role: Role.SALES_REP,
      };

      mockPrismaService.salesRep.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser(1);
      expect(result).toEqual(mockUser);
    });
  });
});
