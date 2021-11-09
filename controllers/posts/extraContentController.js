const extraData = require('../../models/posts/extraContentModel');
const multer = require('multer');
const mongoose = require('mongoose');
const {GridFsStorage} = require('multer-gridfs-storage')
require('dotenv').config();

const url = process.env.MONGODB_URI;
const connect = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });
let gfs;

connect.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(connect.db, {
        bucketName: "uploads/posts/extras"
    });
});

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
          bucketName: "uploads/posts/extras",
          filename: filename
        };
    }
});

const uploadImg = multer({storage: storage}).any();

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
    extraData.find({}, (err, data)=>{
        if (err){
            return res.json({Error: err});
        }
        return res.json(data);
    })
};

const getOneData = (req, res, next) => {
    let id = req.params.id

    extraData.findOne({_id: id}, (err, data)=>{
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        else return res.json(data); 
    })
};

const newData = (req, res) => {
    const newData = new extraData({
        type: req.body.type,
        url: req.body.url,
        thumbnail: 'http://api.pebblewellness.in/uploads/posts/extras/'+req.files[0].filename,
        postedOn: new Date()
    })
    
    newData.save((err, data) => {
        if(err) return res.json({Error: err});
        return res.json(data);
    })
};

const updateData = (req, res, next) => {
    let id = req.params.id

    extraData.findOne({_id: id}, (err, data) => {
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
    })
};

const deleteAllData = (req, res, next) => {
    extraData.deleteMany({}, err => {
        if(err) {
          return res.json({message: "Complete delete failed"});
        }
        return res.json({message: "Complete delete successful"});
    })
};

const deleteOneData = (req, res, next) => {
    let id = req.params.id
    
    extraData.deleteOne({_id: id}, (err, data) => {
        if(err || !data) {
            return res.json({message: "Data doesn't exist."});
        }
        else return res.json({message: "Data deleted."});
    })
};


module.exports = {
    getAllData,
    getOneData,
    uploadImg,
    displayImg,
    newData,
    updateData,
    deleteAllData,
    deleteOneData
};
