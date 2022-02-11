export default () => {
    return {
        type: "input",
        name: "port",
        default() {
            return 8080;
        },
        message: "set port number"
    }
}