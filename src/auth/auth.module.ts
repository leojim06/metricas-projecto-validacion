import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsuarioService } from '../usuario/usuario.service';
import constantes from '../shared/security/constants';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UsuarioModule,
    PassportModule,
    JwtModule.register({
      secret: constantes.JWT_SECRET,
      signOptions: { expiresIn: constantes.JWT_EXPIRES_IN },
    }),
  ],
  providers: [
    AuthService,
    UsuarioService,
    JwtService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
