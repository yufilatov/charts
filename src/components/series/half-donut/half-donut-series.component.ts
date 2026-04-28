import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { HalfDonutSeriesChartService } from './half-donut-series.service';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartComponent } from '../../chart/chart.component';
import { ChartStyleBuilder } from '../../style/chart-style.builder';

@Component({
    selector: 'app-chart-series[type="half-donut"]',
    template: '',
    styleUrls: [],
    providers: [
        HalfDonutSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HalfDonutSeriesChartComponent {
    data = input<any[]>([]);
    style = input<ChartStyleBuilder>(new ChartStyleBuilder());

    total = input<number>(0);

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(HalfDonutSeriesChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());
        this.disposable.add(() => rectChange.unsubscribe());
    }

    private invalidate() {
        this.seriesService.setState({
            data: this.data(),
            style: this.style(),
            total: this.total(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });
    }
}
