import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRole } from "../../../entities/user.entity.js";

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
 
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    // Čitamo tajnu iz .env fajla, ako je nema stavljamo fallback da Passport ne pukne pri super() inicijalizaciji
    const secret = process.env.JWT_SECRET || 'privremeni_fallback_kljuc_za_seed';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }
 
  // Whatever is returned here becomes `request.user` in every guarded route.
  async validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
