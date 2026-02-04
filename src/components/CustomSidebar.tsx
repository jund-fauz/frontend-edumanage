import {
	Users,
	GraduationCap,
	School,
	CircleUser,
	EllipsisVertical,
	ChevronRight,
} from 'lucide-react'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from './ui/dropdown-menu'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarTrigger,
} from './ui/sidebar'
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'
import { Classroom, User } from '@/lib/types'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from './ui/collapsible'

export function CustomSidebar({
	children,
	setClassroom,
}: {
	children: ReactNode
	setClassroom?: Dispatch<SetStateAction<Classroom | Classroom[] | undefined>>
}) {
	const [user, setUser] = useState<User | null>(null)
	const [classrooms, setClassrooms] = useState<Classroom[] | null>(null)
	const pathname = useLocation().pathname
	const [query, setQuery] = useSearchParams()
	const navigate = useNavigate()

	const logout = () => {
		fetch(`${import.meta.env.VITE_BASE_URL}/api/logout`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}).then(res => {
				if (res.ok) {
					localStorage.removeItem('token')
					navigate('/login')
				}
			})
	}

	useEffect(() => {
		if (!query.get('id') && pathname !== '/')
			setQuery({
				id: '1',
			})
		const fetching = async () => {
			const token = localStorage.getItem('token')
			fetch(`${import.meta.env.VITE_BASE_URL}/api/user`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
				.then((response) => response.json())
				.then((data) => setUser(data))
			fetch(`${import.meta.env.VITE_BASE_URL}/api/classrooms${pathname !== '/' ? '?relation=none' : ''}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((data) => setClassrooms(data.data))
		}
		fetching()
	}, [])

	useEffect(
		() =>
			pathname !== '/'
				? setClassroom?.(
						classrooms
							? classrooms.find(
									(classroom) =>
										classroom.id == parseInt(query.get('id') as string),
								)
							: undefined,
					)
				: setClassroom?.(
						classrooms as Classroom[]
					),
		[classrooms],
	)

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader>EduManage, Inc.</SidebarHeader>
				<SidebarContent>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton isActive={pathname === '/'} asChild>
								<a href='/'>
									<School /> Classrooms
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
					<SidebarMenu>
						<Collapsible className='group/collapsible'>
							<SidebarMenuItem>
								<CollapsibleTrigger className='w-full'>
									<SidebarMenuButton isActive={pathname === '/students'}>
										<Users /> Students
										<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{classrooms?.map((classroom: Classroom) => (
											<SidebarMenuSubItem key={classroom.id}>
												<SidebarMenuSubButton
													asChild
													isActive={
														pathname === '/students' &&
														query.get('id') == classroom.id.toString()
													}
												>
													<a href={`/students?id=${classroom.id}`}>
														{classroom.name}
													</a>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					</SidebarMenu>
					<SidebarMenu>
						<Collapsible className='group/collapsible'>
							<SidebarMenuItem>
								<CollapsibleTrigger className='w-full'>
									<SidebarMenuButton isActive={pathname === '/teachers'}>
										<GraduationCap /> Teachers
										<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{classrooms?.map((classroom: Classroom) => (
											<SidebarMenuSubItem key={classroom.id}>
												<SidebarMenuSubButton
													asChild
													isActive={
														pathname === '/teachers' &&
														query.get('id') == classroom.id.toString()
													}
												>
													<a href={`/teachers?id=${classroom.id}`}>
														{classroom.name}
													</a>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					</SidebarMenu>
				</SidebarContent>
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton>
										<CircleUser /> {user?.email}{' '}
										<EllipsisVertical className='ml-auto' />
									</SidebarMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent side='right'>
									<DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>
			<main className='p-1 pe-2 w-full'>
				<SidebarTrigger />
				{children}
			</main>
		</SidebarProvider>
	)
}
