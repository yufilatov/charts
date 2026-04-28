import { Component, inject, OnInit } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { ChartDisposable } from '../../components/common/chart-disposable';
import { ChartStyle } from '../../components/style/chart-style';
import { ChartStyleBuilder } from '../../components/style/chart-style.builder';
import { ExampleDataService } from '../../services/example-data-service';
import { ChartComponent } from '../../components/chart/chart.component';
import { BarSimpleSeriesChartComponent } from '../../components/series/bar-simple-series/bar-simple-series.component';
import { AsyncPipe } from '@angular/common';
import { sort } from 'd3';

@Component({
    selector: 'app-examples-chart-bar',
    templateUrl: './examples-chart-bar-simple-series.component.html',
    styleUrls: ['./examples-chart-bar-simple-series.component.scss'],
    imports: [
        ChartComponent,
        BarSimpleSeriesChartComponent,
        AsyncPipe,
    ]
})
export class ExampleChartBarSimpleSeriesComponent implements OnInit {
    readonly #dataService = inject(ExampleDataService);

    data$!: Observable<any>;
    prevDuration = 0;

    dataFor$!: Observable<any>;
    dataAgainst$!: Observable<any>;
    clubs$!: Subscription;
    clubs!: string[];

    styleFor = new ChartStyleBuilder()
        .for(ChartStyle.bar, (d, i) => {
            const fill = i === 0 ? '#94c31a' : i === 1 ? '#bedb75' : '#F2F2F2';

            return { fill, height: 20, offsetLeft: 25 };
        })
        .for(ChartStyle.animation, (d, i) => {
            const duration = d * 10 + (100 - d) * 10;
            const delay = this.prevDuration;
            this.prevDuration = (i + 1) % 3 > 0 ? this.prevDuration + duration - 210 : 0;

            return { duration, delay, format: '.0' };
        });

    styleAgainst = new ChartStyleBuilder()
        .for(ChartStyle.bar, (d, i) => {
            const fill = i === 0 ? '#f7a704' : i === 1 ? '#faca68' : '#f8f8f8';

            return { fill, height: 20, offsetLeft: 25 };
        })
        .for(ChartStyle.animation, (d, i) => {
            const duration = d * 10 + (100 - d) * 10;
            const delay = this.prevDuration;
            this.prevDuration = (i + 1) % 3 > 0 ? this.prevDuration + duration - 210 : 0;

            return { duration, delay };
        });

    ngOnInit() {
        this.data$ = this.#dataService.getTeams()
            .pipe(map(d => d.sort((a: any, b: any) => b.standings.all.goals.for - a.standings.all.goals.for)));
    }
}
