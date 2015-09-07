var React = require('react');
var Slider = require("bootstrap-slider");

var TimeoutControl = React.createClass({
  getDefaultProps: function() {
    return {
      name: 'Timeout',
      id: '',
      sliderOptions: {
        min: 100,
        max: 1000,
        ticks: [100, 1000],
        ticks_labels: ['100ms', '1s'],
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
        <h3>{this.props.name} <small>100ms-10s</small></h3>
        <hr/>
        <input id={this.props.id} type="text"/>
      </div>
    );
  }
});

module.exports = TimeoutControl;