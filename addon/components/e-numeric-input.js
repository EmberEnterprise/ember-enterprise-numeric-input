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
      if (this.get('value') !== null) {
        this.set('displayedValue', this.get('value').toFixed(this.get('decimals')));
      } else {
        this.set('displayedValue', "");
      }
    }
  }),
  setInitialDisplayValue: Ember.on('init', function() {
    this.set('displayedValue', this.get('formattedValue'));
  }),

  formattedValue: Ember.computed('displayFormatted', function() { // is always string
    const value = this.get('value');
    const decimals = this.get('decimals');
    if (this.get('displayFormatted') && value !== null) {
      const format = this.get('format');
      let valueString;
      if (!format) {
        return value.toFixed(decimals);

      } else if (format === 'currency') {
        valueString = this.get('currencyUnit') + value.toFixed(decimals);
        return valueString;

      } else if (format === 'percentage') {
        valueString = value.toFixed(decimals) + ' %';
        return valueString;

      } else if (format === 'custom') {
        valueString = value.toFixed(decimals) + ' ' + this.get('customFormatUnit');
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

  upperLimitReached: function(value) {
    const max = this.get('max');
    if (max !== null) {
      return (value > max);
    }
    return false;
  },

  lowerLimitReached: function(value) {
    const min = this.get('min');
    if (min !== null) {
      return (value < min);
    }
    return false;
  },

  getFloatValueFromDisplay() {
    const format = this.get('format');
    const displayedValue = this.get('displayedValue');
    let possibleFloat = parseFloat(displayedValue);
    if (!isNaN(possibleFloat)) {
      return possibleFloat;
    }

    if (format === 'currency') {
      possibleFloat = displayedValue.substring(this.get('currencyUnit').length);
    } else if (format === 'percentage') {
      possibleFloat = displayedValue.substring(0, displayedValue.length - 2);
    } else if (format === 'custom') {
      possibleFloat = displayedValue.substring(0, displayedValue.length - 1 - this.get('customFormatUnit').length);
    }
    return parseFloat(possibleFloat);
  },

  keyPress: function(e) {
    this.set('displayFormatted', false);
    const character = String.fromCharCode(e.which);
    const inputElement = e.target;
    const selectionStart = inputElement.selectionStart;
    const selectionEnd = inputElement.selectionEnd;

    const value = this.get('displayedValue');
    const min = this.get('min');
    const possibleValue = value.toString().substring(0, selectionStart) + character + value.toString().substring(selectionEnd);

    const re = new RegExp(this.get('floatRegExp'));
    const isValid = re.test(possibleValue);

    if (!isValid || (min !== null && min >= 0 && character === '-')) {
      e.preventDefault();
    }
  },

  focusIn: function() {
    this.set('displayFormatted', false);
  },

  focusOut: function() {
    if (this.get('displayedValue') !== "") { // trebuie lasata si verificarea lui displayFormatted ??
      let newValue = this.getFloatValueFromDisplay();

      const max = this.get('max');
      const min = this.get('min');

      if (max !== null && newValue > max) {
        newValue = max;
      } else if (min != null && newValue < min) {
        newValue = min;
      }
      this.set('value', newValue);
    } else {
      this.set('value', null);
    }

    this.set('displayFormatted', true);
  },

  pressUp: function() {
    this.set('displayFormatted', false);
    const value = this.get('value');
    const step = this.get('step');
    if (this.upperLimitReached(value) || this.upperLimitReached(value + step)) {
      this.set('value', this.get('max'));
    } else {
      this.set('value', value + step);
    }
  },

  pressDown: function() {
    this.set('displayFormatted', false);
    const value = this.get('value');
    const step = this.get('step');
    if (this.lowerLimitReached(value) || this.lowerLimitReached(value - step)) {
      this.set('value', this.get('min'));
    } else {
      this.set('value', value-step);
    }
  }
});
