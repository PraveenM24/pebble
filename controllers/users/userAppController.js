const userData = require('../../models/appointmentModel');

const getAllData = (req, res, next) => {
    userData.find({user_id: req.params.user_id}, (err, data)=>{
        if (err){
            return res.json({Error: err});
        }
        return res.json(data);
    })
};

const getOneData = (req, res, next) => {
    userData.findOne({_id:req.params.id, user_id: req.params.user_id}, (err, data)=>{
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        else return res.json(data); 
    })
};

const deleteAllData = (req, res, next) => {
    userData.deleteMany({user_id: req.params.user_id}, err => {
        if(err) {
          return res.json({message: "Complete delete failed"});
        }
        return res.json({message: "Complete delete successful"});
    })
};

const deleteOneData = (req, res, next) => {    
    userData.deleteOne({_id:req.params.id, user_id: req.params.user_id}, (err, data) => {
        if(err || !data) {
            return res.json({message: "Data doesn't exist."});
        }
        else return res.json({message: "Data deleted."});
    })
};

module.exports = {
    getAllData,
    getOneData,
    deleteAllData,
    deleteOneData
};