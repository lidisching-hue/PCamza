import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ADMIN_EMAILS } from '../config' // 👈 Importamos la lista de admins

export default function LoginAdmin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 1. Verificación de sesión al cargar
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      // Si ya hay sesión, verificamos si es admin antes de dejarlo pasar
      if (session?.user?.email && ADMIN_EMAILS.includes(session.user.email)) {
        navigate('/admin/dashboard')
      } else if (session) {
        // Si hay sesión pero NO es admin (ej. cliente logueado), cerramos sesión por seguridad
        await supabase.auth.signOut()
      }
    }
    checkSession()
  }, [navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // 2. PRIMERA BARRERA: ¿El correo escrito está en la lista blanca?
    // Si no está, ni siquiera molestamos a Supabase.
    if (!ADMIN_EMAILS.includes(email)) {
      setError('Acceso Denegado: Este correo no tiene permisos de administrador.')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.session) {
        // 3. SEGUNDA BARRERA: Verificación post-login (Doble seguridad)
        const userEmail = data.session.user.email
        
        if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
           navigate('/admin/dashboard')
        } else {
           // Si logró entrar pero no es admin, lo sacamos inmediatamente
           await supabase.auth.signOut()
           setError('Acceso Denegado: No tienes permisos de administrador.')
        }
      }
    } catch (err: any) {
      setError('Credenciales incorrectas o error de conexión.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Cabecera del Login */}
        <div className="bg-red-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-wider">PCAMZA ADMIN</h1>
          <p className="text-red-100 mt-2">Acceso restringido al panel de control</p>
        </div>

        {/* Formulario */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold border border-red-100 text-center animate-pulse">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                placeholder="admin@pcamza.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-slate-900 hover:bg-slate-800 hover:shadow-xl transform hover:-translate-y-1'
              }`}
            >
              {loading ? 'Verificando...' : 'Ingresar al Sistema'}
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Sistema Administrativo PCAMZA
        </div>
      </div>
    </div>
  )
}