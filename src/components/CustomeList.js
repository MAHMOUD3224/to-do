import { useParams } from "react-router-dom";
import { useTodo } from "../contexts/TodoContext";
import { Checkbox } from "@mui/material";
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined";
import PageNotFound from "./pageNotFound";
import { useState } from "react";
import TaskContextMenu from "./RightClick";

export default function CustomList() {
  let { sectionId } = useParams();
  const { sections, tasks, taskCompleted, removeTask, taskImportant} = useTodo();
   const [menu, setMenu] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
  
    const handleContextMenu = (e, task) => {
      e.preventDefault();
      setSelectedTask(task);
      setMenu({ mouseX: e.clientX, mouseY: e.clientY });
    };
  // تحقق لو القسم مش موجود
  if (!sections[sectionId]) {
    return <PageNotFound />;
  }

  // لو مفيش مهام بعد
  if (!tasks[sectionId]) {
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
        <h2>Add Task here</h2>
      </div>
    );
  }

  // دالة لتحديد المهمة كمكتملة
  const checkAsCompleted = (sectionName, taskId) => {
    console.log(sectionName, taskId);
    taskCompleted(sectionName, taskId);
  };

  // إعدادات الـ Checkbox
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  // جلب اسم القسم لاستخدامه في الـ title

  return (
      <ul className="task-list">
        {tasks[sectionId].map((task) => (
          <li
            className={task.completed ? "completed" : ""}
            onContextMenu={(e) => handleContextMenu(e, task)}
            key={task.id}
            id={`task-${task.id}`}
          >
            <div className="task-item">
              <Checkbox
                {...label}
                style={{ color: "#1976D2" }}
                checked={task.completed}
                onChange={() => checkAsCompleted(sectionId, task.id)}
              />
              <p>
                {task.title.match(/.{1,30}/g)?.map((chunk, index, arr) => (
                  <span key={index}>
                    {chunk}
                    {index < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
            <span style={{ display: "grid" }} onClick={() => taskImportant(sectionId, task.id)}>
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
                        onComplete={(t) => taskCompleted(sectionId, t.id)}
                        onImportant={(t) => taskImportant(sectionId, t.id)}
                        onDelete={(t) => removeTask(sectionId, t.id)}
                      />
      </ul>
  );
}