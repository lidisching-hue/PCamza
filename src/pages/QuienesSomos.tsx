import Header from '../components/Header'
import Footer from '../components/Footer'

function QuienesSomos() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow">
        {/* --- PORTADA / BANNER SUPERIOR --- */}
        <section className="relative bg-[#d32f2f] text-white py-20">
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {/* Fondo decorativo opcional */}
            <img 
              src="https://img.freepik.com/foto-gratis/pasillo-supermercado-borroso_23-2148143415.jpg" 
              alt="Fondo Supermercado" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Quiénes Somos
            </h1>
            <p className="text-lg md:text-xl font-light opacity-90 max-w-2xl mx-auto">
              Comprometidos con el ahorro y bienestar de las familias peruanas.
            </p>
          </div>
        </section>

        {/* --- HISTORIA / INTRODUCCIÓN --- */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="https://i.postimg.cc/brLgj4dP/tienda-quienes-somos.jpg" // Imagen referencial o usa una de tu carpeta
                alt="Tienda" 
                className="rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 w-full h-auto object-cover"
              />
            </div>
            <div className="md:w-1/2 text-gray-700 space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2">
                Nuestra Historia
              </h2>
              <p className="text-lg leading-relaxed">
                Somos una cadena de supermercados peruana perteneciente al grupo <strong>PECAMZA</strong>. 
                Nacimos con el firme propósito de acercar productos de primera necesidad y gran consumo 
                a los hogares, garantizando siempre la mejor calidad y, sobre todo, <strong>precios justos</strong>.
              </p>
              <p className="text-lg leading-relaxed">
                A lo largo de los años, nos hemos consolidado como la opción preferida de miles de familias 
                que buscan maximizar su presupuesto sin sacrificar la calidad de lo que llevan a su mesa.
              </p>
            </div>
          </div>
        </section>

        {/* --- MISIÓN Y VISIÓN (TARJETAS) --- */}
        <section className="bg-white py-16 shadow-inner">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10">
              
              {/* Tarjeta Misión */}
              <div className="bg-red-50 rounded-3xl p-10 border border-red-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg text-white">
                   {/* Icono Misión */}
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Misión</h3>
                <p className="text-gray-700 leading-relaxed">
                  Ofrecer a nuestros clientes una experiencia de compra ágil y cercana, brindando un surtido variado de productos de calidad a precios bajos todos los días, contribuyendo así a mejorar la calidad de vida de las comunidades donde operamos.
                </p>
              </div>

              {/* Tarjeta Visión */}
              <div className="bg-blue-50 rounded-3xl p-10 border border-blue-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-16 h-16 bg-[#1e3a5f] rounded-full flex items-center justify-center mb-6 shadow-lg text-white">
                  {/* Icono Visión */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Visión</h3>
                <p className="text-gray-700 leading-relaxed">
                  Ser la cadena de supermercados líder en el formato de cercanía y ahorro en el Perú, reconocidos por nuestra eficiencia, vocación de servicio y compromiso con el desarrollo de nuestros colaboradores y la sociedad.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* --- NUESTROS VALORES --- */}
        <section className="py-20 max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Nuestros Valores</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { titulo: 'Integridad', icon: '💎', desc: 'Actuamos con transparencia y ética.' },
              { titulo: 'Servicio', icon: '🤝', desc: 'El cliente es el centro de todo.' },
              { titulo: 'Excelencia', icon: '🚀', desc: 'Mejoramos cada día lo que hacemos.' },
              { titulo: 'Trabajo en Equipo', icon: '👥', desc: 'Juntos logramos grandes resultados.' },
            ].map((val, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4 group-hover:bg-red-100 group-hover:scale-110 transition-all duration-300 shadow-sm">
                  {val.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">{val.titulo}</h4>
                <p className="text-sm text-gray-500">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>




{/* Banner de WhatsApp con QR, Texto y Botón a la derecha */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-white">
            
            {/* 1. LADO IZQUIERDO: Imagen QR */}
            <div className="bg-white p-2 rounded-xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300 flex-shrink-0">
              <img 
                src="https://i.postimg.cc/SRdCH8jk/PCamza.png" 
                alt="QR Canal WhatsApp" 
                className="w-32 h-32 md:w-36 md:h-36 object-contain"
              />
            </div>

            {/* 2. CENTRO: Texto Informativo (ocupa el espacio disponible) */}
            <div className="text-center md:text-left flex-1">
              <h3 className="text-3xl font-bold mb-2">
                ¡Únete a nuestro Canal!
              </h3>
              <p className="text-green-100 text-lg leading-relaxed">
                Escanea el código QR con tu celular o usa el botón para unirte a nuestro canal. <br className="hidden md:block"/>
                Recibe ofertas exclusivas al instante.
              </p>
            </div>

            {/* 3. LADO DERECHO: Botón de acción */}
            <div className="flex-shrink-0">
              <a
                href="https://whatsapp.com/channel/0029Vb9q1tJJZg46Segt7c04"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white text-green-600 hover:bg-green-50 font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
              >
                <span className="text-lg">Chatear ahora</span>
                {/* Flecha animada al hacer hover */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 transition-transform group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>

          </div>
        </div>
      </section>




      </main>

      <Footer />
    </div>
  )
}

export default QuienesSomos