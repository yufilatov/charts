export interface IChartScale {
    (d: number): number;
    domain: any;
    range: any;
}

export type ChartScaleType = 'band' | 'ordinal' | 'linear' | 'linear-vertical' | 'band-vertical';
