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
    //console.log('init');
    this.set('displayedValue', this.get('formattedValue'));
  }),

  formattedValue: Ember.computed('displayFormatted', function() { // is always string
    //console.log('!!!! fomattedValue computed property', this.get('displayFormatted'));
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
  //displayedValueObserver: Ember.observer('displayedValue', function() {
  //  console.log('---- displayValueObserver', this.get('displayedValue'));
  //  if (!this.get('displayFormatted') && this.get('displayedValue')) {
  //    this.set('value', parseFloat(this.get('displayedValue')));
  //  }
  //}),

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

  keyPress: function(e) {
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

  focusIn: function() {
    this.set('displayFormatted', false);
  },

  focusOut: function() {
    const value = this.get('value');
    const max = this.get('max');
    const min = this.get('min');

    let setToLimit = false;
    if (max && value > max) {
      this.set('value', max);
      setToLimit = true;
    } else if (min && value < min) {
      this.set('value', min);
      setToLimit = true;
    }

    if (!this.get('displayFormatted') && this.get('displayedValue') && !setToLimit) {
      const newValue = parseFloat(this.get('displayedValue'));
      // TODO: handle number of decimals
      // ? decimals = how many decimals can appear in input box
      // when focusing out, round the number to specified number of decimals
      this.set('value', newValue);
    }

    this.set('displayFormatted', true);
  },

  pressUp: function() {
    const value = this.get('value');
    const step = this.get('step');
    if (this.upperLimitReached(value) || this.upperLimitReached(value + step)) {
      this.set('value', this.get('max'));
      return;
    }
    this.set('value', value+step);
  },

  pressDown: function() {
    const value = this.get('value');
    const step = this.get('step');
    if (this.lowerLimitReached(value) || this.lowerLimitReached(value - step)) {
      this.set('value', this.get('min'));
      return;
    }
    this.set('value', value-step);
  }
});
