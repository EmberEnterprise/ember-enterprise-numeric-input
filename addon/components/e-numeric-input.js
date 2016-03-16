import Ember from 'ember';
import layout from '../templates/components/e-numeric-input';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'span',
  classNames: ['e-numeric-input'],
  classNameBindings: ['disabled'],
  attributeBindings: [
    'disabled',
    'placeholder',
  ],

  max: null,
  min: null,
  decimals: 0,
  step: 1,

  displayFormatted: true,
  displayedValue: null,
  switchDisplayedValue: Ember.observer('formattedValue', 'value', function() {
    console.log('formattedValue:', this.get('formattedValue'), 'value', this.get('value'));
    if (this.get('displayFormatted')) {
      this.set('displayedValue', this.get('formattedValue'));
    } else {
      this.set('displayedValue', this.get('value').toString());
    }
  }),
  setInitialDisplayValue: Ember.on('init', function() {
    this.set('displayedValue', this.get('formattedValue'));
  }),

  formattedValue: Ember.computed('displayFormatted', function() { // is always string
    if (this.get('displayFormatted')) {
      const value = this.get('value');
      const format = this.get('format');
      let valueString;
      if (!format) {
        return value.toString();

      } else if (format === 'currency') {
        valueString = this.get('currencyUnit') + value.toString();
        return valueString;

      } else if (format === 'percentage') {
        valueString = value.toString() + ' %';
        return valueString;

      } else if (format === 'custom') {
        valueString = value.toString() + ' ' + this.get('customFormatUnit');
        return valueString;
      }
    }
  }),

  format: null, // options: currency, percentage, custom
  currencyUnit: '$', // user can change to pound/euro/etc
  customFormatUnit: null, // can be anything: kg, l, cm

  floatRegExp: /^(-)?(((\d+(\.\d*)?)|(\.\d*)))?$/,

  disabled: false,

  value: null, // the actual float value
  displayedValueObserver: Ember.observer('displayedValue', function() {
    if (!this.get('displayFormatted') && this.get('displayedValue')) {
      this.set('value', parseFloat(this.get('displayedValue')));
    }
  }),

  upperLimitReached: function(value) {
    const max = this.get('max');
    if (max) {
      return (value > max);
    }
    return false;
  },

  lowerLimitReached: function(value) {
    const min = this.get('min');
    if (min) {
      return (value < min);
    }
    return false;
  },

  keyPress: function(e) {
    const character = String.fromCharCode(e.which);
    const inputElement = Ember.$('input').get(0);
    const selectionStart = inputElement.selectionStart;
    const selectionEnd = inputElement.selectionEnd;

    const value = this.get('displayedValue');
    const min = this.get('min');
    const possibleValue = value.toString().substring(0, selectionStart) + character + value.toString().substring(selectionEnd);

    const re = new RegExp(this.get('floatRegExp'));
    const isValid = re.test(possibleValue);

    if (!isValid || (min !== null && min >= 0 && value.toString().charAt(0) === '-')) {
      e.preventDefault();
    }
  },

  floatToFormattedString: function() {
    const value = this.get('value');
    const format = this.get('format');
    let valueString;
    if (!format) {
      this.set('formattedValue', value.toString());

    } else if (format === 'currency') {
      valueString = this.get('currencyUnit') + value.toString();
      this.set('formattedValue', valueString);

    } else if (format === 'percentage') {
      valueString = value.toString() + ' %';
      this.set('formattedValue', valueString);

    } else if (format === 'custom') {
      valueString = value.toString() + ' ' + this.get('customFormatUnit');
      this.set('formattedValue', valueString);
    }
  },

  formattedStringToFloat: function() {
    //const format = this.get('format');
    //const value = this.get('value');
    //let valueString;
    //if (!format) {
    //  this.set('value', parseFloat(value));
    //} else if (format === 'currency') {
    //  const currencyUnit = this.get('currencyUnit');
    //  valueString = value.slice(currencyUnit.length);
    //  this.set('value', parseFloat(valueString));
    //
    //} else if (format === 'percentage') {
    //  valueString = value.substring(0, value.length-2);
    //  this.set('value', parseFloat(valueString));
    //
    //} else if (format === 'custom') {
    //  const customFormatUnit = this.get('customFormatUnit');
    //  valueString = value.substring(0, value.length-1-customFormatUnit.length);
    //  this.set('value', parseFloat(valueString));
    //}
  },

  didInsertElement: function() {
    //const format = this.get('format');
    //const value = this.get('value');
    //if (format === 'currency') {
    //  this.set('value', this.get('currencyUnit') + value);
    //
    //} else if (format === 'percentage') {
    //  this.set('value', value + ' %');
    //
    //} else if (format === 'custom') {
    //  this.set('value', value + ' ' + this.get('customFormatUnit'));
    //}

    //this.floatToFormattedString();
  },

  focusIn: function() {
    //this.formattedStringToFloat();

    this.set('displayFormatted', false);
  },

  focusOut: function() {
    //const value = parseFloat(this.get('value'));
    const value = this.get('value');
    const max = this.get('max');
    const min = this.get('min');
    if (max && value > max) {
      this.set('value', max);
    } else if (min && value < min) {
      this.set('value', min);
    }

    //this.set('value', value.toString());
    //this.floatToFormattedString();
    this.set('displayFormatted', true);
    console.log('focus OUT  ', this.get('value'), '  ', this.get('displayFormatted'), '  ', this.get('displayedValue'));
  },

  pressUp: function() {
    const value = this.get('value');
    const step = this.get('step');
    if (this.upperLimitReached(value) || this.upperLimitReached(value + step)) {
      return;
    }
    this.set('value', value+step);
  },

  pressDown: function() {
    const value = this.get('value');
    //const step = parseFloat(this.get('step'));
    const step = this.get('step');
    if (this.lowerLimitReached(value) || this.lowerLimitReached(value - step)) {
      return;
    }
    this.set('value', value-step);
  }
});
