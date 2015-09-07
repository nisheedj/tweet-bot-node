var React = require('react');
var Slider = require("bootstrap-slider");
var _ = require('underscore');

var Motor = React.createClass({
  getDefaultProps: function() {
    return {
      name: 'Motor',
      id: 'motor',
      sliderOptions: {
        min: 0,
        max: 255,
        ticks: [0, 255],
        ticks_labels: ['0', '255'],
      },
      isDisabled: false,
      value:100
    };
  },
  toggleDisabled:function(){
    if (this.props.isDisabled) {
      this.slider.disable();
    } else {
      this.slider.enable();
    }
  },
  refreshSlider:function(){
    this.sliderVal = this.slider.getValue();
    this.slider.refresh();
    this.slider.setValue(this.sliderVal);
    this.toggleDisabled();
  },
  componentDidMount: function() {
    this.slider = new Slider('#' + this.props.id, this.props.sliderOptions);
    this.slider.setValue(this.props.value);
    $(window).on('resize', this.refreshSlider);
  },
  componentWillUnmount: function() {
    this.slider.destroy();
    $(window).off('resize', this.refreshSlider);
  },
  componentDidUpdate: function(prevProps, prevState) {
    this.toggleDisabled();
  },
  render: function() {
    return (
      <div className="col-md-12">
        <h3>{this.props.name} <small>0-255</small></h3>
        <hr/>
        <input id={this.props.id} type="text"/>
      </div>
    );
  }

});

module.exports = Motor;