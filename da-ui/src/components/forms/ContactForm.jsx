import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Mail, Phone, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import DOMPurify from 'dompurify';
import { apiService } from '../../services/api';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Nome deve ter no mínimo 2 caracteres';
    }

    if (!formData.email.trim()) {
      errors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'E-mail inválido';
    }

    if (formData.phone.trim()) {
      const phoneDigits = formData.phone.replace(/\D/g, '');

      if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        errors.phone = 'Telefone deve ter 10 ou 11 dígitos';
      } else if (phoneDigits.length === 11 && phoneDigits[2] !== '9') {
        errors.phone = 'Celular deve começar com 9 após o DDD';
      }
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Assunto é obrigatório';
    } else if (formData.subject.trim().length < 10) {
      errors.subject = 'Assunto deve ter no mínimo 10 caracteres';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitStatus(null);
    setErrorMessage('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await apiService.sendContact({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject.trim(),
      });

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
      });

      setTimeout(() => {
        setSubmitStatus(null);
      }, 10000);

    } catch (error) {
      setSubmitStatus('error');

      if (error.data?.data?.errors) {
        const backendErrors = {};
        error.data.data.errors.forEach(err => {
          backendErrors[err.field] = DOMPurify.sanitize(err.message, { ALLOWED_TAGS: [] });
        });
        setFieldErrors(backendErrors);
        setErrorMessage(DOMPurify.sanitize('Por favor, corrija os erros no formulário.', { ALLOWED_TAGS: [] }));
      } else {
        const rawMessage = error.message ||
          error.data?.description ||
          'Erro ao enviar mensagem. Tente novamente.';
        setErrorMessage(DOMPurify.sanitize(rawMessage, { ALLOWED_TAGS: [] }));
      }

      setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage('');
      }, 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: undefined,
      });
    }
  };

  return (
    <div className="p-8 rounded-2xl border border-gray-800 bg-gradient-to-br from-zinc-900/80 to-black/50 backdrop-blur-sm">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          Ou, entre em contato de forma rápida
        </h3>
        <p className="text-gray-400 text-sm">
          Preencha o formulário e entrarei em contato o mais breve possível
        </p>
      </div>

      <AnimatePresence mode="wait">
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-start gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-green-500 font-medium">Mensagem enviada com sucesso!</p>
              <p className="text-green-400/80 text-sm mt-1">
                Obrigado pelo contato. Retornarei em breve!
              </p>
            </div>
          </motion.div>
        )}

        {submitStatus === 'error' && errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-500 font-medium">Erro ao enviar mensagem</p>
              <p className="text-red-400/80 text-sm mt-1">{errorMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <User className="w-4 h-4" />
            Nome
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Seu nome"
            className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg text-white placeholder-gray-600 focus:outline-none transition-colors ${
              fieldErrors.name 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-gray-800 focus:border-gray-600'
            }`}
          />
          {fieldErrors.name && (
            <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <Mail className="w-4 h-4" />
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="seu@email.com"
            className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg text-white placeholder-gray-600 focus:outline-none transition-colors ${
              fieldErrors.email 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-gray-800 focus:border-gray-600'
            }`}
          />
          {fieldErrors.email && (
            <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <Phone className="w-4 h-4" />
            Telefone <span className="text-gray-600 text-xs">(Opcional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
            className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg text-white placeholder-gray-600 focus:outline-none transition-colors ${
              fieldErrors.phone 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-gray-800 focus:border-gray-600'
            }`}
          />
          {fieldErrors.phone && (
            <p className="text-red-400 text-xs mt-1">{fieldErrors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <MessageSquare className="w-4 h-4" />
            Assunto
          </label>
          <textarea
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Descreva seu projeto ou ideia..."
            className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg text-white placeholder-gray-600 focus:outline-none transition-colors resize-none ${
              fieldErrors.subject 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-gray-800 focus:border-gray-600'
            }`}
          />
          {fieldErrors.subject && (
            <p className="text-red-400 text-xs mt-1">{fieldErrors.subject}</p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-black font-semibold rounded-lg transition-all duration-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              Enviar Mensagem
              <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </motion.button>

        <p className="text-xs text-gray-600 text-center">
          Seus dados serão utilizados apenas para responder sua mensagem.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;

