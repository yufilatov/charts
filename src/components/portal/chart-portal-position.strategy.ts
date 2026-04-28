import { Renderer2 } from '@angular/core';
import { IChartRect } from '../common/chart-rect';

export class ChartPortalPositionStrategy {
    constructor(
        private classList: string[],
        private document: Document,
        private position: [number, number],
    ) {}

    attach(element: any, renderer: Renderer2) {
        this.document.body.appendChild(element);
        this.classList.forEach(x => renderer.addClass(element, x));
        return () => {
            const pos = this.getPosition(element);

            renderer.setStyle(element, 'left', `${pos[0]}px`);
            renderer.setStyle(element, 'top', `${pos[1]}px`);
        };
    }

    private getPosition(element: any): [number, number] {
        const size = {
            width: element.offsetWidth as number,
            height: element.offsetHeight as number,
        };

        const [left, top] = this.position;
        const { clientTop, clientLeft, clientWidth, clientHeight } = this.document.body;

        const viewport = {
            left: clientLeft,
            top: clientTop,
            right: clientLeft + clientWidth,
            bottom: clientTop + clientHeight,
            width: clientWidth,
            height: clientHeight,
        };

        const target = {
            left,
            top,
            right: size.width + left,
            bottom: size.height + top,
            width: size.width,
            height: size.height,
        };

        const fit = this.calculateFit(viewport, target);
        return [fit.left, fit.top];
    }

    private calculateFit(viewport: IChartRect, target: IChartRect) {
        const fit = {
            ...target,
        };

        const offsetX =
            target.left < viewport.left
                ? viewport.left - target.left
                : target.right > viewport.right
                    ? viewport.right - target.right
                    : 0;

        const offsetY =
            target.top < viewport.top
                ? viewport.top - target.top
                : target.bottom > viewport.bottom
                    ? viewport.bottom - target.bottom
                    : 0;

        fit.left = fit.left + offsetX;
        fit.right = fit.left + offsetX;
        fit.top = fit.top + offsetY;
        fit.bottom = fit.bottom + offsetY;

        return fit;
    }
}
