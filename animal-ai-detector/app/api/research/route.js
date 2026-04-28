import { NextResponse } from 'next/server';

const RESEARCH_DATABASE = {
  animals: [
    {
      id: 'panthera-leo',
      name: 'Lion',
      scientificName: 'Panthera leo',
      category: 'Mammal',
      habitat: 'Grasslands, Savannas',
      status: 'Vulnerable',
      description: 'The lion is a large cat of the genus Panthera native to Africa and India. It has a muscular, deep-chested body, short, rounded head, round ears, and a hairy tuft at the end of its tail.',
      agriImpact: 'Predatory balance in livestock regions; requires specialized fencing for agricultural protection.',
      agriDetails: {
        affectedCrops: ['Livestock (Cattle, Goats)', 'Poultry'],
        interactionLevel: 'High (Predatory)',
        economicImpact: 'Direct loss of assets; requires high-cost infrastructure investment.',
        mitigation: 'Solar-powered predator-proof bomas, specialized guardian dogs (Anatolian Shepherds), and compensation schemes.'
      }
    },
    {
      id: 'elephas-maximus',
      name: 'Asian Elephant',
      scientificName: 'Elephas maximus',
      category: 'Mammal',
      habitat: 'Forests, Grasslands',
      status: 'Endangered',
      description: 'The Asian elephant is the only extant species of the genus Elephas and is distributed throughout the Indian subcontinent and Southeast Asia.',
      agriImpact: 'Significant impact on crop yields; known for crop-raiding in farms adjacent to forests.',
      agriDetails: {
        affectedCrops: ['Rice', 'Maize', 'Sugarcane', 'Bananas'],
        interactionLevel: 'Severe (Destructive)',
        economicImpact: 'Complete seasonal crop failure in specific zones; infrastructure damage.',
        mitigation: 'Bee-hive fences, chili-rope deterrents, and bio-fencing using non-palatable crops like ginger or lemon grass.'
      }
    },
    {
      id: 'apis-mellifera',
      name: 'Honey Bee',
      scientificName: 'Apis mellifera',
      category: 'Insect',
      habitat: 'Global (excluding polar regions)',
      status: 'Stable',
      description: 'The western honey bee or European honey bee is the most common of the 7-12 species of honey bee worldwide.',
      agriImpact: 'CRITICAL: Responsible for pollinating 70% of the world\'s crops. Essential for global food security.',
      agriDetails: {
        affectedCrops: ['Almonds', 'Apples', 'Blueberries', 'Melons', 'Broccoli'],
        interactionLevel: 'Vital (Symbiotic)',
        economicImpact: '$235–$577 billion USD in annual global food production value.',
        mitigation: 'Habitat preservation, reduction of neonicotinoid pesticides, and diverse floral planting.'
      }
    },
    {
      id: 'oryctolagus-cuniculus',
      name: 'European Rabbit',
      scientificName: 'Oryctolagus cuniculus',
      category: 'Mammal',
      habitat: 'Meadows, Fields',
      status: 'Endangered (in native range)',
      description: 'A small mammal in the family Leporidae. Originally native to the Iberian Peninsula, it has been widely introduced elsewhere.',
      agriImpact: 'High impact on young crops and gardens. Their burrowing can cause soil erosion.',
      agriDetails: {
        affectedCrops: ['Cereals', 'Vegetables', 'Young Trees (Bark)'],
        interactionLevel: 'Moderate (Grazing)',
        economicImpact: 'Reduced yield in early growth stages; erosion damage to machinery pathways.',
        mitigation: 'Exclusion fencing, rabbit-proof tree guards, and habitat manipulation.'
      }
    },
    {
      id: 'sus-scrofa',
      name: 'Wild Boar',
      scientificName: 'Sus scrofa',
      category: 'Mammal',
      habitat: 'Deciduous forests, Steppes',
      status: 'Least Concern',
      description: 'The wild boar, also known as the wild swine or Eurasian wild pig, is a suid native to much of Eurasia and North Africa.',
      agriImpact: 'Extensive damage to root crops, cereals, and vineyards.',
      agriDetails: {
        affectedCrops: ['Maize', 'Potatoes', 'Grapes', 'Wheat'],
        interactionLevel: 'Severe (Tillage/Rooting)',
        economicImpact: 'Direct consumption and physical destruction of fields; disease vector risks.',
        mitigation: 'Electric fencing, acoustic deterrents, and population management via regulated culling.'
      }
    },
    {
      id: 'schistocerca-gregaria',
      name: 'Desert Locust',
      scientificName: 'Schistocerca gregaria',
      category: 'Insect',
      habitat: 'Deserts and semi-arid regions',
      status: 'Stable',
      description: 'The desert locust is a species of locust, a periodic swarming short-horned grasshopper in the family Acrididae.',
      agriImpact: 'DEVASTATING: A single swarm can eat 192 million kilograms of plants per day.',
      agriDetails: {
        affectedCrops: ['All Green Vegetation', 'Cereals', 'Legumes'],
        interactionLevel: 'Catastrophic (Consumption)',
        economicImpact: 'Total region-wide food insecurity; multi-billion dollar recovery costs.',
        mitigation: 'Satellite tracking for early warning, biopesticides (Metarhizium), and rapid response ground units.'
      }
    },
    {
      id: 'cervus-elaphus',
      name: 'Red Deer',
      scientificName: 'Cervus elaphus',
      category: 'Mammal',
      habitat: 'Woodlands, Mountains',
      status: 'Least Concern',
      description: 'The red deer is one of the largest deer species. It inhabits most of Europe, the Caucasus Mountains region, Asia Minor, Iran, and parts of western Asia.',
      agriImpact: 'Damage to forestry through "bark stripping" and grazing on young tree shoots.',
      agriDetails: {
        affectedCrops: ['Forestry (Oak, Pine)', 'Cereals', 'Root Vegetables'],
        interactionLevel: 'Moderate (Browsing)',
        economicImpact: 'Loss of high-value timber; crop yield reduction near forest edges.',
        mitigation: 'Deer-proof fencing, tree shelters, and sustainable forest management.'
      }
    },
    {
      id: 'lumbricina',
      name: 'Earthworm',
      scientificName: 'Lumbricina',
      category: 'Annelid',
      habitat: 'Soil (Global)',
      status: 'Common',
      description: 'Earthworms are terrestrial invertebrates that play a crucial role in soil health and nutrient cycling.',
      agriImpact: 'BENEFICIAL: Enhances soil fertility by aerating the ground and decomposing organic matter.',
      agriDetails: {
        affectedCrops: ['All Soil-Based Crops'],
        interactionLevel: 'High (Beneficial)',
        economicImpact: 'Significantly reduces fertilizer costs; improves water retention and drainage.',
        mitigation: 'Promote no-till farming, cover cropping, and organic matter application to sustain populations.'
      }
    }
  ],
  agriculture: [
    {
      id: 'triticum-aestivum',
      name: 'Wheat',
      type: 'Cereal',
      species: 'Triticum aestivum',
      optimalTemp: '12-25°C',
      soilType: 'Loamy',
      animalPollination: 'Minimal (Wind-pollinated)',
      notes: 'Foundation of global agriculture; susceptible to rust and drought.'
    },
    {
      id: 'oryza-sativa',
      name: 'Rice',
      type: 'Cereal',
      species: 'Oryza sativa',
      optimalTemp: '20-35°C',
      soilType: 'Clay/Loamy (Heavy)',
      animalPollination: 'None',
      notes: 'Requires significant water; vital for Southeast Asian food systems.'
    }
  ]
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase();
  
  if (!query) {
    return NextResponse.json(RESEARCH_DATABASE);
  }

  let results = {
    animals: RESEARCH_DATABASE.animals.filter(a => 
      a.name.toLowerCase().includes(query) || 
      a.scientificName.toLowerCase().includes(query) ||
      a.description.toLowerCase().includes(query)
    ),
    agriculture: RESEARCH_DATABASE.agriculture.filter(i => 
      i.name.toLowerCase().includes(query) || 
      i.species.toLowerCase().includes(query)
    )
  };

  if (results.animals.length === 0 && results.agriculture.length === 0) {
    try {
      const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`, {
        headers: {
          'User-Agent': 'AnimAIDetector/1.0 (contact@animai.io)'
        }
      });
      
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        if (wikiData.title && wikiData.extract) {
          results.animals.push({
            id: `wiki-${wikiData.pageid}`,
            name: wikiData.title,
            scientificName: wikiData.description || 'Global Taxonomy Database',
            category: 'External Registry',
            habitat: 'Global Matrix',
            status: 'Data Retrieved',
            description: wikiData.extract,
            agriImpact: 'Detailed agricultural intersection data not available in public Wikipedia summary.',
            imageUrl: wikiData.thumbnail?.source || null
          });
        }
      }
    } catch (e) {
      console.error('Wikipedia deep search failed:', e);
    }
  }

  return NextResponse.json(results);
}
