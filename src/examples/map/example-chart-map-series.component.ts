import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { convertUmlauts } from '../../components/kit';
import { ChartStyle } from '../../components/style/chart-style';
import { ChartStyleBuilder } from '../../components/style/chart-style.builder';
import { AsyncPipe, NgClass } from '@angular/common';
import { ChartComponent } from '../../components/chart/chart.component';
import { MapSeriesChartComponent } from '../../components/series/map/map-series.component';
import { Observable, Subject, tap } from 'rxjs';
import { ExampleDataService } from '../../services/example-data-service';

@Component({
    selector: 'app-example-chart-map',
    templateUrl: './example-chart-map-series.component.html',
    styleUrls: [
        './example-chart-map-series.component.scss',
        // '../../styles/germany-lands-logos.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgClass, ChartComponent, MapSeriesChartComponent, AsyncPipe
    ]
})
export class ExampleChartMapSeriesComponent implements OnInit {
    private readonly dataService = inject(ExampleDataService);
    show = false;
    data$!: Observable<any>;
    current$: Subject<any> = new Subject();

    legend = [4, 8, 12, 16, 20];

    color = d3.scaleOrdinal(d3.schemeSet3);

    style = new ChartStyleBuilder()
        .for(ChartStyle.arc, (d: any, i: number) => {

            return { fill: this.color(String(i)), strokeWidth: 1, stroke: '#000000', fillHover: '#006666' };
        });

    ngOnInit(): void {
        this.data$ = this.dataService.getMapData().pipe(tap(d => console.log(d)));
    }

    showData(data: any) {
        this.show = true;
        this.current$.next(data);
    }

    getLogo(name: string) {
        return name ? `logo logo-${convertUmlauts(name.toLowerCase().replace(/\s+/g, '-'))}` : '';
    }

    getLogoBig(name: string) {
        return name ? `logo-big logo-${convertUmlauts(name.toLowerCase().replace(/\s+/g, '-'))}` : '';
    }
}
