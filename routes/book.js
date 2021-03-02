let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

//connection to book model
let Book = require('../models/book');

/* GET route for booklist page - READ operation*/
router.get('/', (req, res, next) => {
    Book.find((err, bookList)=>{
        if(err)
        {
            return console.error(err);
        }
        else
        {
            //console.log(BookList);
            res.render('book',{title: 'Booklist', BookList: bookList});
        }
    });
});

module.exports = router;