
import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, SimpleChanges, OnChanges, inject, input } from '@angular/core';

import { AreaSeriesChartService, Point } from './area-series.service';
import { ChartComponent } from '../../chart/chart.component';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartStyleBuilder } from '../../style/chart-style.builder';

@Component({
    selector: 'app-chart-series[type="area"]',
    template: '',
    styleUrls: [],
    providers: [
        AreaSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaSeriesChartComponent implements OnChanges {
    curveType = input('curveLinear');
    data = input<Point[]>([]);
    range = input<{ x: number[], y: number[] }>({ x: [], y: [] });
    style = input<ChartStyleBuilder>(new ChartStyleBuilder);

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(AreaSeriesChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());
        this.disposable.add(() => rectChange.unsubscribe());
    }

    ngOnChanges() {
        this.invalidate();
    }

    private invalidate(): void {
        this.seriesService.setState({
            data: this.data(),
            style: this.style(),
            range: this.range(),
            curveType: this.curveType(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });
    }
}
