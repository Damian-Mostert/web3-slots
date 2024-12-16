import Init from "../init.js"

Init()

import Config from "../models/config.js";

Config.create({
    prizes:{
        banana:[0.1,0.2],
        seven:[0.1,0.2],
        cherry:[0.1,0.2],
        plum:[0.1,0.2],
        orange:[0.1,0.2],
        bell:[0.1,0.2],
        bar:[0.1,0.2],
        lemon:[0.1,0.2],
        melon:[0.1,0.2]
    }
})