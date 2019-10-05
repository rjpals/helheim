'use strict';
import React from 'react'
import ReactDom from 'react-dom'
import ReactSelect from 'react-select'
import 'rc-slider/assets/index.css'
import Slider from 'rc-slider'
import Tooltip from 'rc-tooltip'

const { Handle } = Slider
const handle = (props) => {
  console.log("props:", props)
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  )
}

class Setting extends React.Component {
    render() {
        return <div style={{ width:200, margin: 10 }}>
            <h1> {this.props.title} </h1>
            <h2> Memes </h2>
            <p> {this.props.desc} </p>
            <div>
            <Slider
                min={0}
                max={100}
                defaultValue={69}
                step={1}
                onChange={ (val)=> console.log("value:", val) }
                handle={ handle }
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
                }}
            >
                {openButton}
                <h1 style={{textAlign: "center"}}> Helheim </h1>
                <Setting title="Testing" desc="Explanation" />
            </div>
        } else {
            return openButton;
        }

    }
}
