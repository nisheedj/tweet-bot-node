var React = require('react');
var Slider = require("bootstrap-slider");

var TimeoutControl = React.createClass({
  getDefaultProps: function() {
    return {
      name: 'Timeout',
      id: '',
      sliderOptions: {
        min: 100,
        max: 10000,
        value: 1000,
        ticks: [100, 5000, 10000],
        ticks_labels: ['100ms', '5s', '10s'],
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
        <h3>{this.props.name} <small>100ms-10s</small></h3>
        <hr/>
        <input id={this.props.id} type="text"/>
      </div>
    );
  }
});

module.exports = TimeoutControl;