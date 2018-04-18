if(process.env.NODE.ENV === 'production'){
    module.exports = {mongoURI:'mongodb://nodemongodbproject:abdulrehman197@ds249269.mlab.com:49269/node_mongodb_project'}

}else{
    module.exports = {mongoURI:'mongodb://localhost:27017/NodeProject'}
}