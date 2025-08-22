import { loggerService } from "../services/logger.service.js";

export function logRequest(req, res, next) {
    loggerService.log('Request received:', req.route.path)
    next()
}
