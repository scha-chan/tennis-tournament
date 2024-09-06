import { Usuario } from 'src/app/interfaces/usuario';
import { Moment } from 'moment';
import { Pontuacao } from 'src/app/interfaces/pontuacao';

export interface Desafio {
	id?: number;
    desafiante: Usuario;
    desafiado: Usuario;
    dataDesafio: string;
    pontuacao?: Pontuacao[];
    vitorias_desafiante?: number;
    vitorias_desafiado?: number;
    pontuacao_desafiante?: any[];
    pontuacao_desafiado?: any[];
    canEdit?: boolean;
    mano?:DesafioMano;
    observacao?: string;  
    created_at?: string;
    updated_at?: string;
}

export interface DesafioPost {
	id?: number;
    desafiante: number;
    desafiado: number;
    dataDesafio: string;
    pontuacao?: Pontuacao[];  
    observacao?: string;     
}

export interface DesafioResult {
    desafio: Desafio;
    pontuacao: Pontuacao[]
}

export interface DesafioMano {
    desafiante: number;
    desafiado: number;
}
