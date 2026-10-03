export const manifestoHref = "/about";

export const mailchimpAction =
  "https://bodyandcrown.us18.list-manage.com/subscribe/post?u=9810b14e97af6e0d4580f1414&id=43908ba235&f_id=00b3abe6f0";
export const mailchimpHoneypotName = "b_9810b14e97af6e0d4580f1414_43908ba235";

export const navLinks = [
  { href: "/meet-crownie", label: "Meet Crownie" },
  { href: "/philosophy", label: "Our Philosophy" },
  { href: manifestoHref, label: "Manifesto" },
];

export type Speaker = "Her" | "Crownie";

export const sampleConversation: { speaker: Speaker; text: string }[] = [
  { speaker: "Her", text: "I'm so tired. But I feel guilty even saying it." },
  {
    speaker: "Crownie",
    text: "“Come, sit with me a moment. Tired isn't a confession. It's your body telling a truth you've been too busy to hear. You've carried everyone. Who has been carrying you?”",
  },
  { speaker: "Her", text: "No one. I'm used to it." },
  {
    speaker: "Crownie",
    text: "“I know. And being used to it is just a quieter way of saying worn thin. You don't have to set it all down tonight. Place one thing on the floor beside you. We can begin there.”",
  },
];

export const pathways = [
  {
    title: "With Yourself",
    description: "Crownie, reflection, breath, and grounding. Quiet ways back to you.",
  },
  {
    title: "With Each Other",
    description: "Community and gatherings. Healing happens in belonging, not alone.",
  },
  {
    title: "With the World",
    description:
      "Nature, culture, and shared experiences. Wellness you step outside to feel.",
  },
];

export const beliefs = [
  "Healing should feel like home.",
  "Culture is medicine.",
  "Community saves lives.",
  "Joy belongs in wellness.",
  "People don't need to be fixed.",
  "They deserve spaces where they can reconnect with themselves.",
];

export const faqs = [
  {
    question: "What is Body & Crown?",
    answer:
      "Body & Crown is an emotional wellness ecosystem for women who carry the world. A growing place to reconnect with yourself, your community, and the world around you. Crownie, a warm companion, is the first you meet inside it. Not therapy, not fitness. A place to come home to yourself.",
  },
  {
    question: "Is this therapy?",
    answer:
      "No. Body & Crown is not therapy and does not diagnose or treat mental-health conditions. It offers supportive wellness tools: guided reflection, grounding, breath, and gentle presence. If you are in crisis, please reach out to a licensed mental-health professional or call or text 988 (US) for immediate support.",
  },
  {
    question: "Is the space open yet?",
    answer:
      "Crownie is already alive. A founding circle of women is inside right now, shaping her as she grows. Crown Reset, the seven-day return, opens soon, and access widens season by season. Leave your name above and you'll be among the next women welcomed in. ♛",
  },
];

export const manifestoStatements = [
  {
    statement: "You do not need to be fixed.",
    supporting:
      "You were never broken. You are a whole person who has carried more than any one person should, for longer than anyone thought to notice. That is not a flaw to repair. It is a weight to set down.",
  },
  {
    statement: "Healing is a returning, not a becoming.",
    supporting:
      "It is not about turning into someone new or better or more acceptable. It is about finding your way back to the person you have always been, underneath everything you have carried for everyone else.",
  },
  {
    statement: "Community is medicine.",
    supporting:
      "No one was ever meant to hold it all alone. We heal in the company of people who see us, who make room for us, who remind us we belong before we have proven a single thing.",
  },
  {
    statement: "Culture is medicine.",
    supporting:
      "The languages, the songs, the food, the sayings passed down at kitchen tables. These are not decoration on the path to wellness. They are part of the cure. To be met in the voice of home is its own kind of healing.",
  },
  {
    statement: "Joy belongs in wellness.",
    supporting:
      "Rest is not a reward you earn after you break. It is something you deserve long before. Laughter, celebration, music, and ease are not distractions from the work. They are the work.",
  },
  {
    statement: "Boundaries are a form of care.",
    supporting:
      "Saying no to what drains you is how you say yes to your own life. A boundary is not a wall against the world. It is a door you finally get to hold the key to.",
  },
  {
    statement: "Technology should make you feel more human, not less.",
    supporting:
      "A tool is only worth building if it brings you closer to yourself and to each other. It should feel like compassion, never a transaction, and it should always lead you back toward real, human connection.",
  },
  {
    statement: "Wellness belongs in ordinary days.",
    supporting:
      "Not saved for retreats or reserved for emergencies. Woven into the morning, the long commute, the hard night, and the quiet moment when you finally let your shoulders down.",
  },
  {
    statement: "Everyone deserves a place to feel seen, safe, and supported.",
    supporting:
      "Exactly as you are. Wherever you are on the path. Whether this is your first step or your thousandth, there is room for you here.",
  },
  {
    statement: "Healing is personal, and rarely a straight line.",
    supporting:
      "Some days you rise. Some days you rest. Some days you simply hold steady. All of it counts. All of it is the work.",
  },
];

export type ChatMessage = {
  id: number;
  speaker: Speaker;
  text: string;
};

export const initialChatMessages: ChatMessage[] = [
  {
    id: 1,
    speaker: "Her",
    text: "I'm so tired. But I feel guilty even saying it.",
  },
  {
    id: 2,
    speaker: "Crownie",
    text: "Come, sit with me a moment. Tired isn't a confession. It's your body telling a truth you've been too busy to hear. You've carried everyone. Who has been carrying you?",
  },
];

// Placeholder replies until Crownie is wired to a real backend.
export const crownieDemoResponses = [
  "I know. And being used to it is just a quieter way of saying worn thin. You don't have to set it all down tonight. Place one thing on the floor beside you. We can begin there.",
  "Come, sit with me a moment. Tired isn't a confession. It's your body telling a truth you've been too busy to hear. You've carried everyone. Who has been carrying you?",
];
