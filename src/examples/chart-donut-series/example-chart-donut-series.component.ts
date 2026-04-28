import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { ChartComponent } from '../../components/chart/chart.component';
import { DonutSeriesChartComponent } from '../../components/series/donut/donut-series.component';
import { ChartStyle } from '../../components/style/chart-style';
import { ChartStyleBuilder } from '../../components/style/chart-style.builder';

import { AsyncPipe } from '@angular/common';
import { ExampleDataService } from '../../services/example-data-service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-example-chart-donut',
    templateUrl: './example-chart-donut-series.component.html',
    styleUrls: ['./example-chart-donut-series.component.scss'],
    imports: [
        AsyncPipe,

        ChartComponent,
        DonutSeriesChartComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleChartDonutSeriesComponent {
    readonly #dataService = inject(ExampleDataService);

    data$!: Observable<any>;

    style = new ChartStyleBuilder()
        .for(ChartStyle.arc, (d, i) => {
            const colors = ['#709a28', '#f7a704', '#c23612'];

            return { fill: colors[i], strokeWidth: 2 };
        })
        .for(ChartStyle.pie, () => {
            return { innerRadius: 70 };
        });

    ngOnInit(): void {
        this.data$ = this.#dataService.getTeams();
    }
}
