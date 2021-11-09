const SItemData = require('../../models/users/userSItemModel');

const getAllData = (req, res, next) => {
    let user_id = req.params.user_id

    SItemData.find({user_id: user_id}, (err, data)=>{
        if (err){
            return res.json({Error: err});
        }
        return res.json(data);
    })
};

const getOneData = (req, res, next) => {
    let user_id = req.params.user_id
    let id = req.params.id;

    SItemData.findOne({user_id: user_id, _id: id}, (err, data)=>{
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        else return res.json(data); 
    })
};

const newData = (req, res) => {
    const newData = new SItemData({
        user_id: req.params.user_id,
        postID: req.body.postID
    })

    newData.save((err, data) => {
        if(err) return res.json({Error: err});
        return res.json(data);
    })
};

const deleteAllData = (req, res, next) => {
    let user_id = req.params.user_id

    SItemData.deleteMany({user_id: user_id}, err => {
        if(err) {
          return res.json({message: "Complete delete failed"});
        }
        return res.json({message: "Complete delete successful"});
    })
};

const deleteOneData = (req, res, next) => {
    let user_id = req.params.user_id
    let id = req.params.id;
    
    SItemData.deleteOne({user_id: user_id, _id: id}, (err, data) => {
        if(err || !data) {
            return res.json({message: "Data doesn't exist."});
        }
        else return res.json({message: "Data deleted."});
    })
};

module.exports = {
    getAllData,
    getOneData,
    newData,
    deleteAllData,
    deleteOneData
};
