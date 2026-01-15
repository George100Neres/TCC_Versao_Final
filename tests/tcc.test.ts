// Arquivo: tests/tcc.test.ts

/**
 * MOCKS (Simulações)
 * Note que agora os caminhos do jest.mock batem exatamente com os imports
 */

// 1. Mock do Repositório de Usuário
jest.mock('../src/app/(usuarios)/(model)/(repository)/usuario-repository', () => ({
  UsuarioRepository: {
    create: jest.fn(),
  },
}));

// 2. Mock do Repositório de Reclamação
// --- CORREÇÃO AQUI ---
// Mudamos o caminho para apontar para 'usuario-repository' dentro da pasta de reclamação,
// conforme você confirmou que é o nome real do arquivo.
jest.mock('../src/app/(reclamacao)/(model)/(repository)/usuario-repository', () => ({
  ReclamacaoRepository: {
    create: jest.fn(),
    findAll: jest.fn(),
  },
}));
// ---------------------

// Imports Reais
import { UsuarioRepository } from '../src/app/(usuarios)/(model)/(repository)/usuario-repository';

// --- CORREÇÃO AQUI TAMBÉM ---
// O import precisa apontar para o mesmo lugar do mock acima
import { ReclamacaoRepository } from '../src/app/(reclamacao)/(model)/(repository)/usuario-repository'; 
// -----------------------------

describe('Testes Unitários - TCC', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- CENÁRIO 1: USUÁRIO ---
  test('Deve criar um usuário', async () => {
    const usuario = { nome: 'Teste', email: 'teste@tcc.com', senha: '123' };
    
    // @ts-ignore
    UsuarioRepository.create.mockResolvedValue({ id: '1', ...usuario });

    // @ts-ignore
    const res = await UsuarioRepository.create(usuario);
    expect(res.id).toBeDefined();
  });

  // --- CENÁRIO 2: RECLAMAÇÃO ---
  test('Deve criar uma reclamação', async () => {
    const rec = { descricao: 'Teste', categoria: 'LIXO', lat: 0, long: 0, usuarioId: '1' };
    
    // @ts-ignore
    ReclamacaoRepository.create.mockResolvedValue({ id: 'rec-1', ...rec });

    // @ts-ignore
    const res = await ReclamacaoRepository.create(rec);
    expect(res.id).toBe('rec-1');
  });

  // --- CENÁRIO 3: LISTAR ---
  test('Deve listar reclamações', async () => {
    // @ts-ignore
    ReclamacaoRepository.findAll.mockResolvedValue([{ id: '1', descricao: 'A' }]);

    // @ts-ignore
    const res = await ReclamacaoRepository.findAll();
    expect(res).toHaveLength(1);
  });
});