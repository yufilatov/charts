import { Component, ChangeDetectorRef, ChangeDetectionStrategy, ElementRef, Renderer2, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ChartPortalPositionStrategy } from './chart-portal-position.strategy';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'app-chart-portal',
    templateUrl: './chart-portal.component.html',
    styleUrls: ['./chart-portal.component.scss'],
    imports: [
        NgTemplateOutlet,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartPortalComponent {
    link: { templateRef: TemplateRef<any>, context: any } | null = null;

    constructor(
        private cd: ChangeDetectorRef,
        private elementRef: ElementRef,
        private renderer: Renderer2,
    ) {
        renderer.addClass(elementRef.nativeElement, 'chart-portal');
    }

    attach(positionStrategy: ChartPortalPositionStrategy) {
        const move = positionStrategy.attach(this.elementRef.nativeElement, this.renderer);
        this.cd.detectChanges();

        return move;
    }
}
