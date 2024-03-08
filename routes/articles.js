// routes/articles.js

const express = require('express')
const Article = require('./../models/article')
const router = express.Router()
const passport = require('passport');

///////////////////////////////////////////////////////
router.get('/', function(req, res, next) {
  res.redirect('/');
});

// Google OAuth login route
router.get('/auth/google', passport.authenticate(
  // Which passport strategy is being used?
  'google',
  {
    // Requesting the user's profile and email
    scope: ['profile', 'email'],
    // Optionally force pick account every time
    // prompt: "select_account"
  }
));

// Google OAuth callback route
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/',
    failureRedirect: '/'
  }
));

// OAuth logout route
router.get('/logout', function(req, res){
  req.logout(function() {
    res.redirect('/');
  });
});
///////////////////////////////////////////////////////



//New post
router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})

//Edit
router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
})

//Readmore
router.get('/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    if (article == null) res.redirect('/')
    res.render('articles/show', { article: article })
})

//Delete
router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})


//Create the new post
router.post('/', async (req, res, next) => {
      req.article = new Article()
      next()
  }, saveArticleAndRedirect('new') )
  
  
  //Editing and update
  router.put('/:id', async (req, res, next) => {
        req.article = await Article.findById(req.params.id)
        next()
    }, saveArticleAndRedirect('new') )
    
    
    //Function for both create new and update exiting post
    function saveArticleAndRedirect(path) {
        return async (req, res) => {
            let article = req.article
            article.title = req.body.title
            article.description = req.body.description
            article.markdown = req.body.markdown
            try {
                article = await article.save();
                console.log('Article saved:', article);
                res.redirect(`/articles/${article.id}`);
              } catch (e) {
                  console.error('Error saving article:', e);
                  res.render(`articles/${path}`, { article: article });
                }
              }
            }
            
            
module.exports = router
            


