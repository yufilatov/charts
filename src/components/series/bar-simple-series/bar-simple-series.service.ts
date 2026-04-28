
import * as d3 from 'd3';
import { nextId } from '../../kit';
import { inject, Injectable } from '@angular/core';
import { ChartService } from '../../chart/chart.service';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartDrawFactory } from '../../common/chart-draw.factory';
import { ChartSeriesState, CHART_DEFAULT_SERIES_STATE, createScaleX } from '../../common/chart-series';
import { ChartStyle } from '../../style/chart-style';

export interface IChartBarSeriesState extends ChartSeriesState {
    total?: number;
    animation?: boolean;
}

@Injectable()
export class BarSimpleSeriesChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...CHART_DEFAULT_SERIES_STATE,
        type: 'bar',
        total: 100,
        id: `chart-series-bar-${nextId()}`,
    };

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };
        this.root = this.chartService.select(selector);
        this.root.classed('chart-series-bar-simple', true);
        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: IChartBarSeriesState): void {
        let total = 0;
        const { data: values, style, animation } = state;
        values?.forEach(value => total = total + value);

        const labelStyle = style?.compile(ChartStyle.label) as any;
        const barStyle = style?.compile(ChartStyle.bar) as any;

        const animationStyle = style?.compile(ChartStyle.animation);

        const scaleX = createScaleX('linear', {
            ...state as ChartSeriesState,
            data: [0, total],
        });

        const { rect, data } = this.state;

        if (!rect?.height || !rect?.width) {
            return;
        }

        this.root.selectAll('rect').remove();

        const draw = ChartDrawFactory(this.root, data || []);

        let positionX = 0;

        draw(`.chart-bar-value-${nextId()}`, {
            // @ts-ignore
            create: selection =>
                selection
                    .append('rect'),
            update: selection =>
                selection
                    .classed('bar-animated', !!animation)
                    .attr('width', d => animation ? 0 : scaleX(d))
                    .attr('height', (d: any, i: number) => barStyle(d, i).size)
                    .attr('fill', (d: any, i: number) => barStyle(d, i).fill)
                    .attr('x', (d, i) => {
                        if (i === 0) {
                            return scaleX(0);
                        }
                        positionX = positionX + scaleX(data?.[i - 1]);
                        return positionX;
                    })
                    .attr('y', (d, i) => rect.height / 2 - barStyle(d, i).size / 2),

        });

        draw('.chart-label-left', {
            // @ts-ignore
            create: selection =>
                selection
                    .append('text'),
            update: selection =>
                selection
                    .attr('x', (d, i) => scaleX(0) - barStyle(d, i).paddingLeft)
                    .attr('y', (d, i) => barStyle(d, i).size)
                    .attr('vertical-align', 'middle')
                    .attr('text-anchor', 'end')
                    .attr('font-size', (d, i) => labelStyle(d, i).fontSize)
                    .attr('fill', (d, i) => labelStyle(d, i).color)
                    .attr('font-weight', (d, i) => labelStyle(d, i).fontWeight)
                    .text((d, i) => labelStyle(d, i).text),
        });

        // if (animation) {
        //     this.root.selectAll('.bar-animated')
        //         .transition()
        //         .duration((d, i) => {
        //             return animationStyle(d, i).duration;
        //         })
        //         .attr('width', d => scaleX(d))
        //         .delay((d, i) => {

        //             return animationStyle(d, i).delay;
        //         });

        //     this.root.selectAll('text')
        //         .transition()
        //         .duration((d, i) => animationStyle(d, i).duration)
        //         .delay((d, i) => animationStyle(d, i).delay)
        //         .on('start', function repeat() {
        //             d3.active(this)
        //                 .tween('text', (d, i) => {
        //                     const that = d3.select(this);
        //                     const с = d3.interpolate('0', `${labelStyle(d, i).text}`);

        //                     return (t) => { that.text(d3.format(animationStyle(d, i).format)(с(t))); };
        //                 });

        //         });
        // }
    }
}
