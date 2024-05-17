/* 
    path: api/login
*/

const { Router } = require('express');
const { crearUsuario, loginUsuario, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El contraseña es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').isEmail(),
    validarCampos
], crearUsuario);

router.post('/', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'El contraseña es obligatorio').not().isEmpty(),
], loginUsuario);

// validarJWT
router.get('/renew', validarJWT, renewToken);

module.exports = router;