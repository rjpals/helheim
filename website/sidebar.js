'use strict';

class Page extends React.Component {
    constructor(props) {
        super(props)
        this.state = { open: true }
        window.reactPage = this
    }

    render() {
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
                <button
                    onClick={() => this.setState({ open: false })}
                    style={{position: 'absolute', left: 300}} 
                >
                    Close
                </button>
                <h1 style={{textAlign: "center"}}> Helheim </h1>
            </div>
        } else {
            return (
                <button
                    onClick={() => this.setState({ open: true })}
                    style={{
                        zIndex: 10000,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                    }}
                >
                    Open
                </button>
                );
        }

    }
}

const domContainer = document.querySelector('#react-container');
ReactDOM.render(<Page/>,  domContainer);

