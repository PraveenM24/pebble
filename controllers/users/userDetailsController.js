const userData = require('../../models/users/userDetailsModel');
const multer = require('multer');
const mongoose = require('mongoose');
const {GridFsStorage} = require('multer-gridfs-storage');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const url = process.env.MONGODB_URI;
const connect = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });
let gfs;
var docID = 1;

connect.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(connect.db, {
        bucketName: "uploads/users"
    });
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).send({message: "Authorization required"})
    jwt.verify(token, process.env.API_USER_SECRET_KEY, (err, user) => {
        if (err){
            console.log(err)
            if(err.name == 'TokenExpiredError'){
                return res.status(400).send({message: "Token expired"})
            }else{
                return res.status(403).send({message: "Access denied"})
            }
        }else{
            next()
        }
    })
};

const imagePreCheck = (req, res, next) => {
    gfs.find().toArray((err, files) => {
        if(!files || files.length === 0) {
            next();
        }
        files.map(file => {
            if (file.metadata.user_id == req.params.id) {
                gfs.delete(new mongoose.Types.ObjectId(file._id),
                    (err, data) => {
                        if (err){
                            return res.status(400).send({message: 'Unable to delete file'})
                        }else{
                            next()
                        }
                })
            }
        })
    })   
}

const generateFileName = (name) => {
    var fileName = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length;

    const searchTerm = '.'
    const imageType = name.substring(name.lastIndexOf(searchTerm)+1)

    for ( var i = 0; i < 20; i++ ) {
      fileName += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return fileName + '.' + imageType 
};

const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        var filename = generateFileName(file.originalname)
        return {
          bucketName: "uploads/users",
          filename: filename,
          metadata: {
              user_id: req.params.id
          }
        };
    }
});

const uploadImg = multer({storage: storage}).single("image");

const displayImg = (req, res, next) => {
    gfs.find({filename: req.params.filename}).toArray((err, files) => {
        if (!files[0] || files.length === 0) {
            return res.status(404).json({
                message: 'No files available',
            });
        }
        if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml') {
            gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        } else {
            res.status(400).json({
                err: 'Not an image',
            });
        }
    })
}

const getAllData = (req, res, next) => {
    userData.find({}, (err, data)=>{
        if (err){
            return res.json({Error: err});
        }
        return res.json(data);
    })
};

const getOneData = (req, res, next) => {
    let id = req.params.id;

    userData.findOne({_id: id}, (err, data)=>{
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        else return res.json(data); 
    })
};

const newData = (req, res) => {
    userData.findOne({
        email: req.body.email
    }, (err, data) => {
        if (err) {
            return res.json({
                Error: err
            });
        } else if(data) {
            return res.json({
                message: "Email already exists"
            });
        } else {
            var newData
            if(req.file){
                newData = new userData({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    dob: req.body.dob, 
                    gender: req.body.gender,
                    email: req.body.email, 
                    phone: req.body.phone,
                    image: req.file.path, 
                })
            }
            else{
                newData = new userData({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    dob: req.body.dob, 
                    gender: req.body.gender,
                    email: req.body.email, 
                    phone: req.body.phone,
                })
            }
            newData.save((err, data) => {
                if(err) return res.json({Error: err});
                return res.json(data);
            })
        }
    })
};

const updateData = (req, res, next) => {
    userData.findOne({_id: req.params.id}, (err, data) => {
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        if(req.body.first_name){
            data.first_name = req.body.first_name
        }
        if(req.body.last_name){
            data.last_name = req.body.last_name
        }
        if(req.body.dob){
            data.dob = req.body.dob
        }
        if(req.body.gender){
            data.dob = req.body.gender
        }
        if(req.body.email){
            data.email = req.body.email
        }
        if(req.body.phone){
            data.phone = req.body.phone
        }
        if(req.file){
            data.image = 'http://api.pebblewellness.in/uploads/users/'+req.file.filename
        }
        data.save()
        return res.json(data)
    })
};

const deleteAllData = (req, res, next) => {
    userData.deleteMany({}, err => {
        if(err) {
          return res.json({message: "Complete delete failed"});
        }
        return res.json({message: "Complete delete successful"});
    })
};

const deleteOneData = (req, res, next) => {
    let id = req.params.id;
    
    userData.deleteOne({_id: id}, (err, data) => {
        if(err || !data) {
            return res.status(404).json({message: "Data doesn't exist."});
        }
        else return res.json({message: "Data deleted."});
    })
};

module.exports = {
    authenticateToken,
    getAllData,
    getOneData,
    imagePreCheck,
    uploadImg,
    displayImg,
    newData,
    updateData,
    deleteAllData,
    deleteOneData
};
