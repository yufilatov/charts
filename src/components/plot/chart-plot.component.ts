import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, OnChanges, SimpleChanges, input } from '@angular/core';
import { ChartDisposable } from '../common/chart-disposable';
import { ChartComponent } from '../chart/chart.component';
import { CHART_MARGIN_EMPTY, ChartMargin } from '../common/chart-margin';

@Component({
    selector: 'app-chart-plot',
    template: '',
    styleUrls: [],
    providers: [ChartDisposable],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartPlotComponent implements OnChanges {
    margin = input<ChartMargin>(CHART_MARGIN_EMPTY);

    constructor(
        private chart: ChartComponent,
        private disposable: ChartDisposable,
    ) {
        // const rectChange = chart.rectChange.subscribe(() => this.invalidate());

        // this.disposable.add(() => rectChange.unsubscribe());
    }

    ngOnChanges() {
        this.invalidate();
    }

    private invalidate() {
        // this.chart.margin. = ({ ...CHART_MARGIN_EMPTY, ...this.margin() });
        //  = ({ ...CHART_MARGIN_EMPTY, ...this.margin() });
        // this.chart.updatePlot({ ...CHART_MARGIN_EMPTY, ...this.margin() })
    }
}
