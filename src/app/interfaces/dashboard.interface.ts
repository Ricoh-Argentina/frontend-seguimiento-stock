export interface DataChartClient {
    name:     string;
    month:    string;
    year:     string
    hojas:    number;
    imagenes: number;
}

export interface DataChartTotal {
    month:    string;
    year:     string
    hojas:    number;
    imagenes: number;
}


export interface DataChartSolutionCenter {
    color:    string[];
    hojas:    number[];
    imagenes: number[];
    mes:      string[];
}

export interface DataChartXClient {
    color:    string[];
    hojas:    string[];
    imagenes: string[];
    clientes: string[];
}

export interface DataChartSearh {
    m:    number;
    a:     number;
}