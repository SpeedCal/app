/*
 * https://www.npmjs.com/package/winston-transport-browserconsole
 * Usage:
 *     import { logger } from "./services/Logger";
 *     logger.debug("DEBUG ", {a: 1, b: "two"});
 *     logger.debug("DEBUG ", {a: 1, b: "two"});
 *     logger.info("INFO ", {a: 1, b: "two"});
 *     logger.info("INFO ", {a: 1, b: "two"});
 *     logger.warn("WARN", {a: 1, b: "two"});
 *     logger.warn("WARN", {a: 1, b: "two"});
 *     logger.error("ERROR ", {a: 1, b: "two"});
 *     logger.error("ERROR ", {a: 1, b: "two"});
**/

import * as winston from "winston";
import BrowserConsole from 'winston-transport-browserconsole';

const level = "debug";

winston.configure({
    transports: [
        new BrowserConsole(
            {
                format: winston.format.simple(),
                level,
            },
        ),
        // Uncomment to compare with default Console transport
        // new winston.transports.Console({
        //     format: winston.format.simple(),
        //     level,
        // }),
    ],
});

export { winston as logger }
