const isDebug = true;
const info = (...data: unknown[]) => {
    console.log("[INFO]:", ...data);
}

const warn = (...data: unknown[]) => {
    console.log("[WARN]:", ...data);
}

const error = (...data: unknown[]) => {
    console.log("[ERROR]:", ...data);
}

const debug = (...data: unknown[]) => {
    if(!isDebug) return;
    console.log("[DEBUG]:", ...data);
}


export default {
    info,
    error,
    warn,
    debug
}