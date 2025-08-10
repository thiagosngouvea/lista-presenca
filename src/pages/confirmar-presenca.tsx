import { useState, useEffect } from 'react';
import { addGuest, getGuests } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';
import mascaraImage from '@/assets/mascara-de-carnaval.png';

interface Guest {
  id: string;
  name: string;
  hasCompanions: boolean;
  companions?: string[];
  createdAt?: any;
}

export default function ConfirmarPresenca() {
  const [formData, setFormData] = useState({
    name: '',
    hasCompanions: false,
    companions: ['']
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for glitter effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        companions: checked ? [''] : []
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCompanionChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      companions: prev.companions.map((companion, i) => 
        i === index ? value : companion
      )
    }));
  };

  const addCompanionField = () => {
    setFormData(prev => ({
      ...prev,
      companions: [...prev.companions, '']
    }));
  };

  const removeCompanionField = (index: number) => {
    if (formData.companions.length > 1) {
      setFormData(prev => ({
        ...prev,
        companions: prev.companions.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setMessage('Por favor, preencha o nome completo.');
      return;
    }

    if (formData.hasCompanions) {
      const validCompanions = formData.companions.filter(comp => comp.trim() !== '');
      if (validCompanions.length === 0) {
        setMessage('Por favor, adicione pelo menos um acompanhante ou desmarque a opção.');
        return;
      }
    }

    setIsLoading(true);
    setMessage('');

    try {
      const companionsToSave = formData.hasCompanions 
        ? formData.companions.filter(comp => comp.trim() !== '').map(comp => comp.trim())
        : [];

      await addGuest({
        name: formData.name.trim(),
        hasCompanions: formData.hasCompanions,
        companions: companionsToSave.length > 0 ? companionsToSave : undefined,
      });

      setFormData({ name: '', hasCompanions: false, companions: [''] });
      setMessage('Presença confirmada com sucesso! 🎭');
    } catch (error) {
      console.error('Error:', error);
      setMessage('Erro ao confirmar presença. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black py-8 px-4 relative overflow-hidden">
      {/* CSS for glitter animations */}
      <style jsx>{`
        @keyframes glitter-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes glitter-sparkle {
          0%, 100% {
            transform: scale(0.5);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes glitter-twinkle {
          0%, 100% {
            box-shadow: 0 0 6px #ffd700;
            opacity: 0.6;
          }
          50% {
            box-shadow: 0 0 20px #ffd700, 0 0 30px #ffed4e;
            opacity: 1;
          }
        }

        .glitter-particle {
          position: absolute;
          background: linear-gradient(45deg, #ffd700, #ffed4e, #fbbf24);
          border-radius: 50%;
          pointer-events: none;
          animation: glitter-fall linear infinite, glitter-sparkle 2s ease-in-out infinite;
        }

        .glitter-twinkle {
          position: absolute;
          background: #ffd700;
          border-radius: 50%;
          pointer-events: none;
          animation: glitter-twinkle 1.5s ease-in-out infinite;
        }

        .mouse-glitter {
          position: fixed;
          background: radial-gradient(circle, #ffd700, #ffed4e);
          border-radius: 50%;
          pointer-events: none;
          transition: all 0.1s ease-out;
          z-index: 9999;
        }
      `}</style>

      {/* Fixed Background Glitter */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="glitter-particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDuration: `${Math.random() * 8 + 6}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}

        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={`twinkle-${i}`}
            className="glitter-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Mouse Following Glitter */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`mouse-${i}`}
            className="mouse-glitter"
            style={{
              left: mousePosition.x + Math.sin(Date.now() * 0.001 + i) * 30 - 2,
              top: mousePosition.y + Math.cos(Date.now() * 0.001 + i) * 30 - 2,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              opacity: 0.7 - i * 0.08,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 text-yellow-400 hover:text-yellow-300 transition-colors">
            ← Voltar ao início
          </Link>
          <div className="mb-4 flex justify-center items-center gap-4">
            <Image 
              src={mascaraImage} 
              alt="Máscara de Carnaval" 
              width={80} 
              height={80}
              className="opacity-90 transform hover:scale-110 transition-transform duration-300 filter drop-shadow-2xl"
            />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-500 bg-clip-text text-transparent mb-3 drop-shadow-2xl">
            Confirme a sua presença
          </h1>
          <p className="text-gray-200 text-lg mb-2 font-medium">
            Festa de Aniversário de Ana Claúdia
          </p>
        </div>

        {/* Form */}
        <div className="bg-black bg-opacity-80 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-yellow-400 p-7 mb-8 shadow-yellow-400/20">
          <h2 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center gap-3 drop-shadow-lg">
            <Image src={mascaraImage} alt="Máscara" width={32} height={32} className="opacity-80 filter drop-shadow-lg" />
            Confirmação de Presença
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-yellow-200 mb-2 drop-shadow-md">
                Nome Completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-950 border-2 border-gray-700 rounded-md text-yellow-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all font-medium"
                placeholder="Digite seu nome completo"
              />
            </div>

            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasCompanions"
                  name="hasCompanions"
                  checked={formData.hasCompanions}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 bg-gray-950 border-yellow-400 rounded"
                />
                <label htmlFor="hasCompanions" className="ml-3 block text-sm font-semibold text-yellow-200 drop-shadow-md">
                  Vou levar acompanhantes para a Festa
                </label>
              </div>
            </div>

            {formData.hasCompanions && (
              <div className="space-y-3 bg-gray-950 bg-opacity-70 p-5 rounded-lg border-2 border-yellow-500">
                <label className="block text-sm font-semibold text-yellow-200 flex items-center gap-2 drop-shadow-md">
                  <span>👥</span>
                  Nome dos Acompanhantes
                </label>
                {formData.companions.map((companion, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={companion}
                      onChange={(e) => handleCompanionChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-950 border-2 border-gray-700 rounded-md text-yellow-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-medium"
                      placeholder={`Nome do(a) acompanhante ${index + 1}`}
                    />
                    {formData.companions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCompanionField(index)}
                        className="px-3 py-2 text-red-400 hover:text-red-300 focus:outline-none transition-colors font-bold"
                        title="Remover acompanhante"
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCompanionField}
                  className="text-yellow-300 hover:text-yellow-200 text-sm font-bold focus:outline-none transition-colors flex items-center gap-1 drop-shadow-md"
                >
                  <span>➕</span>
                  Adicionar mais um acompanhante
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-black font-bold py-4 px-6 rounded-lg hover:from-yellow-300 hover:via-yellow-200 hover:to-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.03] active:scale-[0.97] shadow-xl shadow-yellow-400/30 border-2 border-yellow-400"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3 text-lg">
                  <span className="animate-spin">⏳</span>
                  Confirmando presença...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3 text-lg">
                  <Image src={mascaraImage} alt="Máscara" width={28} height={28} className="filter drop-shadow-lg" />
                  Confirmar Presença na Festa
                </span>
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-4 rounded-md border-2 font-semibold ${
              message.includes('sucesso') 
                ? 'bg-green-950 bg-opacity-70 text-green-300 border-green-400 shadow-green-400/20' 
                : 'bg-red-950 bg-opacity-70 text-red-300 border-red-400 shadow-red-400/20'
            }`}>
              {message}
            </div>
          )}
        </div>
      <div className="bg-black bg-opacity-80 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-yellow-400 p-8 shadow-yellow-400/20">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Image src={mascaraImage} alt="Máscara" width={48} height={48} className="opacity-80 filter drop-shadow-lg" />
                <h2 className="text-3xl font-bold text-yellow-300 drop-shadow-lg">
                  Dress Code
                </h2>
                <Image src={mascaraImage} alt="Máscara" width={48} height={48} className="opacity-80 filter drop-shadow-lg transform scale-x-[-1]" />
              </div>
              
              <div className="space-y-6">
                <div className="p-6 bg-yellow-900 bg-opacity-30 rounded-lg border border-yellow-400">
                  <h3 className="text-xl font-bold text-yellow-200 mb-3">✅ Traje Esporte Fino</h3>
                  <p className="text-gray-300 text-lg">
                    Vista seu melhor traje esporte fino para esta noite especial
                  </p>
                </div>

                <div className="p-6 bg-red-900 bg-opacity-40 rounded-lg border-2 border-red-500">
                  <h3 className="text-xl font-bold text-red-300 mb-3">🚫 PROIBIDO ROUPA VERMELHA</h3>
                  <p className="text-gray-300 text-lg">
                    Por favor, evite roupas na cor vermelha para manter a harmonia do evento
                  </p>
                </div>

                <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-600">
                  <h3 className="text-lg font-bold text-gray-300 mb-3">🎭 Máscaras</h3>
                  <p className="text-gray-400">
                    O uso de máscaras será obrigatório
                  </p>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
