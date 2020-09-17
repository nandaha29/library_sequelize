// inisiasi library
const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// implementation
const app = express()

// call models
const models = require("../models/index")
const product = models.product

// config multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./image/product_image")
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage})

// endpoint akses data => GET
app.get("/", async (req,res) => {
    //ambil data
    let data = await product.findAll()
    .then(result => {
        res.json({
            data: result
        })
    })
    .catch(error => (
        res.json({
            message: error.message 
        })        
    ))
})

// endpoint ambil data by id => GET
app.get("/:product_id", async(req,res) => {
    // ambil data by id
    let param = {product_id: req.params.product_id}
    let data = await product.findOne({where: param})
    .then(result =>{
        res.json({
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message 
        })
    })
})

// endpoint simpan data => POST
app.post("/", upload.single("image"), async(req,res) => {
    if(!req.file) {
        res.json({
            message: "no uploaded file"
        })
    } else {
        let data = {
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock,
            image: req.file.filename
        }
        //insert data 
        product.create(data)
        .then(result => {
            res.json({
                message : "data has been inserted"
            })            
        })
        .catch(error => {
            res.json({
                message: error.message
            })           
        })
    }
})

// end-point update data => PUT
app.put("/", upload.single("image"), async(req,res) => {
    // update data
    let param = { product_id: req.body.product_id}
    let data = {
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
    }   
    
    if (req.file) {
        // get data by id
        const row = await product.findOne({where: param})
        let oldFileName = row.image
            
        // delete old file
        let dir = path.join(__dirname,"../product_image",oldFileName)
        fs.unlink(dir, err => console.log(err))

        // set new filename
        data.image = req.file.filename
    }   

    //proses insert data ke tabel transaksi    
    product.update(data, {where: param})
    .then(result => {
        res.json({
            message: "data has been updated",
        })
    })    
    .catch(error => {
        res.json({
            message: error.message
        })
    })   
})

// end-point hapus data => DELETE
app.delete("/:product_id", async(req,res) => {
    // delete data
    try {
        let param = { product_id: req.params.product_id}
        let result = await product.findOne({where: param})
        let oldFileName = result.image
            
        // delete old file
        let dir = path.join(__dirname,"../product_image",oldFileName)
        fs.unlink(dir, err => console.log(err))

        // delete data
        product.destroy({where: param})
        .then(result => {
            res.json({
                message: "data has been deleted",
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
        
    } catch (error) {
        res.json({
            message: error.message
        })
    }    
})

module.exports = app