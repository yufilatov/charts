import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { ChartStyle } from '../../components/style/chart-style';
import { ChartStyleBuilder } from '../../components/style/chart-style.builder';

import { ChartComponent } from '../../components/chart/chart.component';
import { HalfDonutSeriesChartComponent } from '../../components/series/half-donut/half-donut-series.component';
import { Observable } from 'rxjs';
import { ExampleDataService } from '../../services/example-data-service';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-example-chart-half-donut',
    templateUrl: './example-chart-half-donut-series.component.html',
    styleUrls: ['./example-chart-half-donut-series.component.scss'],
    imports: [
        AsyncPipe,

        ChartComponent,
        HalfDonutSeriesChartComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleChartHalfDonutSeriesComponent {
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
