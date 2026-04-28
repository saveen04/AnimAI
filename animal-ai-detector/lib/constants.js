export const ANIMAL_DESCRIPTIONS = {
  cat: 'A small domesticated carnivorous mammal with soft fur, retractable claws, and typically kept as a pet.',
  dog: 'A domesticated carnivorous mammal that typically has a long snout, an acute sense of smell, and a barking call.',
  bird: 'A warm-blooded egg-laying vertebrate with feathers, wings, and a beak.',
  horse: 'A large hoofed mammal domesticated for riding and carrying loads.',
  elephant: 'A very large herbivorous mammal with a long trunk, large ears, and tusks.',
  lion: 'A large cat native to Africa, known for its mane and social pride structure.',
  tiger: 'The largest cat species, with distinctive orange coat and black stripes.',
  bear: 'A large heavy mammal with thick fur, walking on the soles of its feet.',
  deer: 'A hoofed grazing or browsing animal with branched bony antlers.',
  rabbit: 'A small mammal with long ears, short tail, and strong hind legs for hopping.',
  squirrel: 'An agile rodent with a bushy tail, often found in trees.',
  fox: 'A carnivorous mammal with a pointed muzzle, bushy tail, and reddish fur.',
  wolf: 'A wild carnivorous mammal related to the dog, living and hunting in packs.',
  monkey: 'A primate with a long tail, typically living in trees in tropical regions.',
  zebra: 'An African wild horse with black-and-white striped coat.',
  giraffe: 'A tall African mammal with a very long neck and legs.',
  cow: 'A large domesticated bovine animal kept for milk or meat.',
  pig: 'An omnivorous domesticated mammal with a snout and curly tail.',
  sheep: 'A domesticated ruminant animal with a thick woolly coat.',
  goat: 'A hardy domesticated ruminant animal with backward-curving horns.',
  default: 'An animal species detected by our AI model.',
};

// Use 127.0.0.1 by default on Windows to avoid IPv6 localhost edge cases.
export const AI_SERVICE_URL =
  process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://127.0.0.1:8000';
