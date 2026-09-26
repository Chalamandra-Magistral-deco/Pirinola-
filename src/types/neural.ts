export type NeuralFaceId =
  | 'entrada'
  | 'oculta1'
  | 'oculta2'
  | 'salida'
  | 'aprendizaje'
  | 'misteriosa';

export interface NeuralPirinolaFace {
  id: NeuralFaceId;
  index: number; // 0 to 5 (each 60 deg)
  title: string;
  emoji: string;
  role: string;
  summary: string;
  analogy: string;
  sewingMetaphor: string; // The Sewing Workshop analogy
  mlConcept: string;
  actionCallout: string;
  bgGradient: string;
  borderColor: string;
  accentColor: string;
  glowColor: string;
  highlightLayer: 'input' | 'hidden1' | 'hidden2' | 'output' | 'backprop' | 'mystery';
}

export interface FruitSample {
  id: string;
  name: string;
  emoji: string;
  colorName: string;
  colorHex: string;
  colorVal: number; // 0.0 to 1.0 (e.g. green to red)
  sizeVal: number; // 0.0 (small) to 1.0 (large)
  sweetnessVal: number; // 0.0 (sour) to 1.0 (sweet)
  description: string;
  expectedOutput: string;
}

export interface SewingLevel {
  level: number;
  badge: string;
  title: string;
  subtitle: string;
  iconEmoji: string;
  sewingStory: string;
  takeaway: string;
  mappedFaceIndex: number;
  details: string[];
}

