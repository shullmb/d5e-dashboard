const router = require('express').Router()
router.get('/test', (req, res) => {
    res.json({message:'You have accessed the protected route'})
})

module.exports = router