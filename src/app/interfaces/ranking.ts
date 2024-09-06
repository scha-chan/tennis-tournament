import { Usuario } from 'src/app/interfaces/usuario';
import { Moment } from 'moment';

export interface Ranking {
	id?: number;
    posicao: string;
    semana: number;
    ano: number;
    partidas: number;
    vitorias: number;
    derrotas: number;
    usuario: Usuario;  
    situacao?: number;
    dataInicio?: string;
    dataFim?: string
    created_at?: string;
    updated_at?: string;
}

export interface Periodo {
    dataInicio: Moment;
    dataFim: Moment;
    semana?: number;
    ano?: number;
}

export interface ValidateUser {
   noRanking: boolean;
   jaDesafiou: boolean;
}
