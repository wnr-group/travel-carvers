'use client';

export default function AnimatedGlobe() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-brand-olive via-brand-sage to-brand-olive">
      {/* Logo */}
      <div className="absolute top-6 left-6 z-20">
        <div className="flex flex-col">
          <h2 className="text-2xl md:text-3xl font-black italic bg-gradient-to-r from-brand-clay to-white bg-clip-text text-transparent tracking-tight leading-none">
            Travel
          </h2>
          <div className="flex items-center gap-2 -mt-1">
            <div className="h-0.5 w-6 bg-gradient-to-r from-brand-clay to-transparent"></div>
            <h3 className="text-xl md:text-2xl font-light text-white tracking-[0.2em] uppercase">
              CARVERS
            </h3>
          </div>
        </div>
      </div>

      {/* 3D Globe */}
      <div className="relative">
        <div className="globe-container">
          <div className="globe">
            {/* Globe sphere with Earth texture */}
            <div className="globe-sphere"></div>

            {/* Continents overlay */}
            <div className="continents"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .globe-container {
          perspective: 1000px;
          width: 400px;
          height: 400px;
          position: relative;
        }

        .globe {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: rotateGlobe 6s linear infinite;
        }

        .globe-sphere {
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #4a90e2, #1e40af, #0a2540);
          box-shadow:
            inset -40px -40px 80px rgba(0, 0, 0, 0.5),
            inset 20px 20px 40px rgba(255, 255, 255, 0.1),
            0 0 100px rgba(185, 148, 112, 0.3);
          position: relative;
          overflow: hidden;
        }

        .continents {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-image:
            radial-gradient(ellipse 80px 120px at 35% 45%, #5F6F52 40%, transparent 40%),
            radial-gradient(ellipse 60px 90px at 30% 60%, #5F6F52 40%, transparent 40%),
            radial-gradient(ellipse 100px 80px at 55% 35%, #A9B388 40%, transparent 40%),
            radial-gradient(ellipse 90px 110px at 60% 50%, #5F6F52 40%, transparent 40%),
            radial-gradient(ellipse 70px 100px at 75% 45%, #A9B388 40%, transparent 40%),
            radial-gradient(ellipse 50px 70px at 80% 60%, #5F6F52 40%, transparent 40%);
          opacity: 0.8;
        }

        @keyframes rotateGlobe {
          0% {
            transform: rotateY(0deg) rotateX(0deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(0deg);
          }
        }

        @media (max-width: 768px) {
          .globe-container {
            width: 300px;
            height: 300px;
          }
          .globe-sphere {
            width: 300px;
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
}
