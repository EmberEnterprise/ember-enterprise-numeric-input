import Ember from 'ember';

const {
    Controller,
} = Ember;

export default Controller.extend({
    actions: {
        myAction: function() {
            console.log('**** myAction was triggered!!! *****');
        }
    }
});