'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import {User} from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {

    const {data : session} = useSession()
    //  above line only tells us whether user is logged in or not
    const user = session?.user
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
         <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="#" className='text-xl font-bold mb-4 md:mb-0'>Mystery Message</a>
                {
                    session ? (
                        <>
                            <span className='mr-4'>Welcome, {user?.name || user?.email}</span>
                            <Button className="w-full md:w-auto bg-slate-100 text-black" variant="outline" onClick={() => signOut()}>
                                LogOut
                            </Button>
                        </>
                    ) : 
                    (
                        <Link href='/sign-in'>
                            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>
                                LogIn
                            </Button>
                        </Link>
                    )
                }
         </div>
    </nav>
  )
}

export default Navbar
