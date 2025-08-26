const { DEV, VITE_LOCAL } = import.meta.env
import { getRandomIntInclusive, makeId } from "../../services/util.service"

import { userService as remoteService } from "./user.service";
import { userService as localService } from "./user.service.local";

function getEmptyUser() {
    return {
        username: '',
        password: '',
        fullname: '',
        isAdmin: false,
        score: 100,
    };
}

// MongoDB
const service = VITE_LOCAL === 'true' ? localService : remoteService
export const userService = { ...service, getEmptyUser }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.userService = userService


// render.com
// const isRemote = true

// export const userService = isRemote ? remoteService : localService