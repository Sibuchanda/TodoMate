import Todo from '../model/todo.model.js'

// --------- Creating Todos----------------
export const createTodo = async (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        user:req.user._id // Associate todo with logedin user
    })

    try {
        const newTodo = await todo.save();
        res.status(201).json({ message: "Todo Created successfully", newTodo });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Error occured during Todo creation" });
    }
}

// export default createTodo;

// --------- Fetching Todos----------------
export const getTodos = async (req, res) => {

    try {
        const todos = await Todo.find({user:req.user._id}); // Fetched Todos only for logedin users
        res.status(201).json({ message: "Todo fetched successfully", todos});
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Error occured during Todo fetching" });
    }
} 

// --------- Updating Todos----------------

export const UpdateTodo = async (req,res)=>{
    try{
        const result = await Todo.findByIdAndUpdate(req.params.id, req.body,{
            new:true,  // new:true [means, what value the user update accept the updated value ]
        })
        //req.params.id --> req.parameter.id (As in todo.router we pass as an :id so that write here as params.id) 
        res.status(201).json({ message: "Todo Updated successfully", result});
    }catch(err){
        console.log(err);
        res.status(400).json({ message: "Error occured during Todo Updating" });
    }
}

// --------- Deleting Todos----------------
export const DeleteTodo = async (req,res)=>{
    try{
       const todo = await Todo.findByIdAndDelete(req.params.id)
       if(!todo){
        res.status(400).json({ message: "Todo not found"});
       }
        res.status(201).json({ message: "Todo Deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(400).json({ message: "Error occured during Todo Deleting" });
    }
}


// --------- Editing Todo (Updating Text)----------------
export const editTodo = async (req, res) => {
    const { id } = req.params; // Get todo ID from params
    const { text } = req.body; // Get updated text from the request body

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { text }, // Only update the text field
            { new: true } // Return the updated document
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.status(200).json({ message: "Todo updated successfully", result: updatedTodo });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Error occurred during Todo updating" });
    }
};