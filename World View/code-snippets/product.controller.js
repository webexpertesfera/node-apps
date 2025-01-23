const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const { Product } = require("../../models/product.model");
const fs = require('fs');
const path = require('path');
const { getMessage, getBusinessSeller, paginate } = require("../../services/user.service");
const { ProductType, BusinessCategories } = require("../../models/categories.model");
function generateRandomSixDigitNumber() {
    return Math.floor(Math.random() * 900000) + 100000;
}
const addProduct = catchAsync(async (req, res) => {
    const { id } = req.user
    const { discountPrice, price } = req.body
    if (!Array.isArray(req.body.productImages)) {
        return res.status(httpStatus.BAD_REQUEST).send({
            status: 400, message: getMessage("invalidProductImages", req.lang),
        });
    }

    if (req.body.productImages.length > 6) {
        return res.status(httpStatus.BAD_REQUEST).send({
            status: 400, message: getMessage("onlyFiveImages", req.lang),
        });
    }
    let discountPercentage = " ";
    if (discountPrice && price) {
        if (discountPrice > price) return res.status(httpStatus.BAD_REQUEST).send({ status: 400, message: "Discount Price should be less then original price." })
        discountPercentage = ((price - discountPrice) / price * 100).toFixed(2); // Round to two decimal places 
    }
    const validProductType = await ProductType.findById(req.body.productType)
    if (!validProductType) return res.status(httpStatus.BAD_REQUEST).send({ status: 400, message: getMessage("invalidProductType", req.lang) })
    const findBusinessSeller = await getBusinessSeller(id)
    if (!findBusinessSeller) return res.status(httpStatus.BAD_REQUEST).send({ status: 400, message: getMessage("businessSellerNotFound", req.lang) })
    const currentDate = new Date().toISOString();
    const data = await Product.create({
        ...req.body,
        seller: findBusinessSeller._id,
        date: currentDate,
        productId: String(generateRandomSixDigitNumber()),
        discountPercentage
    });

    return res.status(httpStatus.OK).send({
        status: 200,
        message: getMessage("productAddedSuccess", req.lang),
    });
});

const getProductById = catchAsync(async (req, res) => {
    const { id } = req.params
    const lang = req.lang
    const data = await Product.findById(id)
        .populate("seller", "businessName businessEmail profileImage ")
        .populate("productType", "productType").populate("category", "categoryName")
    if (!data) return res.status(httpStatus.BAD_REQUEST).send({ status: 400, message: getMessage("noProductFound", lang) })
    const productType = data.productType ? { _id: data.productType._id, productType: data.productType.productType[lang] } : null;
    const category = data.category ? { _id: data.category._id, categoryName: data.category.categoryName[lang] } : null;
    return res.status(httpStatus.OK).send({
        status: 200,
        message: getMessage("productFetched", lang),
        data: { ...data._doc, productType, category }
    })
})

const deleteProductById = catchAsync(async (req, res) => {
    const { id } = req.body;
    const lang = req.lang
    const data = await Product.findByIdAndDelete(id);

    if (!data) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: getMessage("noProductFound", lang) });
    }

    const images = data.productImages;

    if (images && images.length > 0) {


        const deleteImage = (imagePath) => {
            const filePath = path.join(imagePath);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        };

        images.forEach(image => {
            deleteImage(image);
        });
    }

    return res.status(httpStatus.OK).send({ status: 200, success: true, message: getMessage("productDeleted", lang) });
});

const getApprovedProducts = catchAsync(async (req, res) => {
    const lang = req.lang;
    const { productType, date, page, limit } = req.query;
    const findBusinessSeller = await getBusinessSeller(req.user.id);
    
    if (!findBusinessSeller) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: getMessage("businessSellerNotFound", req.lang) });
    }

    const query = {
        seller: findBusinessSeller._id,
        isApproved: true
    };
    
    if (productType) {
        query.productType = productType;
    }
    
    if (date) {
        const targetDate = new Date(date);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        query.date = {
            $gte: targetDate,
            $lt: endOfDay
        };
    }

    const data = await paginate(Product, query, page, limit, "", [
        { path: "seller", select: "businessName businessEmail profileImage" },
        { path: "productType", select: "productType" },
        { path: "category", select: "categoryName" }
    ]);

    if (!data.data.data || data.data.data.length === 0) {
        return res.status(httpStatus.BAD_REQUEST).send({
            message: getMessage("noProductFound", lang)
        });
    }


    
    const products = data.data.data.map(product => {
        const productTypeData = product.productType ? {
            _id: product.productType._id,
            productType: product.productType.productType[lang]
        } : null;

        const categoryData = product.category ? {
            _id: product.category._id,
            categoryName: product.category.categoryName[lang]
        } : null;

        return {
            ...product.toObject(),
            productType: productTypeData,
            category: categoryData
        };
    });

    return res.status(httpStatus.OK).send({
        status: 200,
        message: getMessage("productFetched", lang),
        data: { ...data.data, data: products }
    });
});


const editProducts = catchAsync(async (req, res) => {
    const lang = req.lang
    const { id, title, description, price, deliveryFee, productImages, discountPrice, quantity, category, productType } = req.body;
    const findProduct = await Product.findById(id);
    const validProductType = await ProductType.findById(productType)
    if (!validProductType) return res.status(httpStatus.BAD_REQUEST).send({ status: 400, message: getMessage("invalidProductType", lang) })
    if (!findProduct) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: getMessage("noProductFound", lang) });
    }
    let discountPercentage = " ";
    if (discountPrice && price) {
        if (discountPrice > price) return res.status(httpStatus.BAD_REQUEST).send({ status: 400, message: "Discount Price should be less then original price." })
        discountPercentage = ((price - discountPrice) / price * 100).toFixed(2); // Round to two decimal places 
    }

    const updatedFields = {
        title, description, price: parseFloat(price),
        deliveryFee: parseFloat(deliveryFee),
        productType, category, discountPrice: parseFloat(discountPrice),
        quantity: parseFloat(quantity), discountPercentage
    };

    if (productImages && productImages.length > 0) {
        updatedFields.productImages = productImages
    }

    const data = await Product.findByIdAndUpdate(
        id,
        { $set: updatedFields },
        { new: true }
    );

    return res.status(httpStatus.OK).send({ status: 200, success: true, message: getMessage("productEdited", lang) });
});

const getBusinessSellerCategories = catchAsync(async (req, res) => {
    const { id } = req.user;
    const lang = req.lang;

    const findBusinessSeller = await getBusinessSeller(id);

    if (!findBusinessSeller) {
        return res.status(httpStatus.BAD_REQUEST).send({
            status: 400,
            message: getMessage("businessSellerNotFound", lang)
        });
    }


    const data = await BusinessCategories.find({
        _id: { $in: findBusinessSeller.categories }
    });
    const filteredCategories = data.map(category => ({
        _id: category._id,
        categoryName: category.categoryName[lang] || category.categoryName.en
    }));

    res.status(httpStatus.OK).send({ status: 200, data: filteredCategories });
});



module.exports = { addProduct, getProductById, deleteProductById, getApprovedProducts, editProducts, getBusinessSellerCategories }