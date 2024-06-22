const Category = require("../models/CategoryModel");

exports.categoryAdd = async (req, res) => {
    try {
        // currently assuming image as a url
        const { cg_name, cg_parentId } = req.body;
        let response = { status: false, message: "" };
        let newCategory = null;
        if (cg_parentId == null || cg_parentId == "") {
            newCategory = new Category({
                cg_name: cg_name,
                cg_parentId: "root",
                root: ["root"]
            });
            response.status = true;
        } else {
            const findParentCg = await Category.findOne({ _id: cg_parentId });
            if (!findParentCg) {
                response.message = "invalid cg_parentId!!!";
            } else {
                let root = findParentCg.root;
                newCategory = new Category({
                    cg_name: cg_name,
                    cg_parentId: cg_parentId,
                    root: root
                });
                root.push(cg_parentId);
                newCategory.root = root;
                response.status = true;
            }
        }
        if (response.status) {
            await newCategory.save();
            response.message = "Success category saved"
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(`--------error: ${error}`);
        res.status(404).json({ status: false, message: error.message });
    }
}
exports.categoryList = async (req, res) => {
    try {
        const { cg_id } = req.body;
        let response = { status: false, message: "" };
        let list = null;
        if (cg_id) {
            list = await Category.find({ _id: cg_id, is_delete: false });
            response.message = "invalid category id";
            if (list) {
                response.status = true;
                response.message = "category found";
                response.data = list;
            }
        } else {
            list = await Category.find({ is_delete: false });
            if (!list || list.length == 0) {
                response.status = false;
                response.message = "No category found";
            } else {
                response.status = true;
                response.message = "category found";
                response.data = list;
            }
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(`--------error: ${error}`);
        res.status(404).json({ status: false, message: error.message });
    }
}
exports.categoryDelete = async (req, res) => {
    try {
        const { cg_id } = req.body;
        const deleteCtg = await Category.findOneAndUpdate({ _id: cg_id, is_delete: false }, { $set: { is_deleted: true } });
        if (!deleteCtg) {
            res.status(200).json({ status: false, message: "Category not found" });
        }
        else {
            res.status(200).json({ status: true, message: "Category deleted successfully" });
        }
    } catch (error) {
        console.log(`--------error: ${error}`);
        res.status(404).json({ status: false, message: error.message });
    }
}
exports.categoryEdit = async (req, res) => {
    try {
        const { cg_id } = req.body;
        let response = { status: false, message: "" };
        let root = null;
        if (req.body.cg_parentId) {
            const findParentCg = await Category.findOne({ _id: req.body.cg_parentId, is_delete: false });
            if (!findParentCg) {
                response.message = "invalid cg_parentId!!!";
            }
            else {
                root = findParentCg.root;
                root.push(req.body.cg_parentId);
                req.body.root = root;
            }
        }
        const postData = req.body;
        delete postData._id;
        const updatedProfile = await Category.findByIdAndUpdate({ _id: cg_id, is_delete: false }, postData, { new: true });
        if (!updatedProfile) {
            response.message = "Invalid Category ID!!!!"
        }
        else {
            response.status = true;
            response.message = "Category updated successfully";
            response.data = updatedProfile;
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(`--------error: ${error}`);
        res.status(404).json({ status: false, message: error.message });
    }
}