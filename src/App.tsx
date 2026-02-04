import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import { PrivateRoute } from './lib/PrivateRoute'
import Dashboard from './pages/Dashboard'
import Teachers from './pages/Teachers'
import Students from './pages/Students'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path='/'
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
					}
				/>
				<Route
					path='/students'
					element={
						<PrivateRoute>
							<Students />
						</PrivateRoute>
					}
				/>
				<Route
					path='/teachers'
					element={
						<PrivateRoute>
							<Teachers />
						</PrivateRoute>
					}
				/>
				<Route path='/login' element={<Login />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
