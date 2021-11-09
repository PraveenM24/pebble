const adminLogin = require('../../models/admin/adminLoginModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).send({message: "Authorization required"})
    jwt.verify(token, process.env.API_ADMIN_SECRET_KEY, (err, user) => {
        if (err){
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

const getAllData = (req, res, next) => {
    adminLogin.find({}, (err, data) => {
        if (err) {
            return res.json({
                Error: err
            });
        }
        return res.json(data);
    })
};

const newData = (req, res) => {
    adminLogin.findOne({
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
            const newData = new adminLogin({
                email: req.body.email,
                password: req.body.password
            })
            newData.save((err, data) => {
                if (err) return res.json({
                    Error: err
                });
                return res.json(data);
            })            
        } 
    })
};

const updateData = (req, res, next) => {
    adminLogin.findOne({
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
};

const deleteOneData = (req, res, next) => {
    let id = req.params.id;
    adminLogin.deleteOne({
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
    authenticateToken,
    getAllData,
    newData,
    updateData,
    deleteOneData
};