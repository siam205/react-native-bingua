import type { Lesson } from "@/types/learning";

/**
 * The lesson library. Everything is hardcoded — no database in this version.
 *
 * A lesson is self-contained: it carries its own vocabulary, phrases,
 * activities and (when it can be run as a call) the AI teacher prompt.
 * To add one, append an entry with the right `unitId` and `order`.
 */
export const lessons: Lesson[] = [
  /* ============================= Spanish · Unit 1 ============================ */
  {
    id: "es-a1-u1-l1",
    unitId: "es-a1-u1",
    order: 1,
    title: "Greetings & Introductions",
    description: "Say hello and tell someone your name.",
    kind: "vocabulary",
    icon: "👋",
    xpReward: 20,
    estimatedMinutes: 5,
    goals: [
      { id: "es-a1-u1-l1-g1", label: "Greet someone at any time of day" },
      { id: "es-a1-u1-l1-g2", label: "Say your name and ask for theirs" },
    ],
    vocabulary: [
      {
        id: "es-hola",
        term: "hola",
        translation: "hello",
        pronunciation: "OH-la",
        partOfSpeech: "phrase",
        example: { text: "¡Hola, Ana!", translation: "Hello, Ana!" },
      },
      {
        id: "es-buenos-dias",
        term: "buenos días",
        translation: "good morning",
        pronunciation: "BWEH-nos DEE-as",
        partOfSpeech: "phrase",
      },
      {
        id: "es-buenas-noches",
        term: "buenas noches",
        translation: "good night",
        pronunciation: "BWEH-nas NO-ches",
        partOfSpeech: "phrase",
      },
      {
        id: "es-adios",
        term: "adiós",
        translation: "goodbye",
        pronunciation: "ah-DYOS",
        partOfSpeech: "phrase",
      },
      {
        id: "es-gracias",
        term: "gracias",
        translation: "thank you",
        pronunciation: "GRA-syas",
        partOfSpeech: "phrase",
      },
    ],
    phrases: [
      {
        id: "es-me-llamo",
        text: "Me llamo Ana.",
        translation: "My name is Ana.",
        pronunciation: "meh YA-mo AH-na",
        usage: "Introducing yourself to anyone, formal or not.",
      },
      {
        id: "es-como-te-llamas",
        text: "¿Cómo te llamas?",
        translation: "What is your name?",
        pronunciation: "KO-mo teh YA-mas",
        usage: "Asking someone your age or younger for their name.",
      },
      {
        id: "es-mucho-gusto",
        text: "Mucho gusto.",
        translation: "Nice to meet you.",
        pronunciation: "MOO-cho GOOS-to",
        usage: "Right after you exchange names.",
      },
    ],
    activities: [
      {
        id: "es-a1-u1-l1-a1",
        type: "multiple-choice",
        prompt: "How do you say “good morning”?",
        xp: 5,
        options: ["buenas noches", "buenos días", "adiós", "gracias"],
        answerIndex: 1,
      },
      {
        id: "es-a1-u1-l1-a2",
        type: "match-pairs",
        prompt: "Match the Spanish word to its meaning.",
        xp: 5,
        pairs: [
          { term: "hola", translation: "hello" },
          { term: "adiós", translation: "goodbye" },
          { term: "gracias", translation: "thank you" },
        ],
      },
      {
        id: "es-a1-u1-l1-a3",
        type: "translate",
        prompt: "Translate into Spanish.",
        xp: 5,
        source: "My name is Ana.",
        answer: "Me llamo Ana.",
        hint: "llamarse = to be called",
      },
      {
        id: "es-a1-u1-l1-a4",
        type: "speak",
        prompt: "Say it out loud.",
        xp: 5,
        text: "Mucho gusto.",
        translation: "Nice to meet you.",
      },
    ],
    aiTeacher: {
      persona: "Rio, a warm and patient Spanish teacher who speaks slowly.",
      voice: "es-ES-female-warm",
      systemPrompt:
        "You are Rio, a friendly Spanish teacher for a complete beginner. " +
        "Speak in short, simple Spanish sentences and repeat the English meaning " +
        "once. Keep every turn under two sentences. Stay on greetings and names; " +
        "do not introduce grammar the learner has not met yet.",
      openingLine: {
        text: "¡Hola! Me llamo Rio. ¿Cómo te llamas?",
        translation: "Hello! My name is Rio. What is your name?",
      },
      conversationStarters: [
        "¿Cómo te llamas?",
        "¡Mucho gusto! ¿Buenos días o buenas noches?",
        "Dime hola otra vez, por favor.",
      ],
      correctionStyle: "gentle",
      targetVocabularyIds: ["es-hola", "es-buenos-dias", "es-gracias"],
      successCriteria: [
        "The learner greets Rio in Spanish without prompting.",
        "The learner says their name using me llamo.",
      ],
    },
  },
  {
    id: "es-a1-u1-l2",
    unitId: "es-a1-u1",
    order: 2,
    title: "Daily Life",
    description: "Talk about your day and how you are feeling.",
    kind: "vocabulary",
    icon: "🌤️",
    xpReward: 20,
    estimatedMinutes: 6,
    goals: [
      { id: "es-a1-u1-l2-g1", label: "Ask how someone is doing" },
      { id: "es-a1-u1-l2-g2", label: "Describe your day in one sentence" },
    ],
    vocabulary: [
      {
        id: "es-bien",
        term: "bien",
        translation: "well / fine",
        pronunciation: "byen",
        partOfSpeech: "adverb",
      },
      {
        id: "es-cansado",
        term: "cansado",
        translation: "tired",
        pronunciation: "kan-SA-do",
        partOfSpeech: "adjective",
      },
      {
        id: "es-trabajo",
        term: "el trabajo",
        translation: "work",
        pronunciation: "el tra-BA-ho",
        partOfSpeech: "noun",
        example: { text: "Voy al trabajo.", translation: "I am going to work." },
      },
      {
        id: "es-hoy",
        term: "hoy",
        translation: "today",
        pronunciation: "oy",
        partOfSpeech: "adverb",
      },
    ],
    phrases: [
      {
        id: "es-como-estas",
        text: "¿Cómo estás?",
        translation: "How are you?",
        pronunciation: "KO-mo es-TAS",
        usage: "Casual check-in with a friend.",
      },
      {
        id: "es-estoy-bien",
        text: "Estoy bien, gracias.",
        translation: "I am fine, thank you.",
        pronunciation: "es-TOY byen GRA-syas",
        usage: "The standard reply to ¿Cómo estás?",
      },
    ],
    activities: [
      {
        id: "es-a1-u1-l2-a1",
        type: "multiple-choice",
        prompt: "Someone asks “¿Cómo estás?”. What do you say?",
        xp: 5,
        options: ["Me llamo Ana.", "Estoy bien, gracias.", "Adiós.", "Hoy."],
        answerIndex: 1,
      },
      {
        id: "es-a1-u1-l2-a2",
        type: "translate",
        prompt: "Translate into Spanish.",
        xp: 5,
        source: "I am tired today.",
        answer: "Estoy cansado hoy.",
      },
      {
        id: "es-a1-u1-l2-a3",
        type: "conversation",
        prompt: "Tell the tutor how your day went.",
        xp: 10,
        openingLine: "¡Hola! ¿Cómo estás hoy?",
        expectedVocabularyIds: ["es-bien", "es-cansado", "es-hoy"],
      },
    ],
    aiTeacher: {
      persona: "Rio, a warm and patient Spanish teacher who speaks slowly.",
      voice: "es-ES-female-warm",
      systemPrompt:
        "You are Rio, teaching a beginner to talk about their day in Spanish. " +
        "Ask one short question at a time and wait. Reuse only the words " +
        "bien, cansado, trabajo and hoy. Praise attempts before correcting.",
      openingLine: {
        text: "¡Hola otra vez! ¿Cómo estás hoy?",
        translation: "Hi again! How are you today?",
      },
      conversationStarters: [
        "¿Estás bien o cansado?",
        "¿Vas al trabajo hoy?",
        "¿Cómo está tu día?",
      ],
      correctionStyle: "gentle",
      targetVocabularyIds: ["es-bien", "es-cansado", "es-trabajo"],
      successCriteria: [
        "The learner answers ¿Cómo estás? with a full sentence.",
        "The learner uses at least two target words.",
      ],
    },
  },
  {
    id: "es-a1-u1-l3",
    unitId: "es-a1-u1",
    order: 3,
    title: "At the Café",
    description: "Order a drink and pay like a local.",
    kind: "audio",
    icon: "☕️",
    xpReward: 25,
    estimatedMinutes: 8,
    goals: [
      { id: "es-a1-u1-l3-g1", label: "Order a coffee politely" },
      { id: "es-a1-u1-l3-g2", label: "Ask for the bill" },
    ],
    vocabulary: [
      {
        id: "es-cafe",
        term: "el café",
        translation: "the coffee",
        pronunciation: "el ka-FEH",
        partOfSpeech: "noun",
        example: { text: "Un café, por favor.", translation: "A coffee, please." },
      },
      {
        id: "es-agua",
        term: "el agua",
        translation: "the water",
        pronunciation: "el AH-gwa",
        partOfSpeech: "noun",
      },
      {
        id: "es-cuenta",
        term: "la cuenta",
        translation: "the bill",
        pronunciation: "la KWEN-ta",
        partOfSpeech: "noun",
      },
      {
        id: "es-por-favor",
        term: "por favor",
        translation: "please",
        pronunciation: "por fa-VOR",
        partOfSpeech: "phrase",
      },
    ],
    phrases: [
      {
        id: "es-quisiera",
        text: "Quisiera un café, por favor.",
        translation: "I would like a coffee, please.",
        pronunciation: "kee-SYEH-ra oon ka-FEH por fa-VOR",
        usage: "The polite way to order anything.",
      },
      {
        id: "es-la-cuenta",
        text: "La cuenta, por favor.",
        translation: "The bill, please.",
        pronunciation: "la KWEN-ta por fa-VOR",
        usage: "When you are ready to pay.",
      },
    ],
    activities: [
      {
        id: "es-a1-u1-l3-a1",
        type: "speak",
        prompt: "Order your coffee.",
        xp: 5,
        text: "Quisiera un café, por favor.",
        translation: "I would like a coffee, please.",
      },
      {
        id: "es-a1-u1-l3-a2",
        type: "multiple-choice",
        prompt: "You want to pay. What do you say?",
        xp: 5,
        options: ["El agua, por favor.", "La cuenta, por favor.", "Mucho gusto."],
        answerIndex: 1,
      },
      {
        id: "es-a1-u1-l3-a3",
        type: "conversation",
        prompt: "Order at the café with the tutor playing the waiter.",
        xp: 15,
        openingLine: "Buenos días, ¿qué desea?",
        expectedVocabularyIds: ["es-cafe", "es-por-favor", "es-cuenta"],
      },
    ],
    aiTeacher: {
      persona: "Rio, playing a friendly waiter in a Madrid café.",
      voice: "es-ES-female-warm",
      systemPrompt:
        "You are Rio, role-playing a waiter in a Spanish café for a beginner. " +
        "Stay in character, speak slowly, and keep to ordering drinks and paying. " +
        "If the learner is stuck for more than a few seconds, offer the phrase in " +
        "Spanish and then its English meaning.",
      openingLine: {
        text: "Buenos días, ¿qué desea?",
        translation: "Good morning, what would you like?",
      },
      conversationStarters: ["¿Un café o un agua?", "¿Algo más?", "¿Quiere la cuenta?"],
      correctionStyle: "gentle",
      targetVocabularyIds: ["es-cafe", "es-agua", "es-cuenta", "es-por-favor"],
      successCriteria: [
        "The learner orders a drink using por favor.",
        "The learner asks for the bill unprompted.",
      ],
    },
  },

  /* ============================= Spanish · Unit 2 ============================ */
  {
    id: "es-a1-u2-l1",
    unitId: "es-a1-u2",
    order: 1,
    title: "Travel & Directions",
    description: "Find your way around a new city.",
    kind: "vocabulary",
    icon: "🧭",
    xpReward: 25,
    estimatedMinutes: 7,
    goals: [
      { id: "es-a1-u2-l1-g1", label: "Ask where something is" },
      { id: "es-a1-u2-l1-g2", label: "Understand left, right and straight on" },
    ],
    vocabulary: [
      {
        id: "es-izquierda",
        term: "la izquierda",
        translation: "the left",
        pronunciation: "la ees-KYER-da",
        partOfSpeech: "noun",
      },
      {
        id: "es-derecha",
        term: "la derecha",
        translation: "the right",
        pronunciation: "la deh-REH-cha",
        partOfSpeech: "noun",
      },
      {
        id: "es-estacion",
        term: "la estación",
        translation: "the station",
        pronunciation: "la es-ta-SYON",
        partOfSpeech: "noun",
      },
    ],
    phrases: [
      {
        id: "es-donde-esta",
        text: "¿Dónde está la estación?",
        translation: "Where is the station?",
        pronunciation: "DON-deh es-TA la es-ta-SYON",
        usage: "Asking for any place — swap the last word.",
      },
      {
        id: "es-todo-recto",
        text: "Todo recto.",
        translation: "Straight ahead.",
        pronunciation: "TO-do REK-to",
        usage: "The answer you will hear most often.",
      },
    ],
    activities: [
      {
        id: "es-a1-u2-l1-a1",
        type: "translate",
        prompt: "Translate into Spanish.",
        xp: 5,
        source: "Where is the station?",
        answer: "¿Dónde está la estación?",
      },
      {
        id: "es-a1-u2-l1-a2",
        type: "match-pairs",
        prompt: "Match the direction to its meaning.",
        xp: 5,
        pairs: [
          { term: "la izquierda", translation: "the left" },
          { term: "la derecha", translation: "the right" },
          { term: "todo recto", translation: "straight ahead" },
        ],
      },
    ],
  },
  {
    id: "es-a1-u2-l2",
    unitId: "es-a1-u2",
    order: 2,
    title: "Shopping",
    description: "Ask for prices and say what you are looking for.",
    kind: "chat",
    icon: "🛍️",
    xpReward: 25,
    estimatedMinutes: 7,
    goals: [
      { id: "es-a1-u2-l2-g1", label: "Ask how much something costs" },
      { id: "es-a1-u2-l2-g2", label: "Say what you are looking for" },
    ],
    vocabulary: [
      {
        id: "es-tienda",
        term: "la tienda",
        translation: "the shop",
        pronunciation: "la TYEN-da",
        partOfSpeech: "noun",
      },
      {
        id: "es-dinero",
        term: "el dinero",
        translation: "the money",
        pronunciation: "el dee-NEH-ro",
        partOfSpeech: "noun",
      },
      {
        id: "es-barato",
        term: "barato",
        translation: "cheap",
        pronunciation: "ba-RA-to",
        partOfSpeech: "adjective",
      },
    ],
    phrases: [
      {
        id: "es-cuanto-cuesta",
        text: "¿Cuánto cuesta?",
        translation: "How much does it cost?",
        pronunciation: "KWAN-to KWES-ta",
        usage: "Pointing at anything in a shop.",
      },
      {
        id: "es-estoy-buscando",
        text: "Estoy buscando una camiseta.",
        translation: "I am looking for a t-shirt.",
        pronunciation: "es-TOY boos-KAN-do OO-na ka-mee-SEH-ta",
        usage: "Telling a shop assistant what you need.",
      },
    ],
    activities: [
      {
        id: "es-a1-u2-l2-a1",
        type: "multiple-choice",
        prompt: "How do you ask for the price?",
        xp: 5,
        options: ["¿Dónde está?", "¿Cuánto cuesta?", "¿Cómo te llamas?"],
        answerIndex: 1,
      },
      {
        id: "es-a1-u2-l2-a2",
        type: "conversation",
        prompt: "Buy something from the tutor's shop.",
        xp: 15,
        openingLine: "¡Hola! ¿En qué puedo ayudarle?",
        expectedVocabularyIds: ["es-tienda", "es-barato", "es-dinero"],
      },
    ],
    aiTeacher: {
      persona: "Rio, playing a cheerful shop assistant.",
      voice: "es-ES-female-warm",
      systemPrompt:
        "You are Rio, role-playing a shop assistant for a beginner learner. " +
        "Keep to prices, sizes and simple items. Say numbers slowly and repeat " +
        "them once in English.",
      openingLine: {
        text: "¡Hola! ¿En qué puedo ayudarle?",
        translation: "Hello! How can I help you?",
      },
      conversationStarters: [
        "¿Busca algo en especial?",
        "Cuesta diez euros. ¿Es barato?",
        "¿Quiere pagar con dinero o tarjeta?",
      ],
      correctionStyle: "gentle",
      targetVocabularyIds: ["es-tienda", "es-dinero", "es-barato"],
      successCriteria: [
        "The learner asks the price of an item.",
        "The learner states what they are looking for.",
      ],
    },
  },

  /* ============================== French · Unit 1 =========================== */
  {
    id: "fr-a1-u1-l1",
    unitId: "fr-a1-u1",
    order: 1,
    title: "Bonjour!",
    description: "Greet people and introduce yourself in French.",
    kind: "vocabulary",
    icon: "👋",
    xpReward: 20,
    estimatedMinutes: 5,
    goals: [
      { id: "fr-a1-u1-l1-g1", label: "Greet someone formally and casually" },
      { id: "fr-a1-u1-l1-g2", label: "Say your name" },
    ],
    vocabulary: [
      {
        id: "fr-bonjour",
        term: "bonjour",
        translation: "hello / good day",
        pronunciation: "bon-ZHOOR",
        partOfSpeech: "phrase",
      },
      {
        id: "fr-salut",
        term: "salut",
        translation: "hi (casual)",
        pronunciation: "sa-LU",
        partOfSpeech: "phrase",
      },
      {
        id: "fr-merci",
        term: "merci",
        translation: "thank you",
        pronunciation: "mer-SEE",
        partOfSpeech: "phrase",
      },
    ],
    phrases: [
      {
        id: "fr-je-mappelle",
        text: "Je m'appelle Léo.",
        translation: "My name is Léo.",
        pronunciation: "zhuh ma-PELL LEH-o",
        usage: "Introducing yourself.",
      },
      {
        id: "fr-enchante",
        text: "Enchanté.",
        translation: "Nice to meet you.",
        pronunciation: "on-shon-TEH",
        usage: "Straight after an introduction.",
      },
    ],
    activities: [
      {
        id: "fr-a1-u1-l1-a1",
        type: "multiple-choice",
        prompt: "Which greeting works with a stranger?",
        xp: 5,
        options: ["salut", "bonjour", "merci"],
        answerIndex: 1,
      },
      {
        id: "fr-a1-u1-l1-a2",
        type: "translate",
        prompt: "Translate into French.",
        xp: 5,
        source: "My name is Léo.",
        answer: "Je m'appelle Léo.",
      },
    ],
    aiTeacher: {
      persona: "Margot, a calm French teacher from Lyon.",
      voice: "fr-FR-female-calm",
      systemPrompt:
        "You are Margot, teaching a complete beginner French greetings. " +
        "Use only bonjour, salut, merci and je m'appelle. Speak slowly and " +
        "translate every sentence into English once.",
      openingLine: {
        text: "Bonjour ! Je m'appelle Margot. Et toi ?",
        translation: "Hello! My name is Margot. And you?",
      },
      conversationStarters: [
        "Comment tu t'appelles ?",
        "Bonjour ou salut ?",
        "Dis-moi enchanté.",
      ],
      correctionStyle: "gentle",
      targetVocabularyIds: ["fr-bonjour", "fr-salut", "fr-merci"],
      successCriteria: [
        "The learner greets Margot in French.",
        "The learner says their name with je m'appelle.",
      ],
    },
  },
  {
    id: "fr-a1-u1-l2",
    unitId: "fr-a1-u1",
    order: 2,
    title: "At the Bakery",
    description: "Buy bread and pastries like a Parisian.",
    kind: "audio",
    icon: "🥐",
    xpReward: 25,
    estimatedMinutes: 7,
    goals: [
      { id: "fr-a1-u1-l2-g1", label: "Order a pastry politely" },
      { id: "fr-a1-u1-l2-g2", label: "Understand a simple price" },
    ],
    vocabulary: [
      {
        id: "fr-pain",
        term: "le pain",
        translation: "the bread",
        pronunciation: "luh pan",
        partOfSpeech: "noun",
      },
      {
        id: "fr-croissant",
        term: "le croissant",
        translation: "the croissant",
        pronunciation: "luh krwa-SON",
        partOfSpeech: "noun",
      },
      {
        id: "fr-sil-vous-plait",
        term: "s'il vous plaît",
        translation: "please",
        pronunciation: "seel voo PLEH",
        partOfSpeech: "phrase",
      },
    ],
    phrases: [
      {
        id: "fr-je-voudrais",
        text: "Je voudrais un croissant, s'il vous plaît.",
        translation: "I would like a croissant, please.",
        pronunciation: "zhuh voo-DREH un krwa-SON seel voo PLEH",
        usage: "The polite way to order.",
      },
    ],
    activities: [
      {
        id: "fr-a1-u1-l2-a1",
        type: "speak",
        prompt: "Order your croissant.",
        xp: 5,
        text: "Je voudrais un croissant, s'il vous plaît.",
        translation: "I would like a croissant, please.",
      },
      {
        id: "fr-a1-u1-l2-a2",
        type: "conversation",
        prompt: "Buy breakfast from the tutor's bakery.",
        xp: 15,
        openingLine: "Bonjour ! Vous désirez ?",
        expectedVocabularyIds: ["fr-pain", "fr-croissant", "fr-sil-vous-plait"],
      },
    ],
    aiTeacher: {
      persona: "Margot, playing a baker in a Paris boulangerie.",
      voice: "fr-FR-female-calm",
      systemPrompt:
        "You are Margot, role-playing a baker for a beginner. Stay in character, " +
        "keep to bread, pastries and prices under ten euros, and repeat any price " +
        "twice.",
      openingLine: {
        text: "Bonjour ! Vous désirez ?",
        translation: "Hello! What would you like?",
      },
      conversationStarters: [
        "Un croissant ou du pain ?",
        "Ça fait deux euros. D'accord ?",
        "Et avec ceci ?",
      ],
      correctionStyle: "gentle",
      targetVocabularyIds: ["fr-croissant", "fr-pain", "fr-sil-vous-plait"],
      successCriteria: [
        "The learner orders using je voudrais.",
        "The learner says s'il vous plaît at least once.",
      ],
    },
  },

  /* ============================= Japanese · Unit 1 ========================== */
  {
    id: "ja-a1-u1-l1",
    unitId: "ja-a1-u1",
    order: 1,
    title: "Greetings",
    description: "Say hello, thank you and goodbye in Japanese.",
    kind: "vocabulary",
    icon: "🌸",
    xpReward: 20,
    estimatedMinutes: 5,
    goals: [
      { id: "ja-a1-u1-l1-g1", label: "Greet someone at the right time of day" },
      { id: "ja-a1-u1-l1-g2", label: "Thank someone politely" },
    ],
    vocabulary: [
      {
        id: "ja-konnichiwa",
        term: "こんにちは",
        translation: "hello / good afternoon",
        pronunciation: "kon-nee-chee-wa",
        partOfSpeech: "phrase",
      },
      {
        id: "ja-ohayou",
        term: "おはようございます",
        translation: "good morning (polite)",
        pronunciation: "o-ha-yoh go-zai-mas",
        partOfSpeech: "phrase",
      },
      {
        id: "ja-arigatou",
        term: "ありがとう",
        translation: "thank you",
        pronunciation: "a-ree-ga-toh",
        partOfSpeech: "phrase",
      },
    ],
    phrases: [
      {
        id: "ja-hajimemashite",
        text: "はじめまして。",
        translation: "Nice to meet you.",
        pronunciation: "ha-jee-meh-mash-teh",
        usage: "The first thing you say to someone new.",
      },
      {
        id: "ja-namae",
        text: "わたしは アナ です。",
        translation: "I am Ana.",
        pronunciation: "wa-ta-shee wa A-na des",
        usage: "Introducing yourself.",
      },
    ],
    activities: [
      {
        id: "ja-a1-u1-l1-a1",
        type: "multiple-choice",
        prompt: "It is 8am. Which greeting do you use?",
        xp: 5,
        options: ["こんにちは", "おはようございます", "ありがとう"],
        answerIndex: 1,
      },
      {
        id: "ja-a1-u1-l1-a2",
        type: "speak",
        prompt: "Introduce yourself.",
        xp: 5,
        text: "はじめまして。",
        translation: "Nice to meet you.",
      },
    ],
    aiTeacher: {
      persona: "Kenji, a gentle Japanese teacher who loves beginners.",
      voice: "ja-JP-male-gentle",
      systemPrompt:
        "You are Kenji, teaching a beginner Japanese greetings. Use only hiragana " +
        "words the learner has met, always give the romaji and the English meaning, " +
        "and never use kanji.",
      openingLine: {
        text: "こんにちは！わたしは けんじ です。",
        translation: "Hello! I am Kenji.",
      },
      conversationStarters: [
        "おなまえは？",
        "おはようございます、と いって ください。",
        "ありがとう は えいごで なんですか？",
      ],
      correctionStyle: "gentle",
      targetVocabularyIds: ["ja-konnichiwa", "ja-ohayou", "ja-arigatou"],
      successCriteria: [
        "The learner greets Kenji in Japanese.",
        "The learner says はじめまして clearly.",
      ],
    },
  },
  {
    id: "ja-a1-u1-l2",
    unitId: "ja-a1-u1",
    order: 2,
    title: "Numbers 1-10",
    description: "Count and read simple prices.",
    kind: "vocabulary",
    icon: "🔢",
    xpReward: 20,
    estimatedMinutes: 6,
    goals: [{ id: "ja-a1-u1-l2-g1", label: "Count from one to ten out loud" }],
    vocabulary: [
      {
        id: "ja-ichi",
        term: "いち",
        translation: "one",
        pronunciation: "ee-chee",
        partOfSpeech: "noun",
      },
      {
        id: "ja-ni",
        term: "に",
        translation: "two",
        pronunciation: "nee",
        partOfSpeech: "noun",
      },
      {
        id: "ja-san",
        term: "さん",
        translation: "three",
        pronunciation: "san",
        partOfSpeech: "noun",
      },
      {
        id: "ja-juu",
        term: "じゅう",
        translation: "ten",
        pronunciation: "joo",
        partOfSpeech: "noun",
      },
    ],
    phrases: [
      {
        id: "ja-ikutsu",
        text: "いくつ ですか。",
        translation: "How many is it?",
        pronunciation: "ee-koo-tsoo des-ka",
        usage: "Asking about a quantity.",
      },
    ],
    activities: [
      {
        id: "ja-a1-u1-l2-a1",
        type: "match-pairs",
        prompt: "Match the number to its meaning.",
        xp: 5,
        pairs: [
          { term: "いち", translation: "one" },
          { term: "に", translation: "two" },
          { term: "さん", translation: "three" },
        ],
      },
      {
        id: "ja-a1-u1-l2-a2",
        type: "translate",
        prompt: "Write the Japanese for “ten”.",
        xp: 5,
        source: "ten",
        answer: "じゅう",
      },
    ],
  },
];

export function getLesson(lessonId: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === lessonId);
}

/** All lessons of a unit, in teaching order. */
export function getLessonsForUnit(unitId: string): Lesson[] {
  return lessons
    .filter((lesson) => lesson.unitId === unitId)
    .sort((a, b) => a.order - b.order);
}

/** Every vocabulary word in a unit — used by the vocabulary review screen. */
export function getVocabularyForUnit(unitId: string) {
  return getLessonsForUnit(unitId).flatMap((lesson) => lesson.vocabulary);
}
