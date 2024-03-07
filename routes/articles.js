// routes/articles.js

const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

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

//Delete
router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

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





