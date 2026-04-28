import { Routes } from '@angular/router';

import { ExampleChartDonutSeriesComponent } from '../examples/chart-donut-series/example-chart-donut-series.component';
import { ExampleChartDoubleDonutSeriesComponent } from '../examples/chart-double-donut-series/example-chart-double-donut-series.component';
import { ExampleChartHalfDonutSeriesComponent } from '../examples/chart-half-donut-series/example-chart-half-donut-series.component';
import { ExampleChartAreaSeriesComponent } from '../examples/chart-area-series/example-chart-area-series.component';
import { ExampleChartBarHorizontalSeriesComponent } from '../examples/chart-bar-horizontal-series/example-chart-bar-horizontal-series.component';
import { ExampleChartBarSimpleSeriesComponent } from '../examples/chart-bar-simple-series/examples-chart-bar-simple-series.component';
import { ExampleChartMapSeriesComponent } from '../examples/map/example-chart-map-series.component';
import { ExampleChartBarVerticalSeriesComponent } from '../examples/chart-bar-vertical-series/example-chart-bar-vertical-series.component';
import { ExampleChartDashboardComponent } from '../examples/dashboard/dashboard.component';

export const routes: Routes = [
    { path: 'dashboard', component: ExampleChartDashboardComponent },
    { path: 'map', component: ExampleChartMapSeriesComponent },
    { path: 'area', component: ExampleChartAreaSeriesComponent },
    { path: 'bar-horizontal', component: ExampleChartBarHorizontalSeriesComponent },
    { path: 'bar-vertical', component: ExampleChartBarVerticalSeriesComponent },
    { path: 'bar-simple', component: ExampleChartBarSimpleSeriesComponent },
    { path: 'donut', component: ExampleChartDonutSeriesComponent },
    { path: 'double-donut', component: ExampleChartDoubleDonutSeriesComponent },
    { path: 'half-donut', component: ExampleChartHalfDonutSeriesComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full'}
];
