import React from 'react'

export default class Scan extends React.Component {
    constructor(props) {
        super(props)
        this.state = { selected : true }
        this.handleClick = this.handleClick.bind(this)

    }

    handleClick() {
        console.log(this.props.name)
        this.setState( { selected: !this.state.selected }) 
    }

    render() {
        if(this.state.selected) {
            return <li onClick={this.handleClick}> <mark> {this.props.name} </mark> </li>
        } else { 
            return <li onClick={this.handleClick}> {this.props.name} </li>
        }
    }
}

