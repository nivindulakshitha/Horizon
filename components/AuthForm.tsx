"use client";
import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomInput from './CustomInput';
import { authFormSchema } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { signUp, signIn } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';
import PlaidLink from './PlaidLink';

const AuthForm = ({ type }: { type: string }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            console.log(values)
            if (type === 'sign-up') {
                const newUser = await signUp(values)
                setUser(newUser)

            } else if (type === 'sign-in') {
                const response = await signIn({
                    email: values.email,
                    password: values.password
                })

                if (response) router.push('/')

            } else {
                new Error('Invalid form type')
            }

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className='auth-form'>
            <header className="flex flex-col gap-5 md:gap-8">
                <Link href="/" className='flex cursor-pointer items-center gap-1'>
                    <Image
                        src="/icons/logo.svg"
                        width={34}
                        height={34}
                        alt='Horizon Logo'
                    />
                    <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>
                        Horizon
                    </h1>
                </Link>

                <div className="flex flex-col gap-1 md:gap-3">
                    <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
                        {
                            user ? 'Link Account' : type === 'sign-in' ? 'Sign In' : 'Sign Up'
                        }
                        <p className="text-16 font-normal text-gray-600">
                            {
                                user ? 'Link your account to continue' : type === 'sign-in' ? 'Sign in to your account' : 'Create an account'
                            }
                        </p>
                    </h1>
                </div>
            </header>

            {
                user ? (
                    <div className="flex flex-col gap-4">
                        <PlaidLink user={user} variant="primary" />
                    </div>
                )
                    : (
                        <>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                    {
                                        type === 'sign-up' && (
                                            <>
                                                <div className="flex gap-4">
                                                    <CustomInput
                                                        control={form.control}
                                                        name='firstName'
                                                        label='First Name'
                                                        placeholder='John'
                                                    />

                                                    <CustomInput
                                                        control={form.control}
                                                        name='lastName'
                                                        label='Last Name'
                                                        placeholder='Smith'
                                                    />
                                                </div>


                                                <CustomInput
                                                    control={form.control}
                                                    name='address1'
                                                    label='Address'
                                                    placeholder="ex: 123, Main Street"
                                                />

                                                <CustomInput
                                                    control={form.control}
                                                    name='city'
                                                    label='City'
                                                    placeholder="ex: New York"
                                                />

                                                <div className="flex gap-4">
                                                    <CustomInput
                                                        control={form.control}
                                                        name='state'
                                                        label='State'
                                                        placeholder='ex: NWP'
                                                    />

                                                    <CustomInput
                                                        control={form.control}
                                                        name='postalCode'
                                                        label='Postal Code'
                                                        placeholder='ex: 60000'
                                                    />
                                                </div>

                                                <div className="flex gap-4">
                                                    <CustomInput
                                                        control={form.control}
                                                        name='birthDate'
                                                        label='Date of Birth'
                                                        placeholder='YYYY-MM-DD'
                                                    />

                                                    <CustomInput
                                                        control={form.control}
                                                        name='ssn'
                                                        label='SNN'
                                                        placeholder='ex: 1234'
                                                    />
                                                </div>
                                            </>
                                        )
                                    }

                                    <CustomInput
                                        control={form.control}
                                        name='email'
                                        label='E mail'
                                        placeholder='johnsmith@email.com'
                                    />

                                    <CustomInput
                                        control={form.control}
                                        name='password'
                                        label='Password'
                                        placeholder='Password'
                                    />

                                    <div className='flex flex-col gap-4'>
                                        <Button type="submit" className='form-btn' disabled={isLoading}>
                                            {
                                                isLoading ? (
                                                    <>
                                                        <Loader2 size={20} className='animate-spin' />
                                                        &nbsp; Loading...
                                                    </>
                                                ) : type === 'sign-in' ? 'Sign In' : 'Sign Up'
                                            }
                                        </Button>
                                    </div>
                                </form>
                            </Form>

                            <footer className="flex justify-center gap-1">
                                <p className='text-14 font-normal text-gray-600'>
                                    {
                                        type === 'sign-in' ? "Don't have an account?" : 'Already have an account?'
                                    }
                                </p>

                                <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className='form-link'>
                                    {
                                        type === 'sign-in' ? 'Sign up' : 'Sign in'
                                    }
                                </Link>
                            </footer>
                        </>
                    )
            }
        </section>
    )
}

export default AuthForm