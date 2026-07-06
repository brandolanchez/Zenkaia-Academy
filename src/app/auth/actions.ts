'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData): Promise<void> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard/profile')
}

export async function signup(formData: FormData): Promise<void> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    full_name: formData.get('full_name') as string,
    age: parseInt(formData.get('age') as string, 10),
    gender: formData.get('gender') as string,
    phone: formData.get('phone') as string,
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`)
  }

  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        age: data.age,
        gender: data.gender,
        role: 'student',
        has_paid: false
      })
      
    if (profileError) {
      console.error("Error creating profile:", profileError)
      redirect(`/register?error=${encodeURIComponent("Usuario creado pero hubo un error al crear el perfil.")}`)
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard/profile')
}

