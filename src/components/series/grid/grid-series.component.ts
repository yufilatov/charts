import { Component, OnInit, OnChanges, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { ChartDisposable } from '../../common/chart-disposable';
import { GridSeriesChartService } from './grid-series.service';
// import { ChartStyleBuilder } from '../../chart-style/chart-style.builder';
import { ChartComponent } from '../../chart/chart.component';
import { ChartStyleBuilder } from '../../style/chart-style.builder';

@Component({
    selector: 'app-chart-series[type="grid"]',
    template: '',
    styleUrls: [],
    providers: [
        GridSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridSeriesChartComponent implements OnChanges {
    @Input() step: { x: number, y: number } = { x: 5, y: 1 };
    @Input() range!: { x: [number, number], y: [number, number] };
    @Input() style = new ChartStyleBuilder();

    constructor(
        private chart: ChartComponent,
        private seriesService: GridSeriesChartService,
        private disposable: ChartDisposable,
    ) {
        const rectChange = chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.invalidate();
    }

    private invalidate() {
        this.seriesService.setState({
            step: this.step,
            style: this.style,
            range: this.range,
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });
    }
}
