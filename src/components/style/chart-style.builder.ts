// @ts-nocheck

import { IChartStyle } from './chart-style';

export type ChartStyleMake<T extends IChartStyle> = (d: any, i: number, context: any) => T;

export class ChartStyleBuilder {
    private styles = new Map<string, ChartStyleMake<any>>();

    for<T extends IChartStyle>(style: T, make: ChartStyleMake<T>) {
        this.styles.set(style.key, make);
        return this;
    }

    compile<T extends IChartStyle>(chartStyle: T, defaults?: T): (d: any, i?: number) => T {
        const { key } = chartStyle;
        const context = {
        };

        const makeStyle = this.styles.get(key);
        const cache = [];
        if (makeStyle) {
            return (d, i): T => {
                if (cache[i]) {
                    return cache[i];
                }

                const style = makeStyle(d, i, context);
                const compStyle = {
                    ...chartStyle as IChartStyle,
                    ...(defaults || {}) as IChartStyle,
                    ...style,
                };

                cache[i] = compStyle;
                compStyle.changeSet = new Set(Object.keys(style));

                return compStyle;
            };
        }

        return () => ({
            ...chartStyle as IChartStyle,
            ...defaults as IChartStyle,
            changeSet: new Set<string>(),
        } as T);
    }
}
