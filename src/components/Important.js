// Important
import Checkbox from "@mui/material/Checkbox";
import { useTodo } from "../contexts/TodoContext";
import StarIcon from '@mui/icons-material/Star';
import { useState } from "react";
import TaskContextMenu from "./RightClick";

export default function Important() {
  const { taskCompleted,taskImportant, importantTasks, sections, removeTask } = useTodo();
     const [menu, setMenu] = useState(null);
      const [selectedTask, setSelectedTask] = useState(null);
    
      const handleContextMenu = (e, task) => {
        e.preventDefault();
        setSelectedTask(task);
        setMenu({ mouseX: e.clientX, mouseY: e.clientY });
      };
  console.log(importantTasks)
  if (importantTasks.length === 0) {
    return (
      <div
        style={{
          position: "absolute",
          background: "#0000007d",
          backdropFilter: "blur(4px)",
          borderRadius: "10px",
          textAlign: "center",
          top: "50%",
          color: "hotpink",
          direction: "ltr",
          width: "90%",
          maxWidth: "400px",
          padding: "20px 15px",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h5>Only the important tasks you can see here</h5>
      </div>
    );
  }
  


  const checkAsCompleted = (sectionName, taskId) => {
    console.log(sectionName, taskId);
    taskCompleted(sectionName, taskId);
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  
  return (
      <ul className="task-list" id="important-list">
        {importantTasks.map((task) => (
          <li
            className={task.completed ? "completed" : ""}
                key={`${task.section}-${task.id}`}
                id={`task-${task.section}-${task.id}`}
              onContextMenu={(e) => handleContextMenu(e, task)}
          >
            <div className="task-item">
              <Checkbox
                {...label}
                style={{ color: "#1976D2" }}
                checked={task.completed}
                name={task.id}
                onChange={() => checkAsCompleted(task.section,  task.id)}
              />
              <p>
                {task.title.match(/.{1,45}/g)?.map((chunk, index, arr) => (
                  <span key={index}>
                    {chunk}
                    {index < arr.length - 1 && <br />}
                    <br/>
                    <span style={{fontSize:'12px', }}>{sections[task.section].name}</span>
                  </span>
                ))}
              </p>
            </div>
            <span style={{ display: "grid" }} onClick={() => taskImportant(task.section, task.id)}>
              <StarIcon
                style={{ color: task.important ? "deeppink" : 'lightgray', cursor: "pointer" }}
              />
            </span>
          </li>
        ))}
                        <TaskContextMenu
                        anchor={menu}
                        task={selectedTask}
                        onClose={() => { setMenu(null); setSelectedTask(null); }}
                        onComplete={(t) => taskCompleted(t.section, t.id)}
                        onImportant={(t) => taskImportant(t.section, t.id)}
                        onDelete={(t) => removeTask(t.section, t.id)}
                      />
      </ul>
  );
}