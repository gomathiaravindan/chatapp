import './App.css';
import { Route, BrowserRouter } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import  ChatPage  from './Pages/ChatPage'
function App() {
  return (
    <>
    <div className="App">
    <BrowserRouter>
      <Route path="/" component={ HomePage } exact/>
      <Route path ="/chats" component = { ChatPage }/> 
      </BrowserRouter>
    </div>
    </>
  );
}

export default App;
