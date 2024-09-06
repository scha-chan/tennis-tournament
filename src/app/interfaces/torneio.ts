import { Moment } from 'moment';

export interface Torneio {
    id?: number;
    nome?: string;
    dataInicio: Moment;
    dataFim: Moment;
    sets?: number;
    created_at?: Moment;
    updated_at?: Moment;
}
