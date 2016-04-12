module.exports = {
    entry: './frontend/js/app',
    output: {
        path: __dirname + '/public',
        filename: 'build.js',
        publicPath: '/public/'
    },

    watch: true,

    devtool: 'source-map',

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.hbs/,
                loader: 'handlebars?helperDirs[]=' + __dirname +'/frontend/templates/helpers'
            }
        ]
    }
}