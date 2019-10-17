'use strict';
import React from 'react'
import ReactDom from 'react-dom'
import 'rc-slider/assets/index.css'
import Slider from 'rc-slider'
const { Handle } = Slider

export default class Setting extends React.Component {
    render() {
        const display = this.props.value.toLocaleString()
        return <div>
            <h3> {this.props.title} </h3>
            <p> {this.props.desc} </p>
            <div style={{textAlign: 'center'}}>
                { display }
                <Slider
                    min={this.props.min}
                    max={this.props.max}
                    value={this.props.value}
                    step={this.props.step}
                    onChange={ this.props.onChange }
                    handle={ props => <Handle {...props}/> }
                />
            </div>

        </div>
    }
}

Setting.defaultProps = {
    min: 0,
    max: 10,
    onChange: console.log,
    title: "Insert title",
    desc: "Insert description",
}
