import { Injectable, EventEmitter, inject } from '@angular/core';
import { ChartSeriesState, CHART_DEFAULT_SERIES_STATE, createScaleX, createScaleY } from '../../common/chart-series';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartService } from '../../chart/chart.service';
import { nextId } from '../../kit';
import { ChartDrawFactory } from '../../common/chart-draw.factory';
import * as d3 from 'd3';
import { ChartStyle, IChartStyle } from '../../style/chart-style';

export interface ChartBarSeriesState extends ChartSeriesState {
    // data: number[];
    total?: number;
    range?: { x: number[], y: number[] };
    animation?: boolean;
}

@Injectable()
export class BarHorizontalSeriesChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...CHART_DEFAULT_SERIES_STATE,
        type: 'bar',
        total: 100,
        id: `chart-series-bar-${nextId()}`,
    };

    selectionChange = new EventEmitter<any>();

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };
        this.root = this.chartService.select(selector);
        this.root.classed('chart-series-bar-horizontal', true);
        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: ChartBarSeriesState): void {
        const { data, style, animation, total, range, rect } = state;

        if (!rect?.width || !rect?.height || !data?.length || !range) {
            return;
        }

        const datum = data.map((x, i) => i) || [];
        datum.push(data.length);

        const scaleX = createScaleX('linear', {
            ...state as ChartSeriesState,
            data: range.x,
        });

        const scaleY = createScaleY('band', {
            ...state as ChartSeriesState,
            data: datum,
        });

        this.root.selectAll('rect').remove();

        const barStyle = style?.compile(ChartStyle.bar) as any;
        const labelStyle = style?.compile(ChartStyle.label) as any;
        const animationStyle = style?.compile(ChartStyle.animation) as any;

        let draw;
        // const format = d3.format(animationStyle(null, 0));

        // draw('.chart-bar-vertical', {
        //   create: selection =>
        //     selection
        //       .append('rect'),
        //   update: selection =>
        //     selection
        //       .attr('width', scaleX(total) - scaleX(0))
        //       .attr('height', (d, i) => barStyle(d, i).height)
        //       .attr('vertical-align', 'middle')
        //       .attr('x', scaleX(0))
        //       .attr('y', (d, i) => scaleY(i))
        //       .attr('fill', (d, i) => barStyle(d, i).background),
        // });

        for (let i = 0; i < data.length; i++) {
            draw = ChartDrawFactory(this.root, data[i] as any);

            draw(`.chart-bar-value-${nextId()}`, {
                // @ts-ignore
                create: selection =>
                    selection
                        .append('rect'),
                update: selection =>
                    selection
                        // .classed('animated-bar', true)
                        .attr('width', (d: any) => animation ? 0 : scaleX(d) - scaleX(0))
                        .attr('height', (d, c) => barStyle(d, c).size)
                        .attr('x', scaleX(0))
                        .attr('y', (d, c) => scaleY(i))
                        .attr('transform', (d, c) => {
                            let previous = 0;
                            for (let j = 0; j < c; j++) {
                                previous = previous + data[i][j];
                            }
                            return `translate(${c > 0 ? scaleX(previous) - scaleX(0) : 0} , ${scaleX(data.length) / data.length + barStyle(d, i).size / 2})`;
                        })
                        .attr('fill', (d, c) => barStyle(d, c).fill)
            });
        }


        // if (label !== 'none') {
        //   draw('.chart-label', {
        //     create: selection =>
        //       selection
        //         .append('text'),
        //     update: selection =>
        //       selection
        //         .attr('x', () => {
        //           if (label === 'start') {
        //             return scaleX(0) - 10;
        //           } return scaleX(total) + 10;
        //         })
        //         .attr('y', (d, i) => scaleY(i) + scaleY(0) / 2)
        //         .style('text-anchor', () => {
        //           if (label === 'start') {
        //             return 'end';
        //           } return 'start';
        //         })
        //         .attr('vertical-align', 'middle')
        //         .attr('font-size', (d, i) => labelStyle(d, i).fontSize)
        //         .attr('fill', (d, i) => labelStyle(d, i).color)
        //         .attr('font-weight', (d, i) => labelStyle(d, i).fontWeight)
        //         .attr('transform', (d, i) => {
        //           if (labelStyle(d, i).padding !== null) {
        //             return `translate(${-scaleX(total) - 10 + scaleX(d) + labelStyle(d, i).padding}, 0)`;
        //           }
        //         })
        //         .text((d, i) => animation ? format(0) : labelStyle(d, i).text),
        //   });
        // }

        // if (animation) {

        //     this.root.selectAll('.animated-bar')
        //         .transition()
        //         .duration((d, i) => animationStyle(d, i).duration)
        //         .attr('width', d => scaleX(d) - scaleX(0))
        //         .delay((d, i) => animationStyle(d, i).delay);

        //     this.root.selectAll('text')
        //         .transition()
        //         .duration((d, i) => animationStyle(d, i).duration)
        //         .delay((d, i) => animationStyle(d, i).delay)
        //         .on('start', function repeat() {
        //             d3.active(this)
        //                 .tween('text', (d, i) => {
        //                     const that = d3.select(this);
        //                     const j = d3.interpolate('0', `${labelStyle(d, i).text}`);
        //                     return (t) => { that.text(format(j(t))); };
        //                 });

        //         });
        // }
    }
}
