import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';

@Module({
  providers: [UsuarioService, AuthService, JwtService],
  controllers: [UsuarioController],
  exports: [UsuarioService],
})
export class UsuarioModule {}
