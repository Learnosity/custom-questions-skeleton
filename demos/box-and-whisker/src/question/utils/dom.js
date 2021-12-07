import { isEmpty } from 'lodash';
import { PREFIX } from '../constants';

export const getClassName = (classNames) => {
    return classNames
        .split(' ')
        .map((className) => `${PREFIX}${className.trim()}`)
        .join(' ');
};

export const getHandlerX = (handlerComponent) => {
    return parseInt(handlerComponent.handler.attr('cx'), 10);
};

export const getShapeWidth = (shape) => {
    const widthAttr = shape.attr('width');

    if (!isEmpty(widthAttr)) {
        return parseInt(shape.attr('width'), 10);
    }

    return shape.node().getBBox().width;
};

export const getShapeX = (shape) => {
    return parseInt(shape.attr('x'), 10);
};

export const getShapeY = (shape) => {
    return parseInt(shape.attr('y'), 10);
};
