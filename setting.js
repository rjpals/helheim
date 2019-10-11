'use strict';
import React from 'react'
import ReactDom from 'react-dom'
import 'rc-slider/assets/index.css'
import Slider from 'rc-slider'
const { Handle } = Slider

export default class Setting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {displayVal: props.defaultValue}
    }

    componentDidMount() {
        //this.props.onChange(this.props.defaultValue)
        console.log('yeet')
    }

    render() {
        const display = this.state.displayVal.toLocaleString()
        return <div>
            <h1> {this.props.title} </h1>
            <p> {this.props.desc} </p>
            <div style={{textAlign: 'center'}}>
                { display }
                <Slider
                    min={this.props.min}
                    max={this.props.max}
                    defaultValue={this.props.defaultValue}
                    step={this.props.step}
                    onChange={ (val)=> {
                        this.setState({displayVal: val})
                        this.props.onChange(val)
                        }
                    }
                    handle={ props => <Handle {...props}/> }
                />
            </div>

        </div>
    }
}

Setting.defaultProps = {
    min: 0,
    max: 10,
    defaultValue: 5,
    onChange: console.log,
    title: "Insert title",
    desc: "Insert description",
}
