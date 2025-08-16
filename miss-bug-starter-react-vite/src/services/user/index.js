import { userService as remoteService } from "./user.service";
import { userService as localService } from "./user.service.local";

const isRemote = true

export const userService = isRemote ? remoteService : localService