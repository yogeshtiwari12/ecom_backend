"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

function Page() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post('/api/signup', formData, {
        withCredentials: true
      })

      if (response.data.success) {
        toast.success(response.data.message)
        setFormData({ name: '', email: '', password: '' })
        router.replace('/verify') 
        console.log(response.data);
      } else {
        toast.error(response.data.message)
        setError(response.data.message || 'Failed to create account. Please try again.')
      }
      console.log("Response data:", response.data);
      
    } catch (err) {
      const errorMessage = 'Network error. Please check your connection and try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-purple-700/50 rounded-xl shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-purple-400 text-center">Create Account</CardTitle>
            <CardDescription className="text-center text-slate-300">
              Enter your information to create your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert className="mb-4 bg-red-950/50 border-red-500/50">
                <AlertDescription className="text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300" htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    className="pl-10 text-slate-300 placeholder:text-slate-500 bg-slate-800/50 border border-slate-600/50 focus:border-purple-500/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300" htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="pl-10 text-slate-300 placeholder:text-slate-500 bg-slate-800/50 border border-slate-600/50 focus:border-purple-500/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300" htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="pl-10 pr-10 text-slate-300 placeholder:text-slate-500 bg-slate-800/50 border border-slate-600/50 focus:border-purple-500/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              <CardDescription className="text-center text-sm text-slate-400 mt-2">
                Already have an account?{' '}
                <a href="/sign-in" className="text-purple-400 hover:text-purple-300 hover:underline">
                  Sign in here
                </a>
              </CardDescription>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Page