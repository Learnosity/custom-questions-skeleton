/**
 * When creating a Learnosity Custom Question, it’s important to prefix the CSS class names being used inside
 * your custom Question UI.
 * You should avoid using a generic class name like `.btn`.
 * Instead, you should add a prefix to it like `.company-name-my-custom-question-btn`
 * to avoid CSS conflict with the host page and the CSS used by the Learnosity API.
 */
export const PREFIX = "lrn-custom-globe-feature";
export const EARTH_IMAGE_URL = "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-day.jpg";

export const GLOBE_COLORS = {
    land_texture: "rgba(0,0,0,0)",
    land_shade: "rgba(255, 217, 90, 0.9)",
    polygon_side_color: "rgb(255, 217, 125, 0.01)",
    polygon_stroke_color: "rgba(0,0,0,0.8)",
    background_color: "#000",
    lat_long_lines: "#FFF"
};

// elevation to position the lat and long
// lines (if chosen by globe author)
// to maker them appear clearly
export const LINE_ELEVATION = 102;
