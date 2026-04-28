import { Component, Output, inject, input, ChangeDetectionStrategy, effect } from '@angular/core';
import { ChartComponent } from '../../chart/chart.component';
import { ChartDisposable } from '../../common/chart-disposable';
import { BarVerticalSeriesChartService } from './bar-series-vertical.service';
import { BarHorizontalSeriesChartService } from './bar-series-horizontal.service';
import { ChartStyleBuilder } from '../../style/chart-style.builder';
import { Range } from '../../common/chart-range';

export type BarSeriesChartOrientation = 'vertical' | 'horizontal';

@Component({
    selector: 'app-chart-series[type="bar"]',
    template: '',
    providers: [
        BarVerticalSeriesChartService,
        BarHorizontalSeriesChartService,
        BarHorizontalSeriesChartService,
        BarVerticalSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarSeriesChartComponent {
    data = input<number[]>([]);
    style = input<ChartStyleBuilder>();

    range = input<Range>({ x: [0, 100], y: [0, 100] });
    total = input<number>(100);
    animation = input<boolean>(false);
    orientation = input<BarSeriesChartOrientation>();

    @Output() get selectionChange() {
        return this.orientation() === 'vertical' ?
            this.#seriesServiceVertical.selectionChange : this.#seriesServiceHorizontal.selectionChange;
    }

    readonly #chart = inject(ChartComponent);
    readonly #seriesServiceVertical = inject(BarVerticalSeriesChartService);
    readonly #seriesServiceHorizontal = inject(BarHorizontalSeriesChartService);
    readonly #disposable = inject(ChartDisposable);

    constructor() {
        const rectChange = this.#chart.rectChange.subscribe(() => this.invalidate());
        this.#disposable.add(() => rectChange.unsubscribe());

        effect(() => {
            this.invalidate();
        })
    }

    private invalidate(): void {
        const service = this.orientation() === 'vertical'
            ? this.#seriesServiceVertical
            : this.#seriesServiceHorizontal;

        service.setState({
            data: this.data(),
            style: this.style(),
            range: this.range(),
            total: this.total(),
            animation: this.animation(),
            rect: this.#chart.rect,
            margin: this.#chart.margin(),
        });
    }
}
