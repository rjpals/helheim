'use strict';
import React from 'react'
import ReactDom from 'react-dom'
import Sidebar from './sidebar'

export default class Dropdown extends React.Component {
    constructor(props) {
        super(props)
        this.state = { open: true }
    }

    render() {
        const openButton = <button
            onClick={ () => this.setState({ open: !this.state.open})}
            style = {{
                width: "100%"
            }}
            >
               <h2> {this.props.title} </h2>
            </button>

        if(this.state.open) {
            return <div>
                <br/>
                {openButton}
                <br/>
                <div style={{
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "grey",
                }} >
                    {this.props.children}
                </div>
            </div>
        } else {
            return <div> <br/> {openButton} <br/> </div>
        }
    }
}

Dropdown.defaultProps = {
    title: "Placeholder title",
}

