import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, map, share} from 'rxjs';

import { ChartComponent } from '../../components/chart/chart.component';
import { BarSeriesChartComponent } from '../../components/series/bar-series/bar-series.component';
import { GridSeriesChartComponent } from '../../components/series/grid/grid-series.component';
import { XAxisChartComponent } from '../../components/series/x-axis/x-axis.component';
import { YAxisChartComponent } from '../../components/series/y-axis/y-axis.component';

import { ChartStyle } from '../../components/style/chart-style';
import { ChartStyleBuilder } from '../../components/style/chart-style.builder';
import { ExampleDataService } from '../../services/example-data-service';
import { Range } from '../../components/common/chart-range';

@Component({
    selector: 'app-example-chart-bar-vertical',
    templateUrl: './example-chart-bar-vertical-series.component.html',
    styleUrls: ['./example-chart-bar-vertical-series.component.scss'],
    imports: [
        AsyncPipe,

        ChartComponent,
        BarSeriesChartComponent,
        GridSeriesChartComponent,
        XAxisChartComponent,
        YAxisChartComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ExampleChartBarVerticalSeriesComponent implements OnInit {
    private readonly colors = ['#709a28', '#87ba30', '#c23612', '#e0471f'];

    data$!: Observable<any>;

    values$!: Observable<number[]>;
    ticks$!: Observable<string[]>;

    readonly margin = { left: 30, bottom: 40, right: 20, top: 0 };
    readonly range: Range = { x: [0, 21], y: [0, 130] };
    readonly gridStep = { x: 0, y: 5 };

    readonly ticksX: number[] = [];
    readonly ticksY: number[] = [];

    readonly #dataService = inject(ExampleDataService);

    readonly style = new ChartStyleBuilder()
        .for(ChartStyle.bar, (d, i) => ({
            fill: this.colors[i],
            background: '#f1f3ca',
            size: 30
        }))
        .for(ChartStyle.label, (d) => ({
            text: `${d}%`,
            fontSize: 9,
            fontWeight: 600
        }));

    readonly gridStyle = new ChartStyleBuilder()
        .for(ChartStyle.line, () => ({
            stroke: '#C0C0C0',
            strokeDasharray: '1 1'
        }));

    ngOnInit(): void {
        for (let i = 1; i < Math.max(...this.range.x); i++) {
            this.ticksX.push(i);
        }

        for (let i = 5; i < Math.max(...this.range.y); i += 5) {
            this.ticksY.push(i);
        }

        this.data$ = this.#dataService.getTeams().pipe(share());

        this.values$ = this.data$
            .pipe(map(d => d.map((c: any) => [c.standings?.all.goals.for])));

        this.ticks$ = this.data$
            .pipe(map(d => [''].concat(d.map((c: any) => c.team.logo))));

        this.update();
    }

    update(): void {
        this.values$ = this.data$
            .pipe(map(ds => ds.sort((a: any, b: any) => a.standings.rank - b.standings.rank)))
            .pipe(map(d => d.map((c: any) => [c.standings?.all.goals.for])));
    }
}
