import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const [state, setState] = useState('Login') // 'Login' or 'Sign Up'
  const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isLogin = state === 'Login'

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      if (isLogin) {
        // login API
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

        if (data.success) {
          setToken(data.token)
          setUser(data.user)
          // storing token in browser's local storage
          localStorage.setItem('token', data.token)
          setShowLogin(false)
          toast.success('Logged in successfully')
        } else {
          toast.error(data.message || 'Login failed')
        }
      } else {
        // signup API
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })

        if (data.success) {
          setToken(data.token)
          setUser(data.user)
          localStorage.setItem('token', data.token)
          setShowLogin(false)
          toast.success('Account created successfully')
        } else {
          toast.error(data.message || 'Registration failed')
        }
      }
    } catch (error) {
      // If axios error, prefer server message if present
      const msg = error?.response?.data?.message || error.message || 'Something went wrong'
      toast.error(msg)
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
      <motion.form
        onSubmit={onSubmitHandler}
        initial={{ opacity: 0.2, y: 100 }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className='relative bg-white p-10 rounded-xl text-slate-500 w-[380px]'
      >
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
        <p className='text-sm mb-4'>{isLogin ? 'Welcome back! Sign in to continue' : 'Create an account to get started'}</p>

        {!isLogin && (
          <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-2'>
            <img src={assets.user_icon} alt='user' />
            <input
              onChange={e => setName(e.target.value)}
              value={name}
              type='text'
              className='outline-none text-sm w-full'
              placeholder='Full Name'
              required
            />
          </div>
        )}

        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
          <img src={assets.email_icon} alt='email' />
          <input
            onChange={e => setEmail(e.target.value)}
            value={email}
            type='email'
            className='outline-none text-sm w-full'
            placeholder='Email-id'
            required
          />
        </div>

        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
          <img src={assets.lock_icon} alt='lock' />
          <input
            onChange={e => setPassword(e.target.value)}
            value={password}
            type='password'
            className='outline-none text-sm w-full'
            placeholder='Password'
            required
          />
        </div>

        <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot Password?</p>

        {/* Make the button submit the form */}
        <button type='submit' className='bg-blue-600 w-full text-white py-2 rounded-full'>
          {isLogin ? 'login' : 'create account'}
        </button>

        {isLogin ? (
          <p className='mt-5 text-center'>
            Don't have an account?{' '}
            <span className='text-blue-600 cursor-pointer' onClick={() => setState('Sign Up')}>
              Sign Up
            </span>
          </p>
        ) : (
          <p className='mt-5 text-center'>
            Already have an account?{' '}
            <span className='text-blue-600 cursor-pointer' onClick={() => setState('Login')}>
              Login
            </span>
          </p>
        )}

        <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt='close' className='absolute top-5 right-5 cursor-pointer' />
      </motion.form>
    </div>
  )
}

export default Login
