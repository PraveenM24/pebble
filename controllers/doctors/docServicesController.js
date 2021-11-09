const servicesData = require('../../models/doctors/docServicesModel');

const getAllData = (req, res, next) => {
    let doctor_id = req.params.doctor_id;
    servicesData.find({doctor_id: doctor_id}, (err, data)=>{
        if (err){
            return res.json({Error: err});
        }
        return res.json(data);
    })
};

const getOneData = (req, res, next) => {
    let doctor_id = req.params.doctor_id;
    let id = req.params.id;

    servicesData.findOne({doctor_id: doctor_id, _id: id}, (err, data)=>{
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        else return res.json(data); 
    })
};

const newData = (req, res) => {
    const newData = new servicesData({
        doctor_id: req.params.doctor_id,
        enquiry: req.body.enquiry,
            enabled: req.body.enabled,
            interval: req.body.interval,
            cost: req.body.cost,
        therapy: req.body.therapy,
            enabled: req.body.enabled,
            interval: req.body.interval,
            cost: req.body.cost,
        consultation: req.body.consultation,
            enabled: req.body.enabled,
            interval: req.body.interval,
            cost: req.body.cost,
    })

    newData.save((err, data) => {
        if (err) return res.json({
            Error: err
        });
        return res.json(data);
    })
};

const updateData = (req, res, next) => {
    let doctor_id = req.params.doctor_id;
    let id = req.params.id;

    servicesData.findOne({
        doctor_id: doctor_id,
        _id: id
    }, (err, data) => {
        if (err || !data) {
            return res.json({
                message: "Data not found"
            });
        }
        if(req.body.enquiry){
            data.enquiry.enabled = req.body.enquiry.enabled
            data.enquiry.interval = req.body.enquiry.interval
            data.enquiry.cost = req.body.enquiry.cost
        }
        if(req.body.therapy){
            data.therapy.enabled = req.body.therapy.enabled
            data.therapy.interval = req.body.therapy.interval
            data.therapy.cost = req.body.therapy.cost
        }
        if(req.body.consultation){
            data.consultation.enabled = req.body.consultation.enabled
            data.consultation.interval = req.body.consultation.interval
            data.consultation.cost = req.body.consultation.cost
        }
        data.save()
        return res.json(data)
    })
};

const deleteAllData = (req, res, next) => {
    let doctor_id = req.params.doctor_id;

    servicesData.deleteMany({doctor_id: doctor_id}, err => {
        if(err) {
          return res.json({message: "Complete delete failed"});
        }
        return res.json({message: "Complete delete successful"});
    })
};

const deleteOneData = (req, res, next) => {
    let doctor_id = req.params.doctor_id;
    let id = req.params.id;
    
    servicesData.deleteOne({doctor_id: doctor_id, _id: id}, (err, data) => {
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
    updateData,
    deleteAllData,
    deleteOneData
};
