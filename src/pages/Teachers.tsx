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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Classroom, Teacher } from '@/lib/types'
import {
	EllipsisVertical,
	Pencil,
	Plus,
	Trash,
} from 'lucide-react'
import { SubmitEvent, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Teachers() {
	const token = localStorage.getItem('token')
	const [teacher, setTeacher] = useState<Teacher | null>(null)
	const [teachers, setTeachers] = useState<Teacher[] | null>(null)
	const [classroom, setClassroom] = useState<Classroom | Classroom[] | undefined>(undefined)
	const [query, _setQuery] = useSearchParams()
	const [open, setOpen] = useState(false)
	const [deleteOpen, setDeleteOpen] = useState(false)
	const [mode, setMode] = useState<'add' | 'edit'>('add')
	const [loading, setLoading] = useState(false)

	const add = (e: SubmitEvent) => {
		e.preventDefault()
		setLoading(true)
		setTeacher({
			...teacher,
			classroom_id: (classroom as Classroom).id as number,
		})
		fetch(
			`${import.meta.env.VITE_BASE_URL}/api/teachers${mode === 'edit' && `/${teacher?.id}`}`,
			{
				method: mode === 'add' ? 'POST' : 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					'Access-Control-Allow-Origin': '*',
				},
				body: JSON.stringify(teacher),
			},
		).catch((error) => console.log(error))
		setTeachers(
			mode === 'add'
				? [...teachers, teacher]
				: teachers?.map((internalTeacher) =>
						internalTeacher.id === teacher.id ? teacher : internalTeacher,
					),
		)
		setLoading(false)
		setOpen(false)
		setTeacher(null)
	}

	const deleteTeacher = () => {
		setLoading(true)
		fetch(
			`${import.meta.env.VITE_BASE_URL}/api/teachers${mode === 'edit' && `/${teacher?.id}`}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
					'Access-Control-Allow-Origin': '*',
				},
			},
		).catch((error) => console.log(error))
        setTeachers(teachers?.filter(internalTeacher => internalTeacher.id !== teacher.id))
		setLoading(false)
		setDeleteOpen(false)
		setTeacher(null)
	}

	useEffect(() => {
		const fetchStudent = async () => {
			fetch(
				`${import.meta.env.VITE_BASE_URL}/api/teachers?classroom_id=${query.get('id')}`,
				{
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${token}`,
					},
				},
			)
				.then((res) => res.json())
				.then((data) => setTeachers(data.data))
		}

		fetchStudent()
	}, [])

	return (
		<CustomSidebar setClassroom={setClassroom}>
			<h1 className='font-bold text-2xl text-center'>
				{classroom && (classroom as Classroom).name} Teachers Data
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
						<TableHead>Lessons</TableHead>
						<TableHead>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{teachers &&
						teachers.map((teacher: Teacher) => (
							<TableRow key={teacher.id}>
								<TableCell>{teacher.name}</TableCell>
								<TableCell>{teacher.lessons.join(', ')}</TableCell>
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
													setTeacher(teacher)
												}}
											>
												<Pencil /> Edit
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => {
													setDeleteOpen(true)
													setTeacher(teacher)
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
					if (!state) setTeacher(null)
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
								value={(teacher && teacher.name) || ''}
								onChange={(e) =>
									setTeacher({ ...(teacher as Teacher), name: e.target.value })
								}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='lessons'>Lessons</Label>
							<Input
								type='text'
								id='lessons'
								placeholder="Lessons (Separate with comma and space ', '"
								value={(teacher && teacher.lessons.join(', ')) || ''}
								onChange={(e) =>
									setTeacher({
										...(teacher as Teacher),
										lessons: e.target.value.split(', '),
									})
								}
							/>
						</div>
						<SubmitButton loadingState={loading}>Submit</SubmitButton>
					</form>
				</DialogContent>
			</Dialog>
			<AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure want to delete the teacher?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. It will permanently delete the
							teacher from servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={deleteTeacher}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</CustomSidebar>
	)
}
