import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChartStyle } from '../../components/style/chart-style';
import { ChartStyleBuilder } from '../../components/style/chart-style.builder';
import { ExampleDataService } from '../../services/example-data-service';
import { ChartComponent } from '../../components/chart/chart.component';
import { AreaSeriesChartComponent } from '../../components/series/area/area-series.component';
import { XAxisChartComponent } from '../../components/series/x-axis/x-axis.component';
import { YAxisChartComponent } from '../../components/series/y-axis/y-axis.component';
import { Range } from '../../components/common/chart-range';
import { AsyncPipe } from '@angular/common';
import { GridSeriesChartComponent } from '../../components/series/grid/grid-series.component';


@Component({
    selector: 'app-example-chart-area',
    templateUrl: './example-chart-area-series.component.html',
    styleUrls: ['./example-chart-area-series.component.scss'],
    imports: [
        ChartComponent,
        AreaSeriesChartComponent,
        XAxisChartComponent,
        YAxisChartComponent,
        GridSeriesChartComponent,

        AsyncPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleChartAreaSeriesComponent implements OnInit {
    readonly #dataService = inject(ExampleDataService);

    data$!: Observable<any>;
    data = [[1996, 40], [1997, 50], [1998, 60], [1999, 40]]

    margin = { left: 40, top: 10, right: 15, bottom: 40 };
    range: Range = {
        x: [0, 38],
        y: [0, 100],
    };
    readonly gridStep = { x: 1, y: 5 };

    ticksX: number[] = [];
    ticksY: number[] = [];

    style: ChartStyleBuilder = new ChartStyleBuilder()
        .for(ChartStyle.circle, () => ({ fill: '#ffdd00', radius: 5, stroke: '#000000' }))
        .for(ChartStyle.line, () => ({ fill: '#034694', strokeWidth: 0 }));

    readonly gridStyle = new ChartStyleBuilder()
        .for(ChartStyle.line, () => ({
            stroke: '#C0C0C0',
            strokeDasharray: '1 1'
        }));

    ngOnInit(): void {
        // this.data$ = this.#dataService
        //     .getHistoryData()
        //     .pipe(map(data => data.history.map((x: any, i: number) => {
        //         const season = Number(x.year.substring(0, 2) + x.year.slice(-2));
        //         return [season, x.goalsScored];
        //         })));

        this.data$ = this.#dataService.getTeams()
            .pipe(map(d => {
                const b = d.find((a: any) => a.team?.id === 49).standings.pointsEachRound;
                return [[0, 0]].concat(b.map(((a: any, i: number) => [i + 1, a])))
            }))


        for (let i = 0; i < 39; i++) {
            this.ticksX.push(i);
        }

        for (let i = 0; i < 101; i = i + 5) {
            this.ticksY.push(i);
        }
    }
}
