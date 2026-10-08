# Milla Burger’s — Next.js

Conversão do HTML original para Next.js com App Router.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Build de produção

```bash
npm run build
npm start
```

## Deploy na Vercel

1. Suba esta pasta para um repositório Git.
2. Importe o repositório na Vercel.
3. A Vercel detectará Next.js automaticamente.
4. Não há variáveis de ambiente obrigatórias.
5. O projeto **não possui script `lint`**.

## O que foi corrigido

- JavaScript inline convertido para React/TypeScript.
- Fontes Google convertidas para `next/font`.
- Font Awesome substituído por `lucide-react`.
- Imagens externas configuradas em `next.config.ts`.
- Carrinho persistido em `localStorage`.
- Checkout muda corretamente entre entrega e retirada.
- Campos de endereço só ficam obrigatórios quando entrega está selecionada.
- Horário calculado no fuso `America/Sao_Paulo`, independentemente do fuso do visitante.
- Modais fecham por X, clique fora e Escape.
- Links externos usam `noopener noreferrer`.
- `crypto.randomUUID()` evita colisões simples de IDs do carrinho.
- Não existe backend obrigatório: o pedido é enviado para o WhatsApp informado no código.
- Vercel/Next.js não precisa de servidor Express ou configuração especial.

## Dados que você pode trocar

No arquivo `app/page.tsx`:
- produtos/preços/imagens;
- taxa de entrega;
- número do WhatsApp;
- endereço;
- Instagram;
- horários.

> Para produção com pagamentos online reais, estoque, painel administrativo ou banco de dados, o próximo passo é adicionar API/DB e autenticação. A versão atual mantém o fluxo original de pedido via WhatsApp.


## Observação sobre Turbopack

O projeto define explicitamente `turbopack.root` como a pasta atual do projeto para evitar que o Next.js escolha uma pasta acima por causa de outros `package-lock.json` existentes no computador.
