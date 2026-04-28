import { Injectable, ApplicationRef, ComponentFactoryResolver, Injector, EmbeddedViewRef, TemplateRef } from '@angular/core';
import { ChartPortalPositionStrategy } from './chart-portal-position.strategy';
import { ChartPortalComponent } from './chart-portal.component';

@Injectable()
export class ChartPortalService {
    constructor(
        private appRef: ApplicationRef,
        private injector: Injector,
        private componentFactoryResolver: ComponentFactoryResolver,
    ) {
    }

    enter(
        link: { templateRef: TemplateRef<any>, context: any },
        positionStrategy: ChartPortalPositionStrategy,
    ) {
        const componentRef = this.componentFactoryResolver
            .resolveComponentFactory(ChartPortalComponent)
            .create(this.injector);

        componentRef.instance.link = link;

        const hostView = componentRef.hostView as EmbeddedViewRef<any>;
        const hostElement = hostView.rootNodes[0] as Element;
        this.appRef.attachView(hostView);

        const move = componentRef.instance.attach(positionStrategy);

        const resource = {
            attach: move,
            detach: () => {
                if (hostElement.parentNode) {
                    hostElement.parentNode.removeChild(hostElement);
                    this.appRef.detachView(hostView);
                }
            },
        };

        return resource;
    }
}
