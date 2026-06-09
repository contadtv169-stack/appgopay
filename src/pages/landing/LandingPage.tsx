import { motion } from 'framer-motion'
import { ArrowRight, Check, Link2, Shield, Zap } from 'lucide-react'
import Logo from '../../components/Logo'

export default function LandingPage() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('features')} className="text-sm text-gray-600 hover:text-gopay-blue transition-colors">Recursos</button>
            <button onClick={() => scrollTo('how')} className="text-sm text-gray-600 hover:text-gopay-blue transition-colors">Como funciona</button>
            <button onClick={() => scrollTo('faq')} className="text-sm text-gray-600 hover:text-gopay-blue transition-colors">FAQ</button>
            <a href="/app" className="text-sm font-semibold text-gopay-blue hover:text-gopay-dark transition-colors">Entrar</a>
            <a href="/app" className="px-5 py-2.5 bg-gopay-blue text-white text-sm font-semibold rounded-xl shadow-[0_4px_15px_rgba(0,102,255,0.3)] hover:shadow-[0_6px_20px_rgba(0,102,255,0.4)] transition-all">
              Começar grátis
            </a>
          </div>
          <a href="/app" className="md:hidden px-4 py-2 bg-gopay-blue text-white text-sm font-semibold rounded-xl">
            Entrar
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 rounded-full text-gopay-blue text-sm font-medium mb-6">
              <Zap size={14} /> Plataforma de pagamentos
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              Receba pagamentos com{' '}
              <span className="text-gopay-blue">links inteligentes</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-[500px]">
              Crie links de pagamento personalizados, conecte ao seu gateway favorito e gerencie tudo em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a
                href="/app"
                className="px-8 py-4 bg-gopay-blue text-white font-semibold rounded-2xl shadow-[0_8px_25px_rgba(0,102,255,0.35)] hover:shadow-[0_10px_35px_rgba(0,102,255,0.45)] transition-all text-center text-lg"
              >
                Começar agora
              </a>
              <button
                onClick={() => scrollTo('how')}
                className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:border-gopay-blue hover:text-gopay-blue transition-all text-center text-lg"
              >
                Como funciona
              </button>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-gray-500 justify-center lg:justify-start">
              <span className="flex items-center gap-1.5"><Check size={14} className="text-green-500" /> Sem taxa fixa</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-green-500" /> Pagamento via PIX</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-green-500" /> 100% digital</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative w-[280px] md:w-[320px]">
              <div className="w-full aspect-[9/19] bg-gradient-to-b from-gopay-blue to-gopay-dark rounded-[40px] p-3 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[32px] overflow-hidden p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gopay-blue flex items-center justify-center text-white text-xs font-bold">G</div>
                      <span className="text-xs font-bold">GoPay</span>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-gopay-blue to-blue-700 rounded-2xl p-4 text-white mb-3">
                    <p className="text-xs opacity-80 mb-1">Saldo disponível</p>
                    <p className="text-2xl font-bold">R$ 1.250,00</p>
                    <p className="text-xs opacity-60 mt-1">via KryptGateway</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] text-gray-500">Recebidos hoje</p>
                      <p className="text-sm font-bold">R$ 320</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] text-gray-500">Links ativos</p>
                      <p className="text-sm font-bold">12</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-10 bg-gopay-blue rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">+ Novo Link</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Tudo que você precisa</h2>
          <p className="text-lg text-gray-600">Uma plataforma completa para gerenciar seus pagamentos</p>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { icon: Link2, title: 'Links personalizados', desc: 'Crie links de pagamento com URL única e personalizada para cada produto ou serviço.' },
            { icon: Shield, title: 'Gateways seguros', desc: 'Conecte-se aos melhores gateways de pagamento com criptografia de ponta a ponta.' },
            { icon: Zap, title: 'Pagamento instantâneo', desc: 'Receba pagamentos via PIX em segundos e acompanhe tudo em tempo real.' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-white border border-gray-100 hover:border-gopay-blue/20 hover:shadow-[0_8px_30px_rgba(0,102,255,0.08)] transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
                <f.icon size={28} className="text-gopay-blue" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-6 bg-gopay-light">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Como funciona</h2>
          <p className="text-lg text-gray-600">Em 3 passos simples</p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Crie sua conta', desc: 'Cadastre-se gratuitamente em menos de 1 minuto.' },
            { step: '02', title: 'Conecte um gateway', desc: 'Conecte ao KryptGateway ou outro provedor de pagamento.' },
            { step: '03', title: 'Compartilhe links', desc: 'Gere links de pagamento e compartilhe com seus clientes.' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gopay-blue text-white text-2xl font-bold flex items-center justify-center mx-auto mb-5 shadow-[0_4px_15px_rgba(0,102,255,0.3)]">
                {s.step}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gateways */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Gateways disponíveis</h2>
          <p className="text-lg text-gray-600">Conecte-se aos principais provedores</p>
        </div>
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          {[
            { name: 'KryptGateway', color: '#0066FF', bg: '#EEF3FF', desc: 'PIX, cripto e mais' },
            { name: 'AbacatePay', color: '#22C55E', bg: '#F0FDF4', desc: 'Pagamentos via PIX' },
          ].map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all flex items-center gap-4"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
                style={{ background: g.color }}
              >
                {g.name[0]}
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-900">{g.name}</h4>
                <p className="text-sm text-gray-500">{g.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mt-6">Mais opções em breve!</p>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-gopay-blue to-gopay-dark">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Crie sua conta gratuitamente e comece a receber pagamentos em minutos.
          </p>
          <a
            href="/app"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gopay-blue font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg"
          >
            Criar conta grátis <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">Perguntas frequentes</h2>
          <div className="space-y-4">
            {[
              { q: 'O GoPay é gratuito?', a: 'Sim! Criar sua conta e gerar links de pagamento é totalmente gratuito.' },
              { q: 'Preciso ter um gateway para usar?', a: 'Sim, você precisa conectar ao KryptGateway ou outro provedor compatível para receber pagamentos.' },
              { q: 'Quanto tempo leva para receber?', a: 'Os pagamentos via PIX são instantâneos. O saque é gerenciado diretamente no seu gateway.' },
              { q: 'Posso usar no meu celular?', a: 'Sim! O GoPay é totalmente responsivo e funciona perfeitamente no celular.' },
            ].map((faq, i) => (
              <details key={i} className="group p-5 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer">
                <summary className="font-semibold text-gray-900 list-none flex items-center justify-between">
                  {faq.q}
                  <ArrowRight size={16} className="text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gopay-blue flex items-center justify-center text-white text-xs font-bold">G</div>
            <span className="text-white font-bold">GoPay</span>
          </div>
          <p className="text-sm">© 2026 GoPay. Todos os direitos reservados.</p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Ajuda</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
