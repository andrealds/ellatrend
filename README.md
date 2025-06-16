# Dados do Blog TecReview

Este diretório contém os dados estáticos do blog TecReview. Os dados são versionados usando Git e seguem um processo específico de atualização.

## Estrutura de Diretórios

```
data/
├── comparativos/     # Comparativos de produtos
│   ├── smartphones.json
│   ├── notebooks.json
│   └── outros.json
├── ofertas/         # Ofertas e descontos
│   ├── amazon.json
│   └── magalu.json
├── categorias/      # Categorias de produtos
│   └── categorias.json
└── produtos/        # Dados dos produtos
    └── produtos.json
```

Cada subdiretório pode conter múltiplos arquivos JSON, permitindo uma melhor organização quando houver muitos dados. O sistema combina automaticamente os dados de todos os arquivos JSON dentro de cada diretório.

## Processo de Atualização

1. **Criar uma Branch**
   ```bash
   git checkout -b feature/nova-atualizacao
   ```

2. **Fazer as Alterações**
   - Editar os arquivos JSON necessários
   - Seguir o schema definido em `client/src/types/`
   - Validar os dados usando Zod
   - Manter a consistência entre arquivos (IDs únicos, slugs únicos, etc.)

3. **Criar Pull Request**
   - Descrever as alterações
   - Solicitar revisão
   - Aguardar aprovação

4. **Deploy**
   - Após aprovação, o CI/CD fará o deploy automaticamente
   - Os dados serão atualizados no site

## Validação de Dados

Todos os dados devem seguir os schemas definidos em:

- `client/src/types/comparativos.ts`
- `client/src/types/ofertas.ts`
- `client/src/types/categorias.ts`
- `client/src/types/produtos.ts`

Para validar os dados, execute:
```bash
npm run validate-data
```

## Templates

### Novo Comparativo
```json
{
  "id": "string",
  "titulo": "string",
  "slug": "string",
  "descricao": "string",
  "conteudo": "string",
  "produtos": ["string"],
  "categoriaId": "string",
  "tags": ["string"],
  "dataPublicacao": "string",
  "autor": "string",
  "visualizacoes": 0,
  "destaque": false,
  "seo": {
    "titulo": "string",
    "descricao": "string",
    "keywords": ["string"]
  }
}
```

### Nova Oferta
```json
{
  "id": "string",
  "titulo": "string",
  "descricao": "string",
  "produtoId": "string",
  "precoOriginal": 0,
  "precoOferta": 0,
  "descontoPercentual": 0,
  "linkAfiliado": "string",
  "loja": "string",
  "dataInicio": "string",
  "dataFim": "string",
  "destaque": false
}
```

## Boas Práticas

1. **Organização de Arquivos**
   - Dividir arquivos por categoria ou tipo de produto
   - Manter nomes de arquivos descritivos
   - Evitar arquivos muito grandes

2. **Consistência de Dados**
   - Manter IDs únicos entre todos os arquivos
   - Usar slugs únicos para URLs
   - Manter datas no formato ISO 8601

3. **Performance**
   - Dividir dados em arquivos menores
   - Evitar duplicação de dados
   - Manter apenas dados necessários

4. **Manutenção**
   - Documentar alterações
   - Manter histórico de mudanças
   - Fazer backup regular dos dados

## Rollback

Em caso de problemas, é possível fazer rollback para uma versão anterior:

1. Identificar a tag/commit desejado
2. Criar uma branch de rollback
3. Reverter as alterações
4. Criar PR para aprovação
5. Deploy automático após aprovação

## Contato

Em caso de dúvidas ou problemas, entre em contato com a equipe de desenvolvimento. 