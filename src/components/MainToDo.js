import "../styles/mainToDo.css";
import {
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import SwapVertIcon from "@mui/icons-material/SwapVert";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useTodo } from "../contexts/TodoContext";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function MainToDo(props) {
  let navigate = useNavigate();
  const {
    addTask,
    sections,
    ChangeOrderTasks,
    sectionDuplicate,
    removeSection,
    changeSectionBackground,
    changeSectionName,
  } = useTodo();
  const { sectionId } = useParams();
  let section = props.sectionName || sectionId;
  let theSection = sections[section];
  const [sectName, setSectName] = useState(theSection ? theSection.name : "");
  useEffect(() => {
    if (theSection?.name) {
      setSectName(theSection.name);
    }
  }, [theSection?.name]);

  // State و Ref للـ Popper الأولاني (Palette)
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  // State و Ref للـ Popper التاني (MoreHoriz)
  const [openMore, setOpenMore] = useState(false);
  const anchorMoreRef = useRef(null);

  // دوال التحكم في الـ Popper الأولاني
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  // دوال التحكم في الـ Popper التاني
  const handleToggleMore = () => {
    setOpenMore((prevOpen) => !prevOpen);
  };

  const handleCloseMore = (event) => {
    if (anchorMoreRef.current && anchorMoreRef.current.contains(event.target)) {
      return;
    }
    setOpenMore(false);
  };

  // إدارة الـ focus للـ Popper الأولاني
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false && anchorRef.current) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  // إدارة الـ focus للـ Popper التاني
  const prevOpenMore = useRef(openMore);
  useEffect(() => {
    if (
      prevOpenMore.current === true &&
      openMore === false &&
      anchorMoreRef.current
    ) {
      anchorMoreRef.current.focus();
    }
    prevOpenMore.current = openMore;
  }, [openMore]);

  if ((!props.sectionName && !sectionId) || !theSection) {
    return (
      <main
        className="main-todo"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {props.children}
      </main>
    );
  }

  const renameSection = (n) => {
    setSectName(n.target.value);
  };

  const updateSectionName = (e) => {
    if (sectName === "") {
      setSectName(theSection.name);
    } else {
      changeSectionName(section, e.target.value);
    }
  };

  const mainSectionBackground = (e) => {
    let color = e.currentTarget.getAttribute("data-color");
    if (color) {
      changeSectionBackground(section, color);
    }
    handleClose(e);
  };

  // دالة لخيارات الـ Popper التاني
  const handleMoreOption = (e, action) => {
    if (action === "delete") {
      removeSection(section);
      let customOnly = Object.keys(sections).filter((custom) =>
        custom.includes("custom")
      );
      if (customOnly.indexOf(section) === 0 && customOnly.length > 1) {
        // document.querySelectorAll('.new-list a')[1].click() ;
        const nextSection = customOnly[1];
        navigate(`/custom/${nextSection}`);
      } else if (customOnly.indexOf(section) !== 0 && customOnly.length > 1) {
        // document.querySelectorAll('.new-list a')[0].click() ;
        const prevSection = customOnly[customOnly.indexOf(section) - 1];
        navigate(`/custom/${prevSection}`);
      } else {
        // document.querySelectorAll('.user-actions a')[0].click();
        navigate("/myDay");
      }
    } else if (action === "duplicate") {
      sectionDuplicate(section);
    }
    handleCloseMore(e);
  };

  const addTaskOperation = (e) => {
    e.preventDefault();
    let addTaskInput = e.target[0];
    let value =
      addTaskInput.value.length > 200
        ? addTaskInput.value.slice(0, 201)
        : addTaskInput.value;
    if (addTaskInput.value.trim() !== "") {
      addTask(section, value);
    }
    addTaskInput.value = "";
  };

  return (
    <main
      className="main-todo"
      style={{ background: theSection?.backGround || "#0e0e0e" }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          id="section-name"
          disabled={theSection.type !== "custom"}
          onBlur={updateSectionName}
          onChange={(n) => renameSection(n)}
          value={sectName}
        />
        <div className="user-options">
          {/* الـ Popper الأولاني */}
          <div>
            <Button
              ref={anchorRef}
              id="composition-button"
              aria-controls={open ? "composition-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              variant="outlined"
            >
              <PaletteOutlinedIcon />
            </Button>
            <Popper
              open={open}
              style={{ background: "#1976D2" }}
              className="ul-theme"
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom-start" ? "left top" : "left bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                      >
                        <MenuItem
                          data-color={"url('/images/tv-tower.jpg')"}
                          style={{
                            backgroundImage: "url('/images/tv-tower.jpg')",
                          }}
                          onClick={mainSectionBackground}
                        ></MenuItem>
                        <MenuItem
                          data-color={"url('/images/autumn.jpg')"}
                          style={{
                            backgroundImage: "url('/images/autumn.jpg')",
                          }}
                          onClick={mainSectionBackground}
                        ></MenuItem>
                        <MenuItem
                          data-color={"url('/images/beach.jpg')"}
                          style={{
                            backgroundImage: "url('/images/beach.jpg')",
                          }}
                          onClick={mainSectionBackground}
                        ></MenuItem>
                        <MenuItem
                          data-color={"url('/images/plouzane.jpg')"}
                          style={{
                            backgroundImage: "url('/images/plouzane.jpg')",
                          }}
                          onClick={mainSectionBackground}
                        ></MenuItem>
                        <MenuItem
                          data-color={"url('/images/milky-way.jpg')"}
                          style={{
                            backgroundImage: "url('/images/milky-way.jpg')",
                          }}
                          onClick={mainSectionBackground}
                        ></MenuItem>
                        <MenuItem
                          data-color={"url('/images/water.jpg')"}
                          style={{
                            backgroundImage: "url('/images/water.jpg')",
                          }}
                          onClick={mainSectionBackground}
                        ></MenuItem>
                        <MenuItem
                          data-color={"url('/images/sultan-ahmet-mosque.jpg')"}
                          style={{
                            backgroundImage:
                              "url('/images/sultan-ahmet-mosque.jpg')",
                          }}
                          onClick={mainSectionBackground}
                        ></MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
          {/* الـ Popper التاني */}
          <div>
            <Button
              ref={anchorMoreRef}
              id="more-button"
              aria-controls={openMore ? "more-menu" : undefined}
              aria-expanded={openMore ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleToggleMore}
              variant="outlined"
            >
              <MoreHorizOutlinedIcon />
            </Button>
            <Popper
              open={openMore}
              style={{ background: "#1976D2", top: "5px" }}
              className="options-list"
              anchorEl={anchorMoreRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom-start" ? "left top" : "left bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleCloseMore}>
                      <MenuList
                        autoFocusItem={openMore}
                        id="more-menu"
                        aria-labelledby="more-button"
                      >
                        <MenuItem onClick={() => ChangeOrderTasks(section)}>
                          <SwapVertIcon />
                          ترتيب المهام
                        </MenuItem>
                        {sectionId ? (
                          <MenuItem
                            onClick={(e) => handleMoreOption(e, "delete")}
                          >
                            <DeleteOutlineIcon />
                            حذف القسم
                          </MenuItem>
                        ) : (
                          ""
                        )}
                        {sectionId ? (
                          <MenuItem
                            onClick={(e) => handleMoreOption(e, "duplicate")}
                          >
                            <ContentCopyOutlinedIcon />
                            تكرار القسم
                          </MenuItem>
                        ) : (
                          ""
                        )}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
        </div>
      </header>
      {props.children}
      <Box
        onSubmit={(e) => addTaskOperation(e)}
        style={{
          position: "absolute",
          width: "calc(100% - 40px)",
          bottom: "3px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
        component="form"
        noValidate
        autoComplete="off"
      >
        <TextField
          style={{
            width: "100%",
            background: "rgb(35 35 35 / 87%)",
            borderRadius: "10px",
            overflow: "hidden",
            color: "white !important",
          }}
          id="filled-basic"
          label="Add Task"
          variant="filled"
        />
      </Box>
    </main>
  );
}
