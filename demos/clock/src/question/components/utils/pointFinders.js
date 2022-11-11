import {
    NUMBER_RADIUS,
    CLOCK_CENTER,
    TRANSLATION_OFFSET,
} from '../../constants';

/**
 * find a point on a circle given the radius and the clockwise rotation angle
@param {number} r the radius of the circle
@param {number} angle = the angle in degrees but will be converted to radians in the function, which is needed for the formula:
x = cx + r * cos(angle)
y = cy + r * sin(angle)
@constant CLOCK_CENTER the point used by default for both cx and cy
@returns {object} and object containing the x,y coords on the circle
 */

export const getPointOnCircle = (r, angleInDegrees) => {
    // convert the angle to radians
    const angleInRadians = angleInDegrees * (Math.PI / 180);

    return {
        x: CLOCK_CENTER + r * Math.cos(angleInRadians),
        y: CLOCK_CENTER + r * Math.sin(angleInRadians),
    };
};

/**
 * find the x and y coordinates whereby to translate the text of the numbers on the clock
 * @param {number} i - the current index in a loop between 0 and 12 looping over the clock
 * @returns the x,y coords for where each number needs to be placed on the clock, based on the value of i
 */
export const numberPoints = (i) => {
    // adding the numbers to the clock by performing a translation
    return {
        x: NUMBER_RADIUS * Math.cos(Math.PI / -2 + (2 * i * Math.PI) / 12),
        y:
            NUMBER_RADIUS * Math.sin(Math.PI / -2 + (2 * i * Math.PI) / 12) +
            TRANSLATION_OFFSET,
    };
};
