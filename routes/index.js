var express = require('express');
var router = express.Router();
const axios = require("axios");
var MongoClient = require("mongodb").MongoClient;
const bodyParser = require('body-parser');
var app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
var url = "mongodb+srv://admin:55555@mirror.k24kx.gcp.mongodb.net/test";

router.get('/', function (req, res, next) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("pic_mirror");
    var query = { test: "check" };
    dbo.collection("check").find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        else {
          console.log(result[0].Value);
          if (result[0].Value == 0) { //ads
            res.redirect('/ads')
          }
          if (result[0].Value == 1) { //scan qr
            res.redirect('/scan')
          }
          if (result[0].Value == 2) { //สั่งให้ถ่าย*********
            res.redirect('/cam')
          }
          if (result[0].Value == 3) { //ดึงรูปที่ถ่าย
            res.redirect('/photo_ori')
          }
          if (result[0].Value == 4) { //ดึงรูปที่ใส่กรอบ
            res.redirect('/photo_frame')
          }
          if (result[0].Value == 5) { //ดึงรูปที่ใส่ติ้ก
            res.redirect('/photo_png')
          }
          if (result[0].Value == 6) { //ดึงรูปที่wait
            res.redirect('/wait')
          }
          if (result[0].Value == 7) { //ขอบใจ
            res.redirect('/thanks')
          }
          /*if (result[0].Value == 8) { //สั่งให้ปริ้นยังไม่ได้ทำ**********
            res.redirect('')
          }*/
          if (result[0].Value == 9) { //กระจก
            res.redirect('/camwait')
          }
          if (result[0].Value == 10) { //pre
            res.redirect('/pre')
          }
          else{
            res.render('index', { title: 'Express' });
          }
          db.close();
        }
      });
  });
  
});
router.get('/ads', function (req, res, next) {
  res.render('ads');
})
router.get('/cam', function (req, res, next) {
  res.render('camera');
})
router.get('/camwait', function (req, res, next) {
  res.render('camwait');
})
router.get('/scan', function (req, res, next) {
  res.render('scan');
})
router.get('/waitpic', function (req, res, next) {
  res.render('waitpic');
})
router.get("/pre", function (req, res, next) { //ดึงรูปมาแสดงในหน้าพรีวิว
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("pic_mirror");  //แก้ให้ดึงจากลิ้งจริงแล้ว อันเก่าคือ mydb
    var mysort = { _id: -1 }; //new to old
    dbo
      .collection("picprint")
      .find()
      .sort(mysort)
      .limit(1)
      .toArray(function (err, result3) {
        if (err) throw err;
        console.log(result3);
        res.render("pre", { picdata: result3 });
        db.close();
      });
  });
});
router.get('/photo_ori', function (req, res, next) {//ดึงรูปออริ 
  var mysort = { _id: -1 };
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("pic_mirror");
    dbo.collection("picture").find().sort(mysort).limit(1)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        res.render('photo_ori', { picdata: result })
      });
  });
})
router.get('/photo_frame', function (req, res, next) { //ดึงรูปที่ใส่กรอบ
  var mysort = { _id: -1 };
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("pic_mirror");
    dbo.collection("picframe").find().sort(mysort).limit(1)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        res.render('photo_frame', { picdata: result })
      });
  });
})
router.get('/photo_png', function (req, res, next) {
  var mysort = { _id: -1 };
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("pic_mirror");
    dbo.collection("picprint").find().sort(mysort).limit(1)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        res.render('photo_png', { picdata: result })
      });
  });
})
router.get('/wait', function (req, res, next) {
  var mysort = { _id: -1 };
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("pic_mirror");
    dbo.collection("picprint").find().sort(mysort).limit(1)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        res.render('wait', { picdata: result })
      });
  });
})
router.get('/thanks', function (req, res, next) {
  res.render('thanks');
})

router.post("/api", function (req, res, next) { ///เอารูปที่ถ่ายเข้าดาต้าเบส
  const data = req.body; //รับมาจากหน้าcam
  const x = 3;
  console.log(data);
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("pic_mirror"); //ชื่อดาต้าเบส
    dbo.collection("picture").insertOne(data, function (err, res) { //ชื่อcollection
      if (err) throw err;
      else {
        console.log("1 document inserted");
        var myquery = { test: "check" };
        var newvalue = { $set: { Value: x } }
        dbo.collection("check").updateOne(myquery, newvalue, function (err, res) { //ชื่อcollection
          if (err) throw err;
          else {
            console.log("1 document update");
          }
          db.close();
        });
      } 
    });
  });
  res.json(data);
});

router.post("/upcheck", function (req, res, next) { ///เอารูปที่ถ่ายเข้าดาต้าเบส
  const data = req.body.x; //รับมาจากหน้าcam
  console.log(data);
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("pic_mirror"); //ชื่อดาต้าเบส
    var myquery = { test: "check" };
    var newvalue = { $set: { Value: data } }
    dbo.collection("check").updateOne(myquery, newvalue, function (err, res) { //ชื่อcollection
      if (err) throw err;
      else {
        console.log("1 document update");
      }
      db.close();
    });
  });
  res.json(data);
});

module.exports = router;
app.use('/', router);