export const SEWING_LEVELS: SewingLevel[] = [
  {
    level: 1,
    badge: '🔰 Nivel 1: Metáfora Simple',
    title: 'El Taller de Costura con Aprendices',
    subtitle: 'Concepto Fundamental',
    iconEmoji: '🧵',
    sewingStory:
      'Imagina un gran taller donde hay aprendices que no saben coser al principio. Cada uno tiene una aguja e hilo, y su tarea es ayudar a confeccionar una prenda (por ejemplo, una camisa) a partir de una tela (la información que entra).\n\n• La tela es la entrada de datos (una imagen, un número, una palabra o una fruta).\n• Los aprendices son las neuronas.\n• Cada aprendiz hace un pequeño ajuste a la tela y la pasa al siguiente.\n• Al principio cosen mal, hacen nudos feos o cosen por donde no deben.\n• Pero con práctica y correcciones, van aprendiendo a coser mejor.',
    takeaway:
      '📌 Así, una red neuronal aprende paso a paso, como un grupo de aprendices guiados por ensayo y error hasta coser una prenda perfecta (dar una buena respuesta).',
    mappedFaceIndex: 0,
    details: [
      'Tela = Entrada de datos',
      'Aprendices = Neuronas',
      'Costura con fallas iniciales = Inicialización aleatoria',
      'Prenda perfecta = Predicción exacta',
    ],
  },
  {
    level: 2,
    badge: '🔄 Nivel 2: Capa por Capa',
    title: 'Las Mesas de Trabajo en Cadena',
    subtitle: 'Intermedio Suave',
    iconEmoji: '✂️',
    sewingStory:
      'Ahora imagina que este taller tiene varias mesas de trabajo (capas). En cada mesa:\n\n1. Los aprendices reciben una tela ya modificada por la mesa anterior.\n2. Cada uno hace su parte del trabajo, muy simple, pero con reglas distintas.\n3. Algunos recortan patrones, otros cosen las telas, otros doblan los cuellos.\n\nAl final, el resultado pasa por todas las mesas consecutivas y sale una camisa lista.',
    takeaway:
      '📌 Red Neuronal = Muchas capas de neuronas que transforman información paso a paso hasta producir una salida (respuesta o predicción).',
    mappedFaceIndex: 1,
    details: [
      'Mesa 1 (Entrada) = Recepción de la tela bruta',
      'Mesa 2 (Capa Oculta 1) = Recorte y preparación de piezas',
      'Mesa 3 (Capa Oculta 2) = Costura de patrones complejas',
      'Mesa 4 (Salida) = Camisa terminada e empaquetada',
    ],
  },
  {
    level: 3,
    badge: '⚙️ Nivel 3: Aprendizaje con Error',
    title: 'El Jefe de Calidad & Retropropagación',
    subtitle: 'Avanzado sin Tecnicismos',
    iconEmoji: '🕵️‍♂️',
    sewingStory:
      '¿Cómo aprenden los aprendices a coser mejor?\n\nCuando terminan la prenda, llega el Jefe de Calidad (el algoritmo de aprendizaje / Loss Function) y dice:\n\n“¡Esta costura está mal! El botón no está en su lugar.”\n\nEl jefe revisa qué parte del trabajo estuvo mal, y manda un mensaje de corrección hacia atrás: desde la camisa terminada hasta los primeros pasos.\n\nCada aprendiz recibe un mini-regaño o una felicitación, y ajusta un poquito su técnica para la próxima vez.',
    takeaway:
      '📌 Este proceso se llama retropropagación (Backpropagation): el error viaja hacia atrás y ayuda a ajustar cada paso del proceso.',
    mappedFaceIndex: 4,
    details: [
      'Jefe de Calidad = Función de Pérdida (Loss Function)',
      'Mensaje hacia atrás = Retropropagación (Backpropagation)',
      'Ajustar la técnica = Descenso de Gradiente (Gradient Descent)',
    ],
  },
  {
    level: 4,
    badge: '🧠 Nivel 4: Activación, Pesos y Funciones',
    title: 'Atención, Criterio Propio y Pesos',
    subtitle: 'Avanzado Suave',
    iconEmoji: '🪡',
    sewingStory:
      'Volvamos al taller. Cada aprendiz tiene:\n\n• Un grado de atención: si le llega algo importante, reacciona más (esto es la Función de Activación).\n• Un criterio propio para actuar: si el aprendiz es bueno cosiendo mangas, se enfoca más en eso (Pesos Sinápticos).\n• A veces decide no hacer nada, si cree que la tela ya está bien (Sesgo o Bias).\n\n¡Y lo más importante: todos estos criterios se van ajustando solos con la práctica!',
    takeaway:
      '📌 La red aprende ajustando esos pesos (criterios) y activaciones (decisiones de actuar o no), para mejorar el resultado final.',
    mappedFaceIndex: 2,
    details: [
      'Grado de Atención = Función de Activación (ReLU / Sigmoide)',
      'Criterio Propio = Pesos Sinápticos (Weights W)',
      'Criterio Inicial = Sesgo (Bias B)',
      'Práctica Continua = Entrenamiento con Épocas (Epochs)',
    ],
  },
  {
    level: 5,
    badge: '🧬 Nivel 5: Visión Global',
    title: 'El Poder de la Experiencia Sin Reglas Escritas',
    subtitle: 'Visión Holística de la IA',
    iconEmoji: '🚀',
    sewingStory:
      'Estas redes de aprendices pueden:\n\n• Aprender a reconocer rostros, traducir idiomas, predecir enfermedades...\n• Y lo hacen sin que nadie les diga exactamente cómo hacerlo de forma manual.\n• Solo necesitan muchos ejemplos (telas de muestra), retroalimentación clara (el jefe de calidad) y tiempo para practicar.\n\nComo un niño que aprende a hablar sin saber gramática, solo escuchando y corrigiéndose, una red neuronal aprende con experiencia, no con reglas escritas.',
    takeaway:
      '📌 Aprendizaje Profundo (Deep Learning): la capacidad de descubrir patrones complejos por sí misma acumulando experiencia.',
    mappedFaceIndex: 3,
    details: [
      'Muchos ejemplos = Conjunto de Datos (Dataset)',
      'Experiencia Acumulada = Parámetros Entrenados',
      'Autonomía = Generalización ante nuevos datos',
    ],
  },
];

