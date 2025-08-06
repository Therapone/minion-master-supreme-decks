// Script to download real card images from Minion Masters Wiki
const https = require('https');
const fs = require('fs');
const path = require('path');

// Extract card links from the wiki category page
const cardLinks = [
  'A%27Zog,_Voidfiend_of_Shars%27Rakk',
  'A.I.M._Bot',
  'Adventuring_Party',
  'Akinlep%27s_Gong_of_Pestilence',
  'An%27Kahesh,_Desert%27s_Doom',
  'Annihilator',
  'Arcane_Barrage',
  'Arcane_Bolt',
  'Arcane_Golem',
  'Arcane_Missiles',
  'Arcane_Ring',
  'Ardent_Aegis',
  'Armored_Escort',
  'Assassin',
  'AtG_Drone_x8',
  'Bahra_the_Witchwolf',
  'Banner_Man',
  'Bats_Bats_Bats!',
  'Battle_Shi-Hou',
  'Bazooka_Scrat',
  'Beam_of_DOOM!',
  'Bearvalanche',
  'Bearzerker',
  'Black_Hole',
  'Bladestar',
  'Blast_Entry',
  'Blastmancer',
  'Blind_Date',
  'Blood_Imps',
  'Blue_Golem',
  'Book_of_the_Dead',
  'Boom_Buggy',
  'Boomer',
  'Border_Patrol',
  'Bounce_Berry_Flingers',
  'Bounty_Sniper',
  'Bridge_Buddies',
  'Bridge_Shrine',
  'Brother_of_the_Burning_Fist',
  'Brothers_of_Light',
  'Brothers_of_the_Void',
  'Brutish_Betrayer',
  'Burn_The_Bridge',
  'Caber_Tosser',
  'Caeleth_Dawnhammer',
  'Caged_Prowler',
  'Call_To_Arms',
  'Cannon_Roller',
  'Chain_Gang',
  'Chain_Lightning',
  'Cheese_Date',
  'Chief_Ice_Breaker_Bolf',
  'Chisma_BOOMSTICK',
  'City_Watch',
  'Clear_Skies',
  'Cleaver',
  'Coax_the_Diplomancer',
  'Colossus',
  'Combustion',
  'Commander_Azali',
  'Corpse_Explosion',
  'Cowardly_Imps',
  'Crakgul_Doomcleaver',
  'Crossbow_Club_House',
  'Crossbow_Dudes',
  'Crossbow_Guild',
  'Crossbow_Trap',
  'Crystal_Arcanist',
  'Crystal_Archers',
  'Crystal_Construct',
  'Crystal_Sentry',
  'Cursebearer',
  'Cursed_Fireball',
  'Daggerfall'
  // ... Add all other card links here
];

// Function to download image from URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to extract image URL from card page
async function getCardImageUrl(cardName) {
  return new Promise((resolve, reject) => {
    const url = `https://minionmasters.fandom.com/wiki/${cardName}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Look for the card image in the page
        const imageRegex = /src="([^"]*\.(?:png|jpg|jpeg))[^"]*"/gi;
        const matches = data.match(imageRegex);
        
        if (matches) {
          // Find the actual card image (usually the largest or main image)
          for (const match of matches) {
            const srcMatch = match.match(/src="([^"]*)"/);
            if (srcMatch && srcMatch[1]) {
              let imageUrl = srcMatch[1];
              // Convert relative URLs to absolute URLs
              if (imageUrl.startsWith('//')) {
                imageUrl = 'https:' + imageUrl;
              } else if (imageUrl.startsWith('/')) {
                imageUrl = 'https://minionmasters.fandom.com' + imageUrl;
              }
              
              // Check if it looks like a card image
              if (imageUrl.includes('static.wikia') || imageUrl.includes('fandom.com')) {
                resolve(imageUrl);
                return;
              }
            }
          }
        }
        
        reject(new Error('No image found for ' + cardName));
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to convert card name to filename
function nameToFilename(name) {
  return name.toLowerCase()
    .replace(/%27/g, '')  // Remove URL encoded apostrophes
    .replace(/%21/g, '')  // Remove URL encoded exclamation marks
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Main download function
async function downloadAllCardImages() {
  const outputDir = 'src/assets/cards';
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log(`Starting download of ${cardLinks.length} card images...`);
  
  for (let i = 0; i < cardLinks.length; i++) {
    const cardLink = cardLinks[i];
    const filename = nameToFilename(cardLink) + '.png';
    const filepath = path.join(outputDir, filename);
    
    try {
      console.log(`[${i + 1}/${cardLinks.length}] Downloading ${cardLink}...`);
      
      const imageUrl = await getCardImageUrl(cardLink);
      await downloadImage(imageUrl, filepath);
      
      console.log(`✓ Downloaded: ${filename}`);
      
      // Add a small delay to be respectful to the server
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.log(`✗ Failed to download ${cardLink}: ${error.message}`);
    }
  }
  
  console.log('Download complete!');
}

// Run the download
if (require.main === module) {
  downloadAllCardImages().catch(console.error);
}

module.exports = { downloadAllCardImages };