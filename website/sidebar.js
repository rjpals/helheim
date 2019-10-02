'use strict';

class Setting extends React.Component {
    render() {
        return <div>
            <h1> {this.props.title} </h1>
            <p> {this.props.desc} </p>

        </div>
    }
}

class Sidebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = { open: true }
        window.reactPage = this
    }

    render() {
        const openButton = <button
            onClick={() => this.setState({ open: !this.state.open })}
            style={{
                position: 'absolute',
                left: this.state.open ? 300 : 0,
                zIndex: 10000
            }} >
                { this.state.open ? "Close" : "Open"}
            </button>

        if(this.state.open) {
            return <div
                style={{
                    zIndex: 10000,
                    position: 'absolute',
                    width: 300,
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

const domContainer = document.querySelector('#react-container');
ReactDOM.render(<Sidebar/>,  domContainer);

