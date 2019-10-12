'use strict';
import React from 'react'
import ReactDom from 'react-dom'
import Sidebar from './sidebar'
import Setting from './setting'

class Dropdown extends React.Component {
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

const sidebar = <Sidebar>
    <h1 style={{textAlign: "center"}}> Helheim </h1>
    <Dropdown title="Graphics settings" >
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
            defaultValue={1e4}
            onChange= {(val) => window.viewer.setPointBudget(val)}
        />
        <Setting
            title="Look Ahead"
            desc="Number of scans to preload"
            onChange= {(val) => window.movie.preload = 1 + val}
        />
        <Setting/>
    </Dropdown>
</Sidebar>

const domContainer = document.querySelector('#react-container');
ReactDom.render(sidebar,  domContainer);

