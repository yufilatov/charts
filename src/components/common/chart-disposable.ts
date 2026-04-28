// @ts-nocheck

import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class ChartDisposable implements OnDestroy {
    private disposes = [];

    add(dispose: () => void) {
        this.disposes.push(dispose);
    }

    finalize() {
        const disposes = Array.from(this.disposes);
        disposes.forEach(f => f());
        this.disposes = [];
    }

    ngOnDestroy() {
        this.finalize();
    }
}
