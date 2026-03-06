import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { registerMockUser } from '../mock/authMock'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error('Name, email and password are required')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    const result = registerMockUser(formData)
    if (!result.ok) {
      toast.error(result.message)
      return
    }

    toast.success(`Account created for ${result.user.name}`)
    navigate('/home')
  }

  return (
    <section className='flex min-h-screen items-center justify-center bg-[#ececec] p-4'>
      <div className='w-full max-w-sm rounded-lg border border-[#ff2c7b] bg-white p-5 shadow-md'>
        <h1 className='mb-4 text-2xl font-bold text-[#e4006e]'>Register</h1>

        <form className='space-y-3' onSubmit={handleSubmit}>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='Full name'
            className='w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[#ff2c7b]'
          />
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
          <input
            type='password'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder='Confirm password'
            className='w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[#ff2c7b]'
          />
          <button
            type='submit'
            className='w-full rounded bg-[#e4006e] py-2 font-semibold text-white'
          >
            Create Account
          </button>
        </form>

        <p className='mt-4 text-sm'>
          Already have an account?{' '}
          <Link to='/login' className='font-semibold text-[#e4006e]'>
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Register
