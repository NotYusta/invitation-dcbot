import { configSection } from "./config.js";

const info = (...data: unknown[]) => {
    console.log("[INFO]:", ...data);
}

const debug = (...data: unknown[]) => {
    if(!configSection.debug) return;
    console.log("[DEBUG]:", ...data);
}

export default {
    info,
    debug
}