export const NEURAL_FACES: NeuralPirinolaFace[] = [
  {
    id: 'entrada',
    index: 0,
    title: 'Entrada',
    emoji: '🍎',
    role: 'Capa de Entrada (Input Layer)',
    summary: 'Observa la fruta y captura sus datos brutos: color, tamaño y dulzura.',
    analogy: 'Es como cuando ves y sostienes una manzana: tus ojos ven que es roja, tu mano siente su tamaño y tu lengua saborea su dulzor.',
    sewingMetaphor: '🧵 La Tela Cruda: El cliente entrega el rollo de tela bruta al taller con sus medidas y color original.',
    mlConcept: 'Los datos del mundo real se convierten en números (vectores de características: X₁=Color, X₂=Tamaño, X₃=Dulzura) para que las neuronas puedan procesarlos.',
    actionCallout: '¡La red neuronal recibe los datos de la fruta!',
    bgGradient: 'from-rose-500 to-red-600',
    borderColor: 'border-red-400',
    accentColor: 'text-red-400',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    highlightLayer: 'input',
  },
  {
    id: 'oculta1',
    index: 1,
    title: 'Capa Oculta 1',
    emoji: '⚖️',
    role: 'Primera Capa Oculta (Feature Extraction 1)',
    summary: 'Pesa la fruta y decide si es principalmente dulce o ácida.',
    analogy: 'Una báscula mágica interna que combina el peso con la acidez para saber si la fruta es ligera y cítrica o pesada y dulce.',
    sewingMetaphor: '✂️ Mesa 1 de Aprendices: Recortan la tela en piezas básicas según su peso y textura inicial.',
    mlConcept: 'Multiplica las entradas por pesos iniciales (W₁) y suma un sesgo (bias). La función de activación (ReLU o Sigmoide) decide qué neuronas se encienden con mayor fuerza.',
    actionCallout: '¡Las neuronas intermedias ponderan peso y acidez!',
    bgGradient: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-400',
    accentColor: 'text-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    highlightLayer: 'hidden1',
  },
  {
    id: 'oculta2',
    index: 2,
    title: 'Capa Oculta 2',
    emoji: '🎨📏',
    role: 'Segunda Capa Oculta (Feature Extraction 2)',
    summary: 'Clasifica por patrones complejos de color, curvatura y tamaño.',
    analogy: 'Un inspector de frutas experto que detecta patrones más específicos: ¿es amarilla y alargada? ¿es redonda y carmesí?',
    sewingMetaphor: '🪡 Mesa 2 de Aprendices: Ensamblan mangas, botones y cuellos uniendo las piezas de la mesa anterior.',
    mlConcept: 'Combina las decisiones de la Capa 1 para construir conceptos de alto nivel (perfil morfológico). Las capas profundas aprenden representaciones más abstractas.',
    actionCallout: '¡La red reconoce la silueta y tono exacto!',
    bgGradient: 'from-violet-500 to-indigo-600',
    borderColor: 'border-violet-400',
    accentColor: 'text-violet-400',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    highlightLayer: 'hidden2',
  },
  {
    id: 'salida',
    index: 3,
    title: 'Salida',
    emoji: '✅',
    role: 'Capa de Salida (Output Layer)',
    summary: 'Predice con una probabilidad matemática qué fruta es.',
    analogy: '¡El veredicto final! La red levanta la mano y dice: "¡Estoy 92% segura de que es una Manzana!".',
    sewingMetaphor: '👕 Camisa Terminada: La prenda sale empaquetada de la fábrica con su etiqueta de comprobación final.',
    mlConcept: 'La capa final aplica una función Softmax para convertir las señales en probabilidades que suman 100%. La neurona con mayor valor es la predicción elegida.',
    actionCallout: '¡Predicción calculada con éxito!',
    bgGradient: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-400',
    accentColor: 'text-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    highlightLayer: 'output',
  },
  {
    id: 'aprendizaje',
    index: 4,
    title: 'Aprendizaje',
    emoji: '🔧',
    role: 'Retropropagación & Optimización (Backpropagation)',
    summary: 'Ajusta las reglas y los pesos si la red se equivocó.',
    analogy: 'Si la red confundió un limón verde con una manzana verde, el maestro le avisa del error y ella reajusta sus cables para no volver a fallar.',
    sewingMetaphor: '🕵️‍♂️ El Jefe de Calidad: Revisa errores ("¡Un botón está mal puesto!") y manda correcciones hacia atrás a cada mesa.',
    mlConcept: 'Calcula el Error (Loss Function) y envía la señal en reversa (Gradiente Descendente) para modificar los pesos sinápticos y reducir el error en el futuro.',
    actionCallout: '¡Ajustando pesos sinápticos y corrigiendo errores!',
    bgGradient: 'from-blue-500 to-cyan-600',
    borderColor: 'border-blue-400',
    accentColor: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    highlightLayer: 'backprop',
  },
  {
    id: 'misteriosa',
    index: 5,
    title: 'Fruta Misteriosa',
    emoji: '🎲',
    role: 'Caso Inesperado / Out-of-Distribution (Sorpresa)',
    summary: '¡Aparece una fruta exótica misteriosa! La red pide repetir turno.',
    analogy: '¡Llegó una Pitahaya (fruta del dragón) o una Carambola estrella! La red nunca la había visto en sus clases de entrenamiento y se queda con los ojos abiertos.',
    sewingMetaphor: '🎩 Pedido Exótico Especial: Llega una prenda fantasía que los aprendices nunca habían visto en el taller y piden practicar más.',
    mlConcept: 'Datos fuera de distribución (OOD) o caso anómalo. La red detecta alta incertidumbre, no puede predecir con confianza y pide un nuevo ejemplo o repetir turno.',
    actionCallout: '¡Sorpresa! Fruta desconocida. ¡Vuelve a girar la pirinola!',
    bgGradient: 'from-fuchsia-500 to-pink-600',
    borderColor: 'border-fuchsia-400',
    accentColor: 'text-pink-400',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    highlightLayer: 'mystery',
  },
];

