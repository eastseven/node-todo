var mongoose = require( 'mongoose' );
var Todo     = mongoose.model( 'Todo' );
var utils    = require( 'connect' ).utils;
 
exports.index = function ( req, res, next ){
  Todo.
    find({ user_id : req.cookies.user_id }).
    sort( '-updated_at' ).
    exec( function ( err, todos, count ){
      if( err ) return next( err );
 
      res.render( 'index', {
          title : 'TODO',
          todos : todos
      });
    });

  // Todo.find( function ( err, todos, count ){
  //   console.log(todos);
  //   res.render( 'index', {
  //       title : 'TODO',
  //       todos : todos
  //   });
  // });
};
 
exports.create = function ( req, res, next ){
  new Todo({
      user_id    : req.cookies.user_id,
      content    : req.body.content,
      updated_at : Date.now()
  }).save( function ( err, todo, count ){
    if( err ) return next( err );
 
    res.redirect( '/' );
  });
};
 
exports.delete = function ( req, res, next ){
  Todo.findById( req.params.id, function ( err, todo ){
    //console.log();
    if( todo.user_id !== req.cookies.user_id ){
      return utils.forbidden( res );
    }
 
    todo.remove( function ( err, todo ){
      if( err ) return next( err );
      console.log(res);
      // res.redirect( '/' );
      res.send('{"success": true}');
    });
  });
};
 
exports.edit = function( req, res, next ){
  Todo.
    find({ user_id : req.cookies.user_id }).
    sort( '-updated_at' ).
    exec( function ( err, todos ){
      if( err ) return next( err );
 
      res.render( 'edit', {
        title   : 'Express Todo Example',
        todos   : todos,
        current : req.params.id
      });
    });
};
 
exports.update = function( req, res, next ){
  Todo.findById( req.params.id, function ( err, todo ){
    if( todo.user_id !== req.cookies.user_id ){
      return utils.forbidden( res );
    }
 
    todo.content    = req.body.content;
    todo.updated_at = Date.now();
    todo.save( function ( err, todo, count ){
      if( err ) return next( err );
 
      res.redirect( '/' );
    });
  });
};
 
// ** 注意!! express 會將 cookie key 轉成小寫 **
exports.current_user = function ( req, res, next ){
  
  if( !req.cookies.user_id ){
    res.cookie( 'user_id', utils.uid( 32 ));
  }
 
  next();
};