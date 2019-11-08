'use strict';
import React from 'react'
import ReactDom from 'react-dom'
import 'rc-slider/assets/index.css'
import Slider from 'rc-slider'
const { Handle, Range } = Slider

class Setting extends React.Component {
    render() {
        console.log(this.props.value)
        const isRange = Array.isArray(this.props.value)

        const display = isRange?
            `[${this.props.value[0].toLocaleString()}, ${this.props.value[1].toLocaleString()}]` :
            this.props.value.toLocaleString()

        const ComponentType = isRange?
            Range :
            Slider

        return <div>
            <h3> {this.props.title} </h3>
            <p> {this.props.desc} </p>
            <div style={{textAlign: 'center'}}>
                { display }
                <ComponentType
                    min={this.props.min}
                    max={this.props.max}
                    value={this.props.value}
                    onChange={ this.props.onChange }
                    handle={ props => <Handle {...props}/> }
                />
            </div>

        </div>
    }
}

class LogSetting extends React.Component {
    render() {
        const display = this.props.value.toLocaleString()
        return <div>
            <h3> {this.props.title} </h3>
            <p> {this.props.desc} </p>
            <div style={{textAlign: 'center'}}>
                { display }
                <Slider
                    min={Math.log(this.props.min)}
                    max={Math.log(this.props.max)}
                    value={Math.log(this.props.value)}
                    step={0.01}
                    onChange={ (val) => this.props.onChange(Math.pow(Math.E, val))}
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

export {Setting, LogSetting}
