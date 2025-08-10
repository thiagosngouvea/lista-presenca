
import { useState, useEffect } from 'react';
import { addIntention } from '@/lib/firebase';
import Image from 'next/image';
import mascaraImage from '@/assets/mascara-de-carnaval.png';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Modal states
  const [showModal, setShowModal] = useState(true);
  const [modalName, setModalName] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalStep, setModalStep] = useState('initial'); // 'initial', 'askName', 'confirmed'

  // Mouse tracking for glitter effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleModalYes = () => {
    setShowModal(false);
    router.push('/confirmar-presenca');
  };

  const handleModalNo = () => {
    // Mostra o campo de nome para quem não vai
    setModalStep('askName');
  };

  const handleConfirmNo = async () => {
    if (!modalName.trim()) {
      setModalMessage('Por favor, digite seu nome.');
      return;
    }

    setModalLoading(true);
    setModalMessage('');

    try {
      await addIntention({
        name: modalName.trim(),
        willAttend: false
      });

      setModalStep('confirmed');
      setModalMessage('Que pena que você não poderá comparecer! 😢 Esperamos você numa próxima oportunidade. Obrigado por nos informar!');
    } catch (error) {
      console.error('Error saving intention:', error);
      setModalMessage('Erro ao salvar resposta. Tente novamente.');
      setModalStep('askName'); // Volta para o step anterior em caso de erro
    } finally {
      setModalLoading(false);
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

      {/* Initial Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl shadow-yellow-400/20">
            <div className="text-center mb-6">
              <div className="mb-4">
                <Image 
                  src={mascaraImage} 
                  alt="Máscara" 
                  width={60} 
                  height={60}
                  className="mx-auto opacity-80 filter drop-shadow-lg"
                />
              </div>
              <h2 className="text-2xl font-bold text-yellow-300 mb-2 drop-shadow-lg">
                Baile de Máscaras
              </h2>
              <p className="text-gray-300 text-lg mb-4">
                Aniversário de Ana Claúdia
              </p>
              {modalStep === 'initial' && (
                <>
                  <p className="text-yellow-200 font-medium mb-3">
                    Você pretende comparecer à festa?
                  </p>
                  <p className="text-gray-400 text-sm italic">
                    ⚠️ Por favor, confirme apenas se tiver certeza da sua resposta
                  </p>
                </>
              )}

              {modalStep === 'askName' && (
                <p className="text-yellow-200 font-medium">
                  Por favor, informe seu nome para confirmarmos que você não poderá comparecer:
                </p>
              )}

              {modalStep === 'confirmed' && (
                <div className="p-4 rounded-md border-2 border-yellow-400 bg-yellow-900 bg-opacity-30 text-yellow-200 font-medium">
                  {modalMessage}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Campo nome só aparece se modalStep for 'askName' */}
              {modalStep === 'askName' && (
                <div>
                  <label htmlFor="modalName" className="block text-sm font-semibold text-yellow-200 mb-2">
                    Seu nome *
                  </label>
                  <input
                    type="text"
                    id="modalName"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-950 border-2 border-gray-700 rounded-md text-yellow-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all font-medium"
                    placeholder="Digite seu nome"
                    disabled={modalLoading}
                  />
                </div>
              )}

              {/* Mensagem de erro */}
              {modalMessage && modalStep === 'askName' && !modalMessage.includes('pena') && (
                <div className="p-3 rounded-md border-2 border-red-400 bg-red-950 bg-opacity-70 text-red-300 font-semibold text-sm">
                  {modalMessage}
                </div>
              )}

              {/* Botões baseados no step */}
              {modalStep === 'initial' && (
                <div className="flex gap-3">
                  <button
                    onClick={handleModalYes}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold py-3 px-4 rounded-lg hover:from-yellow-400 hover:to-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-yellow-400/30"
                  >
                    ✅ Sim, vou!
                  </button>
                  <button
                    onClick={handleModalNo}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 px-4 rounded-lg hover:from-red-500 hover:to-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-400/30"
                  >
                    ❌ Não posso
                  </button>
                </div>
              )}

              {modalStep === 'askName' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setModalStep('initial');
                      setModalName('');
                      setModalMessage('');
                    }}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-bold py-3 px-4 rounded-lg hover:from-gray-500 hover:to-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                    disabled={modalLoading}
                  >
                    ← Voltar
                  </button>
                  <button
                    onClick={handleConfirmNo}
                    disabled={modalLoading}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 px-4 rounded-lg hover:from-red-500 hover:to-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-400/30"
                  >
                    {modalLoading ? 'Salvando...' : 'Confirmar'}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Fixed Background Glitter */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Generate multiple glitter particles */}
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

        {/* Twinkling static glitters */}
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

      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-yellow-300 rounded-full flex items-center justify-center shadow-lg shadow-yellow-300/20">
          <Image src={mascaraImage} alt="Máscara" width={60} height={60} className="transform rotate-12 opacity-60 filter drop-shadow-lg" />
        </div>
        <div className="absolute top-32 right-20 w-24 h-24 border border-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20">
          <Image src={mascaraImage} alt="Máscara" width={40} height={40} className="transform -rotate-45 opacity-60 filter drop-shadow-lg" />
        </div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-yellow-300 rounded-full flex items-center justify-center shadow-lg shadow-yellow-300/20">
          <Image src={mascaraImage} alt="Máscara" width={28} height={28} className="transform rotate-90 opacity-60 filter drop-shadow-lg" />
        </div>
        <div className="absolute bottom-32 right-10 w-20 h-20 border-2 border-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20">
          <Image src={mascaraImage} alt="Máscara" width={32} height={32} className="transform -rotate-12 opacity-60 filter drop-shadow-lg" />
        </div>
        
        {/* Additional floating masks in circles */}
        <div className="absolute top-20 right-1/4 w-28 h-28 border border-yellow-300 rounded-full flex items-center justify-center shadow-lg shadow-yellow-300/20">
          <Image src={mascaraImage} alt="Máscara" width={50} height={50} className="transform rotate-45 opacity-60 filter drop-shadow-lg" />
        </div>
        <div className="absolute bottom-40 left-10 w-20 h-20 border border-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20">
          <Image src={mascaraImage} alt="Máscara" width={34} height={34} className="transform -rotate-30 opacity-60 filter drop-shadow-lg" />
        </div>
        <div className="absolute top-1/2 right-10 w-24 h-24 border-2 border-yellow-300 rounded-full flex items-center justify-center shadow-lg shadow-yellow-300/20">
          <Image src={mascaraImage} alt="Máscara" width={42} height={42} className="transform rotate-60 opacity-60 filter drop-shadow-lg" />
        </div>
      </div>
    </div>
  );
}
