import React, { useState, useMemo } from 'react';
import { Droplets, Activity, Sun, Moon, Flame, Target, User, Ruler, Calendar } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

type ActivityLevel = 'sedentary' | 'moderate' | 'active';
type Climate = 'cold' | 'moderate' | 'hot';
type Gender = 'male' | 'female';
type CalorieActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
type Goal = 'lose' | 'maintain' | 'gain';

interface CalorieResult {
  bmr: number;
  tdee: number;
  target: number;
}

export default function EllaDica() {
  // Estados da calculadora de hidratação
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [climate, setClimate] = useState<Climate>('moderate');

  // Estados da calculadora de calorias
  const [calorieWeight, setCalorieWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [calorieActivityLevel, setCalorieActivityLevel] = useState<CalorieActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('maintain');

  const calculateWater = (): number => {
    const weightNum = parseFloat(weight);
    if (!weight || isNaN(weightNum) || weightNum <= 0 || weightNum > 500) return 0;

    // Base: 35ml por kg
    let baseAmount = weightNum * 35;

    // Ajuste por atividade física
    const activityMultiplier = {
      sedentary: 1.0,
      moderate: 1.15,
      active: 1.3
    };

    // Ajuste por clima
    const climateMultiplier = {
      cold: 0.95,
      moderate: 1.0,
      hot: 1.15
    };

    const total = baseAmount * activityMultiplier[activityLevel] * climateMultiplier[climate];
    return Math.round(total);
  };

  const waterAmount = useMemo(() => calculateWater(), [weight, activityLevel, climate]);
  const glassesCount = Math.round(waterAmount / 250); // copos de 250ml

  // Calculadora de Calorias
  const calculateCalories = (): CalorieResult | null => {
    const w = parseFloat(calorieWeight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    
    if (!calorieWeight || !height || !age || isNaN(w) || isNaN(h) || isNaN(a) || w <= 0 || h <= 0 || a <= 0 || w > 500 || h > 300 || a > 120) {
      return null;
    }

    // Fórmula de Mifflin-St Jeor
    let bmr: number;
    if (gender === 'male') {
      bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
    } else {
      bmr = (10 * w) + (6.25 * h) - (5 * a) - 161;
    }

    // Multiplicador de atividade física
    const activityMultipliers: Record<CalorieActivityLevel, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    const tdee = bmr * activityMultipliers[calorieActivityLevel];

    // Ajuste por objetivo
    let targetCalories = tdee;
    if (goal === 'lose') {
      targetCalories = tdee - 500; // Déficit de 500 calorias
    } else if (goal === 'gain') {
      targetCalories = tdee + 300; // Superávit de 300 calorias
    }

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      target: Math.round(targetCalories)
    };
  };

  const calorieResult = useMemo(() => calculateCalories(), [calorieWeight, height, age, gender, calorieActivityLevel, goal]);

  return (
    <section className="pt-4 pb-8 sm:py-8 bg-gradient-to-b from-pink-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-2 sm:mb-4">
            <span className="text-4xl lg:text-5xl" style={{ fontFamily: 'Dancing Script, cursive', color: '#581C87' }}>Ella</span>
            <span className="text-3xl lg:text-4xl font-bold text-gray-900 ml-2">Dica</span>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dicas rápidas e práticas para o seu dia a dia.
          </p>
        </div>

        {/* Calculadora de Hidratação */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="shadow-xl border border-pink-100 bg-gradient-to-br from-pink-50 via-blue-50 to-cyan-50 overflow-hidden">
            {/* Header com gradiente rosa-azul */}
            <div className="bg-gradient-to-r from-pink-100 to-blue-100 border-b border-pink-200 p-6 sm:p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 via-blue-400 to-cyan-300 mb-4 shadow-lg">
                  <Droplets size={32} className="text-white" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">Calculadora de Hidratação</h2>
                <p className="text-gray-600 text-xl">Descubra quanto de água você precisa beber por dia</p>
              </div>
            </div>
            
            <CardContent className="p-6 sm:p-8 bg-white/80 backdrop-blur-sm">
                {/* Peso */}
                <div className="mb-8">
                  <label className="block text-gray-700 text-base font-medium mb-3">
                    Qual é o seu peso?
                  </label>
                  <div className="relative max-w-xs mx-auto">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="70"
                      min="1"
                      max="500"
                      className="w-full px-6 py-4 text-2xl sm:text-3xl font-light text-gray-800 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:bg-white focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl sm:text-3xl font-light text-gray-400">
                      kg
                    </span>
                  </div>
                </div>

                {/* Nível de Atividade */}
                <div className="mb-8">
                  <label className="block text-gray-700 text-base font-medium mb-3">
                    <Activity size={18} className="inline mr-2" />
                    Nível de atividade física
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: 'sedentary' as ActivityLevel, label: 'Sedentário', desc: 'Pouco ou nenhum exercício' },
                      { value: 'moderate' as ActivityLevel, label: 'Moderado', desc: 'Exercício 3-4x/semana' },
                      { value: 'active' as ActivityLevel, label: 'Ativo', desc: 'Exercício 5-7x/semana' }
                    ].map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setActivityLevel(level.value)}
                        className={`p-4 rounded-xl text-left transition-all duration-300 ease-in-out transform active:scale-95 hover:scale-105 ${
                          activityLevel === level.value
                            ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 scale-105 shadow-md animate-pulse-subtle'
                            : 'bg-gray-50 border-2 border-transparent hover:border-gray-200 hover:shadow-sm'
                        }`}
                        aria-pressed={activityLevel === level.value}
                      >
                        <div className="font-medium text-gray-800 text-base mb-1">{level.label}</div>
                        <div className="text-sm text-gray-500">{level.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clima */}
                <div className="mb-8">
                  <label className="block text-gray-700 text-base font-medium mb-3">
                    <Sun size={18} className="inline mr-2" />
                    Clima da sua região
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'cold' as Climate, label: 'Frio', icon: Moon },
                      { value: 'moderate' as Climate, label: 'Moderado', icon: Sun },
                      { value: 'hot' as Climate, label: 'Quente', icon: Sun }
                    ].map((climateOption) => {
                      const Icon = climateOption.icon;
                      
                      // Definir cores baseadas na opção selecionada
                      const getSelectedStyles = () => {
                        if (climate !== climateOption.value) {
                          return 'bg-gray-50 border-2 border-transparent hover:border-gray-200';
                        }
                        
                        switch (climateOption.value) {
                          case 'cold':
                            return 'bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200';
                          case 'hot':
                            return 'bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200';
                          case 'moderate':
                            return 'bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200';
                          default:
                            return 'bg-gray-50 border-2 border-transparent';
                        }
                      };
                      
                      return (
                        <button
                          key={climateOption.value}
                          onClick={() => setClimate(climateOption.value)}
                          className={`p-4 rounded-xl text-center transition-all duration-300 ease-in-out transform active:scale-95 hover:scale-105 ${
                            climate === climateOption.value
                              ? `${getSelectedStyles()} scale-105 shadow-md animate-pulse-subtle`
                              : getSelectedStyles()
                          }`}
                          aria-pressed={climate === climateOption.value}
                        >
                          <Icon 
                            size={24} 
                            className={`mx-auto mb-2 transition-all duration-300 ${
                              climate === climateOption.value 
                                ? climateOption.value === 'cold' 
                                  ? 'text-blue-600 scale-110' 
                                  : 'text-orange-600 scale-110'
                                : 'text-gray-600'
                            }`} 
                          />
                          <div className="font-medium text-gray-800 text-sm">{climateOption.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Resultado */}
                {waterAmount > 0 && (
                  <div className="bg-gradient-to-br from-pink-50 via-blue-50 to-cyan-50 rounded-xl p-6 sm:p-8 text-center border border-pink-100">
                    <p className="text-gray-600 text-base mb-4">Você deve beber aproximadamente</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-4">
                      <div>
                        <p className="text-5xl sm:text-6xl font-light bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">{(waterAmount / 1000).toFixed(1)}</p>
                        <p className="text-gray-600 mt-1 text-base">litros/dia</p>
                      </div>
                      <div className="hidden sm:block w-px h-16 bg-pink-200"></div>
                      <div>
                        <p className="text-5xl sm:text-6xl font-light bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{waterAmount}</p>
                        <p className="text-gray-600 mt-1 text-base">ml/dia</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Droplets size={20} className="text-blue-500" />
                      <p className="text-base">Isso equivale a aproximadamente {glassesCount} copos de 250ml</p>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Dicas de Hidratação */}
          <Card className="mt-6 shadow-lg border-0">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-xl font-medium text-gray-800 mb-4">💡 Dicas de hidratação</h3>
              <div className="space-y-3 text-base text-gray-600">
                <p>• Beba um copo de água ao acordar para reidratar-se após o sono</p>
                <p>• Mantenha uma garrafa de água sempre por perto</p>
                <p>• Beba água antes, durante e depois de exercícios físicos</p>
                <p>• A cor da urina é um bom indicador: deve ser amarelo claro</p>
                <p>• Aumente a ingestão em dias quentes ou quando estiver doente</p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-[15px] text-gray-400 text-center">
                  ⚠️ Este cálculo é uma estimativa geral. Consulte um profissional de saúde para orientações personalizadas.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calculadora de Calorias */}
        <div className="max-w-4xl mx-auto mb-12 mt-12">
          <Card className="shadow-xl border border-pink-100 bg-gradient-to-br from-pink-50 via-blue-50 to-cyan-50 overflow-hidden">
            {/* Header com gradiente rosa-azul */}
            <div className="bg-gradient-to-r from-pink-100 to-blue-100 border-b border-pink-200 p-6 sm:p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-400 mb-4 shadow-lg">
                  <Flame size={32} className="text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Calculadora de Calorias</h2>
                <p className="text-gray-600 text-lg">Descubra quantas calorias você precisa por dia</p>
              </div>
            </div>
            
            <CardContent className="p-6 sm:p-8 bg-white/80 backdrop-blur-sm">
              {/* Informações Pessoais */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Peso */}
                <div>
                  <label className="block text-gray-700 text-base font-medium mb-3">
                    <User size={18} className="inline mr-2" />
                    Peso
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={calorieWeight}
                      onChange={(e) => setCalorieWeight(e.target.value)}
                      placeholder="70"
                      min="1"
                      max="500"
                      className="w-full px-4 py-3 text-lg font-light text-gray-800 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:bg-white focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-light text-gray-400">
                      kg
                    </span>
                  </div>
                </div>

                {/* Altura */}
                <div>
                  <label className="block text-gray-700 text-base font-medium mb-3">
                    <Ruler size={18} className="inline mr-2" />
                    Altura
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="170"
                      min="1"
                      max="300"
                      className="w-full px-4 py-3 text-lg font-light text-gray-800 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:bg-white focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-light text-gray-400">
                      cm
                    </span>
                  </div>
                </div>

                {/* Idade */}
                <div>
                  <label className="block text-gray-700 text-base font-medium mb-3">
                    <Calendar size={18} className="inline mr-2" />
                    Idade
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="30"
                      min="1"
                      max="120"
                      className="w-full px-4 py-3 text-lg font-light text-gray-800 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:bg-white focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-light text-gray-400">
                      anos
                    </span>
                  </div>
                </div>
              </div>

              {/* Gênero */}
              <div className="mb-8">
                <label className="block text-gray-700 text-base font-medium mb-3">
                  Sexo biológico
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'male' as Gender, label: 'Masculino' },
                    { value: 'female' as Gender, label: 'Feminino' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setGender(option.value)}
                      className={`p-4 rounded-xl text-center transition-all duration-300 ease-in-out transform active:scale-95 hover:scale-105 ${
                        gender === option.value
                          ? 'bg-gradient-to-br from-pink-50 to-blue-50 border-2 border-pink-200 scale-105 shadow-md animate-pulse-subtle'
                          : 'bg-gray-50 border-2 border-transparent hover:border-gray-200 hover:shadow-sm'
                      }`}
                      aria-pressed={gender === option.value}
                    >
                      <div className="font-medium text-gray-800 text-base">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nível de Atividade */}
              <div className="mb-8">
                <label className="block text-gray-700 text-base font-medium mb-3">
                  <Activity size={18} className="inline mr-2" />
                  Nível de atividade física
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'sedentary' as CalorieActivityLevel, label: 'Sedentário', desc: 'Pouco ou nenhum exercício' },
                    { value: 'light' as CalorieActivityLevel, label: 'Leve', desc: 'Exercício 1-3x/semana' },
                    { value: 'moderate' as CalorieActivityLevel, label: 'Moderado', desc: 'Exercício 3-5x/semana' },
                    { value: 'active' as CalorieActivityLevel, label: 'Ativo', desc: 'Exercício 6-7x/semana' },
                    { value: 'veryActive' as CalorieActivityLevel, label: 'Muito Ativo', desc: 'Exercício intenso diário' }
                  ].map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setCalorieActivityLevel(level.value)}
                      className={`p-4 rounded-xl text-left transition-all duration-300 ease-in-out transform active:scale-95 hover:scale-105 ${
                        calorieActivityLevel === level.value
                          ? 'bg-gradient-to-br from-pink-50 to-blue-50 border-2 border-pink-200 scale-105 shadow-md animate-pulse-subtle'
                          : 'bg-gray-50 border-2 border-transparent hover:border-gray-200 hover:shadow-sm'
                      }`}
                      aria-pressed={calorieActivityLevel === level.value}
                    >
                      <div className="font-medium text-gray-800 text-base mb-1">{level.label}</div>
                      <div className="text-sm text-gray-500">{level.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Objetivo */}
              <div className="mb-8">
                <label className="block text-gray-700 text-base font-medium mb-3">
                  <Target size={18} className="inline mr-2" />
                  Seu objetivo
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'lose' as Goal, label: 'Perder Peso', desc: '-500 cal/dia' },
                    { value: 'maintain' as Goal, label: 'Manter Peso', desc: 'Manter' },
                    { value: 'gain' as Goal, label: 'Ganhar Peso', desc: '+300 cal/dia' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setGoal(option.value)}
                      className={`p-4 rounded-xl text-center transition-all duration-300 ease-in-out transform active:scale-95 hover:scale-105 ${
                        goal === option.value
                          ? 'bg-gradient-to-br from-pink-50 to-blue-50 border-2 border-pink-200 scale-105 shadow-md animate-pulse-subtle'
                          : 'bg-gray-50 border-2 border-transparent hover:border-gray-200 hover:shadow-sm'
                      }`}
                      aria-pressed={goal === option.value}
                    >
                      <div className="font-medium text-gray-800 text-base mb-1">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resultado */}
              {calorieResult && (
                <div className="bg-gradient-to-br from-pink-50 via-blue-50 to-cyan-50 rounded-xl p-6 sm:p-8 text-center border border-pink-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <p className="text-gray-600 text-base mb-2">TMB (Basal)</p>
                      <p className="text-4xl sm:text-5xl font-light bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">{calorieResult.bmr}</p>
                      <p className="text-gray-600 text-sm mt-1">calorias/dia</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 text-base mb-2">TDEE (Total)</p>
                      <p className="text-4xl sm:text-5xl font-light bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{calorieResult.tdee}</p>
                      <p className="text-gray-600 text-sm mt-1">calorias/dia</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 text-base mb-2">Meta Diária</p>
                      <p className="text-4xl sm:text-5xl font-light bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">{calorieResult.target}</p>
                      <p className="text-gray-600 text-sm mt-1">calorias/dia</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Flame size={20} className="text-pink-500" />
                    <p className="text-base">
                      {goal === 'lose' && 'Com esse déficit, você pode perder cerca de 0,5kg por semana'}
                      {goal === 'maintain' && 'Mantenha essas calorias para manter seu peso atual'}
                      {goal === 'gain' && 'Com esse superávit, você pode ganhar cerca de 0,3kg por semana'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dicas Nutricionais */}
          <Card className="mt-6 shadow-lg border-0">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-xl font-medium text-gray-800 mb-4">💡 Dicas nutricionais</h3>
              <div className="space-y-3 text-base text-gray-600">
                <p>• Distribua suas calorias em 4-6 refeições ao longo do dia</p>
                <p>• Priorize alimentos integrais e minimize processados</p>
                <p>• Inclua proteínas em todas as refeições (1,6-2g por kg de peso)</p>
                <p>• Não reduza calorias drasticamente - isso pode desacelerar o metabolismo</p>
                <p>• Beba bastante água e durma bem para otimizar os resultados</p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-[15px] text-gray-400 text-center">
                  ⚠️ Este cálculo é uma estimativa baseada na fórmula de Mifflin-St Jeor. Consulte um nutricionista para um plano personalizado.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

