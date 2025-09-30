import ProductModel from "../models/product.model.js";

export const createProductController = async(request,response)=>{
    try {
        const { 
            name ,
            image ,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        } = request.body 

        if(!name || !image[0] || !category[0] || !subCategory[0] || !unit || !price || !description ){
            return response.status(400).json({
                message : "Enter required fields",
                error : true,
                success : false
            })
        }

        const product = new ProductModel({
            name ,
            image ,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        })
        const saveProduct = await product.save()

        return response.json({
            message : "Product Created Successfully",
            data : saveProduct,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


export const getProductController = async(request,response)=>{
    try {
        let { page, limit, search } = request.body;
        if (!page) page = 1;
        if (!limit) limit = 10;
        const skip = (page - 1) * limit;

        // Build aggregation pipeline
        const pipeline = [];
        if (search) {
            pipeline.push({
                $search: {
                    index: "name", // Change to your Atlas Search index name if different
                    text: {
                        query: search,
                        path: { wildcard: "*" }
                    }
                }
            });
        }
        pipeline.push(
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "subCategory",
                    foreignField: "_id",
                    as: "subCategory"
                }
            }
        );

        const data = await ProductModel.aggregate(pipeline);
        // For totalCount, you may want to count all documents or only those matching search
        let totalCount;
        if (search) {
            // Count with the same $search filter
            const countPipeline = pipeline.slice(0, search ? 1 : 0).concat({ $count: "count" });
            const countResult = await ProductModel.aggregate(countPipeline);
            totalCount = countResult[0]?.count || 0;
        } else {
            totalCount = await ProductModel.countDocuments();
        }

        return response.json({
            message: "Product data",
            error: false,
            success: true,
            totalCount: totalCount,
            totalNoPage: Math.ceil(totalCount / limit),
            data: data
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export const getProductByCategory = async(request,response)=>{
    try {
        const { id, page, limit } = request.body 

        if(!id){
            return response.status(400).json({
                message : "provide category id",
                error : true,
                success : false
            })
        }

        // Handle both single ID and array of IDs
        const categoryIds = Array.isArray(id) ? id : [id]
        
        // Set default pagination values
        const currentPage = page || 1
        const pageLimit = limit || 10
        const skip = (currentPage - 1) * pageLimit

        const [products, totalCount] = await Promise.all([
            ProductModel.find({ 
                category : { $in : categoryIds }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageLimit)
            .populate('category subCategory'),
            ProductModel.countDocuments({ 
                category : { $in : categoryIds }
            })
        ])

        return response.json({
            message : "category product list",
            data : products,
            totalCount: totalCount,
            page: currentPage,
            limit: pageLimit,
            totalPages: Math.ceil(totalCount / pageLimit),
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductByCategoryAndSubCategory  = async(request,response)=>{
    try {
        const { categoryId,subCategoryId,page,limit } = request.body

        if(!categoryId || !subCategoryId){
            return response.status(400).json({
                message : "Provide categoryId and subCategoryId",
                error : true,
                success : false
            })
        }

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        const query = {
            category : { $in :categoryId  },
            subCategory : { $in : subCategoryId }
        }

        const skip = (page - 1) * limit

        const [data,dataCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product list",
            data : data,
            totalCount : dataCount,
            page : page,
            limit : limit,
            success : true,
            error : false
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductDetails = async(request,response)=>{
    try {
        // Support both GET (query) and POST (body)
        const productId = request.method === 'GET' ? request.query.productId : request.body.productId;

        const product = await ProductModel.findOne({ _id : productId })

        return response.json({
            message : "product details",
            data : product,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//update product
export const updateProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide product _id",
                error : true,
                success : false
            })
        }

        const updateProduct = await ProductModel.updateOne({ _id : _id },{
            ...request.body
        })

        return response.json({
            message : "updated successfully",
            data : updateProduct,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//delete product
export const deleteProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide _id ",
                error : true,
                success : false
            })
        }

        const deleteProduct = await ProductModel.deleteOne({_id : _id })

        return response.json({
            message : "Delete successfully",
            error : false,
            success : true,
            data : deleteProduct
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//search product
export const searchProduct = async(request,response)=>{
    try {
        let { search, page , limit } = request.body 

        if(!page){
            page = 1
        }
        if(!limit){
            limit  = 10
        }

        const skip = ( page - 1) * limit

        // Use Atlas Search $search aggregation
        const pipeline = [];
        if (search) {
            pipeline.push({
                $search: {
                    index: "default", // or your Atlas Search index name
                    text: {
                        query: search,
                        path: { wildcard: "*" }
                    }
                }
            });
        }
        pipeline.push(
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "subCategory",
                    foreignField: "_id",
                    as: "subCategory"
                }
            }
        );

        const data = await ProductModel.aggregate(pipeline);
        // For totalCount, count all matching documents
        let totalCount = 0;
        if (search) {
            const countPipeline = pipeline.slice(0, 1).concat({ $count: "count" });
            const countResult = await ProductModel.aggregate(countPipeline);
            totalCount = countResult[0]?.count || 0;
        } else {
            totalCount = await ProductModel.countDocuments();
        }

        return response.json({
            message : "Product data",
            error : false,
            success : true,
            data : data,
            totalCount : totalCount,
            totalPage : Math.ceil(totalCount/limit),
            page : page,
            limit : limit 
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}