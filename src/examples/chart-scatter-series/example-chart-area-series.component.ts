import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChartStyle } from '../../components/style/chart-style';
import { ChartStyleBuilder } from '../../components/style/chart-style.builder';
import { ExampleDataService } from '../../services/example-data-service';
import { ChartComponent } from '../../components/chart/chart.component';
import { AreaSeriesChartComponent } from '../../components/series/area/area-series.component';
import { AsyncPipe } from '@angular/common';
import { XAxisChartComponent } from '../../components/series/x-axis/x-axis.component';
import { ChartPlotComponent } from '../../components/plot/chart-plot.component';
import { YAxisChartComponent } from '../../components/series/y-axis/y-axis.component';
import { ScatterSeriesChartService } from '../../components/series/scatter/scatter-series.service';
import { ScatterSeriesChartComponent } from '../../components/series/scatter/scatter-series.component';
import { Range } from '../../components/common/chart-range';


@Component({
    selector: 'app-example-chart-area',
    templateUrl: './example-chart-area-series.component.html',
    styleUrls: ['./example-chart-area-series.component.scss'],
    imports: [
        ChartComponent,
        ScatterSeriesChartComponent,
        AsyncPipe,
        XAxisChartComponent,
        YAxisChartComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleChartScatterSeriesComponent implements OnInit {
    readonly #dataService = inject(ExampleDataService);

    data$!: Observable<any>;
    data = [[1996, 40], [1997, 50], [1998, 60], [1999, 40]]

    margin = { left: 40, top: 10, right: 15, bottom: 40 };
    range: Range = {
        x: [1996, 2025],
        y: [0, 100],
    };

    ticksX: number[] = [];
    ticksY: number[] = [];

    style: ChartStyleBuilder = new ChartStyleBuilder()
        .for(ChartStyle.circle, () =>({ fill: '#ffdd00', radius: 5, stroke: '#000000' }));

    ngOnInit(): void {
        this.data$ = this.#dataService
            .getHistoryData()
            .pipe(map(data => data.history.map((x: any, i: number) => {
                const season = Number(x.year.substring(0, 2) + x.year.slice(-2));
                return [season, x.goalsScored];
                })));
        

        for (let i = 1996; i < 2026; i++) {
            this.ticksX.push(i);
        }

        for (let i = 5; i < 101; i = i + 5) {
            this.ticksY.push(i);
        }
    }
}
