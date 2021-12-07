import * as d3 from 'd3';
import { drag } from 'd3-drag';
import { isFunction, each, noop } from 'lodash';
import {
    BOX,
    LINE_RANGE, STATES,
} from '../constants.js';
import { drawLine, drawHandler, drawRect, drawDomainAxis } from '../utils/shapeHelper';
import { getClassName, getHandlerX, getShapeWidth, getShapeX } from '../utils/dom';

const DRAGGING_CLASSNAME = getClassName('handler-dragging');
// round to 2 decimals if possible
const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

export default class BoxAndWhisker {
    constructor(svgBoard, { question, response }) {
        this.board = svgBoard;
        this.question = question;
        this.response = response;
        this.components = {
            svg: d3.select(this.board),
            handlers: {},
            boxes: {}
        };
    }

    enable() {
        this.disabled = false;
    }

    disable() {
        this.disabled = true;
    }

    registerEvents(events) {
        this.events = Object.assign({
            onChange: noop,
            onValidationUICleared: noop
        }, events);
    }

    triggerEvent(name, ...args) {
        const { events } = this;

        if (events && isFunction(events[name])) {
            events[name](...args);
        }
    }

    render() {
        this.drawAxis();
        this.drawRangeLine();
        this.drawBoxes();
        this.attachDragEvents();
    }

    renderValidationUI(detailedValidatedResult) {
        if (!detailedValidatedResult) {
            return;
        }

        const individualResponses = detailedValidatedResult.partial;
        const setState = (handler, isCorrect) => {
            handler.setState(isCorrect ? STATES.CORRECT : STATES.INCORRECT);
        };
        const {
            minHandler,
            maxHandler,
            q1Handler,
            q3Handler,
            medianHandler
        } = this.components.handlers;

        setState(minHandler, individualResponses.min);
        setState(maxHandler, individualResponses.max);
        setState(q1Handler, individualResponses.quartile_1);
        setState(medianHandler, individualResponses.median);
        setState(q3Handler, individualResponses.quartile_3);
    }

    clearValidationUI() {
        const { components } = this;

        this.triggerEvent('onValidationUICleared');

        each(components.handlers, (handler) => handler.setState(null));
    }

    drawAxis() {
        const { question, components } = this;
        const { svg } = components;
        const width = question.width;

        svg
            .attr('width', width)
            .append('defs');

        this.unitToPx = drawDomainAxis(svg, width, question.line_min, question.line_max);
        this.pxToUnit = this.unitToPx.invert;
    }

    drawRangeLine() {
        const { components, unitToPx } = this;
        const { svg } = components;
        const {
            MIDDLE_LINE_POSITION,
            VERTICAL_LINE_Y1,
            VERTICAL_LINE_Y2,
        } = LINE_RANGE;
        const min = this.get('min');
        const max = this.get('max')
        const minValue = unitToPx(min);
        const maxValue = unitToPx(max);
        const rangeLine = svg.append('g').attr('class', getClassName('line-range'));

        // middle line
        const lineRange = drawLine(rangeLine, minValue, MIDDLE_LINE_POSITION, maxValue, MIDDLE_LINE_POSITION);

        // min handler
        const minHandler = drawHandler(rangeLine, minValue, VERTICAL_LINE_Y1, minValue, VERTICAL_LINE_Y2, min);

        // max handler
        const maxHandler = drawHandler(rangeLine, maxValue, VERTICAL_LINE_Y1, maxValue, VERTICAL_LINE_Y2, max);

        this.components.lineRange = lineRange;
        this.components.handlers = {
            ...components.handlers,
            minHandler,
            maxHandler,
        };
    }

    drawBoxes() {
        const { components, unitToPx } = this;
        const {svg} = components;
        const quartile1 = this.get('quartile_1');
        const median = this.get('median');
        const quartile3 = this.get('quartile_3');
        const q1Value = unitToPx(quartile1);
        const medianValue = unitToPx(median);
        const q3Value = unitToPx(quartile3);
        const boxes = svg.append('g').attr('class', getClassName('boxes'));
        const medianWrapper = svg.append('g').attr('class', getClassName('median'));

        // draw left box
        const q1Box = drawRect(boxes, q1Value, BOX.Y, medianValue - q1Value, BOX.HEIGHT)
            .attr('class', getClassName('box box-q1'));
        const q1Handler = drawHandler(boxes, q1Value, BOX.Y, q1Value, BOX.Y + BOX.HEIGHT, quartile1);

        // draw right box
        const q3Box = drawRect(boxes, medianValue, BOX.Y, q3Value - medianValue, BOX.HEIGHT)
            .attr('class', getClassName('box box-q3'));
        const q3Handler = drawHandler(boxes, q3Value, BOX.Y, q3Value, BOX.Y + BOX.HEIGHT, quartile3);

        // draw median
        const medianHandler = drawHandler(medianWrapper, medianValue, BOX.Y, medianValue, BOX.Y + BOX.HEIGHT, median);

        this.components.boxes = {
            ...components.boxes,
            q1Box,
            q3Box
        };
        this.components.handlers = {
            ...components.handlers,
            q1Handler,
            q3Handler,
            medianHandler
        };
    }

