import { bugService as remoteService } from "./bug.service";
import { bugService as localService } from "./bug.service.local";

const isRemote = true

export const bugService = isRemote ? remoteService : localService