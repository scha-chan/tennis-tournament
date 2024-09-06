export interface TableHeader {	
    nome: string;
    alias: string;   
    sort?: 'asc' | 'desc' | null; 
    sortable?: boolean;
    isButton?: boolean;
    isCheckbox?: boolean;
    isDate?: boolean;  
    isDateTime?: boolean; 
    mask?: string;
    class?: string;  
    nowrap?: boolean;
}

export interface TableFilter {
    label: string;
    alias: string;  
    value?: string;
    type: 'text' | 'number',
    gridClass: string;
}