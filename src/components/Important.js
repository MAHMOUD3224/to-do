// Important
import Checkbox from "@mui/material/Checkbox";
import { useTodo } from "../contexts/TodoContext";
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined";

export default function Important() {
  const { tasks, taskCompleted } = useTodo();
  let section = 'important';

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

  const print = (e) => {
    e.preventDefault();
    console.log("s");
  };

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
            onContextMenu={(e) => print(e)}
            key={task.id}
            id={`task-${task.id}`}
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
            <span style={{ display: "grid" }}>
              <StarBorderPurple500OutlinedIcon
                style={{ color: task.important ? "deeppink" : 'lightgray', cursor: "pointer" }}
              />
            </span>
          </li>
        ))}
      </ul>
  );
}