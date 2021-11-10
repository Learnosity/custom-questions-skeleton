import BoxAndWhiskerQuestion from './views';
import '../scss/main.scss';

/*global LearnosityAmd*/
LearnosityAmd.define([], function () {
    return {
        Question: BoxAndWhiskerQuestion
    };
});