export const SAMPLE_FRUITS: FruitSample[] = [
  {
    id: 'manzana',
    name: 'Manzana Roja',
    emoji: '🍎',
    colorName: 'Rojo vivo',
    colorHex: '#ef4444',
    colorVal: 0.85,
    sizeVal: 0.65,
    sweetnessVal: 0.75,
    description: 'Redonda, dulce, crujiente y tamaño mediano.',
    expectedOutput: 'Manzana',
  },
  {
    id: 'platano',
    name: 'Plátano / Banana',
    emoji: '🍌',
    colorName: 'Amarillo brillante',
    colorHex: '#eab308',
    colorVal: 0.45,
    sizeVal: 0.8,
    sweetnessVal: 0.9,
    description: 'Alargado, dulce, suave y color amarillo.',
    expectedOutput: 'Plátano',
  },
  {
    id: 'limon',
    name: 'Limón Ácido',
    emoji: '🍋',
    colorName: 'Amarillo verdoso',
    colorHex: '#84cc16',
    colorVal: 0.25,
    sizeVal: 0.35,
    sweetnessVal: 0.1,
    description: 'Pequeño, muy ácido y cáscara cítrica.',
    expectedOutput: 'Limón',
  },
  {
    id: 'naranja',
    name: 'Naranja Jugosa',
    emoji: '🍊',
    colorName: 'Naranja cálido',
    colorHex: '#f97316',
    colorVal: 0.6,
    sizeVal: 0.7,
    sweetnessVal: 0.65,
    description: 'Redonda, dulce con toque cítrico y cáscara porosa.',
    expectedOutput: 'Naranja',
  },
  {
    id: 'fresa',
    name: 'Fresa Silvestre',
    emoji: '🍓',
    colorName: 'Rojo intenso',
    colorHex: '#e11d48',
    colorVal: 0.95,
    sizeVal: 0.2,
    sweetnessVal: 0.7,
    description: 'Pequeña, cónica, aroma dulce y semillas exteriores.',
    expectedOutput: 'Fresa',
  },
  {
    id: 'sandia',
    name: 'Sandía Gigante',
    emoji: '🍉',
    colorName: 'Verde exterior / Rojo interior',
    colorHex: '#10b981',
    colorVal: 0.3,
    sizeVal: 0.98,
    sweetnessVal: 0.8,
    description: 'Muy grande, pesada, verde por fuera y dulce por dentro.',
    expectedOutput: 'Sandía',
  },
  {
    id: 'pitahaya',
    name: 'Pitahaya Dragón',
    emoji: '🐉',
    colorName: 'Rosa fucsia exótico',
    colorHex: '#ec4899',
    colorVal: 0.7,
    sizeVal: 0.6,
    sweetnessVal: 0.5,
    description: '¡Fruta misteriosa y exótica con escamas y pulpa punteada!',
    expectedOutput: 'Fruta Misteriosa',
  },
];
