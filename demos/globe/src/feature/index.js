import {
    PREFIX,
    EARTH_IMAGE_URL,
    GLOBE_COLORS,
    LINE_ELEVATION,
} from "./constants";
import Globe from "globe.gl";
import * as atlasData from "world-atlas/countries-110m.json";
import * as topojson from "topojson-client";
import { GeoJsonGeometry } from "three-geojson-geometry";
import { geoGraticule10 } from "d3-geo";
import { LineSegments, LineBasicMaterial } from "three";

export default class Feature {
    constructor(init, lrnUtils) {
        this.init = init;
        this.events = init.events;
        this.lrnUtils = lrnUtils;
        this.el = init.$el.get(0);

        this.render().then(() => {
            this.registerPublicMethods();

            if (init.state === "review") {
                /**
                 * below, we call the disable public method on the custom feature to display it in a read-only mode
                 * to learners and/or instructors viewing their completed assessment results (via Reports API or Items API in "review" mode).
                 * (Please see this.registerPublicMethods below for more detials about the .disable() method, including an example implementation)
                 */
                init.getFacade().disable();
            }

            init.events.trigger("ready");
        });
    }

    render() {
        const { el, init } = this;
        const { feature } = init;

        // TODO: Requires implementation
        el.innerHTML = `
            <div class="lrn_feature_wrapper ${PREFIX}"></div>            
        `;

        return Promise.all([]).then(() => {
            // prepare the world atlas data for the globe
            // create the correct geojson data based on whether the
            // feature JSON has show_countries set to true or false
            let geojson = feature.show_countries
                ? topojson.feature(atlasData, atlasData.objects.countries)
                : topojson.feature(atlasData, atlasData.objects.land);

            // create flex column to wrap and center the feature
            const featureWapper = el.querySelector(`.${PREFIX}`);
            const flexColumn = document.createElement("div");
            flexColumn.classList.add("flex-column");

            // create the DOM for the features components:
            // the globe and globe toggle button
            const globeWrapper = document.createElement("div");

            globeWrapper.classList.add("globe-wrapper");

            const globeBtn = document.createElement("button");
            const globeBtnLabel = document.createElement("span");

            globeBtnLabel.classList.add("globe-toggle-btn-label");
            globeBtnLabel.innerText = "Globe";
            globeBtn.appendChild(globeBtnLabel);
            globeBtn.classList.add("globe-toggle-btn");

            // add event listener to toggle globe show/hide with click of button
            globeBtn.addEventListener("click", () => {
                globeWrapper.classList.toggle("hidden");
            });
            // finished builing the DOM for the custom feature
            featureWapper.appendChild(flexColumn);
            flexColumn.appendChild(globeBtn);
            flexColumn.appendChild(globeWrapper);

            /**
             * Render the globe based on the settings provided in the feature JSON
             */
            const globe = Globe({
                rendererConfig: { antialias: false, alpha: false },
                animateIn: false,
            });
            globe(globeWrapper)
                .height("900")
                .width("900")
                .backgroundColor(GLOBE_COLORS.background_color)
                .globeImageUrl(EARTH_IMAGE_URL)
                .polygonsData(geojson.features)
                .polygonAltitude(0.005)
                .polygonCapColor(() => {
                    return feature.land_texture
                        ? GLOBE_COLORS.land_texture
                        : GLOBE_COLORS.land_shade;
                })
                .polygonStrokeColor(() => GLOBE_COLORS.polygon_stroke_color)
                .polygonSideColor(() => {
                    return feature.show_countries
                        ? GLOBE_COLORS.polygon_side_color
                        : GLOBE_COLORS.land_texture;
                });

            // if show_countries is true, then label each coutry by name with a tooltip
            // hand show colored borders for the polygons
            if (feature.show_countries) {
                globe.polygonLabel(
                    ({ properties: country }) => `
                <span class="country-tooltip">
                    <b>${country.name}</b>
                </span>
                `
                );
            }

            // show_lines is true, then add the Lat and Long lines to the globe internal THREE.js
            // scene instance
            if (feature.show_lines) {
                const latLongLines = new LineSegments(
                    new GeoJsonGeometry(geoGraticule10(), LINE_ELEVATION, 5),
                    new LineBasicMaterial({
                        color: GLOBE_COLORS.lat_long_lines,
                        transparent: false,
                        opacity: 1,
                    })
                );
                globe.scene().children.push(latLongLines);
            }
        });
    }

    /**
     * Add public methods to the created feature instance that is accessible during runtime
     *
     * Example: questionsApp.feature('my-custom-feature-feature-id').myNewMethod();
     *
     */
    registerPublicMethods() {
        const { init } = this;
        // Attach the methods you want on this object
        const facade = init.getFacade();

        facade.disable = () => {
            // TODO: Requires implementation
            /**
             * The purpose of this method is to prevent learner interaction with your question's UI.
             *
             * If you plan to display your custom feature in "review" state, then you may want to implement this
             * method to prevent a learner or instructor who is reviewing their completed results from being able to interact with the feature UI.
             */
            // EXAMPLE implementation
            // document.getElementById('my-feature').setAttribute('disabled', true)
        };
        facade.enable = () => {
            /**
             * The purpose of this method is to re-enable learner interaction with your feature's UI
             * after it has been previously disabled.
             *
             * (For example, you plan to temporarily disable the feature UI for a student taking the assessment until they complete another task like spend a set time reading the instructions.)
             */
            // EXAMPLE implementation
            // document.getElementById('my-feature').removeAttribute('disabled')
        };
    }
}
