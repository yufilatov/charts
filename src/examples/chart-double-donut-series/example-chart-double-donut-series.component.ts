import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartComponent } from '../../components/chart/chart.component';
import { DoubleDonutSeriesChartComponent } from '../../components/series/double-donut/double-donut-series.component';
import { ChartStyle } from '../../components/style/chart-style';
import { ChartStyleBuilder } from '../../components/style/chart-style.builder';

import { Observable } from 'rxjs';
import { ExampleDataService } from '../../services/example-data-service';

@Component({
    selector: 'app-example-chart-double-donut',
    templateUrl: './example-chart-double-donut-series.component.html',
    styleUrls: ['./example-chart-double-donut-series.component.scss'],
    imports: [
        CommonModule,
        ChartComponent,
        DoubleDonutSeriesChartComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleChartDoubleDonutSeriesComponent {
    readonly #dataService = inject(ExampleDataService);

    data$!: Observable<any>;

    counter = 0;

    style = new ChartStyleBuilder()
        .for(ChartStyle.arc, () => {
            const colors = ['#94c31a', '#bedb75', '#f7a704', '#faca68'];
            const fill = colors[this.counter];
            this.counter = this.counter < 3 ? this.counter + 1 : 0;

            return { fill, strokeWidth: 2 };
        })
        .for(ChartStyle.pie, () => {
            return { innerRadius: 70 };
        });

    ngOnInit(): void {
        this.data$ = this.#dataService.getTeams();
    }
}
