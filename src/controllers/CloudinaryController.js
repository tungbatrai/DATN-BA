const uploadCategory = (req,res,next) =>{
    res.send({
        url: req.file.path
    })
}
const uploadBrand = (req,res,next) =>{
    res.send({
        url: req.file.path
    })
}
const uploadProduct = (req,res,next) =>{
    res.send({
        url: req.file.path
    })
}
const uploadProductType = (req,res,next) =>{
    res.send({
        url: req.file.path
    })
}
module.exports = {
        uploadCategory,
        uploadBrand,
        uploadProduct,
        uploadProductType
}