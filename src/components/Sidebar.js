import '../styles/aside.css';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import StarBorderPurple500OutlinedIcon from '@mui/icons-material/StarBorderPurple500Outlined';
// import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
// import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
// import TourOutlinedIcon from '@mui/icons-material/TourOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTodo } from '../contexts/TodoContext';

export default function Sidebar() {
  const {addSection, sections, importantTasks, tasks} = useTodo();
  const closeSidebar = () => {
  document.querySelector('.sidebar-container').classList.remove('open');
  document.getElementById('click-sound').play()
  } 
  let custom = [] ;
  for(const [section,value] of Object.entries(sections)){
  if(value.type === 'custom'){
    custom.push({section,value})
  }
  }
  let custom_Li = custom.map((newLi) => {
      let tasksFound = tasks[newLi.section] === undefined;
      let tasksLength = tasksFound ? '' : tasks[newLi.section].length ;
    return(
            <li key={newLi.section} onClick={closeSidebar}>
            <Link to={'/custom/' + newLi.section} >
            <MenuOutlinedIcon style={{color: tasksFound ? '#50a7ffff' : 'white'}} />
            <span>{newLi.value.name}</span>
            
            {tasksFound ? '' : <span className='list-length'>{tasksLength}</span>}
          </Link>
        </li>
    )
  }) ;
  return (
    <aside className='sidebar-container'>
      <div className='user-info'>
        <div className='user-avatar'>UN</div>
        <article className='user-details'>
          <h5 className="user-name">UserName</h5>
          <p className="user-email">user.name@gmail.com</p>
        </article>
      </div>
      <ul className="user-actions">
        <li onClick={closeSidebar}>  
          <Link to="/myDay">
            <LightModeOutlinedIcon style={{color:'lightgray'}} />
            <span>يومي</span>
            {tasks['myDay'] && tasks['myDay'].length >= 1  ? <span className='list-length'>{tasks['myDay'].length}</span> : ''}
          </Link>
        </li>
        <li onClick={closeSidebar}>
          <Link to="/important">
            <StarBorderPurple500OutlinedIcon style={{color:'deeppink'}} />
            <span>مهم</span>
            {importantTasks.length === 0 ? '' : <span className='list-length'>{importantTasks.length}</span>}
          </Link>
        </li>
        {/* <li onClick={closeSidebar}>
          <Link to="/planned">
            <ListAltOutlinedIcon style={{color:'turquoise'}}/>
            <span>مخطط</span>
          </Link>
        </li>
        <li onClick={closeSidebar}>
          <Link to="/assignedToMe">
            <PermIdentityOutlinedIcon style={{color:'lightgreen'}}/>
            <span>تم تكليفي به</span>
          </Link>
        </li>
        <li onClick={closeSidebar}>
          <Link to="/flaggedEmail">
            <TourOutlinedIcon style={{color:'red'}}/>
            <span>البريد المميز</span>
          </Link>
        </li> */}
        <li onClick={closeSidebar}>
          <Link to="/tasks">
            <HomeOutlinedIcon style={{color:'skyblue'}}/>
            <span>المهام</span>
            {!tasks['tasks'] ? '' : <span className='list-length'>{tasks['tasks'].length}</span>}
          </Link>
        </li>
      </ul>
      <ul className="new-list">
        {custom_Li}
      </ul>
      <footer>
        <Button onClick={() => addSection()}>
          <AddOutlinedIcon />
          <span>أنشاء قائمة</span>
        </Button>
        <Button>En</Button>
      </footer>
    </aside>
  );
}