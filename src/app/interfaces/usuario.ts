import { Ranking } from 'src/app/interfaces/ranking';

export interface Usuario {
	id?: number;
    nome: string;
    email: string;
    ativo: number;   
    tipo: string;
    classe: number;
    codigo?: string;
    dataNascimento?: string;
    classe_nome?: string;
    ativo_nome?: string;
    tipo_nome?: string;
    user_img?: string;
    avatar_img?: string;
    avatar?: string|File;
    password?: string;
    password_confirmation?: string;
    telefone?: string;
    celular?: string;
    token?: string;
    ranking?: Ranking[];
    created_at?: string;
    updated_at?: string;
}

export interface Situacao {
	id?: number;
    nome: string;   
}

export interface UsuarioForm {	
    user: Usuario;
    formData: FormData;   
}

export interface UsuarioDesafio extends Usuario {	
    posicao: number;
    dataDesafio: string;   
}

export interface SenhaUsuario {
    token: string;
    password: string;
    password_confirmation: string;
}


