import React from 'react'

export default class Scan extends React.Component {
    render() {
        let display = this.props.name
        const style = { "backgroundColor": this.props.enabled? "green" : "red" }

        if(this.props.visible) {
            display = <mark> {display} </mark>
        }

        if(this.props.active) {
            display = <strong> {display} </strong>
        }
        return <li style={style} onClick={this.props.handleClick}> {display} </li> 
    }
}
