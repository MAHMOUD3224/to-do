// RightClick.js (مقترح تحديث)
import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grow,
} from "@mui/material";
import {
  // Folder,
  Delete,
  Star,
  CheckCircle,
  // Event,
  // WbSunny,
  // ArrowRight,
} from "@mui/icons-material";

export default function TaskContextMenu({
  anchor,
  task,
  onClose,
  onComplete,
  onImportant,
  onDelete,
}) {
  const [submenuAnchor, setSubmenuAnchor] = useState(null);
  const openTimer = useRef(null);
  const closeTimer = useRef(null);

  // ✅ تنظيف التايمرز لما الكومبوننت يتشال (مهم عشان مايحصلش memory leaks)
  useEffect(() => {
    return () => {
      // clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
    };
  }, []);

  // // فتح متأخر (hover)
  // const handleSubOpenDelayed = (event) => {
  //   // لا نسمح بغلق فوري
  //   event.stopPropagation && event.stopPropagation();
  //   clearTimeout(closeTimer.current);
  //   openTimer.current = setTimeout(() => {
  //     setSubmenuAnchor(event.currentTarget);
  //   }, 150);
  // };

  // // فتح فوري (click / touch) — مهم أن نقوم ب preventDefault + stopPropagation
  // const handleSubOpenImmediate = (event) => {
  //   event.preventDefault && event.preventDefault();
  //   event.stopPropagation && event.stopPropagation();
  //   clearTimeout(closeTimer.current);
  //   clearTimeout(openTimer.current);
  //   setSubmenuAnchor(event.currentTarget); // افتح فورًا
  // };

  // إغلاق متأخر (عند الخروج بالماوس)
  const handleSubClose = () => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => {
      setSubmenuAnchor(null);
    }, 200);
  };

  const handleCloseAll = () => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    
    setSubmenuAnchor(null);
    onClose && onClose();
    
  };

  return (
    <>
      {/* Main Menu */}
      <Menu
        
        open={!!anchor}
        onClose={handleCloseAll}
        anchorReference="anchorPosition"
        anchorPosition={
          anchor ? { top: anchor.mouseY, left: anchor.mouseX } : undefined
        }
        TransitionComponent={Grow}
        transitionDuration={200}
      >
        {/* ... بقية MenuItems كما لديك ... */}
        {/* <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            // تنفيذ أضافة إلى My Day مثلاً
            handleCloseAll();
          }}
        >
          <ListItemIcon>
            <WbSunny fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add to My Day</ListItemText>
        </MenuItem> */}

        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            onImportant && onImportant(task);
            handleCloseAll();
          }}
        >
          <ListItemIcon>
            <Star fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {task?.important ? "Remove importance" : "Mark as important"}
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            onComplete && onComplete(task);
            handleCloseAll();
          }}
        >
          <ListItemIcon>
            <CheckCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {task?.completed ? "Remove completed mark" : "Mark as completed"}
          </ListItemText>
        </MenuItem>

        {/* <MenuItem
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ListItemIcon>
            <Event fontSize="small" />
          </ListItemIcon>
          <ListItemText>Pick a date</ListItemText>
        </MenuItem> */}

        {/* هذا هو عنصر الـ submenu (trigger) */}
        {/* <MenuItem
          aria-haspopup="true"
          onMouseEnter={handleSubOpenDelayed}   // hover => delayed open
          onClick={handleSubOpenImmediate}     // click => open immediately
        >
          <ListItemIcon>
            <Folder fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move task to...</ListItemText>
          <ArrowRight fontSize="small" style={{ marginLeft: "auto" }} />
        </MenuItem> */}

        <MenuItem
          sx={{ color: "red" }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete && onDelete(task);
            handleCloseAll();
          }}
        >
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete task</ListItemText>
        </MenuItem>
      </Menu>

      {/* Submenu (معلق بالكومينتس) */}
      <Menu
        anchorEl={submenuAnchor}
        open={Boolean(submenuAnchor)}
        onClose={handleSubClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        MenuListProps={{
          onMouseEnter: () => clearTimeout(closeTimer.current),
          onMouseLeave: handleSubClose,
          // أهم حاجة ↓↓↓
          onClick: (e) => e.stopPropagation()
        }}
      >
        <MenuItem onClick={() => handleCloseAll()}>Tasks</MenuItem>
        <MenuItem onClick={() => handleCloseAll()}>Front-End libraries</MenuItem>
      </Menu>
    </>
  );
}
