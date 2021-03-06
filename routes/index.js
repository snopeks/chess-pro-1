const express = require('express'),
      ctrl = require('../controllers'),
      passport = require('passport'),
      middleware = require('./middleware'),
      db = require('../models');

/*
 * Initialize Router
*/
const router = express.Router();


router.use(function( req, res, next ){

  res.locals.title = 'Chess-pro';

  // add user to locals
  res.locals.user = req.user || null;

  /*
   * Get all flash messages before rendering
  */
  res.render = middleware.renderWithMessages(res.render);

  next();

});

router.use([ '/signup', '/login' ], middleware.denySignedIn );
router.use(['/game','/board','/user/:id'], middleware.isLoggedIn );

/*
 * Main
*/
router.get('/', ctrl.main.home );
router.get('/about', ctrl.main.about );

/*
 * Users
*/
router.route('/user')
  .post( ctrl.user.create );

router.route('/user/:id')
  .get( ctrl.user.show )
  .put( middleware.isUserCredentails, ctrl.user.update )
  .delete( middleware.isUserCredentails, ctrl.user.delete );

router.get('/signup', ctrl.user.new );

router.route('/login')
  .get( ctrl.user.login )
  .post( passport.authenticate('local', {
    successRedirect: '/profile',
    failureFlash: true,
    failureRedirect: '/login'
  }));

router.get('/profile', middleware.isLoggedIn, ctrl.user.profile );
router.get( '/logout', ctrl.user.logout );

/*
 * Game
*/
router.route('/game')
  .get( ctrl.game.index )
  .post( ctrl.game.create );

router.get('/game/:gameId/join', ctrl.game.join );
router.get('/game/:gameId/board',middleware.isLoggedIn, ctrl.game.board );

module.exports = router;
