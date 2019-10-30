import React from 'react'

export default class Scan extends React.Component {
    render() {
        let display = this.props.name
        const style = this.props.enabled? {} : {backgroundColor: "#ffcccb"}

        if(this.props.visible) {
            display = <mark> {display} </mark>
        }

        if(this.props.active) {
            display = <strong> {display} </strong>
        }
        const input = this.props.enabled?
            <input type="checkbox" onClick={this.props.handleCheck} checked /> :
            <input type="checkbox" onClick={this.props.handleCheck} />

        return <>
            <div style={style} >
                {input}
                <span onClick={this.props.handleClick}>
                    {display}
                </span>
            </div>
        </>
    }
}
