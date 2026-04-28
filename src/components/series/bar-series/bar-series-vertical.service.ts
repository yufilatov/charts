import { Injectable, EventEmitter, inject } from '@angular/core';
import { ChartSeriesState, CHART_DEFAULT_SERIES_STATE, createScaleX, createScaleY } from '../../common/chart-series';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartService } from '../../chart/chart.service';
import { nextId } from '../../kit';
import { ChartDrawFactory } from '../../common/chart-draw.factory';
import * as d3 from 'd3';
import { ChartStyle } from '../../style/chart-style';
import { BehaviorSubject } from 'rxjs';

export interface ChartBarSeriesState extends ChartSeriesState {
    total?: number;
    range?: { x: number[], y: number[] };
    animation?: boolean;
}

const DEFAULT_STATE: ChartBarSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
    type: 'bar',
    total: 100,
};

@Injectable()
export class BarVerticalSeriesChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...DEFAULT_STATE,
        id: `chart-series-bar-${nextId()}`,
    };

    selectionChange = new EventEmitter<any>();

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };
        this.root = this.chartService.select(selector);
        this.root.classed('chart-series-bar-vertical', true);
        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: ChartBarSeriesState): void {
        const { data, style, animation, range, total, rect, margin } = state;

        if (!rect?.width || !rect?.height || !data?.length || !range) {
            return;
        }

        this.root.selectAll('rect').remove();

        const datum = data?.map((x, i) => i);
        datum?.push(data.length);

        const scaleX = createScaleX('band', {
            ...state,
            data: datum,
        });

        const scaleY = createScaleY('linear', {
            ...state,
            data: range.y,
        });

        const barStyle = style?.compile(ChartStyle.bar) as any;
        const labelStyle = style?.compile(ChartStyle.label) as any;
        const animationStyle = style?.compile(ChartStyle.animation) as any;

        // const draw = ChartDrawFactory(this.root, data);
        let draw;
        // const format = d3.format(animationStyle(null, 0).format);

        this.selectionChange.next(1);

        data.forEach((item, index) => {
            draw = ChartDrawFactory(this.root, item);

            draw(`.chart-bar-value-${nextId()}`, {
                // @ts-ignore
                create: selection =>
                    selection
                        .append('rect'),
                update: selection =>
                    selection
                        .classed('animated-bar', true)
                        .attr('width', (d, i) => barStyle(d, i).size)
                        .attr('height', d => animation ? 0 : scaleY(d) - scaleY(0))
                        .attr('transform', (d, i) => {
                            let previous = 0;
                            for (let j = 0; j < index; j++) {
                                previous = previous + data[index][j];
                            }
                            return `translate(${scaleX(data.length) / data.length - barStyle(d, index).size / 2}, ${i > 0 ? -scaleY(previous) + scaleY(0) : 0})`;
                        })
                        .attr('x', scaleX(index))
                        .attr('y', d => scaleY(d3.max(range.y)) - scaleY(d) + scaleY(0))
                        .attr('fill', (d, i) => barStyle(d, i).fill)
            });
        })

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
