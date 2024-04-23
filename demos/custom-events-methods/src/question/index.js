import { PREFIX } from './constants';

export default class Question {
    constructor(init, lrnUtils) {
        this.init = init;
        this.events = init.events;
        this.lrnUtils = lrnUtils;
        this.el = init.$el.get(0);

        this.render();
        this.registerPublicMethods();
        this.handleEvents();

        init.events.trigger('ready');
    }

    render() {
        const { el } = this;

        el.innerHTML = `
            <div class="${PREFIX} lrn-response-validation-wrapper">
                <div class="lrn_response_input">
                    <input style="width:100%; margin-bottom: 10px;"/>
                    <button data-component="custom:event">Dispatch <code>custom:event</code> which will be captured by hostpage</button>
                    <button data-component="custom:method">Dispatch custom public method <code>alertMessage("Hello")</code></button>
                </div>            
            </div>
        `;
    }

    /**
     * Add public methods to the created question instance that is accessible during runtime
     *
     */
    registerPublicMethods() {
        const { init } = this;
        const { events } = init;
        // Attach the methods you want on this object
        const facade = init.getFacade();

        /**
         * Display a custom alert popup with provided message
         * @param message
         */
        facade.alertMessage = (message) => {
            alert(message);

            // Dispatch a custom event to demonstrate the usage of custom events
            facade.customEvents.trigger('alertMessage:dispatched', { message });
        };

        /**
         * A custom pub/sub events object
         * @type {{once, trigger: *, off, on}}
         */
        facade.customEvents = {
            once: events.once,
            on: events.on,
            off: events.off,
            trigger: events.trigger,
        };
    }

    handleEvents() {
        const { init, el } = this;
        const facade = init.getFacade();

        // Dispatch a custom event
        el.querySelector('button[data-component="custom:event"]').addEventListener('click', () => {
            facade.customEvents.trigger('custom:event', { message: 'Custom event dispatched' });
            el.querySelector('input').value = '"custom:event" event has been triggered by custom question and subscribed by the main hostpage. Check the console for event details and assessment.php for the implementation.';
        });

        // Dispatch a custom public method
        el.querySelector('button[data-component="custom:method"]').addEventListener('click', () => {
            facade.alertMessage('Hello');
        });

        // Listening to the custom event when alertMessage public method is called
        facade.customEvents.on('alertMessage:dispatched', (data) => {
            console.log('Listen to custom event "alertMessage:dispatched":', data);

            el.querySelector('input').value = `Custom "alertMessage:dispatched" dispatched with message: ${data.message} and subscribed by the current custom question instance`;
        });
    }
}
