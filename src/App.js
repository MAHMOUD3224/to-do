import { BrowserRouter, Route, Routes, Navigate, useParams } from 'react-router-dom';
import './App.css';
import MainToDo from './components/MainToDo';
import Sidebar from './components/Sidebar';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Button } from '@mui/material';
import MyDay from './components/MyDay';
import Important from './components/Important';
import Planned from './components/Planned';
import AssignedToMe from './components/AssignedToMe';
import FlaggedEmail from './components/FlaggedEmail';
import Tasks from './components/Tasks';
import CustomList from './components/CustomeList';
import { TodoProvider } from './contexts/TodoContext';
import PageNotFound from './components/pageNotFound';

function App() {
  const openSidebar = () => {
    document.querySelector('.sidebar-container').classList.toggle('open');
    document.getElementById('click-sound').play();
  }
  return (
    <TodoProvider>
      <BrowserRouter>
      <div className="App">
        <audio id='click-sound' src='/images/click.mp3'/>
        <nav>
          <h1 className="logo-name">نبراس - Beacon</h1>
          <Button className='menu-btn' onClick={() => openSidebar()}><MenuOutlinedIcon /></Button>
        </nav>
        <div className="App-container">
          <Sidebar />
        <Routes>
          <Route path="*" element={<MainToDo><PageNotFound /></MainToDo>} />
          <Route path="/" element={<Navigate to="/myDay" />} />
          <Route path="/myDay" element={<MainToDo sectionName={'myDay'}><MyDay/></MainToDo>} />
          <Route path="/important" element={<MainToDo sectionName={'important'}><Important /></MainToDo>} />
          <Route path="/tasks" element={<MainToDo sectionName={'tasks'}><Tasks/></MainToDo>} />
          <Route path='/custom/:sectionId' element={<MainToDo><CustomList /></MainToDo>} />
        </Routes>
        
        </div>
      </div>
    </BrowserRouter>
    </TodoProvider>
  );
}

export default App;