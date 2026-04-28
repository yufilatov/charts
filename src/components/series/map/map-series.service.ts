import { Injectable, EventEmitter, inject } from '@angular/core';

import * as d3 from 'd3';

import { ChartSeriesState, CHART_DEFAULT_SERIES_STATE } from '../../common/chart-series';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartService } from '../../chart/chart.service';
import { ChartDrawFactory } from '../../common/chart-draw.factory';
import { ChartStyle } from '../../style/chart-style';
import { nextId } from '../../kit';

export interface ChartMapSeriesState extends ChartSeriesState {
    data: any;
}

const DEFAULT_STATE: ChartSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
};

@Injectable()
export class MapSeriesChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...DEFAULT_STATE,
        id: `chart-series-map-germany-${nextId()}`,
    };

    mouseover = new EventEmitter<any>();
    mouseleave = new EventEmitter<any>();

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };
        this.root = this.chartService.select(selector);
        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: ChartMapSeriesState) {
        const { rect, style, data } = state;

        if (!rect?.height || !rect?.width || !data) {
            return;
        }

        this.root.selectAll('path').remove();

        const bounds = d3.geoBounds(data as any);
        const bottomLeft = bounds[0];
        const topRight = bounds[1];
        const rotLong = -(topRight[0] + bottomLeft[0]) / 2;
        const center: [number, number] = [(topRight[0] + bottomLeft[0]) / 2 + rotLong, (topRight[1] + bottomLeft[1]) / 2];

        let projection = d3.geoAlbers()
            .parallels([bottomLeft[1], topRight[1]])
            .rotate([rotLong, 0, 0])
            .translate([rect.width / 2, rect.height / 2])
            .center(center);

        const bottomLeftPx = projection(bottomLeft) as any;
        const topRightPx = projection(topRight) as any;
        const scaleFactor = 1.00 * Math.min(rect.width / (topRightPx[0] - bottomLeftPx[0]), rect.height / (-topRightPx[1] + bottomLeftPx[1]));

        projection = d3.geoAlbers()
            .parallels([bottomLeft[1], topRight[1]])
            .rotate([rotLong, 0, 0])
            .translate([rect.width / 2, rect.height / 2])
            .scale(scaleFactor * 0.975 * 1000)
            .center(center);

        const path = d3.geoPath()
            .projection(projection);

        const datum = (data as any).features;

        const pathStyle = style?.compile(ChartStyle.arc) as any;

        const draw = ChartDrawFactory(this.root, datum);

        draw(`.chart-map-series-land-${nextId()}`, {
            // @ts-ignore
            create: selection =>
                selection
                    .append('path'),
            update: selection =>
                selection
                    .attr('d', path as any)
                    .attr('chart-map-selector-hover', true)
                    .classed('chart-map-series-land', true)
                    .attr('fill', (d, i) => pathStyle(d, i).fill)
                    .attr('stroke-width', (d, i) => pathStyle(d, i).strokeWidth)
                    .attr('stroke', (d, i) => pathStyle(d, i).stroke)
                    .on('mouseover', (e, d) => {
                        this.root
                            .selectAll('.chart-map-series-land')
                            .filter(a => a === d)
                            .style('cursor', 'pointer')
                            .transition()
                            .delay(100)
                            .attr('fill', pathStyle(d, 0).fillHover);

                        this.mouseover.emit(d);
                    })
                    .on('mouseleave', (e, d) => {
                        let index = 0;

                        this.root
                            .selectAll('.chart-map-series-land')
                            .filter((a, i) => {
                                if (a === d) {
                                    index = i;
                                }
                                return a === d
                            })
                            .transition()
                            .delay(0)
                            .attr('fill', () => pathStyle(d, index).fill);

                        this.mouseleave.emit();
                    }),
        });
    }
}
