import { Outlet } from 'react-router'
import NavBar from './components/NavBar';
import Footer from './components/Footer';

export default function App() {
    return <div className='AppDiv'>
        <NavBar />
        <Outlet />
        <Footer />
    </div>
}