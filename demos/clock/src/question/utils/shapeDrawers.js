import * as d3 from "d3";
import { CLOCK_CENTER } from "../constants";
import { getPointOnCircle } from "./pointFinders";

/**
 * CLOCK_CENTER is the default value
 * for cx,cy in a circle, and x1, y1 in a hand
 * (the place from which circles will originate
 * and to which the clock hands will be anchored)
 */

export const drawCircle = (parent, r, classname) => {
    return d3
        .select(parent)
        .append("circle")
        .attr("cx", CLOCK_CENTER)
        .attr("cy", CLOCK_CENTER)
        .attr("r", r)
        .attr("class", classname);
};

export const drawTick = (parent, x1, y1, x2, y2, classname) => {
    return d3
        .select(parent)
        .append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("class", classname);
};

export const drawArrow = (parent, response_id) => {
    return d3
        .select(parent)
        .append("defs")
        .append("marker")
        .attr("id", `arrow-${response_id}`)
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 2.5)
        .attr("refY", 2.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("fill", "#777")
        .attr("d", "M 0 0 L 5 2.5 L 0 5 z");
};

export const drawHand = (parent, radius, angle, classname, response_id) => {
    return (
        d3
            .select(parent)
            .append("line")
            .data([
                {
                    radius
                },
            ])
            .attr("x1", CLOCK_CENTER)
            .attr("y1", CLOCK_CENTER)
            .attr("x2", (d) => getPointOnCircle(d.radius, angle).x)
            .attr("y2", (d) => getPointOnCircle(d.radius, angle).y)
            .attr("class", classname)
            // add the arrow defined by drawArrow()
            .attr("marker-end", `url(#arrow-${response_id})`)
    );
};

export const updateHand = (hand, angle) => {
    return hand
        .attr("x2", (d) => getPointOnCircle(d.radius, angle).x)
        .attr("y2", (d) => getPointOnCircle(d.radius, angle).y)
        .attr("data-angle", angle);
};

export const drawText = (parent, x, y, text, classname) => {
    return d3
        .select(parent)
        .append("text")
        .attr("x", x)
        .attr("y", y)
        .text(text)
        .attr("class", classname);
};
