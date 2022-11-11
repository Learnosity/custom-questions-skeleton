/**
 * When creating a Learnosity Custom Question, it’s important to prefix the CSS class names being used inside
 * your custom Question UI.
 * You should avoid using a generic class name like `.btn`.
 * Instead, you should add a prefix to it like `.company-name-my-custom-question-btn`
 * to avoid CSS conflict with the host page and the CSS used by the Learnosity API.
 */
export const PREFIX = 'lrn-custom-question';
/* dimensions of the svg viewbox*/
export const VIEW_BOX_SQUARE = 500;
/** the center point of the clock cx,cy */
export const CLOCK_CENTER = VIEW_BOX_SQUARE / 2;
/** the radius of the clock face */
export const CLOCK_RADIUS = VIEW_BOX_SQUARE / 2.4;
/** radius of the circle for number placement **/
export const NUMBER_RADIUS = VIEW_BOX_SQUARE / 2.8;
/** radius of the hour hand **/
export const SMALL_HAND_RADIUS = VIEW_BOX_SQUARE / 4.3;
/** radius of the minute hand **/
export const BIG_HAND_RADIUS = VIEW_BOX_SQUARE / 3.3;
// number y offset
export const NUMBER_Y_OFFSET = VIEW_BOX_SQUARE / 7.5;
// offset for adding to the number translation:
export const TRANSLATION_OFFSET = VIEW_BOX_SQUARE / 2.6;
//** y offsets for clock ticks */
export const Y1_OFFSET = VIEW_BOX_SQUARE / 12;
export const Y2_OFFSET = VIEW_BOX_SQUARE / 9.2307;
/** tolerance - how many degrees off we will tolerate the hand angles in validation */
export const TOLERANCE = 7;
