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

test('test up-down for simple input without restrictions', function(assert) {
    this.render(hbs`{{e-numeric-input value=5 }}`);

    assert.equal(this.$('input').val(), '5', 'given value is displayed in input');

    this.$('.e-numeric-up').click();
    assert.equal(this.$('input').val(), '6', 'value is correct after first increment');

    this.$('.e-numeric-up').click();
    assert.equal(this.$('input').val(), '7', 'value is correct after second increment');

    this.$('.e-numeric-down').click();
    assert.equal(this.$('input').val(), '6', 'value is correct after first decrement');
});

test('test down for simple input with min value restriction', function(assert) {
    this.render(hbs`{{e-numeric-input min=0 value=2 }}`);

    this.$('.e-numeric-down').click();
    assert.equal(this.$('input').val(), '1', 'value is correct after first decrement');

    this.$('.e-numeric-down').click();
    assert.equal(this.$('input').val(), '0', 'value is correct after second decrement');

    this.$('.e-numeric-down').click();
    assert.equal(this.$('input').val(), '0', 'value hit min and did not change');
});

test('test up for simple input with max value restriction', function(assert) {
    this.render(hbs`{{e-numeric-input max=100 value=98 }}`);

    this.$('.e-numeric-up').click();
    assert.equal(this.$('input').val(), '99', 'value is correct after first increment');

    this.$('.e-numeric-up').click();
    assert.equal(this.$('input').val(), '100', 'value is correct after second increment');

    this.$('.e-numeric-up').click();
    assert.equal(this.$('input').val(), '100', 'value hit max and did not change');
});

test('test if input value hits min', function(assert) {
    this.render(hbs`{{e-numeric-input min=0 step=3 value=5 }}`);

    this.$('.e-numeric-down').click();
    assert.equal(this.$('input').val(), '2', 'value is correct after first decrement');

    this.$('.e-numeric-down').click();
    assert.equal(this.$('input').val(), '0', 'value hit min');

    this.$('.e-numeric-down').click();
    assert.equal(this.$('input').val(), '0', 'value still is min and did not change');
});

test('test if input value hits max', function(assert) {
    this.render(hbs`{{e-numeric-input max=100 step=3 value=95 }}`);

    this.$('.e-numeric-up').click();
    assert.equal(this.$('input').val(), '98', 'value is correct after first increment');

    this.$('.e-numeric-up').click();
    assert.equal(this.$('input').val(), '100', 'value hit max');

    this.$('.e-numeric-up').click();
    assert.equal(this.$('input').val(), '0', 'value still is max and did not change');
});