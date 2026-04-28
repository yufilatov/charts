import { inject, Injectable } from '@angular/core';

import * as d3 from 'd3';

import { ChartSeriesState, CHART_DEFAULT_SERIES_STATE } from '../../common/chart-series';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartService } from '../../chart/chart.service';
import { ChartStyle } from '../../style/chart-style';
import { ChartDrawFactory } from '../../common/chart-draw.factory';
import { nextId } from '../../kit';

export interface IChartDoubleDonutSeriesState extends ChartSeriesState {
    total?: number;
}

const DEFAULT_STATE: IChartDoubleDonutSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
};

@Injectable()
export class DoubleDonutSeriesChartService {
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

    setState(state: IChartDoubleDonutSeriesState) {
        const { rect, data, style, total } = state;

        if (!rect?.height || !rect?.width) {
            return;
        }

        const innerDatum = d3.pie().sort(null)(data?.[0]);
        const outerDatum = d3.pie().sort(null)(data?.[1]);

        const innerArcStyle = style?.compile(ChartStyle.arc) as any;
        const outerArcStyle = style?.compile(ChartStyle.arc) as any;
        const pieStyle = style?.compile(ChartStyle.pie) as any;

        const innerArc = d3.arc()
            .innerRadius(rect.height / 2 * pieStyle(null, 0).innerRadius / 100)
            .outerRadius(rect.height / 2 * pieStyle(null, 0).outerRadius / 100);

        const outerArc = d3.arc()
            .innerRadius(rect.height / 2 * pieStyle(null, 0).innerRadius / 100 / 2)
            .outerRadius(rect.height / 2 * pieStyle(null, 0).innerRadius / 100);

        const drawInnerArc = ChartDrawFactory(this.root, innerDatum);
        const drawOuterArc = ChartDrawFactory(this.root, outerDatum);

        drawInnerArc('.chart-donut-arc-outer', {
            // @ts-ignore
            create: selection =>
                selection.append('path'),
            update: selection =>
                selection
                    .attr('d', (d: any) => innerArc(d))
                    .attr('transform', `translate(${rect.width / 2}, ${rect.height / 2})`)
                    .style('stroke', (d: any, i: number) => innerArcStyle(d, i).stroke)
                    .style('stroke-width', (d: any, i: number) => innerArcStyle(d, i).strokeWidth)
                    .style('fill', (d: any, i: number) => innerArcStyle(d, i).fill),
        });

        drawOuterArc('.chart-donut-arc-inner', {
            // @ts-ignore
            create: selection =>
                selection.append('path'),
            update: selection =>
                selection
                    .attr('d', (d: any) => outerArc(d))
                    .attr('transform', `translate(${rect.width / 2}, ${rect.height / 2})`)
                    .style('stroke', (d: any, i: number) => outerArcStyle(d, i).stroke)
                    .style('stroke-width', (d: any, i: number) => outerArcStyle(d, i).strokeWidth)
                    .style('fill', (d: any, i: number) => outerArcStyle(d, i).fill),
        });

    }
}
