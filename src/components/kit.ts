// @ts-nocheck

import * as d3 from 'd3';

let SEQUENCE_ID = 0;
export function nextId() {
    return SEQUENCE_ID += 1;
}

export function elementsFromPoint(x: number, y: number): Element[] {
    if (document.elementsFromPoint) {
        return document.elementsFromPoint(x, y);
    }

    if ((document as any).msElementsFromPoint) {
        return (document as any).msElementsFromPoint(x, y);
    }

    const parents = [];
    const pointerEvents = [];

    let parent = document.elementFromPoint(x, y) as any;
    while (parent) {
        parents.push(parent);
        pointerEvents.push(parent.style.pointerEvents);
        parent.style.pointerEvents = 'none';

        const nextParent = document.elementFromPoint(x, y);
        parent = nextParent === parent ? null : nextParent;
    }

    for (let i = 0, length = parents.length; i < length; i = i + 1) {
        parents[i].style.pointerEvents = pointerEvents[i];
    }

    return parents;
}

const EPSILON = Number.EPSILON;
export class ChartMath {
    static equals(x: number, y: number) {
        return Math.abs(x - y) < EPSILON;
    }

    static less(x: number, y: number) {
        return !this.equals(x, y) && x < y;
    }

    static greater(x: number, y: number) {
        return !this.equals(x, y) && x > y;
    }

}

export function hasParent(parent, node) {
    let target = node;
    while (target.parent) {
        if (parent === target.parent) {
            return true;
        }

        target = target.parent;
    }

    return false;
}

export function findDescendants(node) {
    const result = [];
    if (node) {
        if (node.children) {
            node.children
                .forEach((n) => {
                    result.push(n);
                    result.push(...findDescendants(n));
                });
        }

        return result;
    }
}

export function getLineCurve(type) {
    switch (type) {
        case 'curveMonotoneX': return d3.curveMonotoneX;
        case 'curveMonotoneY': return d3.curveMonotoneY;
        case 'curveLinear': return d3.curveLinear;
        case 'curveBasis': return d3.curveBasis;
        case 'curveBasisClosed': return d3.curveBasisClosed;
        case 'curveBundle(0)': return d3.curveBundle.beta(0);
        case 'curveBundle (ß=0.5)': return d3.curveBundle.beta(0.5);
        case 'curveBundle (ß=1)': return d3.curveBundle.beta(1);
        case 'curveCardinal (tension=0)': return d3.curveCardinal.tension(0);
        case 'curveCardinal (tension=1)': return d3.curveCardinal.tension(1);
        case 'curveCatmullRom (α=0)': return d3.curveCatmullRom.alpha(0);
        case 'curveCatmullRom (α=0.5)': return d3.curveCatmullRom.alpha(0.5);
        case 'curveCatmullRom (α=1)': return d3.curveCatmullRom.alpha(1);
        case 'curveNatural': return d3.curveNatural;
        case 'curveStep': return d3.curveStep;
        case 'curveStepAfter': return d3.curveStepAfter;
        case 'curveStepBefore': return d3.curveStepBefore;
        default: return d3.curveLinear;
    }
}

export function getSumFromObjectValues(...rest) {
    let sum = 0;

    rest.forEach(obj => sum = sum + (Object.values(obj) as number[]).reduce((a, b) => a + b));
    return sum;
}

export function sanitize(value: string) {
    return value.replace(/\s+/g, '-');
}

export function convertUmlauts(value: string) {
    return value.replace(/ü/g, 'ue').replace(/ä/g, 'ae').replace(/ö/g, 'oe');
}

export function checkSum(data, total) {
    let values = data;
    const sum = values.reduce((a, b) => a + b);
    if (sum < total) {
        values = values.concat(total - sum);
    }
    return values;
}
