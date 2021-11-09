const express = require('express'); 

//admin 
const adminLoginController = require('../controllers/admin/adminLoginController')

//user
const userLoginController = require('../controllers/users/userLoginController');
const userAppController = require('../controllers/users/userAppController');
const userDetailsController = require('../controllers/users/userDetailsController');
const userMoodController = require('../controllers/users/userMoodController');
const userSItemController = require('../controllers/users/userSItemController');

//doctor
const docLoginController = require('../controllers/doctors/docLoginController');
const docDetailsController = require('../controllers/doctors/docDetailsController');
const docAvailController = require('../controllers/doctors/docAvailController');
const docServicesController = require('../controllers/doctors/docServicesController');
const docAppController = require('../controllers/doctors/docAppController');

//posts
const docPostController = require('../controllers/posts/docPostController');
const extraContentController = require('../controllers/posts/extraContentController');

//temp
const tempDocDetailsController = require('../controllers/temp/tempDocDetailsController');

const router  = express.Router();

//admin - login 
router.get('/admin/login', adminLoginController.authenticateToken, adminLoginController.getAllData);
router.post('/admin/login/add', adminLoginController.authenticateToken, adminLoginController.newData);
router.patch('/admin/login/update/:id', adminLoginController.authenticateToken, adminLoginController.updateData);
router.delete('/admin/login/remove/:id', adminLoginController.authenticateToken, adminLoginController.deleteOneData);

//user - login
router.get('/users/login', userLoginController.getAllData);
router.get('/users/login/:id', userLoginController.getOneData);
router.post('/users/login', userLoginController.newData); 
router.patch('/users/login/:id', userLoginController.updateData);
//router.delete('/users/login', userLoginController.deleteAllData);
router.delete('/users/login/:id', userLoginController.deleteOneData);

//user - account verification
router.get('/users/verify/:uniqueString', userLoginController.verifyUser);

//user - details
router.get('/users', userDetailsController.authenticateToken, userDetailsController.getAllData);
router.get('/users/:id', userDetailsController.authenticateToken, userDetailsController.getOneData);
router.post('/users', userDetailsController.authenticateToken, userDetailsController.newData); 
router.patch('/users/:id', userDetailsController.authenticateToken, userDetailsController.imagePreCheck, userDetailsController.uploadImg, userDetailsController.updateData); 
//router.delete('/users', userDetailsController.authenticateToken, userDetailsController.deleteAllData);
router.delete('/users/:id', userDetailsController.authenticateToken, userDetailsController.deleteOneData);

router.get('/uploads/users/:filename', userDetailsController.displayImg);

//user - appointments
router.get('/users/:user_id/appointments', userAppController.getAllData);
router.get('/users/:user_id/appointments/:id', userAppController.getOneData);
//router.delete('/users/:user_id/appointments', userAppController.deleteAllData);
router.delete('/users/:user_id/appointments/:id', userAppController.deleteOneData);

//user - mood tracker
router.get('/users/:user_id/mood', userMoodController.getAllData);
router.get('/users/:user_id/mood/:id', userMoodController.getAllData);
router.post('/users/:user_id/mood', userMoodController.newData)
//router.delete('/users/:user_id/mood', userMoodController.deleteAllData);
router.delete('/users/:user_id/mood/:id', userMoodController.deleteOneData);

//user - saved items
router.get('/users/:user_id/savedItems', userSItemController.getAllData);
router.get('/users/:user_id/savedItems/:id', userSItemController.getAllData);
router.post('/users/:user_id/savedItems', userSItemController.newData)
//router.delete('/users/:user_id/savedItems', userSItemController.deleteAllData);
router.delete('/users/:user_id/savedItems/:id', userSItemController.deleteOneData);

//doctor - login
router.get('/doctors/login', docLoginController.getAllData);
router.get('/doctors/login/:id', docLoginController.getOneData);
router.post('/doctors/login', docLoginController.newData); 
router.patch('/doctors/login/:id', docLoginController.updateData);
//router.delete('/doctors/login', docLoginController.deleteAllData);
router.delete('/doctors/login/:id', docLoginController.deleteOneData);

