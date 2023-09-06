import { PREFIX } from './constants';

export default class Feature {
    constructor(init, lrnUtils) {
        this.init = init;
        this.events = init.events;
        this.lrnUtils = lrnUtils;
        this.el = init.$el.get(0);

        this.render().then(() => {
            this.registerPublicMethods();
        
            if (init.state === 'review') {
        
                /**
                 * below, we call the disable public method on the custom feature to display it in a read-only mode
                 * to learners and/or instructors viewing their completed assessment results (via Reports API or Items API in "review" mode).
                 * (Please see this.registerPublicMethods below for more detials about the .disable() method, including an example implementation)
                 */
                init.getFacade().disable();
            }
        
            init.events.trigger('ready');
        });        
    }

    render() {
        const { el, init } = this;
        const { feature } = init;

        // TODO: Requires implementation
        el.innerHTML = `
                <div class="lrn_feature_wrapper ${PREFIX}">
                    Requires implementation - YOUR CONTENT GOES IN HERE
                    This element is the hook into which your custom feature's UI should be rendered.
                </div>            
        `;

        return Promise.all([]).then(() => {
              // TODO - Requires implementation
            /**  The logic to render the UI of your custom question should go here. 
             * 
             * For example this might be a call to a function or instantiation of a class to render your UI component(s).
             * 
             * 
             */ 

            /** Example implementation below that renders a simple decorative text display
             *  - you may replace the following lines below with your own code */
            
                // create a simple h1
                const myFeatureHeading = document.createElement('h1')
                myFeatureHeading.classList.add('my-custom-feature-heading')
                // add the text given for our custom feature JSON's example_custom_property in feature.json
                myFeatureHeading.innerHTML = feature.example_custom_property;
                // append the h1 to the custom feature wrapper hook element
                el.querySelector('.lrn_feature_wrapper').appendChild(myFeatureHeading)
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
