import Checkbox from "@mui/material/Checkbox";
import { useTodo } from "../contexts/TodoContext";
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined";
import { useState } from "react";
import TaskContextMenu from "./RightClick";

export default function MyDay() {
  const { tasks, taskCompleted,removeTask, taskImportant } = useTodo();
  let section = 'myDay';
 const [menu, setMenu] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleContextMenu = (e, task) => {
    e.preventDefault();
    setSelectedTask(task);
    setMenu({ mouseX: e.clientX, mouseY: e.clientY });
  };
  // إضافة Helmet لتحديد الـ title ديناميكيًا
  if (!tasks[section]) {
    return (
      <div
        style={{
          position: "absolute",
          background: "#0000007d",
          backdropFilter: "blur(4px)",
          borderRadius: "10px",
          textAlign: "center",
          top: "50%",
          color: "white",
          direction: "ltr",
          width: "90%",
          maxWidth: "400px",
          padding: "20px 15px",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h2>Foucs on your day</h2>
        <span>
          Get things done with my Day, a list that refreshes every day.
        </span>
      </div>
    );
  }


  const checkAsCompleted = (sectionName, taskId) => {
    console.log(sectionName, taskId);
    taskCompleted(sectionName, taskId);
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  return (
      <ul className="task-list">
        {tasks[section].map((task) => (
          <li
            className={task.completed ? "completed" : ""}
            key={task.id}
            id={`task-${task.id}`}
            onContextMenu={(e) => handleContextMenu(e, task)}
          >
            <div className="task-item">
              <Checkbox
                {...label}
                style={{ color: "#1976D2" }}
                checked={task.completed}
                onChange={() => checkAsCompleted(section, task.id)}
              />
              <p>
                {task.title.match(/.{1,45}/g)?.map((chunk, index, arr) => (
                  <span key={index}>
                    {chunk}
                    {index < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
            <span style={{ display: "grid" }} onClick={() => taskImportant(section, task.id)}>
              <StarBorderPurple500OutlinedIcon
                style={{ color: task.important ? "deeppink" : 'lightgray', cursor: "pointer" }}
              />
            </span>
          </li>
        ))}
          <TaskContextMenu
        anchor={menu}
        task={selectedTask}
        onClose={() => { setMenu(null); setSelectedTask(null); }}
        onComplete={(t) => taskCompleted(section, t.id)}
        onImportant={(t) => taskImportant(section, t.id)}
        onDelete={(t) => removeTask(section, t.id)}
      />
      </ul>
  );
}