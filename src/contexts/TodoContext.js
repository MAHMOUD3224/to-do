// contexts/TodoContext.js
import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const TodoContext = createContext();

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within TodoProvider');
  }
  return context;
};

const getDefaultSections = () => ({
  myDay: { name: 'يومي', type: 'default', backGround: "url('/images/tv-tower.jpg')", },
  important: { name: 'مهم', type: 'default', backGround: '#0e0e0e', sort:false },
  planned: { name: 'مخطط', type: 'default', backGround: '#0e0e0e', },
  assignedToMe: { name: 'تم تكليفي به', type: 'default', backGround: '#0e0e0e', },
  flaggedEmail: { name: 'البريد المميز', type: 'default', backGround: '#0e0e0e', },
  tasks: { name: 'المهام', type: 'default', backGround: '#0e0e0e', },
  custom_1757937742150: { name: 'قائمه غير معرفه', type: 'custom', backGround: '#0e0e0e', },
});

export const TodoProvider = ({ children }) => {
  // استخدام lazy initialization
  const [sections, setSections] = useState(() => {
    try {
      const savedSections = localStorage.getItem('todoSections');
      return savedSections ? JSON.parse(savedSections) : getDefaultSections();
    } catch (error) {
      console.error('Error loading sections from localStorage:', error);
      return getDefaultSections();
    }
  });

  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('todoTasks');
      return savedTasks ? JSON.parse(savedTasks) : {};
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return {};
    }
  });

  // حفظ البيانات في localStorage عند تغييرها فقط
  useEffect(() => {
    try {
      localStorage.setItem('todoSections', JSON.stringify(sections));
    } catch (error) {
      console.error('Error saving sections to localStorage:', error);
    }
  }, [sections]);

  useEffect(() => {
    try {
      localStorage.setItem('todoTasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }, [tasks]);


  // إضافة قسم جديد
  const addSection = () => {
    const section = `custom_${Date.now()}`;
    setSections(prev => ({
      ...prev,
      [section]: {
        name: 'قائمه غير معرفه',
        type: 'custom',
        backGround:'#0e0e0e'
      }
    }));
    
    return section;
  };

  // تغيير اسم القسم
  const changeSectionName = (section, newName) => {
    if(sections[section].type === 'custom'){
          setSections(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        name: newName
      }
    }));
    }else{
      return ;
    }
  };
  
  const changeSectionBackground = (section, newBackground) => {
    setSections(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        backGround: newBackground
      }
    }));
  };
  const sectionDuplicate = (section) => {
    const newSection = `custom_${Date.now()}`;
    setSections(prev => ({
      ...prev,
      [newSection]:{
        name: `${prev[section].name} (C)`,
        type: 'custom',
        backGround:prev[section].backGround
      }
    }));
    setTasks(prev => {
      const newSectionTasks = prev[section] || [];
      return {
        ...prev,
        [newSection]: [...newSectionTasks]
      };
    })
  }

    // حذف قسم مخصص
    // const navigate = useNavigate();
  const removeSection = (section) => {
    if (sections[section]?.type === 'custom') {
      
      setSections(prev => {
        const { [section]: removed, ...rest } = prev;
        return rest;
      });
      setTasks(prev => {
        const { [section]: removed, ...rest } = prev;
        return rest;
      });
  }
  };
  const ChangeOrderTasks = (section) => {
    if(section === 'important'){
      setSections(prev => ({
        ...prev,
        important:{
          ...prev,
          sort:!prev.important.sort
        }
      }))
      return ;
    }
    if( tasks[section] !== undefined &&  tasks[section].length > 1) {
      setTasks(prev => ({
        ...prev,
        [section]: [...(prev[section] || [])].reverse()
      }));
    }
  } 

const importantTasks = useMemo(() => {
  const res = [];
  for (const [sectionKey, arr] of Object.entries(tasks || {})) {
    if (!Array.isArray(arr)) continue;
    arr.forEach(t => {
      if (t && t.important) {
        res.push({ ...t, section: sectionKey });
      }
    });
  }

  return sections.important?.sort ? res.reverse() : res;
}, [tasks, sections]);

const addTask = (section, task) => {
  setTasks(prev => {
    const targetSection = section === 'important' ? 'tasks' : section;

    return {
      ...prev,
      [targetSection]: [
        {
          id: Date.now(),
          title: task,
          completed: false,
          important: section === 'important' ? true : false,
        },
        ...(prev[targetSection] || []) // هنا بقى نجيب المهمات القديمة من المكان الصح
      ]
    };
  });
};


  const removeTask = (section, taskId) => {
    setTasks(prev => ({
      ...prev,
      [section]: prev[section]?.filter(task => task.id !== taskId) || []
    }));
  };
  const taskCompleted = (section, taskId) => {
    setTasks(prev => ({
      ...prev,
      [section]: prev[section]?.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ) || []
    }));
  };

  const taskImportant = (section, taskId) => {
    setTasks(prev => ({
      ...prev,
      [section]: prev[section]?.map(task =>
        task.id === taskId ? { ...task, important: !task.important } : task
      ) || []
    }));
  };
  
  return (
    <TodoContext.Provider value={{
      sections,
      addSection,
      removeSection,
      changeSectionName,
      sectionDuplicate,
      changeSectionBackground,
      tasks,
      ChangeOrderTasks,
      addTask,
      removeTask,
      taskCompleted,
      taskImportant,
      importantTasks,
    }}>
      {children}
    </TodoContext.Provider>
  );
};