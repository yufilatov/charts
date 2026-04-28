import * as d3 from 'd3';
import { Injectable } from '@angular/core';
import { nextId } from '../../kit';
import { ChartService } from '../../chart/chart.service';
import { ChartDisposable } from '../../common/chart-disposable';
import { CHART_DEFAULT_SERIES_STATE, createScaleX, createScaleY, ChartSeriesState } from '../../common/chart-series';
import { ChartStyle } from '../../style/chart-style';
// import { ChartStyle } from '../../chart-style/chart-style';

export interface ChartGridSeriesState extends ChartSeriesState {
    step?: { x: number, y: number };
    range?: { x: number[], y: number[] };
}

const DEFAULT_STATE: ChartGridSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
};

@Injectable()
export class GridSeriesChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...DEFAULT_STATE,
        id: `chart-series-grid-${nextId()}`,
    };

    constructor(
        private chartService: ChartService,
        private disposable: ChartDisposable,
    ) {
        const selector = { id: this.state.id, level: 0 };

        this.root = chartService.select(selector);
        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: ChartGridSeriesState): void {
        this.state = {
            ...this.state,
            ...state,
        };

        const { style, rect, range, step } = this.state;

        if (!rect?.height || !rect?.width || !range) {
            return;
        }

        const scaleX = createScaleX('linear', {
            ...state as ChartSeriesState,
            data: range?.x,
        });

        const scaleY = createScaleY('linear', {
            ...state as ChartSeriesState,
            data: range?.y,
        });

        this.root.selectAll('path').remove();

        const line = d3.line(d => scaleX(d[0]), d => scaleY(d[1]));

        const lineStyle = style?.compile(ChartStyle.line) as any;

        const maxX = d3.max(range?.x) || 0;
        const maxY = d3.max(range?.y) || 0;

        if (step?.x !== 0 && step?.x) {
            for (let j = step?.x; j < maxX; j += step?.x) {
                this.root
                    .append('path')
                    .datum([[j, d3.min(range.y)], [j, d3.max(range.y)]])
                    .attr('d', line as any)
                    .attr('id', nextId())
                    .classed('line', true)
                    .attr('fill', 'none')
                    .attr('stroke', (d, i) => lineStyle(d, i).stroke)
                    .attr('stroke-width', (d, i) => lineStyle(d, i).strokeWidth)
                    .attr('stroke-dasharray', (d, i) => lineStyle(d, i).strokeDasharray);
            }
        }

        if (step?.y !== 0 && step?.y) {
            for (let j = step.y; j < maxY; j += step.y) {
                this.root
                    .append('path')
                    .datum([[d3.min(range.x), j], [d3.max(range.x), j]])
                    .attr('d', line as any)
                    .attr('id', nextId())
                    .classed('line', true)
                    .attr('fill', 'none')
                    .attr('stroke', (d, i) => lineStyle(d, i).stroke)
                    .attr('stroke-width', (d, i) => lineStyle(d, i).strokeWidth)
                    .attr('stroke-dasharray', (d, i) => lineStyle(d, i).strokeDasharray);
            }
        }

    }
}
