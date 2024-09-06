import { Moment } from 'moment';

export interface Classe {
	id?: number;
    nome: string;
    ordem: number;    
    created_at?: Moment;
    updated_at?: Moment;
}
