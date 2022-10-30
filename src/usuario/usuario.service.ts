import { Injectable } from '@nestjs/common';
import { Role } from '../shared/security/role';
import { Usuario } from './usuario';

@Injectable()
export class UsuarioService {
  private usuarios: Usuario[] = [
    new Usuario(1, 'admin', 'admin', [Role.ADMIN]),
    new Usuario(2, 'read', 'read', [Role.READ]),
    new Usuario(3, 'write', 'write', [Role.WRITE]),
    new Usuario(4, 'readRestaurant', 'read', [Role.READ_RESTAURANT]),
    new Usuario(5, 'delete', 'delete', [Role.DELETE]),
  ];

  async buscar(username: string): Promise<Usuario | undefined> {
    return this.usuarios.find((user) => user.username === username);
  }
}
