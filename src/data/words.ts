export interface Word {
  word: string;
  definition: string;
}

export interface Category {
  name: string;
  words: Word[];
  isCustom?: boolean;
}

export const categories: Category[] = [
  {
    name: "Animals",
    words: [
      { word: "giraffe", definition: "A tall African mammal with a very long neck" },
      { word: "penguin", definition: "A flightless aquatic bird found in the Southern Hemisphere" },
      { word: "elephant", definition: "A very large plant-eating mammal with a trunk" },
      { word: "leopard", definition: "A large cat with spots, native to Africa and Asia" },
      { word: "dolphin", definition: "An intelligent aquatic mammal known for its playful behavior" }
    ]
  },
  {
    name: "Foods",
    words: [
      { word: "broccoli", definition: "A green vegetable with a thick central stem and dense flower head" },
      { word: "spaghetti", definition: "Long, thin pasta made from wheat flour" },
      { word: "avocado", definition: "A pear-shaped fruit with a rough dark green skin" },
      { word: "chocolate", definition: "A sweet food made from roasted and ground cacao seeds" },
      { word: "sandwich", definition: "Food items placed between slices of bread" }
    ]
  },
  {
    name: "Countries",
    words: [
      { word: "australia", definition: "The smallest continent and a country known for unique wildlife" },
      { word: "brazil", definition: "The largest country in South America" },
      { word: "canada", definition: "The second largest country by total area" },
      { word: "egypt", definition: "A country known for its ancient pyramids and pharaohs" },
      { word: "france", definition: "A country in Western Europe known for the Eiffel Tower" }
    ]
  },
  {
    name: "Science",
    words: [
      { word: "molecule", definition: "A group of atoms bonded together" },
      { word: "gravity", definition: "The force that attracts objects toward each other" },
      { word: "oxygen", definition: "A chemical element essential for most life forms" },
      { word: "nucleus", definition: "The central part of an atom or cell" },
      { word: "planet", definition: "A celestial body that orbits a star" }
    ]
  },
  {
    name: "Sports",
    words: [
      { word: "basketball", definition: "A game played with a round ball and elevated hoop" },
      { word: "tennis", definition: "A racket sport played on a rectangular court" },
      { word: "swimming", definition: "Moving through water using body movements" },
      { word: "volleyball", definition: "A team sport where players hit a ball over a net" },
      { word: "soccer", definition: "A sport played with a round ball kicked between teams" }
    ]
  },
  {
    name: "Technology",
    words: [
      { word: "computer", definition: "An electronic device for processing information" },
      { word: "internet", definition: "A global network connecting millions of computers" },
      { word: "software", definition: "Programs and operating information used by a computer" },
      { word: "bluetooth", definition: "Wireless technology for exchanging data over short distances" },
      { word: "keyboard", definition: "A panel of keys for operating a computer" }
    ]
  },
  {
    name: "Nature",
    words: [
      { word: "mountain", definition: "A large natural elevation of the earth's surface" },
      { word: "waterfall", definition: "A cascade of water falling from a height" },
      { word: "forest", definition: "A large area covered with trees and undergrowth" },
      { word: "volcano", definition: "A mountain or hill with a crater or vent" },
      { word: "desert", definition: "A barren area of landscape with little precipitation" }
    ]
  },
  {
    name: "Occupations",
    words: [
      { word: "teacher", definition: "A person who helps others to acquire knowledge" },
      { word: "doctor", definition: "A qualified practitioner of medicine" },
      { word: "architect", definition: "A person who designs buildings" },
      { word: "pilot", definition: "A person who operates an aircraft" },
      { word: "chef", definition: "A professional cook in a restaurant" }
    ]
  },
  {
    name: "Music",
    words: [
      { word: "guitar", definition: "A stringed musical instrument with a fretted fingerboard" },
      { word: "piano", definition: "A large keyboard musical instrument" },
      { word: "violin", definition: "A bowed stringed instrument with four strings" },
      { word: "trumpet", definition: "A brass musical instrument with a flared bell" },
      { word: "drums", definition: "A percussion instrument played with sticks or hands" }
    ]
  },
  {
    name: "Weather",
    words: [
      { word: "thunder", definition: "The loud rumbling sound that follows lightning" },
      { word: "rainbow", definition: "An arch of colors visible in the sky" },
      { word: "blizzard", definition: "A severe snowstorm with high winds" },
      { word: "hurricane", definition: "A tropical cyclone with strong winds" },
      { word: "sunshine", definition: "Direct light and warmth from the sun" }
    ]
  }
];