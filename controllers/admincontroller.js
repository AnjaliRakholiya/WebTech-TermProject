// var mongoose = require('mongoose'), Admin = mongoose.model('admin');
// module.exports = {
//     Create:function(req,res){
//         console.log("Let's add movie here!");
//         var movieInfo = req.body;
//         movieInfo = {
//             "name": req.body.name,
//             "director": req.body.director,
//             "year_released": req.body.year_released
//         }
//         Movie.create(movieInfo,function(err,result){
//             if(err) throw err;
//             res.redirect('/movies');
//         })
//     }
// }