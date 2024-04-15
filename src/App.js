import { Routes,Route } from 'react-router-dom';
import './App.css';
import {ConfigProvider} from 'antd'
import LoginPage from './routes/loginPage';
import MainPage from './routes/mainPage';
function App() {
  return (
    <ConfigProvider
      theme={
        {
          token:{
            colorPrimary: '#85a5ff',
            borderRadius:4
          }
        }
      }
    >
       <div className="App">
      <Routes>
        <Route path='/' element={<LoginPage />} ></Route>
        <Route path='/main/*' element={<MainPage />} ></Route>

      </Routes>
    </div>
    </ConfigProvider>
   
  );
}

export default App;
