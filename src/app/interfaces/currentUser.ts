import { Usuario } from 'src/app/interfaces/usuario';

export interface CurrentUser {
    user: Usuario;
    access_token: string;
    token_type: string;
    expires_in: string;
}
