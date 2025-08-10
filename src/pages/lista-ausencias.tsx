import { useState, useEffect } from 'react';
import { getIntentions } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';
import mascaraImage from '@/assets/mascara-de-carnaval.png';

interface Intention {
  id: string;
  name: string;
  willAttend: boolean;
  createdAt?: any;
}

export default function ListaAusencias() {
  const [absences, setAbsences] = useState<Intention[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    loadAbsences();
  }, []);

  // Mouse tracking for glitter effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const loadAbsences = async () => {
    try {
      const intentions = await getIntentions();
      const absencesList = intentions.filter((intention: any) => intention.willAttend === false);
      setAbsences(absencesList as Intention[]);
    } catch (error) {
      console.error('Error loading absences:', error);
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
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="glitter-particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDuration: `${Math.random() * 10 + 8}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3,
            }}
          />
        ))}

        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`twinkle-${i}`}
            className="glitter-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 4}s`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      {/* Mouse Following Glitter */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={`mouse-${i}`}
            className="mouse-glitter"
            style={{
              left: mousePosition.x + Math.sin(Date.now() * 0.001 + i) * 20 - 1,
              top: mousePosition.y + Math.cos(Date.now() * 0.001 + i) * 20 - 1,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              opacity: 0.4 - i * 0.06,
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
              className="opacity-60 transform hover:scale-110 transition-transform duration-300 filter drop-shadow-2xl grayscale"
            />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-200 via-red-300 to-red-400 bg-clip-text text-transparent mb-3 drop-shadow-2xl">
            Lista de Ausências
          </h1>
          <p className="text-gray-200 text-lg mb-2 font-medium">
            Pessoas que não poderão comparecer à festa
          </p>
        </div>

        {/* Absences List */}
        <div className="bg-black bg-opacity-80 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-red-500 p-7 shadow-red-500/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-red-300 flex items-center gap-3 drop-shadow-lg">
              <Image src={mascaraImage} alt="Máscara" width={32} height={32} className="opacity-60 filter drop-shadow-lg grayscale" />
              Ausências Confirmadas
            </h2>
            <div className="text-right">
              <div className="text-sm text-gray-400 font-medium">
                {absences.length} {absences.length === 1 ? 'ausência' : 'ausências'}
              </div>
              <div className="text-lg font-bold text-red-300 drop-shadow-lg">
                {absences.length} {absences.length === 1 ? 'pessoa' : 'pessoas'} não virão
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="mb-4 flex justify-center">
                <Image src={mascaraImage} alt="Máscara" width={80} height={80} className="opacity-30 filter drop-shadow-lg grayscale animate-pulse" />
              </div>
              <p className="text-gray-300 text-lg font-medium">
                Carregando lista de ausências...
              </p>
            </div>
          ) : absences.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4 flex justify-center">
                <Image src={mascaraImage} alt="Máscara" width={80} height={80} className="opacity-40 filter drop-shadow-lg" />
              </div>
              <p className="text-gray-300 text-lg font-medium">
                🎉 Que ótimo! Nenhuma ausência registrada ainda!
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Esperamos que todos possam comparecer à festa!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {absences.map((absence, index) => (
                <div key={absence.id} className="relative">
                  <div className="bg-gradient-to-r from-red-900 to-red-800 bg-opacity-30 border-l-4 border-red-400 p-5 rounded-lg backdrop-blur-sm shadow-lg shadow-red-400/10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-red-400 text-lg">😢</span>
                          <h3 className="font-bold text-red-100 text-lg drop-shadow-md">{absence.name}</h3>
                        </div>
                        
                        <p className="text-sm text-gray-300 mt-2">
                          Não poderá comparecer à festa
                        </p>
                        
                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 font-medium">
                          <span className="flex items-center gap-1">
                            <span>#{index + 1}</span>
                          </span>
                          <span className="text-red-300">Ausência confirmada</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Image 
                          src={mascaraImage} 
                          alt="Máscara" 
                          width={40} 
                          height={40} 
                          className="opacity-40 filter drop-shadow-lg grayscale"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Summary */}
              <div className="mt-8 p-6 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-600">
                <div className="text-center">
                  <p className="text-gray-300 text-lg mb-2">
                    😔 Sentiremos falta de {absences.length} {absences.length === 1 ? 'pessoa' : 'pessoas'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Mas esperamos que possam estar conosco numa próxima oportunidade!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
