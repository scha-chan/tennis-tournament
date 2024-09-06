import { Desafio } from 'src/app/interfaces/desafio';
import { Usuario } from 'src/app/interfaces/usuario';
import { Moment } from 'moment';

export interface Pontuacao {
	id?: number;
    desafio: Desafio;
    numero_partida: number;
    pontos: number;
    usuario: number;   
    created_by? :Usuario;    
    created_at?: string;
    updated_at?: string;
}

export interface Placar {    
    desafio: number;
    desafiante: number;
    desafiado: number;
    vitorias_desafiante: number;
    vitorias_desafiado: number;
    dataDesafio: string;
}