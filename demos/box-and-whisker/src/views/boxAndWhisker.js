import * as d3 from 'd3';
import { range } from 'lodash';

const PADDING = 10;
const isEvenNumber = (number) => number % 2 === 0;

export default class BoxAndWhisker {
    constructor(svgBoard, question, response) {
        this.board = svgBoard;
        this.question = question;
        this.response = response;
    }

    render() {
        this.drawAxes();
    }

    drawAxes() {
        const { question } = this;
        const min = question.line_min;
        const max = question.line_max;
        const width = question.width;
        const svg = d3.select(this.board);
        const createArrowDef = (arrowId, arrowPoints) => {
            svg
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
        const x = d3
            .scaleLinear()
            // Make sure the first & last numbers of the line are Odd number
            .domain([isEvenNumber(min) ? min - 1 : min, isEvenNumber(max) ? max + 1 : max])
            .range([PADDING, width - PADDING]);
        const xAxis = d3
            .axisBottom(x)
            .tickPadding(PADDING)
            .tickSizeOuter(0);

        svg
            .attr('width', width)
            .append('defs');

        createArrowDef('arrowhead-left', '10 0, 10 7, 0 3.5');
        createArrowDef('arrowhead-right', '0 0, 10 3.5, 0 7');

        svg
            .append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,50)')      // This controls the vertical position of the Axis
            .call(xAxis);

        svg.select('.axis path.domain')
            .attr('marker-end', 'url(#arrowhead-right)')
            .attr('marker-start', 'url(#arrowhead-left)')
        ;
    }

    drawRangeLines() {
        const { question, helpers } = this;
        const svg = d3.select(this.board);
        const [minRange, maxRange] = question.range;
        const minRangeX = helpers.unitToX(minRange);

        svg.append('line')
            .attr('class', 'rangeLine')
            .attr('x1', minRangeX)
            .attr('y1', 10)
            .attr('x2', minRangeX)
            .attr('y2', 100)
    }

    helpers = {
        minLine: () => {
            const min = this.question.line_min;

            return isEvenNumber(min) ? min - 1 : min;
        },
        maxLine: () => {
            const max = this.question.line_max;

            return isEvenNumber(max) ? max + 1 : max;
        },
        startX: () => PADDING,
        endX: () => this.question.width - PADDING,
        xPerUnit: () => {
            const { helpers } = this;

            return (helpers.endX() - helpers.startX()) / (helpers.maxLine() - helpers.minLine());
        },
        xToUnit: (xVal) => {
            const { question, helpers } = this;

            return Math.round((xVal - PADDING) / helpers.xPerUnit() / question.step) * question.step + helpers.minLine();
        },

        unitToX: (uVal) => {
            const { helpers } = this;

            return Math.round((uVal - helpers.minLine()) * helpers.xPerUnit() + helpers.startX());
        },
    };
}