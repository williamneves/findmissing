import { useEffect } from 'react';
import { Navbar } from './components';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Home, Login, Register } from './pages';
import { useRecoilState } from 'recoil';
import { userAtom } from './atoms/contextAtom';
import { logout } from './lib/firebase';

function App() {
	const [user, setUser] = useRecoilState(userAtom);
	const navigate = useNavigate();
	useEffect(() => {
		// Check has user in local storage
		if (localStorage.getItem('user')) {
			// Set local storage user to userAtom
			setUser(JSON.parse(localStorage.getItem('user')));
		} else {
			// If not, set user to null
			setUser(null);
		}
	}, [navigate]);

	return (
		<div className='bg-light min-vh-100'>
			<Navbar />
			<div className='container'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
				</Routes>
			</div>
		</div>
	);
}

export default App;
