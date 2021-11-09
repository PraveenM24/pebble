const moodData = require('../../models/users/userMoodModel');

const getAllData = (req, res, next) => {
    let user_id = req.params.user_id

    moodData.find({user_id: user_id}, (err, data)=>{
        if (err){
            return res.json({Error: err});
        }
        return res.json(data);
    })
};

const getOneData = (req, res, next) => {
    let user_id = req.params.user_id
    let id = req.params.id;

    moodData.findOne({user_id: user_id, _id: id}, (err, data)=>{
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        else return res.json(data); 
    })
};

const newData = (req, res) => {
    const newData = new moodData({
        user_id: req.params.user_id,
        mood: req.body.mood,
        time: Date.now() + (5.5*60*60*1000)
    })

    newData.save((err, data) => {
        if(err) return res.json({Error: err});
        return res.json(data);
    })
};

const deleteAllData = (req, res, next) => {
    let user_id = req.params.user_id

    moodData.deleteMany({user_id: user_id}, err => {
        if(err) {
          return res.json({message: "Complete delete failed"});
        }
        return res.json({message: "Complete delete successful"});
    })
};

const deleteOneData = (req, res, next) => {
    let user_id = req.params.user_id
    let id = req.params.id;
    
    moodData.deleteOne({user_id: user_id, _id: id}, (err, data) => {
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
