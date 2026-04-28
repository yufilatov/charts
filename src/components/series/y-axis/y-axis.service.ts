import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { ChartService } from '../../chart/chart.service';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartSeriesState, CHART_DEFAULT_SERIES_STATE, createScaleY } from '../../common/chart-series';
import { nextId } from '../../kit';
import { Range } from '../../common/chart-range';

export interface ChartYAxisState extends ChartSeriesState {
    range: Range['y'];
    ticks?: number[] | string[];
    reverse: boolean;
}

@Injectable()
export class YAxisChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...CHART_DEFAULT_SERIES_STATE,
        id: `chart-y-axis-${nextId()}`,
    };

    constructor(
        private chartService: ChartService,
        private disposable: ChartDisposable,
    ) {
        const selector = { id: this.state.id, level: 0 };

        this.root = chartService.select(selector);
        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: ChartYAxisState): void {
        const { rect, range, margin, ticks, reverse } = state;

        if (!rect?.height || !rect?.width || !range?.length || !margin) {
            return;
        }

        this.root.selectAll('.chart-y-axis').remove();

        const domain = reverse ? [d3.max(range), d3.min(range)] : [d3.min(range), d3.max(range)];
        const scaleY = d3.scaleLinear(domain as any, [rect.height, 0]);

        const y = ticks?.every(e => typeof e === 'number')
            ? d3.axisLeft(scaleY)
                .tickSizeOuter(0)
                .tickValues(ticks || [])
            : d3.axisLeft(scaleY)
                .tickSizeOuter(0)
                .tickValues(ticks?.map((t, i) => i) || [])

        this.root
            .append('g')
            .classed('chart-y-axis', true)
            .attr('transform', `translate(${margin?.left}, ${margin?.top})`)
            .call(y);

                if (ticks?.every(e => typeof e === 'string')) {
            this.root.selectAll('text').remove();

        this.root.selectAll('.tick').append("svg:image")
            .attr("xlink:href", (d, i) => ticks[i])
            .attr("width", 30)
            .attr("height", 30)
            .style('transform', 'translate(-45px, -15px)');
        }
    }
}
