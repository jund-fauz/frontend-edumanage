import SubmitButton from '@/components/SubmitButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { SubmitEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const navigate = useNavigate()

	const login = async (e: SubmitEvent) => {
		setLoading(true)
		e.preventDefault()
		const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		})
		if (!response.ok) {
			const errorData = await response.json()
			setError(errorData.message || 'Login failed')
		} else {
			const data = await response.json()
			localStorage.setItem('token', data.token)
			navigate('/')
		}
		setLoading(false)
	}

	return (
		<div className='flex items-center justify-center w-screen h-screen'>
			<div className='flex flex-col gap-2'>
				<h1 className='text-2xl font-bold'>Login</h1>
				<p>Hi, welcome back👋🏻</p>
				<form className='flex flex-col gap-2' onSubmit={login}>
					<Label htmlFor='email' className='mt-1'>
						Email
					</Label>
					<Input
						id='email'
						type='email'
						placeholder='Enter your email'
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Label htmlFor='password' className='mt-1'>
						Password
					</Label>
					<div className='relative'>
						<Input
							id='password'
							type={showPassword ? 'text' : 'password'}
							placeholder='Enter your password'
							minLength={5}
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<button
							type='button'
							onClick={() => setShowPassword(!showPassword)}
							className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:cursor-pointer'
						>
							{showPassword ? (
								<EyeOff className='h-4 w-4' />
							) : (
								<Eye className='h-4 w-4' />
							)}
						</button>
					</div>
					{error && <p className='text-red-500'>{error}</p>}
					<SubmitButton loadingState={loading} className='mt-2'>Login</SubmitButton>
				</form>
			</div>
		</div>
	)
}
