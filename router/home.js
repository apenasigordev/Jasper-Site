const express = require('express');
const router = express.Router();
const rd = require('../Radios.json');
router.get("/", (req, res) => {
        res.render("home.pug", {req,res,user:req.user, radio: rd.option});
})
module.exports = router;