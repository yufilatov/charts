import { inject, Injectable } from '@angular/core';

import * as d3 from 'd3';

import { ChartStyle } from '../../style/chart-style';
import { ChartService } from '../../chart/chart.service';
import { nextId } from '../../kit';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartDrawFactory } from '../../common/chart-draw.factory';
import { ChartSeriesState, CHART_DEFAULT_SERIES_STATE } from '../../common/chart-series';

export interface ChartDonutSeriesState extends ChartSeriesState {
    total?: number;
    label?: string;
}

@Injectable()
export class DonutSeriesChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...CHART_DEFAULT_SERIES_STATE,
        id: `chart-series-donut-${nextId()}`,
    };

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };
        this.root = this.chartService.select(selector);
        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: ChartDonutSeriesState) {
        const { rect, data, style, label } = state;

        if (!rect?.height || !rect?.width) {
            return;
        }

        const datum = d3.pie().sort(null)(data || []);

        const arcStyle = style?.compile(ChartStyle.arc) as any;
        const pieStyle = style?.compile(ChartStyle.pie) as any;
        const labelStyle = style?.compile(ChartStyle.label) as any;

        const arc = d3.arc()
            .innerRadius(rect.height / 2 * pieStyle(null, 0).innerRadius / 100)
            .outerRadius(rect.height / 2 * pieStyle(null, 0).outerRadius / 100);

        const draw = ChartDrawFactory(this.root, datum);

        draw('.chart-donut-arc', {
            // @ts-ignore
            create: selection =>
                selection
                    .append('path'),
            update: selection =>
                selection
                    .attr('d', (d: any) => arc(d))
                    .attr('transform', `translate(${rect.width / 2}, ${rect.height / 2})`)
                    .style('stroke', (d: any, i: number) => arcStyle(d, i).stroke)
                    .style('stroke-width', (d: any, i: number) => arcStyle(d, i).strokeWidth)
                    .style('fill', (d: any, i: number) => arcStyle(d, i).fill),
        });

        if (label) {
            draw('.chart-donut-label', {
                // @ts-ignore
                create: selection =>
                    selection
                        .append('text'),
                update: selection =>
                    selection
                        .text(label)
                        .attr('vertical-align', 'middle')
                        .attr("text-anchor", "middle")
                        .attr("font-size", '2rem')
                        .attr("dominant-baseline", "middle")
                        .style('transform', `translate(${rect.width / 2}px, ${rect.height / 2}px)`)
            })
        }

    }
}
