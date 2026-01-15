export const routes = {
  home: { name: 'home', path: '/', public: true },
  signIn: { name: 'sign-in', path: '/sign-in', public: true },
  signUp: { name: 'sign-up', path: '/sign-up', public: true },

  painel: { name: 'painel', path: '/painel', public: false },
  reclamacaoList: { name: 'reclamacao-list', path: '/reclamacao/list', public: false },
  reclamacaoAdd: { name: 'reclamacao-add', path: '/reclamacao/add', public: false },
  reclamacaoEdit: { name: 'reclamacao-edit', path: '/reclamacao/:id', public: false },
}
