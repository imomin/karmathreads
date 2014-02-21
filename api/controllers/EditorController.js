/*---------------------
    :: Editor 
	-> controller
---------------------*/
var request = require('request');
var _ = require('underscore');
var formidable = require('formidable');

var EditorController = {
	index: function (req, res) {        
        request("http://karmathreads.imomin.c9.io/garment/categories", function (error, response, body) {
    	if (error) return res.send(console.log(error),500);
    		  if (!error && response.statusCode == 200) {                    
                  var x = JSON.parse(body);
                  var dat = _.filter(JSON.parse(x).result, function(catObj){ 
                                        return _.contains(["1", "2", "3","4","5","6","7","8","9","10","11","12","17"], catObj.category_id)==true;
                                    });                  
                res.view({result:dat});
    		  }
    	});
    },  
    upload: function(req,res) {
        var fs = require('fs');
        var fileExt = req.files.files[0].name.substr(req.files.files[0].name.lastIndexOf('.') + 1);
        var fileName = req.files.files[0].path.substr(req.files.files[0].path.lastIndexOf('/') + 1);
        var fromFolder = req.files.files[0].path;         
        var toFolder = __dirname + '/../../public/images/files/' + fileName + '.' + fileExt;        
        var is = fs.createReadStream(fromFolder);
        var os = fs.createWriteStream(toFolder);        
        is.pipe(os);
        is.on('end',function() {
            fs.unlinkSync(fromFolder);
        });
        res.send({
            path: "/images/files/" + fileName + '.' + fileExt
        });
    },
    clipart: function(req,res){        
        var category = req.param('id');
        var cliparts = [];
        switch (category)
        {
        case 'animal':
          cliparts = [{name:'Bat',url:'/images/cliparts/animals/Black_Bat.png'},{name:'Horse',url:'/images/cliparts/animals/Black_horse.png'},{name:'Sea Horse',url:'/images/cliparts/animals/Black_seahorse.png'},{name:'Dragon',url:'/images/cliparts/animals/face_dragon_art.png'}];
          break;
        case 'sport':
          cliparts = [{name:'Baseball',url:'/images/cliparts/sports/baseball_player.png'},{name:'Runner',url:'/images/cliparts/sports/runner3.png'},{name:'Ski',url:'/images/cliparts/sports/ski.png'},{name:'Soccer',url:'/images/cliparts/sports/soccer.png'}];
          break;
        default:
          cliparts = [{name:'Bat',url:'/images/cliparts/animals/Black_Bat.png'},{name:'Horse',url:'/images/cliparts/animals/Black_horse.png'},{name:'Sea Horse',url:'/images/cliparts/animals/Black_seahorse.png'},{name:'Dragon',url:'/images/cliparts/animals/face_dragon_art.png'}];
        }
        res.send({
            data:cliparts
        });
    }
};
module.exports = EditorController;