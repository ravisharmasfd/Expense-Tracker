const express = require('express')
const path = require('path');
const router = express.Router();

function fileSender(filename){
    return function(req,res){
        res.sendFile(path.join(require.main.path,'views',filename));
    }
}
router.use('/signup',fileSender('signup.html'));
module.exports = router;


