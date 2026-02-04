import { CustomSidebar } from '@/components/CustomSidebar'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Classroom, Student, Teacher } from '@/lib/types'
import { format } from 'date-fns'
import { useState } from 'react'

export default function Dashboard() {
	const [classrooms, setClassrooms] = useState<
		Classroom | Classroom[] | undefined
	>(undefined)

	return (
		<CustomSidebar setClassroom={setClassrooms}>
			<div className='flex flex-col gap-6'>
				<div>
					<h1 className='font-bold text-2xl text-center'>
						Students Data based on Classroom
					</h1>
					{classrooms &&
						(classrooms as Classroom[]).map((classroom: Classroom) => (
							<>
								<h1 className='font-semibold text-xl text-center my-2'>
									{classroom.name}
								</h1>
								<div className='rounded-md border'>
									<Table className='mt-2'>
										<TableHeader>
											<TableRow>
												<TableHead>Name</TableHead>
												<TableHead>Address</TableHead>
												<TableHead>Birthday</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{classroom &&
												classroom.students?.map((student: Student) => (
													<TableRow key={student.id}>
														<TableCell>{student.name}</TableCell>
														<TableCell>{student.address}</TableCell>
														<TableCell>
															{format(
																new Date(student.birthday),
																'd MMMM yyyy',
															)}
														</TableCell>
													</TableRow>
												))}
										</TableBody>
									</Table>
								</div>
							</>
						))}
				</div>
				<div>
					<h1 className='font-bold text-2xl text-center'>
						Teachers Data based on Classroom
					</h1>
					{classrooms &&
						(classrooms as Classroom[]).map((classroom: Classroom) => (
							<>
								<h1 className='font-semibold text-xl text-center my-2'>
									{classroom.name}
								</h1>
								<div className='rounded-md border'>
									<Table className='mt-2'>
										<TableHeader>
											<TableRow>
												<TableHead>Name</TableHead>
												<TableHead>Lessons</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{classroom &&
												classroom.teachers?.map((teachers: Teacher) => (
													<TableRow key={teachers.id}>
														<TableCell>{teachers.name}</TableCell>
														<TableCell>{teachers.lessons.join(', ')}</TableCell>
													</TableRow>
												))}
										</TableBody>
									</Table>
								</div>
							</>
						))}
				</div>
			</div>
		</CustomSidebar>
	)
}
