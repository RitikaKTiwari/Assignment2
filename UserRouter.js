const router = require("express").Router();
const User = require("../models/UserSchema");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/; 
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isMimetypeValid = allowedTypes.test(file.mimetype);

    if (isValid && isMimetypeValid) {
        cb(null, true); 
    } else {
        cb(new Error("Invalid file type. Only images and PDFs are allowed."), false); 
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 
    },
    fileFilter: fileFilter
});

router.get("/registration", (req, res) => {
    res.render("registration"); 
});

router.post("/registration", upload.array('files', 5), (req, res) => {
    const user1 = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        files: req.files.map(file => file.filename) 
    });

    user1.save()
        .then(() => res.send("Registered successfully"))
        .catch((error) => {
            console.error("Error during registration:", error);
            return res.status(400).send("Registration failed. Please try again.");
        });
});

router.get("/files", (req, res) => {
    fs.readdir('uploads/', (err, files) => {
        if (err) {
            return res.status(500).send("Could not list files");
        }
        res.render("filelist", { files }); 
    });
});

router.get("/files/download/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../uploads/", filename); 

    res.download(filePath, (err) => {
        if (err) {
            console.error("Error downloading file:", err);
            res.status(500).send("Could not download the file");
        }
    });
});

module.exports = router;
