import { inject, Injectable } from '@angular/core';
import * as d3 from 'd3';
import { ChartService } from '../../chart/chart.service';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartSeriesState, CHART_DEFAULT_SERIES_STATE } from '../../common/chart-series';
import { nextId } from '../../kit';
import { ChartDrawFactory } from '../../common/chart-draw.factory';
import { Range } from '../../common/chart-range';

export interface ChartXAxisState extends ChartSeriesState {
    range: Range['x'];
    ticks?: number[] | string[];
    reverse: boolean;
}

@Injectable()
export class XAxisChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...CHART_DEFAULT_SERIES_STATE,
        id: `chart-x-axis-${nextId()}`,
    };

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };
        this.root = this.chartService.select(selector);
        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: ChartXAxisState): void {
        const { rect, range, margin, ticks } = state;

        if (!rect?.height || !rect?.width || !margin || !range?.length) {
            return;
        }

        this.root.selectAll('.chart-x-axis').remove();

        const min = d3.min(range) || range[0];
        const max = d3.max(range) || range[1];
        const scaleX = d3.scaleLinear([min, max], [0, rect.width]);

        const x = ticks?.every(e => typeof e === 'number')
            ? d3.axisBottom(scaleX)
                .tickValues(ticks || [])
                .tickFormat((d) => d3.format('.0f')(d))
            : d3.axisBottom(scaleX)
                .tickValues(ticks?.map((t, i) => i) || [])

        const draw = ChartDrawFactory(this.root, [x]);

        this.root
            .append('g')
            .classed('chart-x-axis', true)
            .attr('transform', `translate(${margin?.left}, ${rect.height + margin.top})`)
            .call(x);

        if (ticks?.every(e => typeof e === 'string')) {
            this.root.selectAll('text').remove();

            this.root.selectAll('.tick').append("svg:image")
                .attr("xlink:href", (d, i) => ticks[i])
                .attr("width", 30)
                .attr("height", 30)
                .style('transform', 'translate(-15px, 10px)');

        }
    }
}
