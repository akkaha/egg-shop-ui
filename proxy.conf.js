const PROXY_CONFIG = [
    {
        context: [
            "/shop",
        ],
        target: "http://localhost:8080",
        pathRewrite: {
            '^/shop': 'shop'
        },
        ws: false,
        secure: false
    },
]

module.exports = PROXY_CONFIG
