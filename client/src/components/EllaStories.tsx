import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Play, Pause } from 'lucide-react';
import StoriesBackground from './StoriesBackground';

const WellnessStories = () => {
  const stories = [
    {
      id: 1,
      category: 'Beleza',
      title: 'Moda',
      stories: [
        {
          title: 'Cápsula do Guarda-Roupa',
          content: 'DICA: Escolha 7 peças básicas: 2 calças (jeans + social), 2 camisetas, 1 blazer, 1 vestido e 1 casaco. Todas em cores neutras (preto, branco, bege, azul marinho). Essas peças criam 21 combinações diferentes!',
          image: 'https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
          type: 'fashion-tip',
        },
        {
          title: 'Acessórios que Fazem a Diferença',
          content: 'DICA: Use a regra do 3: máximo 3 acessórios por look. Exemplo: brinco + colar + bolsa. Ou pulseira + relógio + óculos. Acessórios dourados ficam elegantes, prateados são mais casuais.',
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1080&h=1920&fit=crop',
          type: 'fashion-tip',
        },
        {
          title: 'Tendências Outono 2024',
          content: 'DICA: As 4 tendências que você precisa saber: 🧥 Blazers Oversized, 👢 Botas Altas, 🧶 Tricot Chunky, 🤎 Tons Terrosos. Combine essas peças para looks modernos e elegantes.',
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          type: 'fashion-tip'
        },
        {
          title: 'Como Usar Camisa Oversized',
          content: 'DICA: 3 passos para usar camisa oversized: 1️⃣ Use com calça de alfaiataria para equilíbrio, 2️⃣ Dê um nó na frente para marcar a cintura, 3️⃣ Adicione acessórios statement para finalizar.',
          backgroundColor: 'linear-gradient(90deg, #FF6B9D 0%, #C06C84 100%)',
          type: 'fashion-tip'
        },
        {
          title: 'Must Have da Temporada',
          content: 'DICA: Os 3 essenciais que você precisa: 👔 Blazer Estruturado (peça coringa), 👖 Wide Leg Jeans (conforto e estilo), 👜 Bolsa Bucket (acessório prático). Essas peças transformam qualquer look básico.',
          backgroundColor: 'linear-gradient(45deg, #2C5364 0%, #203A43 50%, #0F2027 100%)',
          type: 'fashion-tip'
        },
        {
          title: 'Como Combinar Estampas',
          content: 'DICA: Use uma cor em comum entre as estampas. Misture tamanhos: uma grande + uma pequena. Balance com peças lisas e neutras. Limite a 2-3 estampas por look.',
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          type: 'fashion-tip',
          emoji: '🎨'
        },
        {
          title: 'Proporção Perfeita',
          content: 'DICA: Se a parte de cima é volumosa, a de baixo deve ser ajustada. Oversized + Slim = Look Equilibrado. Use essa regra para criar silhuetas harmoniosas.',
          backgroundColor: 'linear-gradient(180deg, #f093fb 0%, #f5576c 100%)',
          type: 'fashion-tip',
          emoji: '👔👖'
        },
        {
          title: 'Guarda-Roupa de Transição',
          content: 'DICA: 1️ Sobreposições Leves (cardigans e jaquetas finas), 2️ Tecidos Versáteis (algodão e linho mais pesados), 3️ Calçados Fechados (troque sandálias por sapatilhas), 4️ Cores Neutras (introduza tons terrosos).',
          backgroundColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          type: 'fashion-tip',
          emoji: '🌤️'
        },
        {
          title: 'Acessórios Versáteis',
          content: 'DICA: 👜 Bolsa Neutra (combina com tudo), 👟 Tênis Branco (do casual ao elegante), ⌚ Relógio Clássico (atemporal e sofisticado), 🕶️ Óculos Aviador (nunca sai de moda).',
          backgroundColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          type: 'fashion-tip',
          emoji: '✨'
        },
        {
          title: 'Erro que Encurta o Look',
          content: 'DICA: ❌ NÃO FAÇA: Usar calça de cintura baixa com top curto cria uma linha que corta sua silhueta. ✅ FAÇA ISSO: Prefira cintura alta ou média para alongar as pernas e criar proporção.',
          backgroundColor: 'linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)',
          type: 'fashion-tip',
          emoji: '⚠️'
        },
        {
          title: 'Arrume Seu Guarda-Roupa',
          content: 'DICA: ✓ Separe por categoria (blusas, calças, vestidos), ✓ Use cabides iguais para visual limpo, ✓ Organize por cores dentro de cada categoria, ✓ Deixe peças mais usadas em fácil acesso, ✓ Dobe malhas para não deformarem.',
          backgroundColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          type: 'fashion-tip',
          emoji: '📋'
        },
        {
          title: 'Silhueta Ideal',
          content: 'DICA: Para alongar: use cores escuras, cintura alta e calças de alfaiataria. Para equilibrar: combine volumes opostos (parte de cima solta com parte de baixo justa). Para destacar: use acessórios statement e cores vibrantes.',
          backgroundColor: 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)',
          type: 'fashion-tip',
          emoji: '👗'
        },
        {
          title: 'Tecidos por Estação',
          content: 'DICA: 🌸 Primavera: algodão, linho, seda leve. ☀️ Verão: viscose, modal, tecidos respiráveis. 🍂 Outono: lã, cashmere, veludo. ❄️ Inverno: lã pesada, alpaca, tecidos térmicos.',
          backgroundColor: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          type: 'fashion-tip',
          emoji: '🌤️'
        },
        {
          title: 'Investimento Inteligente',
          content: 'DICA: 💎 Peças atemporais: blazer, jeans clássico, camisa branca. 🎯 Acessórios versáteis: bolsa neutra, sapatos confortáveis. 🔄 Peças sazonais: compre em promoção no final da temporada. 📏 Ajustes: vale mais investir em um bom alfaiate.',
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          type: 'fashion-tip',
          emoji: '💰'
        },
        {
          title: 'Look Corporativo',
          content: 'DICA: 👔 Blazer estruturado + calça de alfaiataria, 👠 Sapatos fechados e confortáveis, 💼 Bolsa elegante e funcional, 🎨 Cores neutras com um toque de cor, ✨ Acessórios discretos e profissionais.',
          backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          type: 'fashion-tip',
          emoji: '💼'
        }
      ],
      color: 'from-pink-400 to-rose-500',
      backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      category: 'Beleza',
      title: 'Maquiagem',
      stories: [
        {
          title: 'Base Perfeita',
          content: 'DICA: Prepare a pele com hidratante, use primer para uniformizar, aplique a base com pincel ou esponja úmida, finalize com pó translúcido. Para cobertura extra, use corretivo líquido nas áreas que precisam.',
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1080&h=1920&fit=crop',
          type: 'makeup-tip'
        },
        {
          title: 'Olhos Definidos',
          content: 'DICA: Use sombra clara na pálpebra, sombra média no côncavo, sombra escura no canto externo. Aplique delineador líquido na linha d\'água superior, finalize com máscara de cílios em camadas.',
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1080&h=1920&fit=crop',
          type: 'makeup-tip'
        },
        {
          title: 'Batom Duradero',
          content: 'DICA: Hidrate os lábios antes, use lápis labial para contornar, aplique o batom com pincel para melhor fixação, retire o excesso com papel, aplique uma segunda camada. Para brilho, contra com gloss.',
          image: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=1080&h=1920&fit=crop',
          type: 'makeup-tip'
        },
        {
          title: 'Contorno Natural',
          content: 'DICA: Use cor 2 tons mais escura que sua pele, aplique nas laterais do nariz, nas maçãs do rosto e no maxilar. Misture bem com esponja úmida para efeito natural. Finalize com pó para fixar.',
          image: 'https://images.unsplash.com/photo-1620464003286-a5b0d79f32c2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=736',
          type: 'makeup-tip'
        },
        {
          title: 'Blush Perfeito',
          content: 'DICA: Sorria para encontrar as maçãs do rosto, aplique o blush em movimento circular com pincel, comece suave e vá intensificando. Para rosto redondo, aplique nas laterais. Para rosto alongado, aplique nas maçãs.',
          image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1080&h=1920&fit=crop',
          type: 'makeup-tip'
        },
        {
          title: 'Iluminador Glow',
          content: 'DICA: Aplique nos pontos altos do rosto: topo das maçãs, ponte do nariz, centro da testa e queixo. Use pincel ou dedos para espalhar. Para pele madura, prefira iluminador líquido. Para pele jovem, pode usar pó.',
          image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
          type: 'makeup-tip'
        },
        {
          title: 'Sobrancelhas Definidas',
          content: 'DICA: Use lápis ou pó 1 tom mais claro que os cabelos, preencha as falhas com traços suaves, siga o formato natural. Finalize com gel fixador para manter no lugar. Para formato, siga a linha do nariz.',
          image: 'https://images.unsplash.com/photo-1595550912256-b24059bb08e8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
          type: 'makeup-tip'
        },
        {
          title: 'Máscara de Cílios',
          content: 'DICA: Curva os cílios antes de aplicar, comece pela raiz e vá até as pontas, aplique em camadas finas. Para cílios inferiores, use uma escova menor. Para volume extra, aplique pó translúcido entre as camadas.',
          image: 'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
          type: 'makeup-tip'
        },
        {
          title: 'Delineador Fácil',
          content: 'DICA: Comece com delineador em gel ou caneta, faça pontos na linha d\'água e conecte. Para iniciantes, use fita adesiva como guia. Para olhos pequenos, faça a linha mais fina. Para olhos grandes, pode fazer mais grossa.',
          image: 'https://images.unsplash.com/photo-1566344523460-c7059288a9d6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=626',
          type: 'makeup-tip'
        },
        {
          title: 'Corretivo Pontual',
          content: 'DICA: Use cor 1 tom mais clara que sua pele, aplique com pincel fino nas olheiras e manchas, misture bem com esponja úmida. Para manchas escuras, use corretivo laranja primeiro. Finalize com pó para fixar.',
          image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1080&h=1920&fit=crop',
          type: 'makeup-tip'
        },
        {
          title: 'Fixador Final',
          content: 'DICA: Use spray fixador a 30cm do rosto, aplique em movimento circular, deixe secar naturalmente. Para pele oleosa, use pó translúcido antes. Para pele seca, prefira spray hidratante. Evite excesso para não pesar.',
          image: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=1080&h=1920&fit=crop',
          type: 'makeup-tip'
        },
        {
          title: 'Sombras Suaves',
          content: 'DICA: Use sombra clara na pálpebra, média no meio e escura no canto externo. Misture bem com pincel limpo. Para olhos pequenos, use tons claros. Para olhos grandes, pode usar tons mais escuros.',
          image: 'https://images.unsplash.com/photo-1571332283201-99c82a8b3046?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1472',
          type: 'makeup-tip'
        },
        {
          title: 'Rímel Volumoso',
          content: 'DICA: Aplique rímel em movimento de zigue-zague, comece pela raiz e vá até as pontas. Para volume extra, aplique duas camadas. Para cílios inferiores, use escova menor. Deixe secar entre as camadas.',
          image: 'https://plus.unsplash.com/premium_photo-1678377960130-bb70ffeb1cd8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
          type: 'makeup-tip'
        },
        {
          title: 'Batom Longa Duração',
          content: 'DICA: Contorne os lábios com lápis, preencha com batom, pressione com papel para remover excesso. Aplique segunda camada e finalize com gloss. Para lábios finos, use tons claros. Para lábios grossos, use tons escuros.',
          image: 'https://images.unsplash.com/photo-1709477542145-868afa3d298b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
          type: 'makeup-tip'
        },
        {
          title: 'Pó Compacto',
          content: 'DICA: Use pó compacto para toque final, aplique com esponja úmida em movimento circular. Para pele oleosa, aplique mais pó. Para pele seca, use menos. Finalize com spray fixador para durabilidade.',
          image: 'https://images.unsplash.com/photo-1737014892220-4123c7e020a1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1373',
          type: 'makeup-tip'
        },
        {
          title: 'Preparação da Pele',
          content: 'DICA: Limpe bem a pele, aplique hidratante e deixe absorver. Use primer para uniformizar a textura. Para pele oleosa, use primer matificante. Para pele seca, use primer hidratante. Aguarde 5 minutos antes da base.',
          image: 'https://images.unsplash.com/photo-1606158582120-b4fc196bffad?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
          type: 'makeup-tip',
        }
      ],
      color: 'from-purple-400 to-indigo-500',
      backgroundImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      category: 'Alimentação',
      title: 'Alimentação',
      stories: [
        {
          title: 'Café da Manhã Energético',
          content: 'DICA: Comece com aveia, frutas frescas e proteína. Misture aveia com leite, adicione banana, morangos e chia. Para proteína, inclua iogurte grego ou ovo cozido. Evite açúcares refinados pela manhã.',
          image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1080&h=1920&fit=crop',
          type: 'food-tip'
        },
        {
          title: 'Hidratação Inteligente',
          content: 'DICA: Beba água ao acordar, entre refeições e antes de dormir. Adicione limão, pepino ou hortelã para sabor. Evite líquidos durante as refeições. Para esportistas, hidrate antes, durante e após exercícios.',
          image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=1080&h=1920&fit=crop',
          type: 'food-tip'
        },
        {
          title: 'Almoço Equilibrado',
          content: 'DICA: Divida o prato: 50% vegetais, 25% proteína magra, 25% carboidratos integrais. Use azeite extra-virgem para temperar. Mastigue devagar e saboreie cada garfada. Evite frituras e molhos pesados.',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1080&h=1920&fit=crop',
          type: 'food-tip'
        },
        {
          title: 'Lanches Saudáveis',
          content: 'DICA: Prepare snacks naturais: mix de castanhas, frutas secas, palitos de vegetais com homus. Evite produtos industrializados. Mantenha porções pequenas. Para doces, prefira frutas ou chocolate amargo.',
          image: 'https://images.unsplash.com/photo-1515041761709-f9fc96e04cd3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
          type: 'food-tip'
        },
        {
          title: 'Jantar Leve',
          content: 'DICA: Jante 3 horas antes de dormir. Prefira sopas, saladas ou grelhados. Evite carboidratos pesados à noite. Inclua vegetais verdes e proteína magra. Para sobremesa, frutas ou chá calmante.',
          image: 'https://images.unsplash.com/photo-1668665771757-4d42737d295a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880',
          type: 'food-tip'
        },
        {
          title: 'Planejamento de Refeições',
          content: 'DICA: Planeje o cardápio semanal, faça lista de compras e prepare ingredientes no domingo. Congele porções individuais. Tenha sempre vegetais limpos na geladeira. Economize tempo e evite desperdício.',
          image: 'https://images.unsplash.com/photo-1523289333742-be1143f6b766?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
          type: 'food-tip'
        },
        {
          title: 'Cozinha Inteligente',
          content: 'DICA: Use temperos naturais: alho, cebola, ervas frescas, limão. Evite temperos prontos com sódio. Faça caldos caseiros e congele. Use panelas antiaderentes para reduzir óleo. Organize a despensa por categorias.',
          image: 'https://images.unsplash.com/photo-1517646458010-ea6bd9f4a75f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
          type: 'food-tip'
        },
        {
          title: 'Porções Moderadas',
          content: 'DICA: Use pratos menores para controlar porções. Mastigue 20 vezes cada garfada. Pare de comer quando estiver 80% satisfeito. Sirva-se uma vez e evite repetir. Coma devagar para dar tempo do cérebro registrar saciedade.',
          image: 'https://images.unsplash.com/photo-1606658046016-a9d52350d867?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1373',
          type: 'food-tip'
        },
        {
          title: 'Vegetais Coloridos',
          content: 'DICA: Varie as cores dos vegetais: vermelho (tomate, pimentão), verde (brócolis, espinafre), laranja (cenoura, abóbora), roxo (berinjela, repolho roxo). Cada cor oferece nutrientes diferentes. Coma pelo menos 3 cores diferentes por dia.',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1080&h=1920&fit=crop',
          type: 'food-tip'
        },
        {
          title: 'Proteínas Magras',
          content: 'DICA: Escolha proteínas magras: peito de frango, peixes brancos, ovos, leguminosas (feijão, lentilha, grão-de-bico). Evite carnes processadas e frituras. Consuma proteína em todas as refeições para manter a saciedade.',
          image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=1080&h=1920&fit=crop',
          type: 'food-tip'
        },
        {
          title: 'Grãos Integrais',
          content: 'DICA: Prefira grãos integrais: arroz integral, quinoa, aveia, pão integral. Eles têm mais fibras, vitaminas e minerais. Mantêm a glicemia estável e dão saciedade por mais tempo. Evite grãos refinados e processados.',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1080&h=1920&fit=crop',
          type: 'food-tip'
        },
        {
          title: 'Gorduras Saudáveis',
          content: 'DICA: Use gorduras boas: azeite extra-virgem, abacate, castanhas, sementes (chia, linhaça). Evite gorduras trans e saturadas. As gorduras boas ajudam na absorção de vitaminas e dão saciedade.',
          image: 'https://images.unsplash.com/photo-1642689690565-bf0afb7eb41e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
          type: 'food-tip'
        },
        {
          title: 'Comer Consciente',
          content: 'DICA: Coma sem distrações (TV, celular). Preste atenção no sabor, textura e aroma dos alimentos. Mastigue bem cada garfada. Faça pausas entre as garfadas. Isso melhora a digestão e evita excessos.',
          image: 'https://images.unsplash.com/photo-1621261105631-807a31e9a708?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=708',
          type: 'food-tip'
        }
      ],
      color: 'from-green-400 to-emerald-500',
      backgroundImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      category: 'Saúde Mental',
      title: 'Saúde Mental',
      stories: [
        {
          title: 'Look Natural para o Dia',
          content: 'Tutorial rápido para uma maquiagem natural e elegante',
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1080&h=1920&fit=crop',
          type: 'tutorial',
          duration: '8 min'
        },
        {
          title: 'Maquiagem para Videochamadas',
          content: 'Dicas para ficar linda nas reuniões online',
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1080&h=1920&fit=crop',
          type: 'tutorial',
        }
      ],
      color: 'from-pink-500 to-purple-500',
      backgroundImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop'
    }
  ];

  const [activeCategory, setActiveCategory] = useState(0);
  const [activeStory, setActiveStory] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showStories, setShowStories] = useState(false);

  const STORY_DURATION = 5000;

  useEffect(() => {
    if (!showStories || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [showStories, activeStory, activeCategory, isPaused]);

  const nextStory = () => {
    const currentCategory = stories[activeCategory];
    if (activeStory < currentCategory.stories.length - 1) {
      setActiveStory(activeStory + 1);
      setProgress(0);
    } else if (activeCategory < stories.length - 1) {
      setActiveCategory(activeCategory + 1);
      setActiveStory(0);
      setProgress(0);
    } else {
      setShowStories(false);
      setProgress(0);
    }
  };

  const prevStory = () => {
    if (activeStory > 0) {
      setActiveStory(activeStory - 1);
      setProgress(0);
    } else if (activeCategory > 0) {
      setActiveCategory(activeCategory - 1);
      const prevCategory = stories[activeCategory - 1];
      setActiveStory(prevCategory.stories.length - 1);
      setProgress(0);
    }
  };

  const openStories = (index: number) => {
    setActiveCategory(index);
    setActiveStory(0);
    setProgress(0);
    setShowStories(true);
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'beauty-tip': '💄 Dica de Beleza',
      'makeup-tip': '💋 Dica de Maquiagem',
      'food-tip': '🥗 Dica de Alimentação',
      wellness: '🧘‍♀️ Bem-estar',
      recipe: '🥗 Receita',
      motivation: '🌟 Motivação',
      tutorial: '💋 Tutorial'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStoryLabel = (title: string) => {
    if (title.includes('Como Combinar')) return 'Dica Express';
    if (title.includes('Proporção')) return 'Truque Infalível';
    if (title.includes('Guarda-Roupa de Transição')) return 'Mudança de Estação';
    if (title.includes('Acessórios')) return 'Investimento Certo';
    if (title.includes('Erro que')) return 'Atenção!';
    if (title.includes('Arrume Seu')) return 'Organização';
    if (title.includes('Silhueta Ideal')) return 'Dica de Estilo';
    if (title.includes('Tecidos por Estação')) return 'Guia de Tecidos';
    if (title.includes('Investimento Inteligente')) return 'Smart Shopping';
    if (title.includes('Look Corporativo')) return 'Estilo Profissional';
    if (title.includes('Café da Manhã')) return 'Começo do Dia';
    if (title.includes('Hidratação')) return 'Bem-Estar';
    if (title.includes('Almoço')) return 'Refeição Principal';
    if (title.includes('Lanches')) return 'Snack Saudável';
    if (title.includes('Jantar')) return 'Final do Dia';
    if (title.includes('Planejamento')) return 'Organização';
    if (title.includes('Cozinha')) return 'Dicas Práticas';
    if (title.includes('Porções')) return 'Controle Alimentar';
    if (title.includes('Vegetais Coloridos')) return 'Variedade Nutritiva';
    if (title.includes('Proteínas Magras')) return 'Escolhas Saudáveis';
    if (title.includes('Grãos Integrais')) return 'Carboidratos Inteligentes';
    if (title.includes('Gorduras Saudáveis')) return 'Gorduras Boas';
    if (title.includes('Comer Consciente')) return 'Mindfulness';
    return 'Dica Express';
  };

  const renderStoryContent = (story: any) => {
    const content = story.content.replace('DICA: ', '');
    
    // Se tem imagem, usar layout original (texto na parte inferior sem card)
    if (story.image) {
      return null; // Não renderizar conteúdo aqui, será renderizado na parte inferior
    }
    
    // Se tem backgroundColor, usar layouts específicos do TechStories
    if (story.backgroundColor) {
      // Story 1: Como Combinar Estampas - Grid de dicas
      if (story.title.includes('Como Combinar')) {
      const tips = content.split('. ').filter(tip => tip.trim());
      return (
        <div className="flex flex-col gap-3">
          {tips.map((tip, index) => (
            <div key={index} className="bg-white/15 backdrop-blur-xl border-2 border-white/25 rounded-2xl p-3 sm:p-5 flex items-center gap-3 sm:gap-4 hover:bg-white/20 transition-all duration-300">
              <div className="bg-white/25 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                {index === 0 ? '🎨' : index === 1 ? '📏' : index === 2 ? '⚖️' : '✨'}
              </div>
              <div className="text-white text-sm sm:text-base leading-relaxed">
                {tip.trim()}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Story 2: Proporção Perfeita - Dica grande centralizada
    if (story.title.includes('Proporção')) {
      return (
        <div className="flex flex-col justify-center">
          <div className="bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-3xl p-6 sm:p-10 text-center">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-5">👔👖</div>
            <h3 className="text-white text-lg sm:text-2xl font-bold mb-3 sm:mb-4 uppercase tracking-wide">Regra de Ouro</h3>
            <p className="text-white/95 text-sm sm:text-base leading-relaxed mb-4 sm:mb-5">{content}</p>
            <div className="bg-white/25 backdrop-blur-md rounded-2xl p-3 sm:p-5 border border-white/40">
              <p className="text-white text-base sm:text-lg font-bold text-center">Oversized + Slim = Look Equilibrado</p>
            </div>
          </div>
        </div>
      );
    }

    // Story 3: Guarda-Roupa de Transição - Lista numerada
    if (story.title.includes('Guarda-Roupa de Transição')) {
      const steps = content.split('), ').filter(step => step.trim());
      return (
        <div className="flex flex-col gap-3">
          {steps.map((step, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-xl border-2 border-white/35 rounded-2xl p-4 hover:bg-white/25 transition-all duration-300">
              <div className="pt-1">
                <strong className="text-white text-base block mb-1 font-bold">
                  {step.split(' (')[0].replace(/^\d+/, '').trim()}
                </strong>
                <span className="text-white/90 text-sm leading-relaxed">
                  {step.split(' (')[1]?.replace(')', '') || ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Story 4: Acessórios Versáteis - Grid 2x2
    if (story.title.includes('Acessórios')) {
      const accessories = [
        { emoji: '👜', name: 'Bolsa Neutra', desc: 'Combina com tudo, todo dia' },
        { emoji: '👟', name: 'Tênis Branco', desc: 'Do casual ao elegante' },
        { emoji: '⌚', name: 'Relógio Clássico', desc: 'Atemporal e sofisticado' },
        { emoji: '🕶️', name: 'Óculos Aviador', desc: 'Nunca sai de moda' }
      ];
      return (
        <div className="grid grid-cols-2 gap-3">
          {accessories.map((item, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-2xl p-6 text-center hover:bg-white/25 transition-all duration-300">
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h3 className="text-white text-base font-bold mb-2">{item.name}</h3>
              <p className="text-white/90 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      );
    }

    // Story 5: Erro Comum - Alerta
    if (story.title.includes('Erro que')) {
      return (
        <div className="flex flex-col justify-center px-2">
          <div className="bg-white/15 backdrop-blur-xl border-2 border-white/30 rounded-3xl p-4 sm:p-6 text-center max-w-full">
            <div className="text-5xl sm:text-7xl mb-3 sm:mb-5 animate-pulse">⚠️</div>
            <h3 className="text-white text-lg sm:text-2xl font-bold mb-3 sm:mb-5 uppercase tracking-wide">Evite Isso</h3>
            
            <div className="bg-black/20 rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4">
              <h4 className="text-white text-sm sm:text-base font-bold mb-2 flex items-center justify-center gap-2">
                ❌ NÃO FAÇA
              </h4>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                Usar calça de cintura baixa com top curto cria uma linha que corta sua silhueta
              </p>
            </div>

            <div className="bg-white/30 rounded-2xl p-3 sm:p-4">
              <h4 className="text-white text-sm sm:text-base font-bold mb-2 flex items-center justify-center gap-2">
                ✅ FAÇA ISSO
              </h4>
              <p className="text-white text-sm sm:text-base leading-relaxed font-semibold">
                Prefira cintura alta ou média para alongar as pernas e criar proporção
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Story 6: Organização - Checklist
    if (story.title.includes('Arrume Seu')) {
      const items = [
        'Separe por categoria (blusas, calças, vestidos)',
        'Use cabides iguais para visual limpo',
        'Organize por cores dentro de cada categoria',
        'Deixe peças mais usadas em fácil acesso',
        'Dobre malhas para não deformarem'
      ];
      return (
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div key={index} className="bg-white/50 backdrop-blur-md border-2 border-white/60 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/65 transition-all duration-300">
              <div className="w-7 h-7 rounded-lg bg-green-300/80 flex items-center justify-center text-lg flex-shrink-0 shadow-md">
                ✓
              </div>
              <div className="text-gray-800 text-base font-semibold leading-relaxed">
                {item}
              </div>
            </div>
          ))}
        </div>
      );
    }


    // Story 8: Silhueta Ideal - Dica grande centralizada
    if (story.title.includes('Silhueta Ideal')) {
      return (
        <div className="flex flex-col justify-center">
          <div className="bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-3xl p-6 sm:p-10 text-center">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-5">👗</div>
            <h3 className="text-white text-lg sm:text-2xl font-bold mb-3 sm:mb-4 uppercase tracking-wide">Dicas de Silhueta</h3>
            <p className="text-white/95 text-base sm:text-lg leading-relaxed mb-4 sm:mb-5">{content.replace('DICA: ', '')}</p>
          </div>
        </div>
      );
    }

    // Story 9: Tecidos por Estação - Grid de estações
    if (story.title.includes('Tecidos por Estação')) {
      const seasons = [
        { emoji: '🌸', name: 'Primavera', desc: 'Algodão, linho, seda leve' },
        { emoji: '☀️', name: 'Verão', desc: 'Viscose, modal, respiráveis' },
        { emoji: '🍂', name: 'Outono', desc: 'Lã, cashmere, veludo' },
        { emoji: '❄️', name: 'Inverno', desc: 'Lã pesada, alpaca, térmicos' }
      ];
      return (
        <div className="grid grid-cols-2 gap-3">
          {seasons.map((season, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-2xl p-4 sm:p-6 text-center hover:bg-white/25 transition-all duration-300">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{season.emoji}</div>
              <h3 className="text-white text-sm sm:text-base font-bold mb-2">{season.name}</h3>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed">{season.desc}</p>
            </div>
          ))}
        </div>
      );
    }

    // Story 10: Investimento Inteligente - Lista numerada
    if (story.title.includes('Investimento Inteligente')) {
      const tips = content.split('. ').filter(tip => tip.trim());
      return (
        <div className="flex flex-col gap-3">
          {tips.map((tip, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-xl border-2 border-white/35 rounded-2xl p-3 sm:p-4 hover:bg-white/25 transition-all duration-300">
              <div className="pt-1">
                <strong className="text-white text-sm sm:text-base block mb-1 font-bold">
                  {tip.split(':')[0]}
                </strong>
                <span className="text-white/90 text-base leading-relaxed">
                  {tip.split(':')[1]?.trim() || tip.trim()}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Story 11: Look Corporativo - Lista de dicas
    if (story.title.includes('Look Corporativo')) {
      const tips = content.split(', ').filter(tip => tip.trim());
      return (
        <div className="flex flex-col gap-3">
          {tips.map((tip, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-xl border-2 border-white/35 rounded-2xl p-3 sm:p-4 hover:bg-white/25 transition-all duration-300">
              <div className="pt-1">
                <span className="text-white text-base sm:text-lg leading-relaxed">
                  {tip.trim()}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

      // Layout padrão para outros stories com backgroundColor
      return (
        <div className="text-center">
          <div className="bg-white/15 backdrop-blur-xl border-2 border-white/25 rounded-2xl p-5">
            <p className="text-white text-base leading-relaxed">{content}</p>
          </div>
        </div>
      );
    }

    // Layout padrão para stories sem backgroundColor nem imagem
    return (
      <div className="text-center">
        <div className="bg-white/15 backdrop-blur-xl border-2 border-white/25 rounded-2xl p-5">
          <p className="text-white text-base leading-relaxed">{content}</p>
        </div>
      </div>
    );
  };

  if (!showStories) {
    return (
      <div className="pt-4 pb-8 sm:py-8 relative" style={{ background: 'linear-gradient(135deg, hsl(200, 50%, 85%) 0%, hsl(280, 40%, 90%) 25%, hsl(330, 30%, 92%) 50%, hsl(280, 40%, 90%) 75%, hsl(200, 50%, 85%) 100%)' }}>
        {/* Fundo decorativo */}
        <StoriesBackground />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-2 sm:mb-4">
              <span className="text-4xl lg:text-5xl" style={{ fontFamily: 'Dancing Script, cursive', color: '#581C87' }}>Ella</span>
              <span className="text-3xl lg:text-4xl font-bold text-purple-600 ml-2">Stories</span>
            </div>
            <p className="text-lg text-gray-600">Dicas de Beleza, Bem-estar e Desenvolvimento Pessoal</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {stories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => openStories(index)}
                className="flex-shrink-0 group cursor-pointer"
              >
                <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${category.color} p-[2.5px] mb-3 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl`}>
                  <div className="bg-white p-[2px] rounded-full w-full h-full flex items-center justify-center">
                    {category.category === 'Beleza' && category.title === 'Maquiagem' ? (
                      <img 
                        src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80" 
                        alt="Produtos de Maquiagem" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : category.backgroundImage ? (
                      <img 
                        src={category.backgroundImage} 
                        alt={category.title} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-lg md:text-2xl">
                          {category.category === 'Beleza' ? '💄' : category.category === 'Saúde Mental' ? '🧠' : category.category === 'Alimentação' ? '🥗' : category.category === 'Desenvolvimento' ? '🌟' : '💋'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-center text-gray-800 text-sm md:text-base font-medium max-w-[80px] md:max-w-[140px] truncate">
                  {category.title}
                </p>
                <p className="text-center text-gray-600 text-xs md:text-sm">
                  {category.stories.length} {category.stories.length === 1 ? 'story' : 'stories'}
                </p>
              </button>
            ))}
          </div>

        </div>
      </div>
    );
  }

  const currentCategory = stories[activeCategory];
  const currentStory = currentCategory.stories[activeStory];

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-md mx-auto">
        <div 
          key={`${activeCategory}-${activeStory}`}
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            background: currentStory.image ? `url(${currentStory.image})` : (currentStory.backgroundColor || 'transparent'),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />
        </div>

        {/* Progress Bar */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="flex gap-1">
            {currentCategory.stories.map((_, idx) => (
              <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width: idx < activeStory ? '100%' : idx === activeStory ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Header com controles */}
        <div className="absolute top-16 right-4 z-10">
          <div className="flex gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-white/90 hover:text-white transition-colors"
            >
              {isPaused ? <Play size={24} /> : <Pause size={24} />}
            </button>
            <button
              onClick={() => setShowStories(false)}
              className="text-white/90 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Conteúdo com layouts específicos */}
        <div className="relative h-full flex flex-col px-4 sm:px-8 py-8 sm:py-16 overflow-y-auto">
          {/* Header com label e balão da categoria */}
          <div className="mb-4 sm:mb-8">
            {/* Balão com emoji da categoria - alinhado à esquerda */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${currentCategory.color} flex items-center justify-center`}>
                <span className="text-lg sm:text-xl">
                  {currentCategory.category === 'Beleza' ? '💄' : 
                   currentCategory.category === 'Saúde Mental' ? '🧠' : 
                   currentCategory.category === 'Alimentação' ? '🥗' : 
                   currentCategory.category === 'Desenvolvimento' ? '🌟' : '💋'}
                </span>
              </div>
              <div className="text-white">
                <p className="font-bold text-sm sm:text-base">{currentCategory.title}</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-block bg-white/20 backdrop-blur-md text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-white/30 mb-3 sm:mb-4">
                {getStoryLabel(currentStory.title)}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {currentStory.title}
              </h2>
            </div>
          </div>
          
          {/* Layout baseado no tipo de story */}
          <div className="flex-1 flex flex-col justify-center min-h-0">
            {renderStoryContent(currentStory)}
          </div>

          {/* Para stories com imagem, texto centralizado no meio da tela */}
          {currentStory.image && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-4">
                <p className="text-lg sm:text-xl text-white leading-relaxed font-medium">
                  {currentStory.content.replace('DICA: ', '')}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Navegação */}
        <button
          onClick={prevStory}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10"
          disabled={activeCategory === 0 && activeStory === 0}
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={nextStory}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10"
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );
};

export default WellnessStories;
