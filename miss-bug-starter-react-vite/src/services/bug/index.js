const { DEV, VITE_LOCAL } = import.meta.env
import { getRandomIntInclusive, makeId } from "../../services/util.service"

import { bugService as remoteService } from "./bug.service";
import { bugService as localService } from "./bug.service.local";

function getEmptyBug() {
  return {
    id: makeId(),
    title: '',
    description: '',
    severity: getRandomIntInclusive(1, 5),
    labels: [],
    creator: '',
  };
}

function getDefaultFilter() {
  return {
    severity: '',
    title: '',
    createdAt: '',
  };
}

// console.log('VITE_LOCAL:', VITE_LOCAL)


// const service = VITE_LOCAL === 'true' ? localService : remoteService
// export const bugService = { getEmptyBug, getDefaultFilter, ...service }



const isRemote = true

export const bugService = isRemote ? remoteService : localService