import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartComponent } from '../../chart/chart.component';
import { ChartStyleBuilder } from '../../style/chart-style.builder';
import { DoubleDonutSeriesChartService } from './double-donut-series.service';

@Component({
    selector: 'app-chart-series[type="double-donut"]',
    template: '',
    styleUrls: [],
    providers: [
        DoubleDonutSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoubleDonutSeriesChartComponent {
    data = input<any[]>([]);
    style = input<ChartStyleBuilder>(new ChartStyleBuilder());
    total = input<number>(0);

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(DoubleDonutSeriesChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());
        this.disposable.add(() => rectChange.unsubscribe());
    }

    private invalidate(): void {
        this.seriesService.setState({
            data: this.data(),
            style: this.style(),
            total: this.total(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });
    }
}
