import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../App.css"; 

const TodoPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [deadline, setDeadline] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState("");
  const navigate = useNavigate();

  // Fetch tasks from Firestore
  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    setTasks(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // Add a new task with deadline
  const addTask = async () => {
    if (!newTask.trim()) return;
    await addDoc(collection(db, "tasks"), { text: newTask, completed: false, deadline, createdAt: new Date() });
    setNewTask("");
    setDeadline("");
    fetchTasks(); // Refresh list
  };

  // Delete a task
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Enable task editing
  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  // Update task text
  const updateTask = async () => {
    if (!editingTaskText.trim()) return;
    await updateDoc(doc(db, "tasks", editingTaskId), { text: editingTaskText });
    setTasks(tasks.map((task) => (task.id === editingTaskId ? { ...task, text: editingTaskText } : task)));
    setEditingTaskId(null);
    setEditingTaskText("");
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id, completed) => {
    await updateDoc(doc(db, "tasks", id), { completed: !completed });
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !completed } : task)));
  };

  // Logout user
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Calculate progress percentage
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="page-container">
      <div className="content-box">
        <h2 className="text-xl font-bold text-center mb-4">To-Do List</h2>
  
        {/* Progress Bar */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Progress: {progress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
  
        {/* Add Task */}
        <div className="flex flex-col mb-4">
          <input
            type="text"
            placeholder="Enter a task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="border p-2 mb-2 rounded"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border p-2 mb-2 rounded"
          />
          <button onClick={addTask} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Add Task
          </button>
        </div>
  
        
        {/* Task List */}
<ul>
  {tasks.map((task) => (
    <li
      key={task.id}
      className="flex justify-between items-center border border-gray-300 rounded-lg p-3 mb-2 bg-white shadow-md"
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTaskCompletion(task.id, task.completed)}
        className="mr-3"
      />
      <div className="flex-1">
        {editingTaskId === task.id ? (
          <input
            type="text"
            value={editingTaskText}
            onChange={(e) => setEditingTaskText(e.target.value)}
            className="border p-2 rounded w-full"
          />
        ) : (
          <div>
            <span className={task.completed ? "line-through text-gray-500" : "text-gray-800 font-medium"}>
              {task.text}
            </span>
            <p className="text-xs text-gray-500 mt-1">Deadline: {task.deadline || "No deadline"}</p>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        {editingTaskId === task.id ? (
          <button onClick={updateTask} className="text-green-500 text-sm">
            ✅
          </button>
        ) : (
          <>
            <button onClick={() => startEditing(task)} className="text-blue-500 text-sm">
              ✏️
            </button>
            <button onClick={() => deleteTask(task.id)} className="text-red-500 text-sm">
              ❌
            </button>
          </>
        )}
      </div>
    </li>
  ))}
</ul>
  
        {/* Logout Button */}
        <button onClick={handleLogout} className="mt-4 bg-red-500 text-white p-2 w-full rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </div>
  );
};

export default TodoPage;

