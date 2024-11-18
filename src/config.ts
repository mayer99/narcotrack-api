export default () => ({
    origins: process.env.ORIGINS ? process.env.ORIGINS.split(' ') : []
})