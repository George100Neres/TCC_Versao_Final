-- ===============================
-- EXTENSÃO
-- ===============================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===============================
-- TABELA: usuario
-- ===============================
CREATE TABLE public.usuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  telefone VARCHAR(15) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  cep VARCHAR(10),
  endereco VARCHAR(255),
  numero VARCHAR(10),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  perfil VARCHAR(10) NOT NULL DEFAULT 'cidadao',
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT usuario_perfil_check CHECK (perfil IN ('gestor', 'cidadao'))
);

-- ===============================
-- TABELA: reclamacao
-- ===============================
CREATE TABLE public.reclamacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL,
  descricao TEXT NOT NULL,
  latitude NUMERIC(10,8) NOT NULL,
  longitude NUMERIC(11,8) NOT NULL,
  endereco TEXT NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  cep VARCHAR(10) NOT NULL,
  bairro VARCHAR(100) NOT NULL,
  numero VARCHAR(10) NOT NULL,
  situacao VARCHAR(30) NOT NULL DEFAULT 'aberta',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT reclamacao_situacao_check
    CHECK (situacao IN ('aberta', 'em analise', 'encaminhada', 'resolvido')),
  CONSTRAINT fk_reclamacao_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES public.usuario(id)
);

-- ===============================
-- TABELA: imagem_reclamacao
-- ===============================
CREATE TABLE public.imagem_reclamacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_arquivo VARCHAR(250) NOT NULL,
  tipo_arquivo VARCHAR(40) NOT NULL,
  arquivo BYTEA NOT NULL,
  reclamacao_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_imagem_reclamacao_reclamacao
    FOREIGN KEY (reclamacao_id)
    REFERENCES public.reclamacao(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- ===============================
-- TABELA: categoria
-- ===============================
CREATE TABLE public.categoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- TABELA: subcategoria
-- ===============================
CREATE TABLE public.subcategoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id UUID NOT NULL,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_subcategoria_categoria
    FOREIGN KEY (categoria_id)
    REFERENCES public.categoria(id)
    ON DELETE CASCADE
);
