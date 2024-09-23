const express = require('express');
const router = express.Router();


router.get("/", ( req, res)=> {
  res.redirect("/index.html");
})

router.get('/*.html', (req, res) => {
    let file = req.params.file;
  res.sendFile(`${file}.html`, { root: `${__dirname}/public` });
});

module.exports = router;