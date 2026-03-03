'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClientProfileRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/profile/provider') }, [router])
  return null
}
