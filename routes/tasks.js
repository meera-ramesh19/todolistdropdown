const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated } = require('../helpersmiddleware/auth');
// Load Idea Model
require('../models/Task');
const Task = mongoose.model('tasks');



//Task index page

router.get('/', ensureAuthenticated, (req, res) => {
    Task.find({ user: req.user.id })

    .sort({ deadline: 'desc' })
        .then(tasks => {

            res.render('tasks/index', {
                tasks: tasks
            });
        });

});


// Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('tasks/add');
});


//Edit Tasks form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Task.findOne({
            _id: req.params.id
        })
        .then(task => {
            if (task.user != req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/tasks');
            } else {
                res.render('tasks/edit', {
                    tasks: tasks
                });
            }
        });
});

//Lists all the Tasks page

router.get('/lists', ensureAuthenticated, (req, res) => {
    Task.findAll({})
        .then(task => {
            task.userid = req.body.userid;
            task.name = req.body.name;
            task.category = req.body.category;
            task.description = req.body.description;
            task.deadline = req.body.deadline;
            res.render('lists', {
                tasks: tasks
            })

            req.flash('success_msg', 'Tasks displayed')
            res.redirect('lists')

        });
});


//MarkCompleted
router.get('/markcompleted', ensureAuthenticated, (req, res) => {
    Task.find({ completed: true })
        .then(task => {
            // task.userid = req.body.userid;
            // task.name = req.body.name;
            // task.category = req.body.category;
            // task.description = req.body.description;
            // task.deadline = req.body.deadline;
            // task.completed = req.body.completed;
            // req.flash('success_msg', 'Tasks displayed')
            // res.redirect('/status')
            .sort({ deadline: 'desc' })
                .then(tasks => {

                    res.render('status/markcompleted', {

                        tasks: tasks
                    });
                });

        });
})

//Marked Incomplete


router.get('/incomplete', ensureAuthenticated, (req, res) => {
    Task.find({ completed: false })
        .then(task => {
            //.sort({ deadline: 'desc' })
            // task.userid = req.body.userid;
            // task.name = req.body.name;
            // task.category = req.body.category;
            // task.description = req.body.description;
            // task.deadline = req.body.deadline;
            // task.completed = req.body.completed;
            // req.flash('success_msg', 'Tasks displayed')
            // res.redirect('/status')
            .then(tasks => {
                // res.send('incomplete');
                res.render('status/incomplete', {
                    tasks: tasks
                });
            });

        });
})


//Process Form for add
router.post('/', ensureAuthenticated, (req, res) => {

    let errors = [];

    if (!req.body.name) {
        errors.push({
            text: 'Please add a task todo'
        });
    }
    if (!req.body.category) {
        errors.push({
            text: 'Please select a category'
        });
    }
    if (!req.body.description) {
        errors.push({
            text: 'Please add a description to the task'
        });
    }
    if (!req.body.deadline) {
        errors.push({
            text: 'Please select a deadline date'
        });
    }

    if (errors.length > 0) {
        res.render('/add', {
            errors: errors,
            userid: req.body.userid,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            deadline: req.body.deadline
        });
    } else {

        const newUser = {
            userid: req.body.id,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            deadline: req.body.deadline,
            completed: false,
            user: req.user.id
        };
        new Task(newUser)
            .save()
            .then(task => {

                console.log('Task was saved!');
                // res.send("item saved to database");
                req.flash('success_msg', 'Task added');
                res.redirect('/tasks');
            })

    }
});



//Process the edit 

router.put('/:id', ensureAuthenticated, (req, res) => {

    Task.findOne({
            _id: req.params.id
        })
        .then(task => {

            task.name = req.body.name;
            task.category = req.body.category;
            task.description = req.body.description;
            task.deadline = req.body.deadline;
            task.save()
                .then(task => {
                    req.flash('success_msg', 'Tasks updated');
                    res.redirect('/tasks');


                })
        });
});




//Delete Task
router.delete('/:id', ensureAuthenticated, (req, res) => {
    // res.send('Delete')
    Task.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Task removed')
            res.redirect('/tasks');

        });
});


module.exports = router;