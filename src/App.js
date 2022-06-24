import { Navigationbar } from './components';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages';

function App() {
	return (
		<>
			<Navigationbar />
			<div className='container'>
				<Routes>
					<Route path='/' element={<Home />} />
				</Routes>
			</div>
		</>
	);
}

export default App;
