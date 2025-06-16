import { z } from 'zod';
import fs from 'fs';
import path from 'path';

// Schemas
const ProdutoComparativoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  preco: z.string(),
  precoOriginal: z.string(),
  linksAfiliados: z.record(z.string())
});

const SecaoComparativoSchema = z.object({
  titulo: z.string(),
  produtos: z.array(z.object({
    nome: z.string(),
    caracteristicas: z.array(z.string())
  }))
});

const VereditoSchema = z.object({
  conclusao: z.string(),
  recomendacoes: z.array(z.object({
    perfil: z.string(),
    produto: z.string()
  }))
});

const ConteudoComparativoSchema = z.object({
  introducao: z.string(),
  secoes: z.array(SecaoComparativoSchema),
  veredito: VereditoSchema
});

const ComparativoSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  slug: z.string(),
  resumo: z.string(),
  conteudo: ConteudoComparativoSchema,
  imagemDestaque: z.string(),
  metaTitulo: z.string(),
  metaDescricao: z.string(),
  status: z.string(),
  visualizacoes: z.number(),
  curtidas: z.number(),
  destaque: z.boolean(),
  dataPublicacao: z.string(),
  categoria: z.string(),
  produtos: z.array(ProdutoComparativoSchema)
});

const ComparativosSchema = z.object({
  comparativos: z.array(ComparativoSchema)
});

const OfertaSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  descricao: z.string(),
  produtoId: z.string(),
  precoOriginal: z.number(),
  precoOferta: z.number(),
  descontoPercentual: z.number(),
  codigoCupom: z.string().optional(),
  linkAfiliado: z.string(),
  loja: z.string(),
  ativo: z.boolean(),
  destaque: z.boolean(),
  dataInicio: z.string(),
  dataFim: z.string(),
  cliques: z.number(),
  conversoes: z.number()
});

const OfertasSchema = z.object({
  ofertas: z.array(OfertaSchema)
});

const CategoriaSchema = z.object({
  id: z.string(),
  nome: z.string(),
  slug: z.string(),
  descricao: z.string(),
  icone: z.string(),
  cor: z.string(),
  ativo: z.boolean(),
  ordem: z.number()
});

const CategoriasSchema = z.object({
  categorias: z.array(CategoriaSchema)
});

const ProdutoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  slug: z.string(),
  descricao: z.string(),
  especificacoes: z.record(z.string()),
  categoriaId: z.string(),
  marca: z.string(),
  avaliacao: z.number(),
  linksAfiliados: z.record(z.string()),
  disponivel: z.boolean()
});

const ProdutosSchema = z.object({
  produtos: z.array(ProdutoSchema)
});

// Função para validar um arquivo JSON
function validateJsonFile(filePath: string, schema: z.ZodType) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    schema.parse(data);
    console.log(`✅ ${path.basename(filePath)} válido`);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`❌ Erro de validação em ${path.basename(filePath)}:`);
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    } else {
      console.error(`❌ Erro ao ler ${path.basename(filePath)}:`, error);
    }
    return false;
  }
}

// Função para validar todos os arquivos em um diretório
function validateDirectory(dirPath: string, schema: z.ZodType) {
  const files = fs.readdirSync(dirPath);
  let hasErrors = false;

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(dirPath, file);
      if (!validateJsonFile(filePath, schema)) {
        hasErrors = true;
      }
    }
  }

  return hasErrors;
}

// Validar todos os diretórios
const dataDir = path.join(process.cwd(), 'data');
let hasErrors = false;

// Validar comparativos
const comparativosPath = path.join(dataDir, 'comparativos');
if (fs.existsSync(comparativosPath)) {
  console.log('\nValidando comparativos...');
  if (validateDirectory(comparativosPath, ComparativosSchema)) {
    hasErrors = true;
  }
}

// Validar ofertas
const ofertasPath = path.join(dataDir, 'ofertas');
if (fs.existsSync(ofertasPath)) {
  console.log('\nValidando ofertas...');
  if (validateDirectory(ofertasPath, OfertasSchema)) {
    hasErrors = true;
  }
}

// Validar categorias
const categoriasPath = path.join(dataDir, 'categorias');
if (fs.existsSync(categoriasPath)) {
  console.log('\nValidando categorias...');
  if (validateDirectory(categoriasPath, CategoriasSchema)) {
    hasErrors = true;
  }
}

// Validar produtos
const produtosPath = path.join(dataDir, 'produtos');
if (fs.existsSync(produtosPath)) {
  console.log('\nValidando produtos...');
  if (validateDirectory(produtosPath, ProdutosSchema)) {
    hasErrors = true;
  }
}

// Sair com erro se houver problemas
if (hasErrors) {
  process.exit(1);
}

console.log('\n✨ Todos os arquivos de dados são válidos!'); 