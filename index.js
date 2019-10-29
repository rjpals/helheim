'use strict';
import "@babel/polyfill";


import React from 'react'
import ReactDom from 'react-dom'
import Sidebar from './sidebar'
import Setting from './setting'
import Dropdown from './dropdown'
import Scan from './scan'
import DefaultConfig from './config'
import Utils from './utils'

//TODO
const validate = (config) => typeof config === typeof {}

class Movie extends React.Component {
    constructor(props) {
        super(props)
        const config = props.config
        const enabledPCs = config.resources.map(res => res.enabled)
        const visiblePCs = config.resources.map(res => false)
        const pointBudget = config.viewer.pointBudget
        this.viewer = props.viewer

        this.state = {
            paused: false,
            activePC: 0,
            speed: 1,
            pointBudget,
            preload: 5,
            visiblePCs,
            enabledPCs,
            interval: null,
        }
    }

    async componentDidMount() {
        await this.initViewer()
    }

    async loadPointcloudsFromConfig() {
        const config = this.props.config
        const resources = config.resources
        const prefix = window.location.hostname === 'localhost' ?
            config.resourceMeta.devPrefix :
            config.resourceMeta.prodPrefix

        const loadPC = ({ name }) => {
            const path = `${prefix}${name}/ept.json`
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

    share() {
        const dir = this.viewer.scene.view.getPivot()
        const pos = this.viewer.scene.getActiveCamera().getWorldPosition(pos)
        const obj = {
            posX: pos.x,
            posY: pos.y,
            posZ: pos.z,
            dirX: dir.x,
            dirY: dir.y,
            dirZ: dir.z,
        }
        this.props.config.resources.forEach( (res, index) => {
            obj[res.name] = this.state.enabledPCs[index]
        })
        const encode = (o) => Object.keys(o).map( k => `${k}=${o[k]}`).join('&')
        const l = window.location
        const link = `${l.origin}${l.pathname}?${encode(obj)}`
        try {
            navigator.clipboard.writeText(link)
        } catch (e) {
            console.log(new Error("Can't copy to clipboard: is TLS working? Are you using a supported browser?"))
        }

        //debugging
        console.log(obj)
        console.log(link)
    }

    dumpState() {
        const config = JSON.parse(JSON.stringify(this.props.config))
        const v = config.viewer
        config.resources.forEach((res, index) => {
             res.enabled = this.state.enabledPCs[index]
        })

        config.viewer.pointBudget = this.state.pointBudget

        const cam = this.viewer.scene.getActiveCamera()
        const pos = cam.getWorldPosition()
        config.viewer.view.position = [pos.x, pos.y, pos.z]

        const dir = this.viewer.scene.view.getPivot()
        config.viewer.view.lookAt = [dir.x, dir.y, dir.z]

        console.log(config)
        }

    async initViewer() {
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
        await this.loadPointcloudsFromConfig()

        this.setState( (state, props) => {
            const f = this.tick.bind(this)
            const ms = this.state.speed * 1000
            const interval = setInterval(f, ms)
            return {interval}
        })
    }

    advancePC() {
        this.setState((state, props) => {
            let activePC = state.activePC
            //find next enabled PC
            do {
                activePC++
                if(activePC >= this.props.config.resources.length)
                    activePC = 0
            } while (!state.enabledPCs[activePC])
            //set PSId filter to ensure PC is visible
            const psid = this.props.config.resources[activePC].psid
            this.viewer.setFilterPointSourceIDRange(psid - 0.5, psid + 0.5)
            this.viewer.scene.pointclouds[activePC].visible = true
            //debug
            const range = this.viewer.filterPointSourceIDRange
            const activeName = props.config.resources[activePC].name
            console.log({range, psid, activeName})

            //update state
            return {activePC}
        })
    }

    updateVisiblePCs() {
        this.setState((state, props) => {
            const visiblePCIndices = new Set(this.getVisiblePCs(state))
            const allPCs = this.viewer.scene.pointclouds
            const numPCs = allPCs.length
            const visiblePCs = allPCs.map( pc => null)
            allPCs.forEach( (pc, i) => {
                visiblePCs[i] = pc.visible = visiblePCIndices.has(i)
            })
            return {visiblePCs}
        })
    }

    tick() {
        if(!this.state.paused) {
            this.advancePC()
            this.updateVisiblePCs()
        }
        //console.log(this.viewer.filterPointSourceIDRange)
    }

    getVisiblePCs(state) {
        const enabledPCs = state.enabledPCs
        const activePC = state.activePC
        const arr = [activePC]
        if(enabledPCs[activePC]) {
            let ptr = activePC
            while(arr.length < (state.preload + 1) ) {
                ptr = (ptr + 1) % enabledPCs.length
                if(ptr === activePC) break
                if(enabledPCs[ptr]) { arr.push(ptr) }
            }
            return arr
        } else { throw new Error("The active pointcloud is not enabled") }
    }

    togglePause() {
        this.setState((state, props) => {
            return {paused: !state.paused }
        })
    } 

    changeSpeed(speed) {
        this.setState((state, props) => {
            clearInterval(state.interval)
            const interval = setInterval(this.tick.bind(this), 1000 * speed)
            return {speed, interval}
        })
        console.log(`Speed changed to ${speed}`)
    }

    changePointBudget(budget) {
        this.viewer.setPointBudget(budget)
        this.setState({pointBudget: budget})
        console.log(`Point budget changed to ${budget}`)
    }

    changeLookAhead(n) {
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
        const exportButton = <button onClick={ this.dumpState.bind(this) } >
                Export
            </button>

        const pauseButton = <button onClick={ this.togglePause.bind(this) } >
                { this.state.paused? "Play" : "Pause"}
            </button>

        const shareButton = <button onClick={ this.share.bind(this) } >
                Share
            </button>

        const sidebar = <Sidebar>
            <h1 style={{textAlign: "center"}}> Helheim </h1>
            {pauseButton}
            {exportButton}
            {shareButton}
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
                    onChange={this.changePointBudget.bind(this)}
                />
                <Setting
                    title="Look Ahead"
                    desc="Number of scans to preload"
                    value={this.state.preload}
                    onChange= {this.changeLookAhead.bind(this)}
                />
                <Setting
                    title="Displayed Scan"
                    desc="Index of the scan that you want to look at"
                    min={0}
                    max={this.props.config.resources.length}
                    value={this.state.activePC}
                    onChange={(activePC) => this.setState({activePC})}
                />
            </Dropdown>
            <Dropdown title="Pointcloud Selection">
                <ul>
                    { this.props.config.resources.map( (scan, index) => (
                        <Scan
                            name={Utils.toIso(scan.name)}
                            key={scan.name}
                            enabled={this.state.enabledPCs[index]}
                            visible={this.state.visiblePCs[index]}
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
    const viewer = new Potree.Viewer(potreeContainer, {useDefaultRenderLoop: true})
    window.viewer = viewer

    const movie = <Movie config={Utils.applyUrlChanges(DefaultConfig)} viewer={viewer}/>
    ReactDom.render(movie,  domContainer)
} else { 
    ReactDom.render(badBrowserPage,  domContainer)
}

