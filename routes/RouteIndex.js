const express = require('express');
const userRouter = require('./user');
const productRouter = require('./product');
const marketplaceRouter = require('./marketplace');
const imageUploadRouter = require('./Imageupload');
const fileUploadRouter = require('./Fileupload');
const router = express.Router();

router.use('/user',userRouter);
router.use('/product',productRouter);
router.use('/image',imageUploadRouter);
router.use('/file',fileUploadRouter);
router.use('/marketplace',marketplaceRouter);

module.exports = router;
