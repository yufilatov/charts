// @ts-nocheck

import * as d3 from 'd3';

export type ChartDrawSelection<T> = d3.Selection<d3.BaseType | d3.EnterElement, T, SVGElement, string>;

export interface IChartDrawSettings<T> {
    create?: (selection: ChartDrawSelection<T>) => ChartDrawSelection<T>;
    update?: (selection: ChartDrawSelection<T>) => ChartDrawSelection<T>;
    delete?: (selection: ChartDrawSelection<T>) => ChartDrawSelection<T>;
}

const INITIAL_DRAW_SETTINGS: IChartDrawSettings<any> = {
    create: x => x,
    update: x => x,
    delete: x => x,
};

export function ChartDrawFactory<T>(
    root: d3.Selection<SVGElement, string, SVGElement, number>,
    datum: T[],
) {
    return (selector: string, settings: IChartDrawSettings<T>) => {
        const context: IChartDrawSettings<T> = {
            ...INITIAL_DRAW_SETTINGS,
            ...settings,
        };

        const selection = root
            .selectAll(selector)
            .data(datum);

        const enter = context
            .create(selection.enter())
            .attr('class', selector.slice(1));

        const merge = enter
            .merge(selection as d3.Selection<d3.EnterElement, T, SVGElement, string>);
        context.update(merge);

        context
            .delete(selection.exit())
            .remove();
    };
}
