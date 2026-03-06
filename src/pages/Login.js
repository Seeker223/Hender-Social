import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getMockUsers, loginMockUser } from '../mock/authMock'

const Login = () => {
  const navigate = useNavigate()
  const mockUsers = getMockUsers().slice(0, 2)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error('Email and password are required')
      return
    }

    const result = loginMockUser(formData)
    if (!result.ok) {
      toast.error(result.message)
      return
    }

    toast.success(`Welcome back, ${result.user.name}`)
    navigate('/home')
  }

  return (
    <section className='flex min-h-screen items-center justify-center bg-[#ececec] p-4'>
      <div className='w-full max-w-sm rounded-lg border border-[#ff2c7b] bg-white p-5 shadow-md'>
        <h1 className='mb-4 text-2xl font-bold text-[#e4006e]'>Login</h1>

        <form className='space-y-3' onSubmit={handleSubmit}>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Email'
            className='w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[#ff2c7b]'
          />
          <input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Password'
            className='w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[#ff2c7b]'
          />
          <button
            type='submit'
            className='w-full rounded bg-[#e4006e] py-2 font-semibold text-white'
          >
            Sign In
          </button>
        </form>

        <div className='mt-4 rounded border border-[#ffd1e6] bg-[#fff5fa] p-3 text-xs text-black'>
          <p className='mb-2 font-semibold'>Mock Accounts</p>
          {mockUsers.map((user) => (
            <p key={user.id}>
              {user.email} / {user.password}
            </p>
          ))}
        </div>

        <p className='mt-4 text-sm'>
          No account?{' '}
          <Link to='/register' className='font-semibold text-[#e4006e]'>
            Register
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Login
