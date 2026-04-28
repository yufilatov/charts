import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { ChartComponent } from '../../components/chart/chart.component';
import { DonutSeriesChartComponent } from '../../components/series/donut/donut-series.component';
import { ChartStyle } from '../../components/style/chart-style';
import { ChartStyleBuilder } from '../../components/style/chart-style.builder';

import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ExampleDataService } from '../../services/example-data-service';
import { map, Observable, share } from 'rxjs';
import { AreaSeriesChartComponent } from '../../components/series/area/area-series.component';
import { Range } from '../../components/common/chart-range';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [
        AsyncPipe,
        NgTemplateOutlet,

        ChartComponent,
        DonutSeriesChartComponent,
        // AreaSeriesChartComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleChartDashboardComponent {
    readonly #dataService = inject(ExampleDataService);

    data$!: Observable<any>;
    team1$!: Observable<any>;
    team2$!: Observable<any>;
    area1$!: Observable<any>;
    area2$!: Observable<any>;

    range: Range = {
        x: [0, 38],
        y: [0, 100],
    };

    style = new ChartStyleBuilder()
        .for(ChartStyle.arc, (d, i) => {
            const colors = ['#709a28', '#f7a704', '#c23612'];

            return { fill: colors[i], strokeWidth: 2 };
        })
        .for(ChartStyle.label, (d) => {
            return { text: '0' };
        })
        .for(ChartStyle.pie, () => {
            return { innerRadius: 70 };
        });

    ngOnInit(): void {
        this.#dataService.getStatistics().subscribe();
        this.data$ = this.#dataService.getTeams().pipe(share());

        this.team1$ = this.data$.pipe(map(teams => teams.find((team: any) => team.team.id === 49)));
        this.team2$ = this.data$.pipe(map(teams => teams.find((team: any) => team.team.id === 50)));

        // this.area1$ = this.team$
        //     .pipe(map(d => {
        //         const b = d.standings.pointsEachRound;
        //         return [[0, 0]].concat(b.map(((a: any, i: number) => [i + 1, a])))
        //     }))

        // this.area2$ = this.team$
        //     .pipe(map(d => {
        //         const b = d.standings.rankEachRound;
        //         return [[0, 0]].concat(b.map(((a: any, i: number) => [i + 1, a])))
        //     }))

        //     this.#dataService.getStata().subscribe();
    }
}
