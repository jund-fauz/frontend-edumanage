import { CustomSidebar } from '@/components/CustomSidebar'
import SubmitButton from '@/components/SubmitButton'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Classroom, Student } from '@/lib/types'
import { format } from 'date-fns'
import {
	CalendarIcon,
	EllipsisVertical,
	Pencil,
	Plus,
	Trash,
} from 'lucide-react'
import { SubmitEvent, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Students() {
	const token = localStorage.getItem('token')
	const [student, setStudent] = useState<Student | null>(null)
	const [students, setStudents] = useState<Student[] | null>(null)
	const [classroom, setClassroom] = useState<Classroom | Classroom[] | undefined>(undefined)
	const [query, _setQuery] = useSearchParams()
	const [open, setOpen] = useState(false)
	const [deleteOpen, setDeleteOpen] = useState(false)
	const [calendarOpen, setCalendarOpen] = useState(false)
	const [mode, setMode] = useState<'add' | 'edit'>('add')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const add = (e: SubmitEvent) => {
		e.preventDefault()
		if (!student?.birthday) {
			setError('Birthday not set')
			return
		}
		setLoading(true)
		setStudent({...student, classroom_id: (classroom as Classroom).id as number})
		fetch(
			`${import.meta.env.VITE_BASE_URL}/api/students${mode === 'edit' ? `/${student.id}` : ''}`,
			{
				method: mode === 'add' ? 'POST' : 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(student),
			},
		).then(res => res.json()).then(data => console.log(data)).catch((error) => console.log(error))
		setStudents(
			mode === 'add'
				? [...students, student]
				: students?.map((internalStudent) =>
						internalStudent.id === student.id ? student : internalStudent,
					),
		)
		setLoading(false)
		setOpen(false)
		setStudent(null)
	}

	const deleteStudent = () => {
		setLoading(true)
		fetch(
			`${import.meta.env.VITE_BASE_URL}/api/students/${student?.id}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		).catch((error) => console.log(error))
        setStudents(students?.filter(internalStudent => internalStudent.id !== student.id))
		setLoading(false)
		setDeleteOpen(false)
		setStudent(null)
	}

	useEffect(() => {
		const fetchStudent = async () => {
			fetch(
				`${import.meta.env.VITE_BASE_URL}/api/students?classroom_id=${query.get('id')}`,
				{
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${token}`,
					},
				},
			)
				.then((res) => res.json())
				.then((data) => setStudents(data.data))
		}

		fetchStudent()
	}, [])

	return (
		<CustomSidebar setClassroom={setClassroom}>
			<h1 className='font-bold text-2xl text-center'>
				{classroom && (classroom as Classroom).name} Students Data
			</h1>
			<div className='flex justify-end'>
				<Button
					onClick={() => {
						setOpen(true)
						setMode('add')
					}}
				>
					<Plus /> Add
				</Button>
			</div>
			<Table className='mt-2'>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Address</TableHead>
						<TableHead>Birthday</TableHead>
						<TableHead>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{students &&
						students.map((student: Student) => (
							<TableRow key={student.id}>
								<TableCell>{student.name}</TableCell>
								<TableCell>{student.address}</TableCell>
								<TableCell>
									{format(new Date(student.birthday), 'd MMMM yyyy')}
								</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger>
											<Button size='sm' variant='ghost'>
												<EllipsisVertical />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuItem
												onClick={() => {
													setOpen(true)
													setMode('edit')
													setStudent(student)
												}}
											>
												<Pencil /> Edit
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => {
													setDeleteOpen(true)
													setStudent(student)
												}}
											>
												<Trash /> Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
			<Dialog
				open={open}
				onOpenChange={(state: boolean) => {
					setOpen(state)
					if (!state) setStudent(null)
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{mode == 'edit' ? 'Edit' : 'Add'} Student</DialogTitle>
					</DialogHeader>
					<form className='space-y-3' onSubmit={add}>
						<div className='space-y-2'>
							<Label htmlFor='name'>Name</Label>
							<Input
								type='text'
								id='name'
								required
								placeholder='Complete name'
								value={(student && student.name) || ''}
								onChange={(e) =>
									setStudent({ ...(student as Student), name: e.target.value })
								}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='address'>Address</Label>
							<Input
								type='text'
								id='address'
								required
								placeholder='Address'
								value={(student && student.address) || ''}
								onChange={(e) =>
									setStudent({
										...(student as Student),
										address: e.target.value,
									})
								}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='birthday'>Birthday</Label>
							<Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
								<PopoverTrigger asChild>
									<Button
										variant='outline'
										id='birthday'
										className='justify-start font-normal'
									>
										{student && student.birthday ? (
											format(new Date(student.birthday), 'd MMMM yyyy')
										) : (
											<CalendarIcon />
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className='w-auto overflow-hidden p-0'
									align='start'
								>
									<Calendar
										mode='single'
										selected={
											student && student.birthday && new Date(student.birthday)
										}
										defaultMonth={
											student && student.birthday && new Date(student.birthday)
										}
										captionLayout='dropdown'
										onSelect={(date) => {
											if (date)
												setStudent({ ...(student as Student), birthday: date })
											setCalendarOpen(false)
										}}
									/>
								</PopoverContent>
							</Popover>
						</div>
						{error && <p className='text-red-500'>{error}</p>}
						<SubmitButton loadingState={loading}>Submit</SubmitButton>
					</form>
				</DialogContent>
			</Dialog>
			<AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure want to delete the student?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. It will permanently delete the
							student from servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={deleteStudent}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</CustomSidebar>
	)
}
