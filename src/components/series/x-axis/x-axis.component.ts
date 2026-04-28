import { Component, ChangeDetectionStrategy, OnChanges, inject, input } from '@angular/core';

import { ChartComponent } from '../../chart/chart.component';
import { ChartStyleBuilder } from '../../style/chart-style.builder';
import { XAxisChartService } from './x-axis.service';
import { ChartDisposable } from '../../common/chart-disposable';
import { Range } from '../../common/chart-range';

@Component({
    selector: 'app-chart-x-axis',
    template: '',
    styleUrls: [],
    providers: [
        XAxisChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XAxisChartComponent implements OnChanges {
    style = input<ChartStyleBuilder>();

    range = input<Range['x']>([0, 10]);
    ticks = input<number[] | string[]>();
    reverse = input<boolean>(false);

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(XAxisChartService);
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
            style: this.style(),
            range: this.range(),
            ticks: this.ticks(),
            reverse: this.reverse(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });
    }
}
