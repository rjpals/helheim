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

const getQueryParam = function(name) {
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(window.location.href);
    if (!results || !results[2]) return null;
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const applyUrlChanges = (config) => {
    config = JSON.parse(JSON.stringify(config))
        config.resources = config.resources.map( r => {
        let enabled = JSON.parse(getQueryParam(r.name))
        if(enabled != null) {
            r.enabled = enabled
        }
        return r
    })

    const v = config.viewer.view

    const posX = getQueryParam('posX')
    if(posX != null)
        v.position[0] = posX

    const posY = getQueryParam('posY')
    if(posY != null)
        v.position[1] = posY

    const posZ = getQueryParam('posZ')
    if(posZ != null)
        v.position[2] = posZ

    const dirX = getQueryParam('dirX')
    if(dirX != null)
        v.lookAt[0] = dirX

    const dirY = getQueryParam('dirY')
    if(dirY != null)
        v.lookAt[1] = dirY

    const dirZ = getQueryParam('dirZ')
    if(dirZ != null)
        v.lookAt[2] = dirZ
    return config
}

export default {fps, isWebGL2Available, toIso, getQueryParam, applyUrlChanges}
