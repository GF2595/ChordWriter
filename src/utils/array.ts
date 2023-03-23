import { fill } from 'lodash';

export const replace = <T>(
    array: Array<T>,
    index: number,
    value: T
): Array<T> => [...fill(array, value, index, index + 1)];

export const removeAt = <T>(array: Array<T>, index: number): Array<T> =>
    index === 0
        ? [...array.slice(1)]
        : [...array.slice(0, index), ...array.slice(index + 1)];

export const insert = <T>(
    array: Array<T>,
    index: number,
    value: T
): Array<T> => [...array.slice(0, index), value, ...array.slice(index)];

