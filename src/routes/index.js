
const categoryRouter = require('./category');
const siteRouter = require('./site');

function route(app){

    app.use('/category', categoryRouter);
    
    
    app.get('/register', (req, res) => {
        // console.log('User searchs:', req.query.q)
        res.render('register')
    })
    
    app.get('/login', (req, res) => {
        res.render('login')
    })

    app.use('/',siteRouter);
}

module.exports=route;
