import { Component, ChangeDetectionStrategy, OnChanges, inject, input } from '@angular/core';

import { ChartComponent } from '../../chart/chart.component';
import { ChartStyleBuilder } from '../../style/chart-style.builder';
import { YAxisChartService } from './y-axis.service';
import { ChartDisposable } from '../../common/chart-disposable';
import { Range } from '../../common/chart-range';

@Component({
    selector: 'app-chart-y-axis',
    template: '',
    styleUrls: [],
    providers: [
        YAxisChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YAxisChartComponent implements OnChanges {
    style = input<ChartStyleBuilder>();

    range = input<Range['y']>([0, 10]);
    ticks = input<number[] | string[]>();
    reverse = input<boolean>(false);

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(YAxisChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());
        this.disposable.add(() => rectChange.unsubscribe());
    }

    ngOnChanges(): void {
        this.invalidate();
    }

    private invalidate(): void {
        this.seriesService.setState({
            style: this.style(),
            range: this.range(),
            ticks: this.ticks(),
            reverse: this.reverse(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });
    }
}
