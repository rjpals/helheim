'use strict';
import React from 'react'
import ReactDom from 'react-dom'
import ReactSelect from 'react-select'

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
                position: 'absolute',
                left: 0,
                zIndex: 10001,
            }} >
                { this.state.open ? "Close" : "Open"}
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
                    overflowY: 'auto',
                }}
            >
                {openButton}
                {this.props.children}
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
