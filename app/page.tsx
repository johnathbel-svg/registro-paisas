'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiExplosion from 'react-confetti-explosion';
import { Check, Loader2, Mail, Phone, User, MapPin, CreditCard, Sparkles } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 }
  }
};

export default function RegistroPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [validation, setValidation] = useState({
    phone: { valid: false, message: '' },
    email: { valid: false, message: '' }
  });

  const validatePhone = (value: string) => {
    if (value.length === 0) return { valid: false, message: '' };
    if (value.length < 10) return { valid: false, message: 'Mínimo 10 dígitos' };
    if (!value.startsWith('3')) return { valid: false, message: 'Debe iniciar con 3' };
    return { valid: true, message: '✓ Número válido' };
  };

  const validateEmail = (value: string) => {
    if (value.length === 0) return { valid: false, message: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return { valid: false, message: 'Email inválido' };
    return { valid: true, message: '✓ Email válido' };
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const documentId = formData.get('documentId') as string;
    const address = formData.get('address') as string;

    const fullName = `${firstName} ${lastName}`.trim().toUpperCase();

    try {
      const { error: dbError } = await supabase
        .from('clients')
        .insert({
          first_name: firstName.toUpperCase(),
          last_name: lastName.toUpperCase(),
          full_name: fullName,
          phone: phone,
          email: email || null,
          document_id: documentId || null,
          address: address?.toUpperCase() || null,
        });

      if (dbError) throw dbError;

      setFirstName(firstName);
      setSuccess(true);
      setTimeout(() => {
        (e.target as HTMLFormElement).reset();
        setSuccess(false);
        setValidation({
          phone: { valid: false, message: '' },
          email: { valid: false, message: '' }
        });
      }, 5000);
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 rounded-t-3xl p-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/5" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"
            />
            <div className="relative z-10">
              <motion.h1
                className="text-3xl font-bold text-white tracking-tight"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                GRANERO LOS PAISAS
              </motion.h1>
              <p className="text-orange-100 text-sm mt-2 font-medium">Registro de Clientes</p>
            </div>
          </motion.div>

          {/* Form Container */}
          <motion.div
            variants={itemVariants}
            className="bg-white/95 backdrop-blur-xl rounded-b-3xl shadow-2xl p-8 border border-white/50"
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="text-center space-y-6 py-8"
                >
                  <div className="relative">
                    <ConfettiExplosion
                      force={0.6}
                      duration={3000}
                      particleCount={80}
                      width={1000}
                    />
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: 3, duration: 0.5 }}
                      className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-lg"
                    >
                      <Check className="w-12 h-12 text-white" strokeWidth={3} />
                    </motion.div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2">
                      ¡Bienvenido, {firstName}!
                    </h2>
                    <p className="text-gray-600 text-lg">
                      Ya eres parte de la familia 🎉
                    </p>
                    <p className="text-gray-500 text-sm mt-4">
                      Recibirás nuestras mejores promociones
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center mb-8">
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl mb-4 shadow-lg"
                    >
                      <Sparkles className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Bienvenido!</h2>
                    <p className="text-gray-700 text-sm font-medium">
                      Completa tus datos para agilizar tus pedidos y recibir promociones.
                    </p>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm font-medium text-center"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Phone */}
                    <motion.div variants={itemVariants} className="relative">
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          name="phone"
                          type="tel"
                          required
                          placeholder="Celular (300...)"
                          onChange={(e) => setValidation(prev => ({ ...prev, phone: validatePhone(e.target.value) }))}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 placeholder:text-gray-500 text-gray-900 font-medium"
                        />
                        {validation.phone.message && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`text-xs mt-2 ml-1 font-semibold ${validation.phone.valid ? 'text-green-600' : 'text-orange-600'}`}
                          >
                            {validation.phone.message}
                          </motion.p>
                        )}
                      </div>
                    </motion.div>

                    {/* Email */}
                    <motion.div variants={itemVariants} className="relative">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          name="email"
                          type="email"
                          placeholder="Correo electrónico (opcional)"
                          onChange={(e) => setValidation(prev => ({ ...prev, email: validateEmail(e.target.value) }))}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 placeholder:text-gray-500 text-gray-900 font-medium"
                        />
                        {validation.email.message && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`text-xs mt-2 ml-1 font-semibold ${validation.email.valid ? 'text-green-600' : 'text-orange-600'}`}
                          >
                            {validation.email.message}
                          </motion.p>
                        )}
                      </div>
                    </motion.div>

                    {/* Name Fields */}
                    <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          name="firstName"
                          required
                          placeholder="Nombre"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 placeholder:text-gray-500 text-gray-900 font-medium"
                        />
                      </div>
                      <input
                        name="lastName"
                        required
                        placeholder="Apellido"
                        className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 placeholder:text-gray-500 text-gray-900 font-medium"
                      />
                    </motion.div>

                    {/* Document ID */}
                    <motion.div variants={itemVariants} className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        name="documentId"
                        placeholder="Cédula (Opcional)"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 placeholder:text-gray-500 text-gray-900 font-medium"
                      />
                    </motion.div>

                    {/* Address */}
                    <motion.div variants={itemVariants} className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        name="address"
                        placeholder="Dirección Principal (Opcional)"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 placeholder:text-gray-500 text-gray-900 font-medium"
                      />
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                      variants={itemVariants}
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(251, 146, 60, 0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white font-bold py-5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative flex items-center justify-center gap-2 text-base">
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Registrando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Registrarme
                          </>
                        )}
                      </span>
                    </motion.button>

                    <motion.p
                      variants={itemVariants}
                      className="text-center text-xs text-gray-500 mt-4 font-medium"
                    >
                      Al registrarte aceptas nuestra política de tratamiento de datos.
                    </motion.p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
