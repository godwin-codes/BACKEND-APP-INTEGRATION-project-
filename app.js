// Task1: initiate app and run server at 3000
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// serve frontend build files
app.use(express.static(path.join(__dirname + '/dist/FrontEnd')));

// Task2: create mongoDB connection 
// Replace below connection string with your actual mongodb atlas uri
mongoose.connect('mongodb+srv://<username>:<password>@cluster0.mongodb.net/employeedb?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.error('❌ MongoDB Connection Error:', err.message));

// Define schema and model
const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true }
});
const Employee = mongoose.model('Employee', employeeSchema);

// Task 2 : write api with error handling and appropriate api mentioned in the TODO below

// TODO: get data from db using api '/api/employeelist'
app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Server Error while fetching employee list' });
    }
});

// TODO: get single data from db using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const emp = await Employee.findById(req.params.id);
        if (!emp) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(emp);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ message: 'Server Error while fetching employee' });
    }
});

// TODO: send data to db using api '/api/employeelist'
// Request body format:{name:'',location:'',position:'',salary:''}
app.post('/api/employeelist', async (req, res) => {
    try {
        const { name, location, position, salary } = req.body;
        if (!name || !location || !position || !salary) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newEmployee = new Employee({ name, location, position, salary });
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ message: 'Server Error while adding employee' });
    }
});

// TODO: delete employee data from db using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const deletedEmp = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmp) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: 'Server Error while deleting employee' });
    }
});

// TODO: Update employee data from db using api '/api/employeelist'
// Request body format:{_id:'',name:'',location:'',position:'',salary:''}
app.put('/api/employeelist', async (req, res) => {
    try {
        const { _id, name, location, position, salary } = req.body;
        if (!_id) return res.status(400).json({ message: 'Employee ID is required' });

        const updatedEmp = await Employee.findByIdAndUpdate(
            _id,
            { name, location, position, salary },
            { new: true, runValidators: true }
        );

        if (!updatedEmp) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(updatedEmp);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Server Error while updating employee' });
    }
});

//! dont delete this code. it connects the front end file.
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + 'dist/Frontend','index.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
});
