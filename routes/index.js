const { Router } = require("express");
const router = Router();

router.use("/login", require('./login'));
router.use("/notes", require('./notes'));

router.use((err, req, res, next) => {
    if(err.message.includes('Cast to ObjectId failed')) {
       res.status(400).send('Invalid id provided');
    } else {
       res.status(500).send('Something broke!');
    }
   });


module.exports = router;
