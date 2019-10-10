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

export default class Sidebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = { open: true, paused: false }
    }

    // TODO idk if this is correct, viewer might not be initialized by the time
    // these components are rendered
    componentDidRender() {
        this.props.onChange(this.props.defaultValue)
    }

    render() {
        const openButton = <button
            onClick={() => this.setState({ open: !this.state.open })}
            style={{
                position: 'relative',
                left: this.state.open ? this.props.width : 0,
                zIndex: 10000,
                marginLeft: this.state.open? this.props.margin : 0,
            }} >
                { this.state.open ? "Close" : "Open"}
            </button>

        const pauseButton = <button
            onClick={
                () => {
                    window.movie.paused = !window.movie.paused
                    this.setState({ paused: !this.state.paused })
                }
            } >
                { this.state.paused? "Play" : "Pause"}
            </button>


        if(this.state.open) {
            return <div
                style={{
                    zIndex: 10000,
                    position: 'absolute',
                    width: this.props.width,
                    height: '100%',
                    left: 0,
                    top: 0,
                    backgroundColor: 'white',
                    paddingRight: this.props.margin,
                    paddingLeft: this.props.margin,
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
                    defaultValue={1}
                    onChange= {
                        (val) => window.movie.speed = 1000 * val
                    }
                />
                <Setting
                    title="Point Budget"
                    desc="Total number of points displayed"
                    min={1e4}
                    max={1e9}
                    defaultValue={1e6}
                    onChange= {(val) => window.viewer.setPointBudget(val)}
                />
                <Setting
                    title="Look Ahead"
                    desc="Number of scans to preload"
                    onChange= {(val) => window.movie.preload = 1 + val}
                />
                <Setting/>
                {pauseButton}
            </div>
        } else {
            return openButton;
        }

    }
}
Sidebar.defaultProps = {
    width: 300,
    margin: 10,
}
