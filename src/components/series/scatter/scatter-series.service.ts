import * as d3 from 'd3';
import { inject, Injectable } from '@angular/core';
import { ChartService } from '../../chart/chart.service';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartDrawFactory } from '../../common/chart-draw.factory';
import { ChartSeriesState, CHART_DEFAULT_SERIES_STATE, createScaleX, createScaleY } from '../../common/chart-series';
import { nextId, getLineCurve } from '../../kit';
import { ChartStyle } from '../../style/chart-style';
import { Range } from '../../common/chart-range';


export interface ChartScatterSeriesState extends ChartSeriesState {
    range: Range;
}

@Injectable()
export class ScatterSeriesChartService {
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

    setState(state: ChartScatterSeriesState): void {
        const { data, style, rect, range } = state;

        if (!rect?.height || !rect?.width || !data?.length) {
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

        const circleStyle = style?.compile(ChartStyle.circle) as any;

        this.root.selectAll('circle').remove();

        const drawPoints = ChartDrawFactory(this.root, data);

        drawPoints('.chart-line-point', {
            // @ts-ignore
            create: selection =>
                selection
                    .append('circle'),
            update: selection =>
                selection
                    .attr('cx', (d, i) => scaleX(d[0]))
                    .attr('cy', d => scaleY(d[1]))
                    .attr('r', (d, i) => circleStyle(d, i).radius)
                    .attr('fill', (d, i) => circleStyle(d, i).fill)
                    .attr('stroke', (d, i) => circleStyle(d, i).stroke)
                    .attr('stroke-width', (d, i) => circleStyle(d, i).strokeWidth)
                    .on('mouseover', (d, i) => {
                        this.root.selectAll('.circle').filter(n => n === d);
                    }),
        });
    }
}
