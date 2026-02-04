'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RegistroPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const documentId = formData.get('documentId') as string;
    const address = formData.get('address') as string;

    const fullName = `${firstName} ${lastName}`.trim().toUpperCase();

    try {
      const { error } = await supabase
        .from('clients')
        .insert({
          first_name: firstName.toUpperCase(),
          last_name: lastName.toUpperCase(),
          full_name: fullName,
          phone: phone,
          document_id: documentId || null,
          address: address?.toUpperCase() || null,
        });

      if (error) throw error;

      setMessage({ type: 'success', text: '¡Registro exitoso!' });
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: error.message || 'Error al registrar' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-2xl p-6 text-center">
          <h1 className="text-2xl font-bold text-white">GRANERO LOS PAISAS</h1>
          <p className="text-orange-100 text-sm mt-1">Registro de Clientes</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">¡Hola! 👋</h2>
            <p className="text-gray-500 text-sm mt-1">
              Completa tus datos para agilizar tus pedidos y recibir promociones.
            </p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm text-center font-medium ${message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
                }`}
            >
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                name="phone"
                type="tel"
                required
                placeholder="Celular (300...)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                name="firstName"
                required
                placeholder="Nombre"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
              <input
                name="lastName"
                required
                placeholder="Apellido"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <input
                name="documentId"
                placeholder="Cédula (Opcional)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <input
                name="address"
                placeholder="Dirección Principal (Opcional)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registrando...' : 'Registrarme'}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              Al registrarte aceptas nuestra política de tratamiento de datos.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
