'use strict';
import "@babel/polyfill";


import React from 'react'
import ReactDom from 'react-dom'
import Sidebar from './sidebar'
import Setting from './setting'
import Dropdown from './dropdown'
import Scan from './scan'
import Config from './config'
import Utils from './utils'

const validate = () => true //TODO


const tickDisplayedPointCloud = () => {
    if(!window.movie.paused) {
        const pcs = window.viewer.scene.pointclouds
        const {preload, activePC} = window.movie
        if(pcs.length > 0) {
            const activeRange = circularSlice(pcs, activePC, activePC + preload)
            const hiddenRange = circularSlice(pcs, activePC + preload, activePC)
            activeRange.forEach(pc => pc.visible = true)
            hiddenRange.forEach(pc => pc.visible = false)

            const psid = window.movie.PSIDs[`South_${activeRange[0].name}`]
            window.viewer.setDescription(Utils.toIso(activeRange[0].name))
            window.viewer.setFilterPointSourceIDRange(psid - 0.5, psid + 0.5)
        }
        window.movie.activePC++
    }
    setTimeout( () => tickDisplayedPointCloud(), window.movie.speed)
}

const circularSlice = (arr, start, end) => {
    start = start % arr.length
    end = end % arr.length
    if(start > end) {
        return [...arr.slice(start), ...arr.slice(0, end)]
    } else {
        return arr.slice(start, end)
    }
}

class Movie extends React.Component {
    constructor(props) {
        super(props)
        const config = props.config
        const enabledPCs = config.resources.map(res => res.enabled)
        const visiblePCs = config.resources.map(res => false)
        const interval = setInterval(this.advancePC.bind(this), 1000)
        const pointBudget = config.viewer.pointBudget
        this.viewer = props.viewer
        this.state = {
            paused: false,
            activePC: 0,
            speed: 1,
            pointBudget,
            preload: 6, 
            enabledPCs,
            interval,
        }
        this.loadPointcloudsFromConfig()
        this.initViewer()
    }

    async loadPointcloudsFromConfig() {
        const config = this.props.config
        const resources = config.resources
        const loadPC = ({ name, path }) => {
            return new Promise(
                (resolve) => Potree.loadPointCloud(path, name, resolve)
            )
        }
        const pcPromises = resources.map(loadPC)

        const events = await Promise.all(pcPromises)
        const pointclouds = events.map( (e) => e.pointcloud)
        pointclouds.forEach( (pc) => {
            for(let key in config.material) {
                pc.material[key] = config.material[key]
            }
            this.viewer.scene.addPointCloud(pc)
        })
    }

    dumpState() { console.log(this.state) }

    initViewer() {
        const viewer = this.viewer
        const scene = viewer.scene
        const config = this.props.config
        const {position, lookAt} = config.viewer.view

        viewer.setEDLEnabled(true)
        viewer.setFOV(60)
        viewer.setDescription("Helheim")

        viewer.setPointBudget(this.props.config.viewer.pointBudget)
        scene.view.position.set(...position)
        scene.view.lookAt(new THREE.Vector3(...lookAt));
    }

    advancePC() {
        if(!this.state.paused) {
            let activePC = this.state.activePC
            do {
                activePC = (activePC + 1) % this.props.config.resources.length
            } while (!this.state.enabledPCs[activePC])
            this.setState({ activePC })
            const psid = this.props.config.resources[activePC].psid
            // window.viewer.setDescription(Utils.toIso(activeRange[0].name))
            this.viewer.setFilterPointSourceIDRange(psid - 0.5, psid + 0.5)
            this.viewer.scene.pointclouds[activePC].visible = true
        }
        this.updateVisiblePCs()
        //console.log("visible pointclouds:", this.getVisiblePCs())
    }

    updateVisiblePCs() {
        const visiblePCIndices = this.getVisiblePCs()
        const allPCs = this.viewer.scene.pointclouds
        const visiblePCs = allPCs.map( x => false )
        visiblePCIndices.forEach( i => {
            visiblePCs[i] = true
            allPCs.visible = true
        })
        this.setState(visiblePCs)
    }

    getVisiblePCs() {
        const enabledPCs = this.state.enabledPCs
        const activePC = this.state.activePC
        const arr = [activePC]
        if(enabledPCs[activePC]) {
            let ptr = activePC
            while(arr.length < this.state.preload) {
                ptr = (ptr + 1) % enabledPCs.length
                if(ptr === activePC) break
                if(enabledPCs[ptr]) { arr.push(ptr) }
            }
            return arr
        } else { throw new Error() }
    }

    togglePause() {
        this.setState({ paused: !this.state.paused })
    } 

    changeSpeed(speed) {
        clearInterval(this.state.interval)
        const interval = setInterval(this.advancePC.bind(this), 1000 * speed)
        this.setState({speed, interval}) 
        console.log(`Speed changed to ${speed}`)
    }

    changePointBudget(budget) {
        this.viewer.setPointBudget(budget)
        this.setState({pointBudget: budget})
        console.log(`Point budget changed to ${budget}`)
    }

    changeLookAhead(n) {
        //window.movie.preload = 1 + n
        this.setState({preload: n}) 
    }

    toggleEnabledScan(index) {
        const copy = this.state.enabledPCs.slice()
        copy[index] = !copy[index] 
        this.setState( { enabledPCs: copy } )
        
        //logging
        const status = copy[index]? "enabled" : "disabled"
        const name = this.props.config.resources[index].name
        console.log(`Resoure #${index}, named "${name}", has been ${status}`)
    }

    render() {
        const pauseButton = <button onClick={ this.togglePause.bind(this) } >
                { this.state.paused? "Play" : "Pause"}
            </button>

        const sidebar = <Sidebar>
            <h1 style={{textAlign: "center"}}> Helheim </h1>
            {pauseButton}
            <Dropdown title="Graphics Settings" >
                <Setting
                    title="Scan speed"
                    desc="Speed at which renderer advances to the next scan"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={this.state.speed}
                    onChange= {this.changeSpeed.bind(this)}
                />
                <Setting
                    title="Point Budget"
                    desc="Total number of points displayed"
                    min={1e4}
                    max={1e7}
                    value={this.state.pointBudget}
                    onChange= {this.changePointBudget.bind(this)}
                />
                <Setting
                    title="Look Ahead"
                    desc="Number of scans to preload"
                    value={this.state.preload}
                    onChange= {this.changeLookAhead.bind(this)}
                />
            </Dropdown>
            <Dropdown title="Pointcloud Selection">
                <ul>
                    { this.props.config.resources.map( (scan, index) => (
                        <Scan
                            name={Utils.toIso(scan.name)}
                            key={scan.name}
                            enabled={this.state.enabledPCs[index]}
                            active={this.state.activePC===index}
                            handleClick={
                                () => this.toggleEnabledScan.bind(this)(index)
                            }
                        />))
                    }
                </ul>
            </Dropdown>
        </Sidebar>

        return sidebar
    }
}

const domContainer = document.querySelector('#react-container');
const badBrowserPage = <>
    <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            margin: 10,
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
        }}> 
        <h1> Browser not supported </h1>
        <p> Please use a browser that supports WebGL 2 such as Firefox or Chrome
            on the desktop. Some versions of Firefox on Andriod will work.
        </p>
    </div>
</>

if(Utils.isWebGL2Available()) {
    const potreeContainer = document.getElementById("potree_render_area")
    const viewer = new Potree.Viewer(potreeContainer)
    const movie = <Movie config={Config} viewer={viewer}/>
    ReactDom.render(movie,  domContainer)
} else { 
    ReactDom.render(badBrowserPage,  domContainer)
}

