var React = require('react');
var Slider = require("bootstrap-slider");

var Motor = React.createClass({
  getDefaultProps: function() {
    return {
      name: 'Motor',
      id: 'motor',
      sliderOptions: {
        min: 0,
        max: 255,
        value: 100,
        ticks: [0, 255],
        ticks_labels: ['0', '255'],
      }
    };
  },
  refreshSlider:function(){
    this.sliderVal = this.slider.getValue();
    this.slider.refresh();
    this.slider.setValue(this.sliderVal);
  },
  componentDidMount: function() {
    this.slider = new Slider('#' + this.props.id, this.props.sliderOptions);
    $(window).on('resize', this.refreshSlider);
  },
  componentWillUnmount: function() {
    this.slider.destroy();
    $(window).off('resize', this.refreshSlider);
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