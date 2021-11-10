import { each } from 'lodash';
import { AXIS_Y, HANDLER, MARGIN, STATES, ICONS } from '../constants';
import { getClassName, getShapeWidth, getShapeX } from './dom';
import * as d3 from 'd3';

const isEvenNumber = (number) => number % 2 === 0;

export const drawDomainAxis = (parentElement, width, min, max) => {
    const getWidth = () => {
        const width = width || 600;

        return width - MARGIN.LEFT - MARGIN.RIGHT;
    };
    const minLine = () => {
        return isEvenNumber(min) ? min - 1 : min;
    };
    const maxLine = () => {
        return isEvenNumber(max) ? max + 1 : max;
    };
    const createArrowDef = (arrowId, arrowPoints) => {
        parentElement
            .select('defs')
            .append('marker')
            .attr('id', arrowId)
            .attr('refX', 10)
            .attr('refY', 3.5)
            .attr('markerWidth', 10)
            .attr('markerHeight', 7)
            .append('polygon')
            .attr('points', arrowPoints)
            .attr('fill', 'black');
    };

    const scaleX = d3
        .scaleLinear()
        // Make sure the first & last numbers of the line are Odd number
        .domain([minLine(), maxLine()])
        .range([MARGIN.LEFT, getWidth()]);

    createArrowDef('arrowhead-left', '10 0, 10 7, 0 3.5');
    createArrowDef('arrowhead-right', '0 0, 10 3.5, 0 7');

    const xAxis = parentElement
        .append('g')
        .attr('class', getClassName('axis'))
        .attr('transform', `translate(0,${AXIS_Y})`)      // This controls the vertical position of the Axis
        .call(d3.axisBottom(scaleX).tickSizeOuter(0));

    xAxis.select('path.domain')
        .attr('marker-end', 'url(#arrowhead-right)')
        .attr('marker-start', 'url(#arrowhead-left)')
    ;
    
    return scaleX;
} 

export const drawLine = (parent, x1, y1, x2, y2) => {
    return parent.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', 'currentColor')
        ;
};

export const drawRect = (parent, x, y, width, height) => {
    return parent.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', width)
        .attr('height', height)
    ;
};

export const drawText = (parent, x, y, text) => {
    return parent.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .text(text);
};

export const drawHandler = (parent, x1, y1, x2, y2, textContent) => {
    const { RADIUS, ICON_HEIGHT, TEXT_GAP } = HANDLER;
    const line = drawLine(parent, x1, y1, x2, y2)
        .attr('class', getClassName('handler-line'));
    const text = drawText(parent, x1, y1 - TEXT_GAP, textContent)
        .attr('class', getClassName('handler-text'));
    const handler = parent.append('circle')
        .attr('cx', x1)
        .attr('cy', y2 - y1 + MARGIN.TOP)
        .attr('r', RADIUS)
        .attr('class', getClassName('handler-point'))
        ;

    return {
        line,
        text,
        handler,
        setState(state) {
            const iconClassName = getClassName('validation-icon');
            const classNames = {
                [getClassName('correct')]: state === STATES.CORRECT,
                [getClassName('incorrect')]: state === STATES.INCORRECT
            };
            const shouldShowValidationUI = [STATES.CORRECT, STATES.INCORRECT].includes(state);
            let icon;

            if (shouldShowValidationUI) {
                const x = getShapeX(text) + Math.round(getShapeWidth(text) / 2);
                const y = MARGIN.TOP - ICON_HEIGHT;

                icon = parent
                    .append('path')
                    .attr('d', ICONS[state])
                    .attr('class', iconClassName)
                    .attr('transform', `translate(${x}, ${y})`);
            }

            each(classNames, (value, className) => {
                line.classed(className, value);
                text.classed(className, value);
                handler.classed(className, value);

                if (icon) {
                    icon.classed(className, value);
                }
            });

            // clear state
            if (!shouldShowValidationUI) {
                parent.select(`.${iconClassName}`).remove();
            }
        }
    };
};
