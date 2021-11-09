const availData = require('../../models/doctors/docAvailabilityModel');

const getAllData = (req, res, next) => {
    availData.find({doctor_id: req.params.doctor_id}, (err, data)=>{
        if (err){
            return res.json({Error: err});
        }
        return res.json(data);
    })
};

const getOneData = (req, res, next) => {
    availData.findOne({_id: req.params.id, doctor_id: req.params.doctor_id}, (err, data)=>{
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        else return res.json(data); 
    })
};

const newData = (req, res) => {
    const newData = new availData({
        doctor_id: req.body.doctor_id,
        onlineAvailability: req.body.onlineAvailability,
            sun: req.body.sun,
                enabled: req.body.enabled,
                timing: req.body.timing,
            mon: req.body.mon,
                enabled: req.body.enabled,
                timing: req.body.timing,
            tue: req.body.tue,
                enabled: req.body.enabled,
                timing: req.body.timing,
            wed: req.body.wed,
                enabled: req.body.enabled,
                timing: req.body.timing,
            thu: req.body.thu,
                enabled: req.body.enabled,
                timing: req.body.timing,
            fri: req.body.fri,
                enabled: req.body.enabled,
                timing: req.body.timing,
            sat: req.body.sat,
                enabled: req.body.enabled,
                timing: req.body.timing,
        inclinicAvailability: req.body.inclinicAvailability,
            sun: req.body.sun,
                enabled: req.body.enabled,
                timing: req.body.timing,
            mon: req.body.mon,
                enabled: req.body.enabled,
                timing: req.body.timing,
            tue: req.body.tue,
                enabled: req.body.enabled,
                timing: req.body.timing,
            wed: req.body.wed,
                enabled: req.body.enabled,
                timing: req.body.timing,
            thu: req.body.thu,
                enabled: req.body.enabled,
                timing: req.body.timing,
            fri: req.body.fri,
                enabled: req.body.enabled,
                timing: req.body.timing,
            sat: req.body.sat,
                enabled: req.body.enabled,
                timing: req.body.timing,
    })

    newData.save((err, data) => {
        if(err) return res.json({Error: err});
        return res.json(data);
    })
};

const updateData = (req, res, next) => {
    availData.findOne({_id: req.params.id, doctor_id: req.params.doctor_id}, (err, data) => {
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        if(req.body.doctor_id){
            data.doctor_id = req.params.doctor_id
        }
        if(req.body.onlineAvailability){
            data.onlineAvailability = req.body.onlineAvailability
        
            if(req.body.sun){
                data.sun = req.body.sun
                if(req.body.enabled){
                    data.enabled = req.body.enabled
                }
                if(req.body.timing){
                    data.timing = req.body.timing
                }
            }
            if(req.body.mon){
                data.mon = req.body.mon
                if(req.body.enabled){
                    data.enabled = req.body.enabled
                }
                if(req.body.timing){
                    data.timing = req.body.timing
                }
            }
            if(req.body.tue){
                data.tue = req.body.tue
                if(req.body.enabled){
                    data.enabled = req.body.enabled
                }
                if(req.body.timing){
                    data.timing = req.body.timing
                }
            }
            if(req.body.wed){
                data.wed = req.body.wed
                if(req.body.enabled){
                    data.enabled = req.body.enabled
                }
                if(req.body.timing){
                    data.timing = req.body.timing
                }
            }
            if(req.body.thu){
                data.thu = req.body.thu
                if(req.body.enabled){
                    data.enabled = req.body.enabled
                }
                if(req.body.timing){
                    data.timing = req.body.timing
                }
            }            
            if(req.body.fri){
                data.fri = req.body.fri
                if(req.body.enabled){
                    data.enabled = req.body.enabled
                }
                if(req.body.timing){
                    data.timing = req.body.timing
                }
            }

            if(req.body.sat){
                data.sat = req.body.sat
                if(req.body.enabled){
                    data.enabled = req.body.enabled
                }
                if(req.body.timing){
                    data.timing = req.body.timing
                }
            } 
        }          
        if(req.body.inclinicAvailability){
            data.inclinicAvailability = req.body.inclinicAvailability
        
            if(req.body.sun){
                data.sun = req.body.sun
                if(req.body.enabled){
                    data.enabled = req.body.enabled
                }
                if(req.body.timing){
                    data.timing = req.body.timing
                }
            }
            if(req.body.mon){
                data.mon = req.body.mon
                if(req.body.enabled){
                    data.enabled = req.body.enabled
                }
                if(req.body.timing){
                    data.timing = req.body.timing
                }
            }
            if(req.body.tue){
                data.tue = req.body.tue
                if(req.body.enabled){
                    data.enabled = req.body.enabled
                }
                if(req.body.timing){
                    data.timing = req.body.timing
                }
            }
            if(req.body.wed){
                data.wed = req.body.wed
                if(req.body.enabled){
                    data.enabled = req.body.enabled
                }
                if(req.body.timing){
                    data.timing = req.body.timing
                }
            }
            if(req.body.thu){
                data.thu = req.body.thu
                if(req.body.enabled){
                    data.enabled = req.body.enabled
                }
                if(req.body.timing){
                    data.timing = req.body.timing
                }
            }            
            if(req.body.fri){
                data.fri = req.body.fri
                if(req.body.enabled){
                    data.enabled = req.body.enabled
                }
                if(req.body.timing){
                    data.timing = req.body.timing
                }
            }

            if(req.body.sat){
                data.sat = req.body.sat
                if(req.body.enabled){
                    data.enabled = req.body.enabled
                }
                if(req.body.timing){
                    data.timing = req.body.timing
                }
            }
        }
        data.save()
        return res.json(data)
    })
};

const deleteAllData = (req, res, next) => {
    availData.deleteMany({doctor_id: req.params.doctor_id}, err => {
        if(err) {
          return res.json({message: "Complete delete failed"});
        }
        return res.json({message: "Complete delete successful"});
    })
};

const deleteOneData = (req, res, next) => {
    let id = req.params.id;
    
    availData.deleteOne({_id: id, doctor_id: req.params.doctor_id}, (err, data) => {
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
