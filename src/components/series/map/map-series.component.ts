import { Component, ChangeDetectionStrategy, ViewEncapsulation, Output,inject, input, effect } from '@angular/core';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartComponent } from '../../chart/chart.component';
import { MapSeriesChartService } from './map-series.service';
import { ChartStyleBuilder } from '../../style/chart-style.builder';

@Component({
    selector: 'app-chart-series[type="map"]',
    template: '',
    styleUrls: [],
    providers: [
        MapSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class MapSeriesChartComponent {
    data = input();
    style = input<ChartStyleBuilder>(new ChartStyleBuilder());

    @Output() get onHover() {
        return this.seriesService.mouseover;
    }

    @Output() get onLeave() {
        return this.seriesService.mouseleave;
    }

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(MapSeriesChartService);
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
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });
    }
}
