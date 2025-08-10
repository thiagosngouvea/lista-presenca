import { useState, useEffect } from 'react';
import { getGuests } from '@/lib/firebase';
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

export default function ListaConfirmados() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    loadGuests();
  }, []);

  // Mouse tracking for glitter effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const loadGuests = async () => {
    try {
      const guestsList = await getGuests();
      setGuests(guestsList as Guest[]);
    } catch (error) {
      console.error('Error loading guests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalPeople = () => {
    return guests.reduce((total, guest) => {
      return total + 1 + (guest.companions?.length || 0);
    }, 0);
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

      <div className="max-w-4xl mx-auto relative z-10">
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
            Lista de Confirmados
          </h1>
          <p className="text-gray-200 text-lg mb-2 font-medium">
            Festa de Aniversário da Ana Claúdia
          </p>
        </div>

        {/* Guests List */}
        <div className="bg-black bg-opacity-80 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-yellow-400 p-7 shadow-yellow-400/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-yellow-300 flex items-center gap-3 drop-shadow-lg">
              <Image src={mascaraImage} alt="Máscara" width={32} height={32} className="opacity-80 filter drop-shadow-lg" />
              Convidados Confirmados
            </h2>
            <div className="text-right">
              <div className="text-sm text-gray-300 font-medium">
                {guests.length} {guests.length === 1 ? 'confirmação' : 'confirmações'}
              </div>
              <div className="text-xl font-bold text-yellow-300 drop-shadow-lg">
                {getTotalPeople()} {getTotalPeople() === 1 ? 'pessoa' : 'pessoas'} confirmadas
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="mb-4 flex justify-center">
                <Image src={mascaraImage} alt="Máscara" width={80} height={80} className="opacity-40 filter drop-shadow-lg animate-pulse" />
              </div>
              <p className="text-gray-300 text-lg font-medium">
                Carregando lista de confirmados...
              </p>
            </div>
          ) : guests.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4 flex justify-center">
                <Image src={mascaraImage} alt="Máscara" width={80} height={80} className="opacity-40 filter drop-shadow-lg" />
              </div>
              <p className="text-gray-300 text-lg font-medium">
                Nenhuma presença confirmada ainda...
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Seja o primeiro a confirmar presença na festa!
              </p>
              <Link href="/confirmar-presenca" className="inline-block mt-4 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-bold py-2 px-4 rounded-lg hover:from-yellow-300 hover:to-yellow-200 transition-all">
                Confirmar Presença
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {guests.map((guest, guestIndex) => (
                <div key={guest.id} className="relative">
                  <div className="bg-gradient-to-r from-yellow-900 to-yellow-800 bg-opacity-40 border-l-4 border-yellow-400 p-5 rounded-lg backdrop-blur-sm shadow-lg shadow-yellow-400/10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-300 text-lg">👤</span>
                          <h3 className="font-bold text-yellow-100 text-lg drop-shadow-md">{guest.name}</h3>
                        </div>
                        
                        {guest.hasCompanions && guest.companions && guest.companions.length > 0 && (
                          <div className="mt-3 bg-gray-950 bg-opacity-50 p-4 rounded-md border border-yellow-500">
                            <p className="text-sm font-bold text-yellow-200 mb-2 flex items-center gap-1 drop-shadow-md">
                              <span>👥</span>
                              Acompanhantes ({guest.companions.length}):
                            </p>
                            <div className="grid gap-1">
                              {guest.companions.map((companion, index) => (
                                <div key={index} className="text-sm text-yellow-100 flex items-center gap-2 font-medium">
                                  <span className="text-yellow-300">•</span>
                                  {companion}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-300 font-medium">
                          <span className="flex items-center gap-1">
                            <span>👥</span>
                            Total: {1 + (guest.companions?.length || 0)} {
                              (1 + (guest.companions?.length || 0)) === 1 ? 'pessoa' : 'pessoas'
                            }
                          </span>
                          <span className="flex items-center gap-1">
                            <span>#{guestIndex + 1}</span>
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Image 
                          src={mascaraImage} 
                          alt="Máscara" 
                          width={40} 
                          height={40} 
                          className="opacity-70 filter drop-shadow-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
