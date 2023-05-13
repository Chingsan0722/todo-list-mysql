const express = require('express')
const router = express.Router()
const db = require('../../models')
const User = db.User
const passport = require('passport')
const bcrypt = require('bcryptjs')
router.get('/login', (req, res) => {
  return res.render('login')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      console.log('User already exists')
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

// 登出功能，執行req.logout()這個function後會讓passport自行把session剔除
router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', '您已成功登出！')
  res.redirect('/users/login')
})

module.exports = router
