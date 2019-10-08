'use strict';
import React from 'react'
import ReactDom from 'react-dom'
import ReactSelect from 'react-select'
import 'rc-slider/assets/index.css'
import Slider from 'rc-slider'
const { Handle } = Slider

class Setting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {display: props.value || 5}
    }

    render() {
        const display = this.state.display.toLocaleString()
        return <div> 
            <h1> {this.props.title} </h1>
            <p> {this.props.desc} </p>
            <div style={{textAlign: 'center'}}>
                { display }
                <Slider
                    min={this.props.min || 0}
                    max={this.props.max || 10}
                    defaultValue={this.state.display}
                    step={this.props.step}
                    onChange={ (val)=> {
                        this.setState({display: val})
                        this.props.onChange(val)
                        }
                    }
                    handle={ props => <Handle {...props}/> }
                />
            </div>

        </div>
    }
}

export default class Sidebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = { open: true }
        window.reactPage = this
        this.width = props.width || 300
    }

    render() {
        const openButton = <button
            onClick={() => this.setState({ open: !this.state.open })}
            style={{
                position: 'absolute',
                left: this.state.open ? this.width : 0,
                zIndex: 10000
            }} >
                { this.state.open ? "Close" : "Open"}
            </button>

        const pauseButton = (paused) => (<button
            onClick={ () => window.movie.paused = !window.movie.paused }
            style={{
                position: 'absolute',
                left: 0,
                zIndex: 10000
            }} >
                { "Play / Pause"}
            </button>)


        if(this.state.open) {
            return <div
                style={{
                    zIndex: 10000,
                    position: 'absolute',
                    width: this.width,
                    height: '100%',
                    left: 0,
                    top: 0,
                    backgroundColor: 'white',
                    paddingRight: 10,
                    paddingLeft: 10,
                }}
            >
                {openButton}
                <h1 style={{textAlign: "center"}}> Helheim </h1>
                <Setting
                    title="Scan speed"
                    desc="Speed at which renderer advances to the next scan"
                    min={0.2}
                    max={10}
                    step={0.1}
                    value={1}
                    onChange= {
                        (val) => window.movie.speed = 1000 * val
                    }
                />
                <Setting
                    title="Point Budget"
                    desc="Total number of points displayed"
                    min={1e4}
                    max={1e9}
                    value={1e6}
                    onChange= {(val) => window.viewer.setPointBudget(val)}
                />
                <Setting
                    title="Look Ahead"
                    desc="Number of scans to preload"
                    min={1}
                    max={10}
                    value={6}
                    onChange= {(val) => window.movie.preload = val}
                />
                <Setting title="Testing" desc="Explanation" value='5'/>
                {pauseButton(window.movie.paused)}
            </div>
        } else {
            return openButton;
        }

    }
}
