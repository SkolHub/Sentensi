import './App.scss';
import { Route, Routes } from 'react-router-dom';
import { lazy } from 'react';

const Home = lazy(() => import('./pages/home/Home.tsx'));
const Play = lazy(() => import('./pages/play/Play.tsx'));
const Create = lazy(() => import('./pages/create/Create.tsx'));


function App() {

	return (
		<Routes>
			<Route path="/create" element={<Create />} />
			<Route path="/play/:id" element={<Play />} />
			<Route path="/" element={<Home />} />
		</Routes>
	);
}

export default App;