//doctor - details
router.get('/doctors', docDetailsController.authenticateToken, docDetailsController.getAllData);
router.get('/doctors/:id', docDetailsController.authenticateToken, docDetailsController.getOneData);
router.post('/doctors', docDetailsController.authenticateToken, docDetailsController.newData); 
router.patch('/doctors/:id',docDetailsController.authenticateToken, docDetailsController.uploadImg, docDetailsController.updateData); 
//router.delete('/doctors', docDetailsController.authenticateToken, docDetailsController.deleteAllData);
router.delete('/doctors/:id', docDetailsController.authenticateToken, docDetailsController.deleteOneData);

router.get('/uploads/doctors/:filename', docDetailsController.displayImg);

//doctor - availability
router.get('/doctors/:doctor_id/availability', docAvailController.getAllData);
router.get('/doctors/:doctor_id/availability/:id', docAvailController.getOneData);
router.post('/doctors/:doctor_id/availability', docAvailController.newData); 
router.patch('/doctors/:doctor_id/availability/:id', docAvailController.updateData); 
//router.delete('/doctors/:doctor_id/availability', docAvailController.deleteAllData);
router.delete('/doctors/:doctor_id/availability/:id', docAvailController.deleteOneData);

//doctor - services
router.get('/doctors/:doctor_id/services', docServicesController.getAllData);
router.get('/doctors/:doctor_id/services/:id', docServicesController.getOneData);
router.post('/doctors/:doctor_id/services', docServicesController.newData); 
router.patch('/doctors/:doctor_id/services/:id', docServicesController.updateData); 
//router.delete('/doctors/:doctor_id/services', docServicesController.deleteAllData);
router.delete('/doctors/:doctor_id/services/:id', docServicesController.deleteOneData);

//doctor - appointments 
router.get('/doctors/:doctor_id/appointments', docAppController.getAllData);
router.get('/doctors/:doctor_id/appointments/:id', docAppController.getOneData);
router.post('/doctors/:doctor_id/appointments', docAppController.newData); 
router.patch('/doctors/:doctor_id/appointments/:id', docAppController.updateData); 
//router.delete('/doctors/:doctor_id/appointments', docAppController.deleteAllData);
router.delete('/doctors/:doctor_id/appointments/:id', docAppController.deleteOneData);

//home - extra content
router.get('/posts/extra', extraContentController.getAllData);
router.get('/posts/extra/:id', extraContentController.getOneData);
router.post('/posts/extra', extraContentController.uploadImg, extraContentController.newData); 
router.patch('/posts/extra/:id', extraContentController.updateData); 
//router.delete('/posts/extra', extraContentController.deleteAllData);
router.delete('/posts/extra/:id', extraContentController.deleteOneData);

router.get('/uploads/posts/extras/:filename', extraContentController.displayImg);

//home - doctor posts
router.get('/posts', docPostController.getAllData);
router.get('/posts/:id', docPostController.getOneData);
router.post('/posts', docPostController.uploadImg, docPostController.newData); 
router.patch('/posts/:id', docPostController.uploadImg, docPostController.updateData);
router.post('/posts/:id/comment', docPostController.updateCommentsData); 
router.post('/posts/:id/like', docPostController.addLike);
//router.delete('/posts', docPostController.deleteAllData);
router.delete('/posts/:id', docPostController.deleteOneData);
router.delete('/posts/:id/image/:filename', docPostController.deleteOneImage);
router.delete('/posts/:id/comment', docPostController.deleteAllComment);
router.delete('/posts/:id/comment/:c_id', docPostController.deleteOneComment);
router.delete('/posts/:id/like', docPostController.removeLike);

router.get('/uploads/posts/:filename', docPostController.displayImg);

//temp - doctor registration
router.get('/temp/doctors', tempDocDetailsController.authenticateToken, tempDocDetailsController.getAllData);
router.get('/temp/doctors/:id', tempDocDetailsController.authenticateToken, tempDocDetailsController.getOneData);
router.post('/temp/doctors', tempDocDetailsController.authenticateToken, tempDocDetailsController.newData); 
router.patch('/temp/doctors/:id',tempDocDetailsController.authenticateToken, tempDocDetailsController.updateData); 
router.delete('/temp/doctors', tempDocDetailsController.authenticateToken, tempDocDetailsController.deleteAllData);
router.delete('/temp/doctors/:id', tempDocDetailsController.authenticateToken, tempDocDetailsController.deleteOneData);

module.exports = router;