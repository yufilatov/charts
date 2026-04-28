import * as d3 from 'd3';
import { inject, Injectable } from '@angular/core';
import { ChartService } from '../../chart/chart.service';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartDrawFactory } from '../../common/chart-draw.factory';
import { ChartSeriesState, CHART_DEFAULT_SERIES_STATE, createScaleX, createScaleY } from '../../common/chart-series';
import { nextId, getLineCurve } from '../../kit';
import { ChartStyle } from '../../style/chart-style';

export interface Point {
    x: number;
    y: number;
}

export interface ChartAreaSeriesState extends ChartSeriesState {
    data: Point[];
    curveType?: string;
    range?: { x: number[], y: number[] };
}

@Injectable()
export class AreaSeriesChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...CHART_DEFAULT_SERIES_STATE,
        id: `chart-series-area-${nextId()}`,
    };

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };
        this.root = this.chartService.select(selector);
        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: ChartAreaSeriesState): void {
        const { data, style, rect, curveType, range } = state;

        if (!rect?.height || !rect?.width || !data?.length || !range) {
            return;
        }

        const scaleX = createScaleX('linear', {
            ...state as ChartSeriesState,
            data: [d3.min(range.x), d3.max(range.x)],
        });

        const scaleY = createScaleY('linear', {
            ...state as ChartSeriesState,
            data: [d3.max(range.y), d3.min(range.y)],
        });

        this.state = {
            ...this.state,
            ...state,
            scaleX,
            scaleY,
        };

        const line = d3.area()
            .x(d => scaleX(d[0]))
            .y(d => scaleY(0))
            .y1(d => scaleY(d[1]))
            .curve(getLineCurve(curveType) as any) as any;

        const lineStyle = style?.compile(ChartStyle.line) as any;
        const circleStyle = style?.compile(ChartStyle.circle);

        this.root.selectAll('path').remove();
        this.root.selectAll('circle').remove();

        const drawArea = ChartDrawFactory(this.root, [data]);
        const drawPoints = ChartDrawFactory(this.root, data);

        drawArea('.chart-line-area', {
            // @ts-ignore
            create: selection =>
                selection
                    .append('path'),
            update: selection =>
                selection
                    .attr('d', line)
                    .classed('line', true)
                    .attr('fill', (d, i) => lineStyle(d, i).fill)
                    .attr('stroke', (d, i) => lineStyle(d, i).stroke)
                    .attr('stroke-width', (d, i) => lineStyle(d, i).strokeWidth),
        });
    }
}
