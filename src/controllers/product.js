const Product = require("../models/ProductModel");
const Category = require("../models/CategoryModel");
exports.productAdd = async (req, res) => {
    try {
        // currently assuming image as a url
        const { pd_name, pd_image, pd_price, pd_description, pd_category } = req.body;
        const category = await Category.findById(pd_category);
        if (!category) {
            res.status(200).json({ status: false, message: "Invalid category passed" });
        }
        else {
            const cg_name = category.cg_name;
            const newProduct = new Product({
                pd_name,
                pd_image,
                pd_price,
                pd_description,
                pd_title,
                pd_category: cg_name
            });
            await newProduct.save();
            res.status(200).json({ status: true, message: "Product saved successfully" });
        }
    } catch (error) {
        console.log(`--------error: ${error}`);
        res.status(404).json({ status: false, message: error.message });
    }
}
exports.productList = async (req, res) => {
    try {
        const { pd_title } = req.body;
        let list = [];
        if (pd_title) {
            list = await Product.find({ pd_title: pd_title, is_delete: false });
        }
        else {
            list = await Product.find({ is_delete: false });
        }
        if (!list || list.length == 0) {
            res.status(200).json({ status: false, message: "No product found" });
        }
        else {
            res.status(200).json({ status: true, message: "product List found", data: list });
        }
    } catch (error) {
        console.log(`--------error: ${error}`);
        res.status(404).json({ status: false, message: error.message });
    }
}
exports.productDelete = async (req, res) => {
    try {
        const { pd_id } = req.body;
        const deletePrd = await Product.findOneAndUpdate({ _id: pd_id, is_delete: false }, { $set: { is_delete: true } });
        if (!deletePrd) {
            res.status(200).json({ status: false, message: "Product not found" });
        }
        else {
            res.status(200).json({ status: true, message: "Product deleted successfully" });
        }
    } catch (error) {
        console.log(`--------error: ${error}`);
        res.status(404).json({ status: false, message: error.message });
    }
}
exports.productEdit = async (req, res) => {
    try {
        let response = { status: false, message: "" };
        if (req.body.pd_category) {
            const category = await Category.findById(req.body.pd_category);
            response.message = "Invalid category!!";
            if (category) {
                req.body.pd_category = category.cg_name;
                response.status = true;
            }
        }
        else {
            response.status = true;

        }



        if (!response.status) {
            res.status(200).json(response);
        }
        else {
            const postData = req.body;
            delete postData._id;
            const editPrd = await Product.findOneAndUpdate({ _id: pd_id, is_delete: false }, postData, { new: true });
            if (!editPrd) {
                response.status = false;
                response.message = "Product not found!!";
            } else {
                response.status = true;
                response.message = "Product updated successfully!!";
            }

            res.status(200).json(response);
        }


    } catch (error) {
        console.log(`--------error: ${error}`);
        res.status(404).json({ status: false, message: error.message });
    }
}