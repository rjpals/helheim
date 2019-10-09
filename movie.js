window.movie.paused = true

const fps = (lastFrame, lastTime) => {
    //if(!(typeof lastFrame === 'number' && lastTime instanceof Date))
    if(lastFrame === undefined || lastTime === undefined)
        return fps(Potree.framenumber, new Date())
    let f = Potree.framenumber
    let d = new Date()
    let deltaF = f - lastFrame
    let deltaT = d - lastTime
    console.log({deltaF, deltaT, fps: 1000 * deltaF / deltaT})
    setTimeout(() => fps(f, d), 1000)
}

const tickDisplayedPointCloud = () => {
    if(!window.movie.paused) {
        const pcs = window.viewer.scene.pointclouds
        const {preload, activePC} = window.movie
        if(pcs.length > 0) {
            activeRange = circularSlice(pcs, activePC, activePC + preload)
            hiddenRange = circularSlice(pcs, activePC + preload, activePC)
            activeRange.forEach(pc => pc.visible = true)
            hiddenRange.forEach(pc => pc.visible = false)

            psid = window.movie.PSIDs[`South_${activeRange[0].name}`]
            window.viewer.setDescription(toIso(activeRange[0].name))
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

const startMovie = () => {
    window.movie.paused = false
    window.movie.speed = 1000
    window.movie.preload = 6
    window.movie.activePC = 0
    tickDisplayedPointCloud()
}

// takes an array of objects {name: "lion", path: "./lion/ept.json"} 
const loadPointcloudsInOrder = async (resources) => {
    const pcPromises = resources.map( ({ name, path }) => {
        return new Promise(
            (resolve) => Potree.loadPointCloud(path, name, resolve)
        ) 
    })

    const events = await Promise.all(pcPromises)
    const pointclouds = events.map( (e) => e.pointcloud)
    pointclouds.forEach( (pc) => window.viewer.scene.addPointCloud(pc))

    return pointclouds
}

const glacierInit = async () => {
    const pointclouds = await loadPointcloudsInOrder(window.movie.resources)
    for(const pointcloud of pointclouds) {
        pointcloud.visible = false

        const material = pointcloud.material;
        material.size = 3;
        material.pointSizeType = Potree.PointSizeType.FIXED;
        material.pointColorType = Potree.PointColorType.ELEVATION
        material.elevationRange = [0, 180]
    }

    const scene = window.viewer.scene
    scene.view.position.set(-4234485.586, 9990252.213, 36176.402)
    scene.view.lookAt(new THREE.Vector3(-4246615.561, 9974709.709, 60.068));
    viewer.setPointBudget(1e10)
    startMovie()
}

