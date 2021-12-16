const postData = require('../../models/posts/docPostModel');
const multer = require('multer');
const mongoose = require('mongoose');
const {GridFsStorage} = require('multer-gridfs-storage')
require('dotenv').config();

const url = process.env.MONGODB_URI;
const connect = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });
let gfs;

connect.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(connect.db, {
        bucketName: "uploads/posts"
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
          bucketName: "uploads/posts",
          filename: filename
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
    postData.find({}, (err, data)=>{
        if (err){
            return res.json({Error: err});
        }
        return res.json(data);
    })
};

const getOneData = (req, res, next) => {
    let id = req.params.id

    postData.findOne({_id: id}, (err, data)=>{
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        else return res.json(data); 
    })
};

const newData = (req, res) => {
    var newData
    var currentTime = new Date();
    var ISTOffset = 330;
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset)*60000);
    if(req.file){
        newData = new postData({
            doctorInfo: req.body.doctorInfo,
                doctor_id: req.body.doctor_id,
                name: req.body.name,
                education: req.body.education,
                image: req.body.image, 
            postInfo: req.body.postInfo,
                description: req.body.description,
            image: 'https://pebble-api.herokuapp.com/uploads/posts/'+req.file.filename
        })
    }
    else{
        newData = new postData({
            doctorInfo: req.body.doctorInfo,
                doctor_id: req.body.doctor_id,
                name: req.body.name,
                education: req.body.education,
                image: req.body.image, 
            postInfo: req.body.postInfo,
                description: req.body.description,
        })
    }
    newData.save((err, data) => {
        if(err) return res.json({Error: err});
        return res.json(data);
    })
};

const updateData = (req, res, next) => {
    let id = req.params.id
    if(req.file){
        postData.findOne({_id: id}, (err, data) => {
            if(err || !data) {
                return res.json({message: "Data not found"});
            }
            var temp = 'https://pebble-api.herokuapp.com/uploads/posts/'+req.file.filename
            data.image.push(temp)
            if(req.body.postInfo){
                data.postInfo.description = req.body.postInfo.description
            }   
            data.save(err => {
                if (err) { 
                return res.json({Error: err});
                }
                return res.json(data);
            })
        })
    }
    else{
        postData.findOne({_id: id}, (err, data) => {
            if(err || !data) {
                return res.json({message: "Data not found"});
            }
            if(req.body.postInfo){
                data.postInfo.description = req.body.postInfo.description
            }   
            data.save(err => {
                if (err) { 
                return res.json({Error: err});
                }
                return res.json(data);
            })
        })
    }
}

const updateCommentsData = (req, res, next) => {
    let id = req.params.id
    let user_id = req.body.user_id
    let comment = req.body.comment
    const tempData = {
        user_id: user_id,
        comment: comment
    }
    postData.findOne({_id: id}, (err, data) => {
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        data.postComments.push(tempData)
        data.save(err => {
            if (err) { 
            return res.json({message: "Comment failed to add.", error:err});
            }
            return res.json(data);
        })
    })
};

const addLike = (req, res, next) => {
    let id = req.params.id

    postData.findOne({_id: id}, (err, data) => {
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        data.postLikes += 1
        data.save(err => {
            if (err) { 
            return res.json({Error: err});
            }
            return res.json(data);
        })
    })
}

const removeLike = (req, res, next) => {
    let id = req.params.id

    postData.findOne({_id: id}, (err, data) => {
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        if(data.postLikes > 0){
            data.postLikes -= 1
        }
        data.save(err => {
            if (err) { 
            return res.json({Error: err});
            }
            return res.json(data);
        })
    })
}

const deleteAllData = (req, res, next) => {
    postData.deleteMany({}, err => {
        if(err) {
          return res.json({message: "Complete delete failed"});
        }
        return res.json({message: "Complete delete successful"});
    })
};

const deleteOneData = (req, res, next) => {
    let id = req.params.id
    
    postData.deleteOne({_id: id}, (err, data) => {
        if(err || !data) {
            return res.json({message: "Data doesn't exist."});
        }
        else return res.json({message: "Data deleted."});
    })
};

const deleteOneImage = (req, res, next) => {
    let id = req.params.id
    let filename = req.params.filename

    postData.findOne({_id: id}, (err, data)=>{
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        else{
            data.image.forEach((img, index) => {
                if(img.includes(filename)){
                    data.image.splice(index, 1);
                }
            })
            data.save()
            return res.json({message: "Image delete successful"});
        }
    })

}

const deleteAllComment = (req, res, next) => {
    let id = req.params.id

    postData.findOne({_id: id}, (err, data)=>{
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        else{
            data.postComments = []
            data.save()
            return res.json({message: "Complete delete successful"});
        }
    })

};

const deleteOneComment = (req, res, next) => {
    let id = req.params.id
    let comment_id = req.params.c_id

    postData.findOne({_id: id}, (err, data)=>{
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        else{
            function checkComment(comment){
                return comment._id != comment_id
            }
            var filteredComments = data.postComments.filter(checkComment)
            data.postComments = filteredComments
            data.save()
            return res.json({message: "Data deleted."});
        }
    })
};

module.exports = {
    getAllData,
    getOneData,
    uploadImg,
    displayImg,
    newData,
    updateData,
    updateCommentsData,
    addLike,
    removeLike,
    deleteAllData,
    deleteOneData,
    deleteOneImage,
    deleteAllComment,
    deleteOneComment
};
