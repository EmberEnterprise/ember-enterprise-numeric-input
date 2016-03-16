import {
    moduleForComponent,
    test
} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('e-numeric-input', {
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
    integration: true,
});

function imitateClick(button, component) {
    button.focus();
    button.click();
    component.blur();
}

// TODO: check why fillIn does not work! --> then some tests can be 'merged'
// TODO: check why tests are failing if test window is not in focus when running them

test('test up-down for simple input without restrictions', function(assert) {
    this.render(hbs`{{e-numeric-input value=5 }}`);

    const inputElement = this.$('input');
    const upButton = this.$('.e-numeric-up');
    const downButton = this.$('.e-numeric-down');
    const component = this.$('span');

    assert.equal(inputElement.val(), '5', 'given value is displayed in input');

    imitateClick(upButton, component);
    assert.equal(inputElement.val(), '6', 'value is correct after first increment');

    imitateClick(upButton, component);
    assert.equal(inputElement.val(), '7', 'value is correct after second increment');

    imitateClick(downButton, component);
    assert.equal(inputElement.val(), '6', 'value is correct after first decrement');
});

test('test down for simple input with min value restriction', function(assert) {
    this.render(hbs`{{e-numeric-input min=0 value=2 }}`);

    const inputElement = this.$('input');
    const downButton = this.$('.e-numeric-down');
    const component = this.$('span');

    imitateClick(downButton, component);
    assert.equal(inputElement.val(), '1', 'value is correct after first decrement');

    imitateClick(downButton, component);
    assert.equal(inputElement.val(), '0', 'value is correct after second decrement');

    imitateClick(downButton, component);
    assert.equal(inputElement.val(), '0', 'value hit min and did not change');
});

test('test up for simple input with max value restriction', function(assert) {
    this.render(hbs`{{e-numeric-input max=100 value=98 }}`);

    const inputElement = this.$('input');
    const upButton = this.$('.e-numeric-up');
    const component = this.$('span');

    imitateClick(upButton, component);
    assert.equal(inputElement.val(), '99', 'value is correct after first increment');

    imitateClick(upButton, component);
    assert.equal(inputElement.val(), '100', 'value is correct after second increment');

    imitateClick(upButton, component);
    assert.equal(inputElement.val(), '100', 'value hit max and did not change');
});

test('test if input value hits min', function(assert) {
    this.render(hbs`{{e-numeric-input min=0 step=3 value=5 }}`);

    const inputElement = this.$('input');
    const downButton = this.$('.e-numeric-down');
    const component = this.$('span');

    imitateClick(downButton, component);
    assert.equal(inputElement.val(), '2', 'value is correct after first decrement');

    imitateClick(downButton, component);
    assert.equal(inputElement.val(), '0', 'value hit min');

    imitateClick(downButton, component);
    assert.equal(inputElement.val(), '0', 'value still is min and did not change');
});

test('test if input value hits max', function(assert) {
    this.render(hbs`{{e-numeric-input max=100 step=3 value=95 }}`);

    const inputElement = this.$('input');
    const upButton = this.$('.e-numeric-up');
    const component = this.$('span');

    imitateClick(upButton, component);
    assert.equal(inputElement.val(), '98', 'value is correct after first increment');

    imitateClick(upButton, component);
    assert.equal(inputElement.val(), '100', 'value hit max');

    imitateClick(upButton, component);
    assert.equal(inputElement.val(), '100', 'value still is max and did not change');
});

test('test up-down for currency input with restrictions', function(assert) {
    this.render(hbs`{{e-numeric-input format="currency" max=6 min=4 value=5 }}`);

    const inputElement = this.$('input');
    const upButton = this.$('.e-numeric-up');
    const downButton = this.$('.e-numeric-down');
    const component = this.$('span');

    assert.equal(inputElement.val(), '$5', 'given value is displayed in input');

    imitateClick(upButton, component);
    assert.equal(inputElement.val(), '$6', 'value is correct after first increment');

    imitateClick(upButton, component);
    assert.equal(inputElement.val(), '$6', 'value is still max after third increment');

    imitateClick(downButton, component);
    assert.equal(inputElement.val(), '$5', 'value is correct after first decrement');

    imitateClick(downButton, component);
    assert.equal(inputElement.val(), '$4', 'value is correct after second decrement');

    imitateClick(downButton, component);
    assert.equal(inputElement.val(), '$4', 'value is still min after third decrement');
});