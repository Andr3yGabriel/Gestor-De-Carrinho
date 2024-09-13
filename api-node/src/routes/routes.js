const express = require('express');
const UserController = require('../controllers/UserController');
const ProductController = require('../controllers/ProductController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/user/register', UserController.register);
router.post('/user/login', UserController.login);

router.use(verifyToken);

router.put('/user/update/:id', UserController.updateUser);
router.delete('/user/delete/:id', UserController.deleteUser);
router.put('/user/changepassword/:id', UserController.changePassword);

router.post('/product/create', ProductController.create);
router.get('/product/list', ProductController.getAll);
router.get('/product/detail/:id', ProductController.getById);
router.put('/product/update/:id', ProductController.update);
router.delete('/product/delete/:id', ProductController.delete);

module.exports = router;