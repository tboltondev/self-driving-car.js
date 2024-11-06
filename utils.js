/**
 * Calculates the point at the ratio between start and end
 * @param {number} start
 * @param {number} end
 * @param {number} ratio
 * @returns {number} point at ratio between start and end
 */
const lerp = (start, end, ratio) => {
    return start + (end - start) * ratio;
}

/**
 * @typedef {Object} Point
 * @property {number} x - x coordinate
 * @property {number} y - y coordinate
 */

/**
 * @typedef {Object} PointWithOffset
 * @extends Point
 * @property {number} offset - offset from aStart. `offset = 0` when the intersection
 * is exactly at `aStart` and `offset = 1` when it is at `aEnd`
 */

/**
 * Gets intersection between two lines, a and b
 * @param {Point} aStart - start point of line a
 * @param {Point} aEnd - end point of line a
 * @param {Point} bStart - start point of line b
 * @param {Point} bEnd - end point of line b
 * @returns {PointWithOffset | null}
 */
const getIntersection = (aStart, aEnd, bStart, bEnd) => {
    const tTop = (bEnd.x - bStart.x) * (aStart.y - bStart.y) - (bEnd.y - bStart.y) * (aStart.x - bStart.x);
    const uTop = (bStart.y - aStart.y) * (aStart.x - aEnd.x) - (bStart.x - aStart.x) * (aStart.y - aEnd.y);
    const bottom = (bEnd.y - bStart.y) * (aEnd.x - aStart.x) - (bEnd.x - bStart.x) * (aEnd.y - aStart.y);

    if (bottom !== 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(aStart.x, aEnd.x, t),
                y: lerp(aStart.y, aEnd.y, t),
                offset: t
            }
        }
    }

    return null;
}

/**
 * @typedef {Point[]} Polygon
 */

/**
 * Calculates if two polygons intersect
 * @param {Polygon} poly1 - first polygon
 * @param {Polygon} poly2 - second polygon
 * @returns {boolean} true if polygons intersect, otherwise false
 */
const polysIntersect = (poly1, poly2) => {
    for (let i = 0; i < poly1.length; i++) {
        for (let j = 0; j < poly2.length; j++) {
            const touch = getIntersection(
                poly1[i],
                poly1[(i+1) % poly1.length],
                poly2[j],
                poly2[(j+1) % poly2.length]
            );

            if (touch) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Returns an RGBA color value for a given positive or negative number
 * @param {number} value - the value to create an RGBA color for
 * @returns {string} - an RGBA color value
 */
const getRGBA = (value) => {
    const alpha = Math.abs(value);
    const r = value < 0 ? 0 : 255;
    const g = r;
    const b = value > 0 ? 0 : 255;
    return `rgba(${r},${g},${b},${alpha})`;
}
