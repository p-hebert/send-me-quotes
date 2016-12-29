module.exports = logout;

function logout(req, res, next) {
  if(req.session.user){
    if(req.session && req.session.destroy){
      req.session.destroy(function(err) {
        if(err){
          res.status(500).json({message: 'Could not destroy session.'});
        }else{
          next();
        }
      });
    }
  }else{
    res.status(400).json({message: 'The user is not logged in.'});
  }
}