    attachDragEvents() {
        const { components, question, unitToPx } = this;
        const { lineRange } = components;
        const {
            minHandler,
            maxHandler,
            q1Handler,
            q3Handler,
            medianHandler
        } = components.handlers;
        const {
            q1Box,
            q3Box,
        } = components.boxes;
        const lineMin = unitToPx(question.line_min);
        const lineMax = unitToPx(question.line_max);
        const step = Math.abs((this.unitToPx(1) - this.unitToPx(0)) * (this.question.step || 1));

        this.setupDrag(minHandler, {
            step,
            min: () => lineMin,
            max: () => getShapeX(q1Box) - step,
            onDrag: ({x}) => {
                lineRange.attr('x1', x);
            }
        });

        this.setupDrag(maxHandler, {
            step,
            min: () => getShapeX(q3Box) + getShapeWidth(q3Box) + step,
            max: () => lineMax,
            onDrag: ({x}) => {
                lineRange.attr('x2', x);
            }
        });

        this.setupDrag(q1Handler, {
            step,
            min: () => parseInt(lineRange.attr('x1'), 10) + step,
            max: () => getHandlerX(medianHandler) - step,
            onDrag: ({x}) => {
                const width = getHandlerX(medianHandler) - x;

                q1Box
                    .attr('x', x)
                    .attr('width', width)
                ;
            }
        });

        this.setupDrag(q3Handler, {
            step,
            min: () => getHandlerX(medianHandler) + step,
            max: () => parseInt(lineRange.attr('x2'), 10) - step,
            onDrag: ({x}) => {
                const width = x - getHandlerX(medianHandler);

                q3Box.attr('width', width);
            }
        });

        this.setupDrag(medianHandler, {
            step,
            min: () => getShapeX(q1Box) + step,
            max: () => getShapeX(q3Box) + getShapeWidth(q3Box) - step,
            onDrag: ({x}) => {
                const q1BoxWidth = x - getShapeX(q1Box);
                const q3BoxWidth = getShapeX(q3Box) + getShapeWidth(q3Box) - x;

                q1Box.attr('width', q1BoxWidth);
                q3Box.attr('x', x).attr('width', q3BoxWidth);
            }
        });
    }

    setupDrag(handlerComponent, options = {}) {
        const self = this;
        const { handler, line, text } = handlerComponent;
        const min = options.min;
        const max = options.max;
        const step = options.step;
        const onDragStart = options.onDragStart || noop;
        const onDrag = options.onDrag || noop;
        const onDragEnd = options.onDrag || noop;
        let originalX;

        const dragCallback = drag()
            .on('start', function (event) {
                if (self.disabled) {
                    return;
                }

                originalX = d3.select(this)
                    .raise()
                    .classed(DRAGGING_CLASSNAME, true)
                    .attr('cx')
                ;

                originalX = parseInt(originalX, 10);
                onDragStart({
                    event,
                    x: originalX
                });
                self.clearValidationUI();
            })
            .on('drag', function (event) {
                if (self.disabled) {
                    return;
                }

                const { x } = event;
                const diffX = x - originalX;

                if (Math.abs(diffX) < step) {
                    return;
                }

                let newX = diffX > 0 ? originalX + step : originalX - step;
                const maxVal = max();
                const minVal = min();

                if (newX > maxVal) {
                    newX = maxVal;
                } else if (newX < minVal) {
                    newX = minVal;
                }

                originalX = newX;

                d3.select(this).attr('cx', originalX);
                line.attr('x1', originalX).attr('x2', originalX);
                text.attr('x', originalX).text(round(self.pxToUnit(originalX)));

                onDrag({
                    event,
                    x: originalX
                });
            })
            .on('end', function (event) {
                if (self.disabled) {
                    return;
                }

                d3.select(this).classed(DRAGGING_CLASSNAME, false);
                onDragEnd({
                    event,
                    x: originalX
                });

                self.updateResponse();
            });

        handler.call(dragCallback);
    }

    updateResponse() {
        const { components, pxToUnit } = this;
        const {
            minHandler,
            maxHandler,
            q1Handler,
            q3Handler,
            medianHandler
        } = components.handlers;

        this.response = this.response || {
            type: 'object',
            value: {}
        };

        this.response.value = {
            min: round(pxToUnit(getHandlerX(minHandler))),
            max: round(pxToUnit(getHandlerX(maxHandler))),
            quartile_1: round(pxToUnit(getHandlerX(q1Handler))),
            median: round(pxToUnit(getHandlerX(medianHandler))),
            quartile_3: round(pxToUnit(getHandlerX(q3Handler)))
        };

        this.triggerEvent('onChange', this.response);
    }

    get(key) {
        const { question, response } = this;
        const responseValue = (response && response.value) || {};

        return responseValue[key] || question[key];
    }
}