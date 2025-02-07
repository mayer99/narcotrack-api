import { Environment } from "./auth/enum/environment.enum";

export default () => ({
    origins: process.env.ORIGINS ? process.env.ORIGINS.split(' ') : [],
    environment: parseEnvironment(),
    jwtSecret: process.env.JWT_SECRET
})

function parseEnvironment(): Environment {
    switch (process.env.ENVIRONMENT) {
        case Environment.PRODUCTION:
            return Environment.PRODUCTION
        case Environment.DEVELOPMENT:
            return Environment.DEVELOPMENT
        default:
            return Environment.UNKNOWN
    }
}