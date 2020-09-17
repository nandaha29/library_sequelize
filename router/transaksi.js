 // inisiasi library
 const express = require('express')
 const multer = require('multer')

 // call models
 const models = require('../models/index')
 const transaksi = models.transaksi
 const detail_transaksi = models.detail_transaksi

 // implementation
 const app = express()
 app.use(express.urlencoded({extended: true}))

// endpoint akses data => GET
app.get("/", async (req,res) => {
    let data = await transaksi.findAll({
        include: [
            "customer",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["product"]
            }
        ]
    })
    res.json({
        data: data
    })
})

// end-point ambil data by id => GET
app.get("/:transaksi_id", async (req,res) => {
    //ambil data by id
    let param = {transaksi_id: req.params.transaksi_id}
    let data = await transaksi.findOne({
        where: param,
        include: [
            "customer",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["product"]
            }
        ]
    })
    res.json({
        data: data
    })
})

// end-point simpan data => POST
app.post("/", async (req,res) => {
    //insert data
    
    //tampung data 
    let data ={
        customer_id: req.body.customer_id,
        waktu: req.body.waktu
    }

    //proses insert data ke table trnsaksi
    transaksi.create(data)
    .then(result => {

        //ambil nilai dari transaksi_id
        let transaksi_id = result.transaksi_id
        let detail = JSON.parse(req.body.detail_transaksi)

        //proses menyisipkan transaksi_id
        detail.forEach(element => {
            element.transaksi_id = transaksi_id
        });

        // proses insert data ke detail_transaksi
        detail_transaksi.bulkCreate(detail)
        .then(result => {
            res.json({
                message: "data has been inserted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

// end-point update data => PUT
app.put("/", async (req,res) => {
    //update data

    //tampung data
    let data = {
        customer_id: req.body.customer_id,
        waktu: req.body.waktu
    }

    //tampung data parameter
    let param = {
        transaksi_id: req.body.transaksi_id
    }

    //proses insert data ke tabel transaksi
    transaksi.update(data, {where: param})
    .then(result => {

        //hapus data di detail
        detail_transaksi.destroy({where: param}).then().catch()

        //ambil nilai dari trasaksi_id
        let transaksi_id = param.transaksi_id
        let detail = JSON.parse(req.body.detail_transaksi)

        //proses menyisipkan transaksi_id
        detail.forEach(element => {
            element.transaksi_id = transaksi_id
        });

        //proses insert data ke detail_transaksi
        detail_transaksi.bulkCreate(detail)
        .then(result => {
            res.json({
                message: "data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

// end-point hapus data => DELETE
app.delete("/:transaksi_id", async (req,res) => {
    //delete data

    //tampung data transaksi dari parameter yang dituju
    let param = {transaksi_id: req.params.transaksi_id}
    try {
        //hapus detail_transaksi
        await detail_transaksi.destroy({where: param})

        //hapus transaksinya
        await transaksi.destroy({where: param})

        //berhasil hapus berikan output
        res.json({
            message: "data has been deleted"
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

module.exports = app

/** async -> spy aman
 *  await -> salah satu funtion asyn
 *  create -> dibuat utk insert 1 data / row
 *  bulkCreate -> dibuat utk insert multiple data/row
 *  function .then/.catch -> utk utk promise. Then jika pas eksekusi sukses, catch utk jika eksekusi gagal
 *  function Promise -> mulai findAll, findOne, create, update, destroy
 *  findAll() -> mengambil semua data pada tabel transaksi
 *   
 *  
 * // awal dari array detail
 * detail = [
 *     {"product_id": "1","qty" : "1", "price":"10000"}, // elemen 1 sisipkan transaksi_id = "5"
 *     {"product_id": "2","qty" : "5", "price":"5000"} // elemen 2, sisipkan transaksi_id ="5"
 *  ]
 * 
 * // proses menyisipkan transaksi_id
 * detail.forEach(element => {
 *      element.transaksi_id = transaksi_id
 * });
 * 
 *  // akhir dari array detail
 * detail = [
 *      {"transaksi_id": "5","product_id": "1","qty" : "1", "price":"10000"}, // elemen 1 sisipkan transaksi_id = "5"
 *      {"transaksi_id": "5","product_id": "2","qty" : "5", "price":"5000"} // elemen 2, sisipkan transaksi_id ="5"
 * ]
 * 
 */
