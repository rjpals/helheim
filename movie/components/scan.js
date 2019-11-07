import React from 'react'

export default class Scan extends React.Component {
    render() {
        const Color = {
            lightRed: "#ffcccb",
            lightGrey: "#cccccc",
        }

        let display = this.props.name
        const style = this.props.enabled? {} : {backgroundColor: Color.lightGrey}

        if(this.props.visible) {
            display = <mark> {display} </mark>
        }

        if(this.props.active) {
            display = <strong> {display} </strong>
        }
        if(this.props.enabled) {
            display = <span onClick={this.props.handleClick}> {display} </span>
        }
        const input = this.props.enabled?
            <input type="checkbox" onClick={this.props.handleCheck} checked /> :
            <input type="checkbox" onClick={this.props.handleCheck} />

        return <>
            <div style={style} >
                {input}
                {display}
            </div>
        </>
    }
}
