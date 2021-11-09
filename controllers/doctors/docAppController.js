const appData = require('../../models/appointmentModel');
const axios = require('axios').default;
const CryptoJS = require('crypto-js');

const getAllData = (req, res, next) => {
    appData.find({doctor_id: req.params.doctor_id}, (err, data)=>{
        if (err){
            return res.json({Error: err});
        }
        return res.json(data);
    })
};

const getOneData = (req, res, next) => {
    appData.findOne({_id: req.params.id, doctor_id: req.params.doctor_id}, (err, data)=>{
        if(err || !data) {
            return res.json({message: "Data not found"});
        }
        else return res.json(data); 
    })
};


const base64url = (source) => {
    var encodedSource = CryptoJS.enc.Base64.stringify(source)
    encodedSource = encodedSource.replace(/=+$/, '')
    encodedSource = encodedSource.replace(/\+/g, '-')
    encodedSource = encodedSource.replace(/\//g, '_')
    return encodedSource;
}

const generateJWT = () => {
    const header = {
        "alg": "HS256",
        "typ": "JWT"
    } 
    var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header))
    var encodedHeader = base64url(stringifiedHeader)
    const today = new Date()
    const tempExpiry = Date.parse(new Date(today.getFullYear(), today.getMonth(), today.getDate()+1))
    const expiry = parseInt(tempExpiry.toString().substring(0,tempExpiry.toString().length-3))
    const data = {
        "iss": "rcKAaq76RAekpvYZjB5Stw",
        "exp": expiry
    }
    var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data))
    var encodedData = base64url(stringifiedData)
    var token = encodedHeader + "." + encodedData
    var secret = 'yGZ1JGkJnRTJzQCu39UmVWzTjvx75XRqJMAd'
    var signature = CryptoJS.HmacSHA256(token, secret)
    signature = base64url(signature)
    var signedToken = token + "." + signature
    return signedToken
}

const newData = (req, res) => {
    const zoomID = 'kwmddd1_ScCXUkF4Ncl-eA' 
    if(req.body.appointmentDetails.mode === 'online' || req.body.appointmentDetails.mode === 'Online'){
        var meetingDate = req.body.appointmentDetails.date.substring(0, req.body.appointmentDetails.date.length-14)+"T"+req.body.appointmentDetails.time.substring(0, req.body.appointmentDetails.time.length-3)+":00"
        axios({
            method: 'POST',
            url: 'https://api.zoom.us/v2/users/'+zoomID+'/meetings',
            headers: {
                Authorization: 'Bearer ' + generateJWT()
            },
            data: {
                topic: "Therapy - " + req.body.patientDetails.name,
                type: "2",
                start_time: meetingDate,
                timezone: "Asia/Kolkata",
                duration: "60",
                password: Math.floor(Math.random() * 90000) + 10000
            }
        })
        .then(function(response) {
            const newData = new appData({
                doctor_id: req.params.doctor_id, 
                user_id: req.body.user_id,
                appointmentDetails: req.body.appointmentDetails,
                    date: req.body.date,
                    time: req.body.time,
                    type: req.body.type,
                    mode: req.body.mode,
                patientDetails: req.body.patientDetails,
                    name: req.body.name,
                    age: req.body.age,
                    gender: req.body.gender,
                price: req.body.price,
                payment: false,
                meeting_id: response.data.id,
                password: response.data.password,
                join_url: response.data.join_url,
            })
        
            newData.save((err, data) => {
                if(err) return res.json({Error: err});
                return res.json(data);
            })
        })
        .catch(function (err) {
            console.log(err)
        })
    }
    else{
        const newData = new appData({
            doctor_id: req.params.doctor_id, 
            user_id: req.body.user_id,
            appointmentDetails: req.body.appointmentDetails,
                date: req.body.date,
                time: req.body.time,
                type: req.body.type,
                mode: req.body.mode,
            patientDetails: req.body.patientDetails,
                name: req.body.name,
                age: req.body.age,
                gender: req.body.gender,
            price: req.body.price,
            payment: req.body.payment,
            meeting_id: '',
            password: '',
            join_url: '',
        })
    
        newData.save((err, data) => {
            if(err) return res.json({Error: err});
            return res.json(data);
        })
    }
};

const updateData = (req, res, next) => {
    appData.findOne({_id: req.params.id, doctor_id: req.params.doctor_id}, (err, data) => {
        if(err || !data) {
            return res.json({message: "Data not found"});
        }

        if(req.body.payment){
            data.payment = req.body.payment
        }

        if(req.body.doctorNotes){
            data.doctorNotes = req.body.doctorNotes
        }
        
        data.save()
        return res.json(data)
    })
};

const deleteAllData = (req, res, next) => {
    appData.deleteMany({}, err => {
        if(err) {
          return res.json({message: "Complete delete failed"});
        }
        return res.json({message: "Complete delete successful"});
    })
};

const deleteOneData = (req, res, next) => {
    let id = req.params.id;
    
    appData.deleteOne({_id: id}, (err, data) => {
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
