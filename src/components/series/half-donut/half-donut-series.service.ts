import * as d3 from 'd3';
import { checkSum, nextId } from '../../kit';
import { inject, Injectable} from '@angular/core';
import { ChartService } from '../../chart/chart.service';
import { ChartStyle } from '../../style/chart-style';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartDrawFactory } from '../../common/chart-draw.factory';
import { ChartSeriesState, CHART_DEFAULT_SERIES_STATE } from '../../common/chart-series';

export interface IChartHalfDonutSeriesState extends ChartSeriesState {
    total?: number;
}

const DEFAULT_STATE: IChartHalfDonutSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
};

@Injectable({providedIn: 'root'})
export class HalfDonutSeriesChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...DEFAULT_STATE,
        id: `chart-series-pie-${nextId()}`,
    };

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };
        this.root = this.chartService.select(selector);
        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: IChartHalfDonutSeriesState): void {
        const { rect, data, style, total } = state;

        if (!rect?.height || !rect.width) {
            return;
        }

        const values = checkSum(data, total);
        const anglesRange = 0.5 * Math.PI;
        const datum = d3.pie()
            .sort(null)
            .startAngle(anglesRange * -1)
            .endAngle(anglesRange)(values) as any;

        const arcStyle = style?.compile(ChartStyle.arc) as any;
        const pieStyle = style?.compile(ChartStyle.pie) as any;

        const arc = d3.arc()
            .innerRadius(rect.width / 2 * pieStyle(null, 0).innerRadius / 100)
            .outerRadius(rect.width / 2 * pieStyle(null, 0).outerRadius / 100);

        const draw = ChartDrawFactory<number>(this.root, datum);

        draw('.chart-donut-arc', {
            // @ts-ignore
            create: selection =>
                selection
                    .append('path'),
            update: selection =>
                selection
                    .attr('d', (d: any) => arc(d))
                    .attr('transform', `translate(${rect.width / 2}, ${rect.height})`)
                    .style('stroke', (d: any, i: number) => arcStyle(d, i).stroke)
                    .style('stroke-width', (d: any, i: number) => arcStyle(d, i).strokeWidth)
                    .style('fill', (d: any, i: number) => arcStyle(d, i).fill),
        });

    }
}
