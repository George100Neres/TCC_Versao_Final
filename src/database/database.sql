-- Extensão necessária para gerar UUIDs aleatórios
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criação da tabela de usuário
CREATE TABLE "usuario" (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
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
  data_atualizacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de reclamação
CREATE TABLE "reclamacao" (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL,
  descricao TEXT NOT NULL,
  latitude NUMERIC(10, 8) NOT NULL,
  longitude NUMERIC(11, 8) NOT NULL,
  endereco TEXT NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  cep VARCHAR(10) NOT NULL,
  bairro VARCHAR(100) NOT NULL,
  numero VARCHAR(10) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de imagem da reclamação
CREATE TABLE "imagem_reclamacao" (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_arquivo VARCHAR(250) NOT NULL,
  tipo_arquivo VARCHAR(40) NOT NULL,
  arquivo BYTEA NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reclamacao_id UUID NOT NULL
);

-- ✅ Adiciona as foreign keys após a criação de todas as tabelas
ALTER TABLE "reclamacao"
ADD CONSTRAINT fk_reclamacao_usuario
FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id");

ALTER TABLE "imagem_reclamacao"
ADD CONSTRAINT fk_imagem_reclamacao_reclamacao
FOREIGN KEY ("reclamacao_id") REFERENCES "reclamacao" ("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- ✅ Adiciona o constraint do campo perfil após tudo
ALTER TABLE "usuario"
ADD CONSTRAINT usuario_perfil_check
CHECK (perfil IN ('gestor', 'cidadao'));


CREATE TABLE categoria (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome varchar(100) NOT NULL,
  descricao text,
  created_at timestamp DEFAULT now() NOT NULL
);

ALTER TABLE categoria
ADD CONSTRAINT categoria_nome_unique UNIQUE (nome);

CREATE TABLE subcategoria (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria_id uuid NOT NULL,
  nome varchar(100) NOT NULL,
  descricao text,
  created_at timestamp DEFAULT now() NOT NULL,
  CONSTRAINT fk_subcategoria_categoria
    FOREIGN KEY (categoria_id)
    REFERENCES categoria(id)
    ON DELETE CASCADE
);
