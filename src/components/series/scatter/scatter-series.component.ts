
import { Component, ChangeDetectionStrategy, OnChanges, inject, input } from '@angular/core';

import { ChartComponent } from '../../chart/chart.component';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartStyleBuilder } from '../../style/chart-style.builder';
import { ScatterSeriesChartService } from './scatter-series.service';
import { Range } from '../../common/chart-range';

@Component({
    selector: 'app-chart-series[type="scatter"]',
    template: '',
    styleUrls: [],
    providers: [
        ScatterSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScatterSeriesChartComponent implements OnChanges {
    data = input<any[]>([]);
    range = input<Range>({ x: [0, 10], y: [0, 10] });
    style = input<ChartStyleBuilder>(new ChartStyleBuilder);

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(ScatterSeriesChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());
        this.disposable.add(() => rectChange.unsubscribe());
    }

    ngOnChanges() {
        this.invalidate();
    }

    private invalidate() {
        this.seriesService.setState({
            data: this.data(),
            style: this.style(),
            range: this.range(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });
    }
}
