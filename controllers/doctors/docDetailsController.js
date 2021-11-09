const docData = require('../../models/doctors/docDetailsModel');
const multer = require('multer');
const mongoose = require('mongoose');
const {GridFsStorage} = require('multer-gridfs-storage')
const jwt = require('jsonwebtoken');
require('dotenv').config();

const url = process.env.MONGODB_URI;
const connect = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });
var gfs;
var docID = 1;

connect.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(connect.db, {
        bucketName: "uploads/doctors"
    });
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).send({message: "Authorization required"})
    jwt.verify(token, process.env.API_DOC_SECRET_KEY, (err, user) => {
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
            if (file.metadata.doctor_id == req.params.id) {
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
          bucketName: "uploads/doctors",
          filename: filename,
          metadata: {
              doctor_id: req.params.id
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
    docData.find({}, (err, data)=>{
        if (err){
            return res.json({Error: err});
        }
        return res.json(data);
    })
};

const getOneData = (req, res, next) => {
    let id = req.params.id;

    docData.findOne({doctor_id: id}, (err, data)=>{
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        else return res.json(data); 
    })
};

function fetchLastDocID(req, res){
    docData.find({}).sort({_id: -1}).limit(1)
    .then(data => {
        docID = parseInt(data[0].doctor_id.slice(8, ))
        newData(req, res)
    })
};

function* IDGenerator() {
    while(true){
        const date = new Date();
        yield 'PBL' + date.getFullYear() + '.' + docID
        docID++
    }
};

const generator = IDGenerator()
const newData = (req, res) => {
    const generatedID = generator.next().value
    docData.findOne({
        contact:{
            email: req.body.email
        }
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
            docData.findOne({
                doctor_id: generatedID
            }, (err, data) =>{
                if(data){
                    fetchLastDocID(req, res)
                }
                else{
                    var newData
                    if(req.file){
                        newData = new docData({
                            doctor_id: generatedID, 
                            basic: req.body.basic,
                                first_name: req.body.first_name,
                                last_name: req.body.last_name, 
                                dob: req.body.dob, 
                                image: req.file.path, 
                            contact: req.body.contact,
                                email: req.body.email, 
                                phone: req.body.phone,
                            work: req.body.work,
                                education: req.body.education, 
                                specialization: req.body.specialization, 
                                experience: req.body.experience, 
                                languages: req.body.languages, 
                                bio: req.body.bio, 
                            tags: req.body.tags,
                            ratings: req.body.ratings, 
                        })
                    }
                    else{
                        newData = new docData({
                            doctor_id: generatedID, 
                            basic: req.body.basic,
                                first_name: req.body.first_name,
                                last_name: req.body.last_name, 
                                dob: req.body.dob, 
                            contact: req.body.contact,
                                email: req.body.email, 
                                phone: req.body.phone,
                            work: req.body.work,
                                education: req.body.education, 
                                specialization: req.body.specialization, 
                                experience: req.body.experience, 
                                languages: req.body.languages, 
                                bio: req.body.bio, 
                            tags: req.body.tags,
                            ratings: req.body.ratings, 
                        })
                    }
                    newData.save((err, data) => {
                        if(err) return res.json({Error: err});
                        return res.json(data);
                    })
                }
            })
        }
    })
};

const updateData = (req, res, next) => {
    console.log('Update running')
    docData.findOne({doctor_id: req.params.id}, (err, data) => {
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        else{
            if(req.body.access_blocked != undefined){
                data.access_blocked = req.body.access_blocked;
            }
            if(req.body.basic){
                if(req.body.first_name){
                    data.first_name = req.body.first_name
                }
                if(req.body.last_name){
                    data.last_name = req.body.last_name
                }
                if(req.body.dob){
                    data.dob = req.body.dob
                }
            }
            if(req.body.contact){
                if(req.body.email){
                    data.email = req.body.email
                }
                if(req.body.phone){
                    data.phone = req.body.phone
                }
            }
            if(req.body.work){
                if(req.body.education){
                    data.education = req.body.education
                }
                if(req.body.specialization){
                    data.specialization = req.body.specialization
                }
                if(req.body.experience){
                    data.experience = req.body.experience
                }
                if(req.body.languages){
                    data.languages = req.body.languages
                }
                if(req.body.bio){
                    data.bio = req.body.bio
                }
            }
            if(req.body.tags){
                if(Array.isArray(req.body.tags)){
                    req.body.tags.length == 0 ? data.tags = [] : data.tags = [...data.tags, ...req.body.tags]
                }
                else{
                    data.tags.push(req.body.tags)
                }
            }
            if(req.body.ratings){
                data.ratings = req.body.ratings
            }
            if(req.file){
                data.image = 'https://pebble-test.herokuapp.com/uploads/doctors/'+req.file.filename
            }
        }       
        data.save()
        return res.json(data)
    })
};

const deleteAllData = (req, res, next) => {
    docData.deleteMany({}, err => {
        if(err) {
          return res.json({message: "Complete delete failed"});
        }
        return res.json({message: "Complete delete successful"});
    })
};

const deleteOneData = (req, res, next) => {
    let id = req.params.id;
    
    docData.deleteOne({_id: id}, (err, data) => {
        if(err || !data) {
            return res.json({message: "Data doesn't exist."});
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
