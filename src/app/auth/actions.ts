'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Solo rutas internas: evita redirecciones a otros dominios (//sitio.com, https://...)
function safeNext(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') return null
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return null
  return value
}

function withNext(path: string, next: string | null) {
  return next ? `${path}&next=${encodeURIComponent(next)}` : path
}

export async function login(formData: FormData): Promise<void> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const next = safeNext(formData.get('next'))

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(withNext(`/login?error=${encodeURIComponent(error.message)}`, next))
  }

  revalidatePath('/', 'layout')
  redirect(next || '/dashboard/profile')
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

  const next = safeNext(formData.get('next'))

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  if (error) {
    redirect(withNext(`/register?error=${encodeURIComponent(error.message)}`, next))
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
      redirect(withNext(`/register?error=${encodeURIComponent("Usuario creado pero hubo un error al crear el perfil.")}`, next))
    }
  }

  revalidatePath('/', 'layout')
  redirect(next || '/dashboard/profile')
}

