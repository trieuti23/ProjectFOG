
const News = require('../models/News');
const User = require('../models/User');
const { multipleMongooseToObject } = require('../ulti/mongoose')
const { mongooseToObject } = require('../ulti/mongoose')

class NewsController {
    
    //[GET] /news/create 
    create(req,res,next) {
        if (req.isAuthenticated()) {
            User.findOne({username: req.user.username})
            .then (user =>{
                res.render('news/create', { 
                    userLogin: mongooseToObject(user)
                });
            })
        }
        else{
            res.render('news/create')
        }
    }

    //[GET] /news/trash 
    trash(req,res,next) {
        Promise.all([News.findDeleted({}), News.countDeleted(), News.count(), User.findOne({username:req.user.username})])
        .then(([news, deletedCount, storedCount, userLogin]) => 
        res.render('news/trash', {
            deletedCount,
            storedCount,
            news: multipleMongooseToObject(news),
            userLogin: mongooseToObject(userLogin),
            })
        )
        .catch(next)

        // Promise.all([News.findDeleted({}), News.countDeleted(), News.count()])
        // .then(([news, deletedCount, storedCount]) => 
        // res.render('news/trash', {
        //     deletedCount,
        //     storedCount,
        //     news: multipleMongooseToObject(news),
        //     })
        // )
        // .catch(next) 
    }

    //[GET] /news/manage 
    manage(req,res,next) {
        Promise.all([News.find({}), News.countDeleted(), News.count(), User.findOne({username: req.user.username})])
            .then(([news, deletedCount, storedCount, userLogin]) => 
            res.render('news/manage', {
                deletedCount,
                storedCount,
                news: multipleMongooseToObject(news),
                userLogin: mongooseToObject(userLogin),
                })
            )
            .catch(next)
    }
    
    //[POST] /news/handle-form-actions
    handleFormActions(req,res,next) {
        switch (req.body.action){
            case 'delete':
                News.delete({_id: { $in: req.body.newsIds}})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                News.restore({_id: { $in: req.body.newsIds}})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'force':
                News.remove({_id: { $in: req.body.newsIds}})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({Message: 'Action is invalid !!'})
        }
    }

    //[POST] /news/:id/edit
    edit(req,res,next) {
        Promise.all([News.findById(req.params.id), User.findOne({username: req.user.username})])
            .then(([news, userLogin]) => 
            res.render('news/edit', {
                news: mongooseToObject(news),
                userLogin: mongooseToObject(userLogin),
                })
            )
            .catch(next)

        // News.findById(req.params.id)
        //     .then(news => res.render('news/edit', {
        //         news: mongooseToObject(news)
        //     }))
        //     .catch(next);
    }

    //[PUT] /news/:id
    update(req,res,next) {
        News.updateOne({_id: req.params.id}, req.body)
            .then(news => res.redirect('/news'))
            .catch(next);
    }

    //[DELETE] /news/:id
    delete(req,res,next) {
        News.delete({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[DELETE] /news/:id/force
    force(req,res,next) {
        News.deleteOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[RESTORE] /news/:id/store
    restore(req,res,next) {
        News.restore({_id: req.params.id})
            .then(() => res.redirect('/news/manage'))
            .catch(next);
        
    }

    //[POST] /store news
    store(req,res,next) {
        const eve = new News(req.body);
        eve.save()
            .then(() => res.redirect('/news'))
            .catch(error => {
                
            })
    }


    // [GET] /:slug
    // Find object in MongoDB by slug
    show(req,res,next){
        // News.findOne({ slug: req.params.slug})
        // .then (news => {
        //     res.render('news/show', { 
        //         news: mongooseToObject(news) 
        //     });
        // })
        // .catch(next)
        
        if (req.isAuthenticated()) {
        Promise.all([News.find({}), News.findOne({ slug: req.params.slug}), 
            User.findOne({username: req.user.username})])
            .then(([news, newsDetail, userLogin]) => 
            res.render('news/show', {
                newsDetail: mongooseToObject(newsDetail),
                news: multipleMongooseToObject(news),
                userLogin: mongooseToObject(userLogin),
                })
            )
            .catch(next)
        }
        else{
            Promise.all([News.find({}), News.findOne({ slug: req.params.slug})])
                .then(([news, newsDetail]) => 
                res.render('news/show', {
                    newsDetail: mongooseToObject(newsDetail),
                    news: multipleMongooseToObject(news),
                    })
                )
                .catch(err=>next(err));
        }
    }

    // [GET] /news
    index(req, res, next){
        if (req.isAuthenticated()) {
            Promise.all([News.find({}), User.findOne({username: req.user.username})])
            .then(([news, userLogin]) => 
            res.render('news', {
                news: multipleMongooseToObject(news),
                userLogin: mongooseToObject(userLogin),
                })
            )
            .catch(next)
        }
        else{
            News.find({})
            .then(news => {
                // news = news.map(cat => cat.toObject())
                res.render('news', {
                    news: multipleMongooseToObject(news)
                })
            })
            .catch(err=>next(err));
            }

        // Promise.all([News.find({}), User.findOne({username: req.user.username})])
        //     .then(([news, userLogin]) => 
        //     res.render('news', {
        //         news: multipleMongooseToObject(news),
        //         userLogin: mongooseToObject(userLogin),
        //         })
        //     )
        //     .catch(next)

        // News.find({})
        // .then(news => {
        //     // news = news.map(cat => cat.toObject())
        //     res.render('news', {
        //         news: multipleMongooseToObject(news)
        //     })
        // })
        // .catch(err=>next(err));
    }

}

module.exports = new NewsController;

const res = require('express/lib/response');
const newsController = require('./NewsController');