import { Component, input, inject, ChangeDetectionStrategy, effect } from '@angular/core';
import { ChartComponent } from '../../chart/chart.component';
import { BarSimpleSeriesChartService } from './bar-simple-series.service';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartStyleBuilder } from '../../style/chart-style.builder';

@Component({
    selector: 'app-chart-series[type="bar-simple"]',
    template: '',
    providers: [
        BarSimpleSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarSimpleSeriesChartComponent {
    data = input<any[]>();
    style = input<ChartStyleBuilder>();

    total = input<number>(100);
    animation = input<boolean>(false);

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(BarSimpleSeriesChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());
        this.disposable.add(() => rectChange.unsubscribe());

        effect(() => {
            this.invalidate();
        })
    }

    private invalidate() {
        this.seriesService.setState({
            data: this.data(),
            style: this.style(),
            total: this.total(),
            animation: this.animation(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });
    }
}
