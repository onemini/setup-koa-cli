export default () => {
    return {
        type: "checkbox",
        name: "middleware",
        choices: [
            {
                name: "koaStatic"
            },
            {
                name: "koaRouter",
            },
            {
                name: "koaViews",
            },
            {
                name: "koaBody",
            }
        ]
    }
}