import BoxAndWhisker from './boxAndWhisker';

export default class BoxAndWhiskerQuestion {
    constructor(init, lrnUtils) {
        const { state } = init;

        this.init = init;
        this.events = init.events;
        this.el = init.$el.get(0);

        this.render();

        init.events.trigger('ready');
    }

    render() {
        const { el, init } = this;
        const { question, response } = init;

        el.innerHTML = '<div><svg class="lrn-board"></svg></div>';

        this.bnw = new BoxAndWhisker(el.querySelector('.lrn-board'), question, response);

        this.bnw.render(question, response);
    }
}
