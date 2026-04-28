import {
    Component,
    HostBinding, ChangeDetectionStrategy, HostListener, Output, EventEmitter, AfterViewInit,
    ViewEncapsulation, Input, OnChanges, SimpleChanges, ElementRef,
    input,
    output,
    inject
} from '@angular/core';

import { ChartService } from './chart.service';
import { ChartMargin, CHART_MARGIN_EMPTY } from '../common/chart-margin';
import { IChartRect, CHART_RECT_EMPTY } from '../common/chart-rect';
import { ChartSeriesState } from '../common/chart-series';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    providers: [ ChartService ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements AfterViewInit, OnChanges {
    @HostBinding('class.app-chart') hostClass = true;

    @HostListener('window:resize') onWindowResize() {
        this.invalidateSize();
    }

    margin = input<ChartMargin>(CHART_MARGIN_EMPTY);

    rectChange = output<IChartRect>();
    seriesListChange = output<ChartSeriesState[]>();

    rect = CHART_RECT_EMPTY;
    seriesList: ChartSeriesState[] = [];

    private readonly elementRef = inject(ElementRef);

    invalidateSize(): void {
        const { nativeElement } = this.elementRef;
        const rect = nativeElement.getBoundingClientRect();
        const margin = this.margin();

        this.rect = {
            top: rect.top + margin.top,
            bottom: rect.bottom - margin.bottom,
            left: rect.left + margin.left + 10,
            right: rect.right - margin.right,
            height: rect.height - margin.top - margin.bottom,
            width: rect.width - margin.left - margin.right,
        };

        this.rectChange.emit(this.rect);
    }

    ngOnChanges(changes: SimpleChanges) {
        this.invalidateSize();
    }

    ngAfterViewInit() {
        this.invalidateSize();
    }

    addSeries(series: ChartSeriesState) {
        const index = this.seriesList.findIndex(x => x.id === series.id);
        if (index >= 0) {
            this.seriesList[index] = series;
        } else {
            this.seriesList.push(series);
        }

        this.seriesListChange.emit(this.seriesList);
    }

    removeSeries(series: ChartSeriesState) {
        const index = this.seriesList.findIndex(x => x.id === series.id);
        if (index >= 0) {
            this.seriesList.splice(index, 1);
            this.seriesListChange.emit(this.seriesList);
        }
    }
}
