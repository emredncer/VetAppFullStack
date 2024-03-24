import { Outlet } from 'react-router'
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
    return <div className='AppDiv'>
        <ToastContainer />
        <NavBar />
        <Outlet />
        <Footer />
    </div>
}