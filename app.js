const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename : function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

// Init upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 100000000},
    fileFilter : function(req,file,cb){
        checkFileType(file,cb);
    }
}).single('Image');

// Check file Type
function checkFileType(file,cb){
    // Allowed extensions 
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb('Error: Images Only!');
    }
}

//Init App
const app = express();

//EJS setup
app.set('view engine','ejs');

// Public Folder
app.use(express.static('./public'));

app.get('/',(req,res)=>{
    res.render('index');
});

app.post('/upload',(req,res)=>{
    upload(req,res,(err) =>{
        if(err){
            res.render('index',{
                msg: err
            });
        }else{
            if(req.file == undefined){
                res.render('index',{
                    msg: 'Error: No File Selected' 
                });
            }else{
                res.render('index',{
                    msg: 'Success: File Uploaded',
                    file: `uploads/${req.file.filename}` 
                });
            }
        }
    });
});

const port = 3000;

app.listen(port, ()=> console.log(`Server Starting on port ${port}`));
