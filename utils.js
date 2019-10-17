const isWebGL2Available = function () {
    try {
        var canvas = document.createElement( 'canvas' )
        return !! ( window.WebGL2RenderingContext && canvas.getContext( 'webgl2' ) )
    } catch ( e ) {
        return false
    }
}
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

function toIso (t) {
    const s = (i) => t.slice(i,i+2)
    return `20${s(0)}-${s(2)}-${s(4)}T${s(7)}:${s(9)}:${s(11)}Z`
}

export default {fps, isWebGL2Available, toIso}
