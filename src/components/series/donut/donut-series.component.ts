import { Component, ChangeDetectionStrategy, input, inject, effect } from '@angular/core';
import { DonutSeriesChartService } from './donut-series.service';
import { ChartStyleBuilder } from '../../style/chart-style.builder';
import { ChartComponent } from '../../chart/chart.component';
import { ChartDisposable } from '../../common/chart-disposable';

@Component({
    selector: 'app-chart-series[type="donut"]',
    template: '',
    styleUrls: [],
    providers: [
        DonutSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutSeriesChartComponent {
    data = input<any[]>([]);
    style = input<ChartStyleBuilder>(new ChartStyleBuilder());
    total = input<number>(0);
    label = input<string>()

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(DonutSeriesChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());
        this.disposable.add(() => rectChange.unsubscribe());

        effect(() => this.invalidate());
    }

    private invalidate(): void {
        this.seriesService.setState({
            data: this.data(),
            style: this.style(),
            total: this.total(),
            label: this.label(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });
    }
}
