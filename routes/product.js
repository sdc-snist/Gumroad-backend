const express = require('express');
const {Product} = require('../db');
const { authMiddleware } = require('../middlewares/Authmiddleware');
const router = express.Router();

router.post('/create-product',authMiddleware, async (req, res) => {
    const body = req.body;
    if(!body){
        return res.status(400).json({
            message: "Please provide product details"
        });
    }
    const product = await Product.create(body);
    if(!product){
        return res.status(500).json({
            message: "Product creation failed"
        });
    }
    res.status(201).json({
        message: "Product created successfully",
        product
    });
});

router.put('/new-product',authMiddleware, async (req, res) => {
    try {
        const body = req.body;
        const id  = req.userId;  
        if (!body) {
            throw new Error("Request body is missing");
        }
        const product = await Product.findOne({ userId: id });
        if (!product) {
            return res.status(404).json({ message: "User not found" });
        }
        product.products.push(body);
        await product.save();
        res.json({
            message: "products updated successfully",
            product,
        });
    } catch (error) {
        console.error("Error updating the Products:", error.message);
        res.status(500).json({
            message: "An error occurred while updating the Products",
            error: error.message,
        });
    }
});

router.put('/update-product/:productId',authMiddleware, async (req, res) => {
    const userId = req.userId;
    const productId  = req.params.productId;
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            message: "Request Body is missing"
        });
    }
    const user = await Product.findOne({ userId: userId });
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }
    const product = user.products.id(productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    product.productName = body.productName || product.productName;
    product.productDescription = body.productDescription || product.productDescription;
    product.price = body.price || product.price;
    product.published = body.published || product.published;
    await user.save();
    res.json({
        message: "Product updated successfully",
        product,
    });
}); 

router.delete('/delete-product/:productId',authMiddleware, async (req, res) => {
    const userId = req.userId;
    const productId  = req.params.productId;
    const user = await Product.findOne({ userId: userId });
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }
    const product = user.products.id(productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    user.products.remove(product);

    await user.save();
    res.json({
        message: "Product deleted successfully",
        product,
    });
})


router.get('/bulk',authMiddleware, async (req, res) => {
    try {
        const id  = req.userId;  
        const userProducts = await Product.findOne({ userId: id });
        if (!userProducts) {
            return res.status(404).json({ message: "No Product found" });
        }
        res.json({
            message: "User Products fetched successfully",
            userProducts: userProducts.products,
        });
    } catch (error) {
        console.error("Error fetching user Products:", error.message);
        res.status(500).json({
            message: "An error occurred while fetching the user Products",
            error: error.message,
        });
    }
})

module.exports = router;