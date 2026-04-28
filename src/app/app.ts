import { Component, signal } from '@angular/core';
import { Route, RouterLink, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal('charts');

    types: Route[] = [];
    activeChart = 0;

    pages = ['Home', 'Contacts', 'About'];

    ngOnInit(): void {
        this.types = routes;
    }

    onClick(index: number): void {
        this.activeChart = index;
    }
}
