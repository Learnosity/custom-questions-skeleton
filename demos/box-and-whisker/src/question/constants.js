/**
 * When creating a Learnosity Custom Question, it’s important to prefix the CSS class names being used inside
 * your custom Question UI.
 * You should avoid using a generic class name like `.btn`.
 * Instead, you should add a prefix to it like `.company-name-my-custom-question-btn`
 * to avoid CSS conflict with the host page and the CSS used by the Learnosity API.
 */
export const PREFIX = 'lrn-bnw-';
export const CLASS_NAMES = {
    CORRECT: 'lrn_correct',
    INCORRECT: 'lrn_incorrect'
};
export const MARGIN = {
    TOP: 20,
    RIGHT: 20,
    BOTTOM: 20,
    LEFT: 20
};
export const AXIS_Y = MARGIN.TOP + 80;
export const HANDLER = {
    RADIUS: 6,
    TEXT_GAP: 5,
    ICON_HEIGHT: 12
};
export const LINE_RANGE = {
    MIDDLE_LINE_POSITION: MARGIN.TOP + 40,
    VERTICAL_LINE_Y1: MARGIN.TOP + 20,
    VERTICAL_LINE_Y2: MARGIN.TOP + 60,
};
export const BOX = {
    HEIGHT: LINE_RANGE.VERTICAL_LINE_Y2 - LINE_RANGE.VERTICAL_LINE_Y1,
    Y: LINE_RANGE.VERTICAL_LINE_Y1
};

export const STATES = {
    INITIAL: 'INITIAL',
    CORRECT: 'CORRECT',
    INCORRECT: 'INCORRECT'
};

export const ICONS = {
    CORRECT: 'm12.432613,2.032617l-6.899994,7.1l-3.100006,-3.2c-0.100006,-0.1 -0.300003,-0.1 -0.399994,0l-2,2c-0.100006,0.099999 -0.100006,0.3 0,0.4l5.299988,5.400001c0.100006,0.099999 0.300003,0.099999 0.400009,0l9.099991,-9.3c0.100006,-0.1 0.100006,-0.3 0,-0.4l-2,-2c-0.099991,-0.1 -0.299988,-0.1 -0.399994,0z',
    INCORRECT: 'm9.575012,8l5.100006,-5.1c0.099991,-0.1 0.099991,-0.4 0,-0.5l-1.700012,-1.7c-0.099991,-0.1 -0.399994,-0.1 -0.5,0l-5.099991,5.1l-5.100006,-5.1c-0.099991,-0.1 -0.399994,-0.1 -0.5,0l-1.699997,1.7c-0.100006,0.1 -0.100006,0.4 0,0.5l5.100006,5.1l-5.100006,5.1c-0.100006,0.099999 -0.100006,0.4 0,0.5l1.699997,1.7c0.100006,0.099999 0.400009,0.099999 0.5,0l5.100006,-5.1l5.099991,5.1c0.100006,0.099999 0.400009,0.099999 0.5,0l1.700012,-1.7c0.099991,-0.1 0.099991,-0.400001 0,-0.5l-5.100006,-5.1z'
};
