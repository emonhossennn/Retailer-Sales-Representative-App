import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

enum Role {
  ADMIN = 'ADMIN',
  SALES_REP = 'SALES_REP',
}

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if no roles are required', () => {
    const mockContext = createMockExecutionContext({ role: Role.SALES_REP });
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const result = guard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('should allow access if user has required role', () => {
    const mockContext = createMockExecutionContext({ role: Role.ADMIN });
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

    const result = guard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('should deny access if user does not have required role', () => {
    const mockContext = createMockExecutionContext({ role: Role.SALES_REP });
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

    const result = guard.canActivate(mockContext);

    expect(result).toBe(false);
  });

  function createMockExecutionContext(user: any): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  }
});
