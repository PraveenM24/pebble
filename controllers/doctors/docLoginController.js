const docLogin = require('../../models/doctors/docLoginModel')
const bcrypt = require('bcrypt')

const getAllData = (req, res, next) => {
    docLogin.find({}, (err, data) => {
        if (err) {
            return res.json({
                Error: err
            });
        }
        return res.json(data);
    })
};

const getOneData = (req, res, next) => {
    let id = req.params.id;

    docLogin.findOne({
        _id: id
    }, (err, data) => {
        if (err || !data) {
            return res.json({
                message: "Data not found"
            });
        } else return res.json(data);
    })
};

const newData = (req, res) => {
    const orgPassword = req.body.password

    docLogin.findOne({
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
            bcrypt.hash(orgPassword, 10, function(err, hashedPassword) {
                if(err) return res.json({
                    Error: err
                });
                const newData = new docLogin({
                    email: req.body.email,
                    password: hashedPassword
                })
                newData.save((err, data) => {
                    if (err) return res.json({
                        Error: err
                    });
                    return res.json(data);
                })
            });
        } 
    })
};

const updateData = (req, res, next) => {
    docLogin.findOne({
        _id: req.params.id
    }, (err, data) => {
        if (err || !data) {
            return res.json({
                message: "Data not found"
            });
        }
        if (req.body.email) {
            data.email = req.body.email
        }
        if (req.body.password) {
            data.password = req.body.password
        }
        data.save()
        return res.json(data)
    })
}

const deleteAllData = (req, res, next) => {
    docLogin.deleteMany({}, err => {
        if (err) {
            return res.json({
                message: "Complete delete failed"
            });
        }
        return res.json({
            message: "Complete delete successful"
        });
    })
};

const deleteOneData = (req, res, next) => {
    let id = req.params.id;

    docLogin.deleteOne({
        _id: id
    }, (err, data) => {
        if (err || !data) {
            return res.json({
                message: "Data doesn't exist."
            });
        } else return res.json({
            message: "Data deleted."
        });
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