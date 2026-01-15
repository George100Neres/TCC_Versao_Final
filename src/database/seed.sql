CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO public.usuario (
  nome,
  telefone,
  email,
  senha,
  cep,
  endereco,
  numero,
  complemento,
  bairro,
  cidade,
  estado,
  perfil
)
VALUES (
  'Administrador do Sistema',
  '61999999999',
  'admin@email.com',
  '123456',
  '70000000',
  'Sussuarana',
  '1',
  NULL,
  'Asa Norte',
  'Brasília',
  'DF',
  'gestor'
);


INSERT INTO categoria (nome, descricao) VALUES
('Coleta Domiciliar', 'Problemas relacionados à coleta comum'),
('Entulho e Restos de Obra', 'Resíduos de construção civil'),
('Móveis e Volumosos', 'Sofás, colchões, eletrodomésticos'),
('Vegetação', 'Galhos, troncos e capina'),
('Animais Mortos', 'Animais em via pública'),
('Coleta Seletiva', 'Resíduos recicláveis'),
('Lixo Hospitalar', 'Risco à saúde pública'),
('Lixo Eletrônico', 'Pilhas, baterias, eletrônicos'),
('Lixo em Encostas', 'Risco de alagamento e deslizamento');

-- ===============================
-- SUBCATEGORIAS — TODAS DE UMA VEZ
-- ===============================

INSERT INTO public.subcategoria (categoria_id, nome, descricao)

-- Coleta Domiciliar
SELECT id, sub, sub
FROM public.categoria,
     unnest(ARRAY[
       'Caminhão não passou',
       'Lixo derramado na via',
       'Coletor não levou tudo'
     ]) AS sub
WHERE nome = 'Coleta Domiciliar'

UNION ALL

-- Entulho e Restos de Obra
SELECT id, sub, sub
FROM public.categoria,
     unnest(ARRAY[
       'Restos de tijolo',
       'Cimento descartado',
       'Areia acumulada',
       'Pisos e cerâmicas',
       'Ponto viciado de entulho'
     ]) AS sub
WHERE nome = 'Entulho e Restos de Obra'

UNION ALL

-- Móveis e Volumosos
SELECT id, sub, sub
FROM public.categoria,
     unnest(ARRAY[
       'Sofá descartado',
       'Colchão abandonado',
       'Eletrodoméstico velho',
       'Madeira descartada'
     ]) AS sub
WHERE nome = 'Móveis e Volumosos'

UNION ALL

-- Vegetação
SELECT id, sub, sub
FROM public.categoria,
     unnest(ARRAY[
       'Galhos de árvores',
       'Troncos de árvores',
       'Capina acumulada'
     ]) AS sub
WHERE nome = 'Vegetação'

UNION ALL

-- Animais Mortos
SELECT id, sub, sub
FROM public.categoria,
     unnest(ARRAY[
       'Cão morto em via pública',
       'Gato morto em via pública',
       'Pombo morto',
       'Animal de grande porte morto'
     ]) AS sub
WHERE nome = 'Animais Mortos'

UNION ALL

-- Coleta Seletiva
SELECT id, sub, sub
FROM public.categoria,
     unnest(ARRAY[
       'Ecoponto cheio',
       'Ecoponto sujo',
       'Caminhão da coleta seletiva não passou'
     ]) AS sub
WHERE nome = 'Coleta Seletiva'

UNION ALL

-- Lixo Hospitalar
SELECT id, sub, sub
FROM public.categoria,
     unnest(ARRAY[
       'Seringas descartadas',
       'Medicamentos descartados',
       'Curativos descartados em via pública'
     ]) AS sub
WHERE nome = 'Lixo Hospitalar'

UNION ALL

-- Lixo Eletrônico
SELECT id, sub, sub
FROM public.categoria,
     unnest(ARRAY[
       'Pilhas descartadas',
       'Baterias descartadas',
       'Peças de computador',
       'Equipamentos eletrônicos'
     ]) AS sub
WHERE nome = 'Lixo Eletrônico'

UNION ALL

-- Lixo em Encostas
SELECT id, sub, sub
FROM public.categoria,
     unnest(ARRAY[
       'Descarte irregular em encosta',
       'Risco de alagamento',
       'Risco de deslizamento'
     ]) AS sub
WHERE nome = 'Lixo em Encostas';
