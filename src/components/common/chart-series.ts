// @ts-nocheck

import { ChartStyleBuilder } from '../style/chart-style.builder';
import * as d3 from 'd3';
import { ChartMargin } from './chart-margin';
import { IChartScale, ChartScaleType } from './chart-scale';
import { IChartRect } from './chart-rect';

export interface ChartSeriesState {
    id?: string;
    type?: string;
    data?: any[];
    style?: ChartStyleBuilder;
    scaleX?: IChartScale;
    scaleY?: IChartScale;
    rect?: IChartRect;
    margin?: ChartMargin;
    selectX?: string;
    selectY?: string;
}

export const CHART_DEFAULT_SERIES_STATE: ChartSeriesState = {
    data: [],
    style: new ChartStyleBuilder(),
    scaleX: d3.scaleLinear(),
    scaleY: d3.scaleLinear(),
};

export function createScaleX(type: ChartScaleType, series: ChartSeriesState): IChartScale {
    const { data, rect, margin } = series;

    switch (type) {
        case 'ordinal': {
            return d3.scaleOrdinal()
                .domain(data)
                .range([margin.left, rect.width + margin.left]);
        }
        case 'band': {
            return d3.scaleBand()
                .domain(data.map((x, i) => i))
                .range([margin.left, rect.width + margin.left]);
        }
        case 'linear': {
            return d3.scaleLinear()
                .range([margin.left, rect.width + margin.left])
                .domain(data);
        }
        case 'linear-vertical': {
            return d3.scaleLinear()
                .domain(data)
                .range([margin.top, rect.height + margin.top]);
        }
        default:
            throw Error(`Invalid type ${type}`);
    }
}

export function createScaleY(type: ChartScaleType, series: ChartSeriesState): any {
    const { data, rect, margin } = series;

    switch (type) {
        case 'ordinal':
            return d3.scaleOrdinal()
                .domain(data)
                .range([margin.top, rect.height + margin.top]);
        case 'band': {
            return d3.scaleBand()
                .domain(data.map((x, i) => i))
                .range([margin.top, rect.height + margin.top]);
        }
        case 'band-vertical': {
            return d3.scaleBand()
                .domain(data.map((x, i) => i))
                .range([margin.left, rect.width + margin.left]);
        }
        case 'linear': {
            return d3.scaleLinear(data, [margin.top, rect.height + margin.top])
        }
        case 'linear-vertical': {
            return d3.scaleLinear()
                .domain(data)
                .range([margin.left, rect.width + margin.left]);
        }
        default:
            throw Error(`Invalid type ${type}`);
    }
}
