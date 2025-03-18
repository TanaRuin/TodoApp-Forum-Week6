import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const FirestoreTest = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from Firestore
  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    setTasks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Add a test task to Firestore
  const addTestTask = async () => {
    await addDoc(collection(db, "tasks"), { text: "Test Task", createdAt: new Date() });
    fetchTasks(); // Refresh list
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Firestore Test</h2>
      <button onClick={addTestTask} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
        Add Test Task
      </button>
      <ul className="mt-4">
        {tasks.map((task) => (
          <li key={task.id} className="border p-2 mt-2 rounded">
            {task.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FirestoreTest;
