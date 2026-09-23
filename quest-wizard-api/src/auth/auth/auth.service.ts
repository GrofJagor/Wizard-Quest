import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../../users/users/users.service.js";
import { User, UserRole } from "../../entities/user.entity.js";
import { LoginDto } from "../../dto/login.dto.js";
import { RegisterDto } from "../../dto/register.dto.js";


const SALT_ROUNDS = 10;
 
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}
 
  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmailWithPassword(dto.email);
    if (existing) {
      throw new ConflictException("Email already in use");
    }
 
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
 
    const user =
      dto.role === UserRole.WIZARD
        ? await this.usersService.createWizard({
            email: dto.email,
            passwordHash,
            name: dto.name!,
            affinity: dto.affinity!,
          })
        : await this.usersService.createTower({
            email: dto.email,
            passwordHash,
          });
 
    return this.buildAuthResponse(user);
  }
 
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
 
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid credentials");
    }
 
    return this.buildAuthResponse(user);
  }
 
  private buildAuthResponse(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}