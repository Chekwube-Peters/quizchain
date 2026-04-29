import { QuizCategory, Difficulty, Question } from "@/types";

const CATEGORY_PROMPTS: Record<QuizCategory, string> = {
  BLOCKCHAIN:
    "blockchain technology, DeFi, consensus mechanisms, smart contracts, Layer 1 and Layer 2 networks, NFTs, DAOs, and crypto protocols",
  ROOTSTOCK:
    "Rootstock (RSK) blockchain, RBTC, RSK smart contracts, the RSK token bridge, RSK ecosystem, Rootstock's merge mining, and RSK DeFi protocols",
  BITCOIN:
    "Bitcoin protocol, Bitcoin mining, Lightning Network, Bitcoin wallets, Bitcoin history, Satoshi Nakamoto, Bitcoin halvings, and BTC transactions",
  BIOLOGY:
    "cell biology, genetics, evolution, ecology, human anatomy, microbiology, photosynthesis, and biochemistry",
  SPORTS:
    "football (soccer), basketball, tennis, cricket, Formula 1, Olympic games, sports history, and famous athletes",
  HISTORY:
    "world history, ancient civilizations, World Wars, major revolutions, famous historical figures, empires, and historical events",
  MOVIES:
    "film history, famous directors, Oscar-winning films, movie characters, cinema techniques, cult classics, and box office records",
  RELIGION:
    "world religions including Christianity, Islam, Judaism, Hinduism, Buddhism, religious philosophy, sacred texts, and religious history",
  CUSTOM: "",
};

// Built-in question bank — used when no API keys are configured or as fallback
const QUESTION_BANK: Record<QuizCategory, Omit<Question, "id" | "order">[]> = {
  BLOCKCHAIN: [
    { text: "What is the primary purpose of a blockchain?", options: ["Centralized data storage", "Immutable distributed ledger", "Email encryption", "File compression"], correctIndex: 1, explanation: "A blockchain is a distributed ledger that records transactions across many computers so they can't be altered retroactively.", points: 1000, timeLimit: 30 },
    { text: "What consensus mechanism does Ethereum currently use?", options: ["Proof of Work", "Proof of Stake", "Delegated Proof of Stake", "Proof of Authority"], correctIndex: 1, explanation: "Ethereum switched to Proof of Stake via 'The Merge' in September 2022.", points: 1000, timeLimit: 30 },
    { text: "What does 'DeFi' stand for?", options: ["Digital Finance", "Decentralized Finance", "Distributed Fiat", "Derivative Finance"], correctIndex: 1, explanation: "DeFi (Decentralized Finance) refers to financial services built on blockchain networks without traditional intermediaries.", points: 1000, timeLimit: 25 },
    { text: "What is a smart contract?", options: ["A legal document on a computer", "Self-executing code stored on a blockchain", "An AI trading bot", "A cryptocurrency wallet"], correctIndex: 1, explanation: "Smart contracts are self-executing programs stored on a blockchain that automatically enforce agreement terms.", points: 1000, timeLimit: 30 },
    { text: "What is an NFT?", options: ["New Financial Token", "Non-Fungible Token", "Network File Transfer", "Node Framework Tool"], correctIndex: 1, explanation: "NFT stands for Non-Fungible Token — a unique digital asset verified using blockchain technology.", points: 1000, timeLimit: 25 },
    { text: "What is a DAO?", options: ["Digital Asset Organization", "Decentralized Autonomous Organization", "Distributed Algorithm Output", "Data Access Object"], correctIndex: 1, explanation: "A DAO (Decentralized Autonomous Organization) is an organization governed by smart contracts and token holders.", points: 1000, timeLimit: 30 },
    { text: "What is the Ethereum Virtual Machine (EVM)?", options: ["A cloud server for Ethereum", "A runtime environment for smart contracts", "An Ethereum mining tool", "A hardware wallet"], correctIndex: 1, explanation: "The EVM is a computation engine that executes smart contracts on the Ethereum network.", points: 1000, timeLimit: 25 },
    { text: "What is a Layer 2 solution?", options: ["A second blockchain layer for scalability", "A backup blockchain", "A second wallet type", "A two-factor auth system"], correctIndex: 0, explanation: "Layer 2 solutions are protocols built on top of Layer 1 blockchains to increase transaction throughput and reduce fees.", points: 1000, timeLimit: 30 },
    { text: "What is 'gas' in the context of Ethereum?", options: ["A type of cryptocurrency", "A fee for processing transactions", "A consensus vote", "A mining reward"], correctIndex: 1, explanation: "Gas is the fee required to execute transactions or smart contracts on the Ethereum network.", points: 1000, timeLimit: 25 },
    { text: "Which of these is NOT a consensus mechanism?", options: ["Proof of Work", "Proof of Stake", "Proof of History", "Proof of Download"], correctIndex: 3, explanation: "Proof of Download is not a consensus mechanism. PoW, PoS, and PoH (used by Solana) are all real consensus mechanisms.", points: 1000, timeLimit: 25 },
    { text: "What does 'immutable' mean in blockchain?", options: ["Data can be changed anytime", "Data cannot be altered once recorded", "Data is encrypted", "Data is private"], correctIndex: 1, explanation: "Immutability means that once data is recorded on the blockchain, it cannot be changed or deleted.", points: 1000, timeLimit: 30 },
    { text: "What is the 51% attack?", options: ["Stealing 51% of funds", "Controlling 51% of network hash rate", "Voting 51% yes on a proposal", "51 nodes going offline"], correctIndex: 1, explanation: "A 51% attack occurs when a single entity gains control of more than 50% of a blockchain's mining power.", points: 1000, timeLimit: 25 },
    { text: "What is a blockchain oracle?", options: ["A blockchain prediction market", "A service connecting blockchains to real-world data", "A blockchain founder", "A node validator"], correctIndex: 1, explanation: "Oracles bridge the gap between blockchains and the real world by providing external data to smart contracts.", points: 1000, timeLimit: 30 },
    { text: "What is 'staking' in blockchain?", options: ["Hacking a blockchain", "Locking tokens to support network security", "Creating new tokens", "Selling NFTs"], correctIndex: 1, explanation: "Staking involves locking cryptocurrency in a wallet to support network operations and earn rewards in return.", points: 1000, timeLimit: 25 },
    { text: "What is a hard fork?", options: ["A disagreement among developers", "A permanent divergence in the blockchain protocol", "A wallet backup", "A mining pool split"], correctIndex: 1, explanation: "A hard fork is a radical protocol change that creates a permanent divergence from the previous blockchain version.", points: 1000, timeLimit: 30 },
  ],

  ROOTSTOCK: [
    { text: "What is Rootstock (RSK)?", options: ["A Bitcoin mining pool", "A smart contract platform secured by Bitcoin", "An Ethereum fork", "A hardware wallet brand"], correctIndex: 1, explanation: "Rootstock (RSK) is an open-source smart contract platform secured by Bitcoin's network through merge mining.", points: 1000, timeLimit: 30 },
    { text: "What is RBTC?", options: ["A new cryptocurrency", "The native currency of Rootstock pegged to BTC", "A Rootstock token standard", "A stablecoin"], correctIndex: 1, explanation: "RBTC is Rootstock's native currency, pegged 1:1 with Bitcoin and used to pay for smart contract execution.", points: 1000, timeLimit: 25 },
    { text: "How does Rootstock achieve security?", options: ["Proof of Stake", "Merge mining with Bitcoin", "Its own miners", "Delegated validators"], correctIndex: 1, explanation: "Rootstock uses merge mining, allowing Bitcoin miners to simultaneously mine both Bitcoin and Rootstock.", points: 1000, timeLimit: 30 },
    { text: "Is Rootstock EVM-compatible?", options: ["No", "Yes, fully compatible", "Partially compatible", "Only for DeFi"], correctIndex: 1, explanation: "Rootstock is fully EVM-compatible, meaning Ethereum smart contracts can run on Rootstock with minimal changes.", points: 1000, timeLimit: 25 },
    { text: "What is the Rootstock Bridge?", options: ["A physical infrastructure project", "A protocol to transfer BTC to RBTC", "A cross-chain DEX", "An RSK governance mechanism"], correctIndex: 1, explanation: "The Rootstock Bridge is a two-way peg allowing users to convert BTC into RBTC for use on the Rootstock network.", points: 1000, timeLimit: 30 },
    { text: "What is the maximum TPS (transactions per second) of Rootstock?", options: ["~7 TPS", "~100 TPS", "~10,000 TPS", "~400 TPS"], correctIndex: 1, explanation: "Rootstock processes approximately 100 transactions per second, significantly more than Bitcoin's ~7 TPS.", points: 1000, timeLimit: 25 },
    { text: "What programming language is used for Rootstock smart contracts?", options: ["Rust", "Solidity", "Python", "Go"], correctIndex: 1, explanation: "Rootstock smart contracts are written in Solidity, the same language used for Ethereum smart contracts.", points: 1000, timeLimit: 30 },
    { text: "What does 'merge mining' mean?", options: ["Combining two mining pools", "Mining two blockchains simultaneously with the same work", "Mining on a GPU and CPU together", "A type of staking"], correctIndex: 1, explanation: "Merge mining allows miners to mine two separate cryptocurrencies simultaneously without extra computational work.", points: 1000, timeLimit: 25 },
    { text: "What is the Rootstock block time?", options: ["10 minutes", "30 seconds", "1 minute", "5 minutes"], correctIndex: 1, explanation: "Rootstock has a ~30 second block time, much faster than Bitcoin's 10 minutes.", points: 1000, timeLimit: 30 },
    { text: "Who created Rootstock?", options: ["Vitalik Buterin", "IOV Labs (formerly RSK Labs)", "Satoshi Nakamoto", "Binance"], correctIndex: 1, explanation: "Rootstock was created by IOV Labs (previously RSK Labs), founded by Diego Gutierrez Zaldivar.", points: 1000, timeLimit: 25 },
    { text: "What is RIF (Rootstock Infrastructure Framework)?", options: ["A Rootstock node type", "A suite of open-source services on Rootstock", "A token standard", "A stablecoin protocol"], correctIndex: 1, explanation: "RIF is a suite of open and decentralized infrastructure services built on top of the Rootstock network.", points: 1000, timeLimit: 30 },
    { text: "What is the ratio of RBTC to BTC?", options: ["10:1", "1:1", "1:100", "0.01:1"], correctIndex: 1, explanation: "RBTC maintains a 1:1 peg with Bitcoin through the two-way peg bridge mechanism.", points: 1000, timeLimit: 25 },
    { text: "Which consensus does Rootstock use for finality?", options: ["Pure PoW", "PoS with validators", "DECOR+ protocol", "Tendermint"], correctIndex: 2, explanation: "Rootstock uses the DECOR+ protocol, an extension to Nakamoto consensus that reduces uncle blocks.", points: 1000, timeLimit: 30 },
    { text: "Can Ethereum wallets be used on Rootstock?", options: ["No, separate wallets required", "Yes, same address format", "Only MetaMask", "Only hardware wallets"], correctIndex: 1, explanation: "Rootstock uses the same address format as Ethereum, so MetaMask and other Ethereum wallets work natively.", points: 1000, timeLimit: 25 },
    { text: "What percentage of Bitcoin's hash rate secures Rootstock?", options: ["~10%", "~30%", "~60%", "~90%"], correctIndex: 2, explanation: "Over 60% of Bitcoin's mining hash rate also secures the Rootstock network through merge mining.", points: 1000, timeLimit: 30 },
  ],

  BITCOIN: [
    { text: "Who created Bitcoin?", options: ["Vitalik Buterin", "Satoshi Nakamoto", "Nick Szabo", "Hal Finney"], correctIndex: 1, explanation: "Bitcoin was created by the pseudonymous Satoshi Nakamoto, who published the whitepaper in October 2008.", points: 1000, timeLimit: 25 },
    { text: "What is the maximum supply of Bitcoin?", options: ["100 million BTC", "21 million BTC", "1 billion BTC", "Unlimited"], correctIndex: 1, explanation: "Bitcoin has a hard-capped supply of 21 million coins, built into its protocol.", points: 1000, timeLimit: 25 },
    { text: "How often does Bitcoin halving occur?", options: ["Every year", "Every 4 years (210,000 blocks)", "Every 2 years", "Every 10 years"], correctIndex: 1, explanation: "Bitcoin halving happens every 210,000 blocks, approximately every 4 years, cutting the block reward in half.", points: 1000, timeLimit: 30 },
    { text: "What is the smallest unit of Bitcoin?", options: ["Millibitcoin", "Satoshi", "Bit", "Microbitcoin"], correctIndex: 1, explanation: "A Satoshi is the smallest unit of Bitcoin: 1 BTC = 100,000,000 Satoshis.", points: 1000, timeLimit: 25 },
    { text: "What consensus mechanism does Bitcoin use?", options: ["Proof of Stake", "Proof of Work", "Delegated PoS", "Proof of Authority"], correctIndex: 1, explanation: "Bitcoin uses Proof of Work (PoW), where miners compete to solve complex mathematical puzzles.", points: 1000, timeLimit: 25 },
    { text: "What is the Lightning Network?", options: ["A Bitcoin competitor", "A Layer 2 payment channel network for fast BTC transactions", "A mining pool", "A Bitcoin wallet"], correctIndex: 1, explanation: "The Lightning Network is a Layer 2 protocol enabling fast, cheap Bitcoin transactions through payment channels.", points: 1000, timeLimit: 30 },
    { text: "What is Bitcoin's average block time?", options: ["1 minute", "5 minutes", "10 minutes", "30 minutes"], correctIndex: 2, explanation: "Bitcoin targets a 10-minute block time, adjusted automatically by the difficulty algorithm.", points: 1000, timeLimit: 25 },
    { text: "In what year was the Bitcoin whitepaper published?", options: ["2006", "2007", "2008", "2009"], correctIndex: 2, explanation: "Satoshi Nakamoto published the Bitcoin whitepaper 'Bitcoin: A Peer-to-Peer Electronic Cash System' in October 2008.", points: 1000, timeLimit: 25 },
    { text: "What is a Bitcoin UTXO?", options: ["An unspent transaction output", "A Bitcoin user token", "An upgrade transaction order", "A unified transaction object"], correctIndex: 0, explanation: "UTXO (Unspent Transaction Output) is the fundamental building block of Bitcoin's accounting model.", points: 1000, timeLimit: 30 },
    { text: "What was the price of the famous 'Bitcoin Pizza' transaction?", options: ["100 BTC", "1,000 BTC", "10,000 BTC", "50,000 BTC"], correctIndex: 2, explanation: "On May 22, 2010, Laszlo Hanyecz paid 10,000 BTC for two pizzas — the first real-world Bitcoin transaction.", points: 1000, timeLimit: 25 },
    { text: "What is the Bitcoin Genesis Block?", options: ["The first block ever mined", "The biggest Bitcoin block", "Satoshi's wallet", "The mining algorithm"], correctIndex: 0, explanation: "The Genesis Block (Block 0) was mined by Satoshi Nakamoto on January 3, 2009, launching the Bitcoin network.", points: 1000, timeLimit: 25 },
    { text: "What is SegWit?", options: ["Segregated Witness — a protocol upgrade to fix transaction malleability", "A Bitcoin miner brand", "A type of Bitcoin wallet", "A mining pool"], correctIndex: 0, explanation: "SegWit (Segregated Witness) is a Bitcoin protocol upgrade that fixes transaction malleability and increases block capacity.", points: 1000, timeLimit: 30 },
    { text: "What is the current Bitcoin block reward (post-2024 halving)?", options: ["6.25 BTC", "3.125 BTC", "1.5625 BTC", "12.5 BTC"], correctIndex: 1, explanation: "After the April 2024 halving, the Bitcoin block reward dropped from 6.25 BTC to 3.125 BTC.", points: 1000, timeLimit: 25 },
    { text: "What is a Bitcoin node?", options: ["A mining machine", "A computer that validates transactions and stores the full blockchain", "A Bitcoin wallet", "A trading bot"], correctIndex: 1, explanation: "A Bitcoin node is any computer that participates in the Bitcoin network by storing and validating the blockchain.", points: 1000, timeLimit: 30 },
    { text: "What does HODL mean in crypto culture?", options: ["Hold On for Dear Life (buy and hold)", "A type of trade order", "Hash Output Digital Ledger", "High Order Data Layer"], correctIndex: 0, explanation: "HODL originated from a misspelling of 'hold' in a 2013 forum post and became a Bitcoin mantra for long-term holding.", points: 1000, timeLimit: 25 },
  ],

  BIOLOGY: [
    { text: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"], correctIndex: 1, explanation: "The mitochondria produces ATP through cellular respiration, earning its nickname as the 'powerhouse of the cell'.", points: 1000, timeLimit: 25 },
    { text: "What carries genetic information in most organisms?", options: ["RNA", "DNA", "Protein", "Lipids"], correctIndex: 1, explanation: "DNA (deoxyribonucleic acid) is the molecule that carries genetic instructions in most living organisms.", points: 1000, timeLimit: 25 },
    { text: "How many chromosomes do humans have?", options: ["23", "46", "48", "92"], correctIndex: 1, explanation: "Humans have 46 chromosomes arranged in 23 pairs, one set from each parent.", points: 1000, timeLimit: 25 },
    { text: "What process do plants use to make food from sunlight?", options: ["Respiration", "Photosynthesis", "Fermentation", "Osmosis"], correctIndex: 1, explanation: "Photosynthesis converts sunlight, water, and CO₂ into glucose and oxygen in plant chloroplasts.", points: 1000, timeLimit: 25 },
    { text: "What is the basic unit of life?", options: ["Atom", "Organ", "Cell", "Tissue"], correctIndex: 2, explanation: "The cell is the fundamental unit of all living organisms, as established by cell theory.", points: 1000, timeLimit: 25 },
    { text: "Which blood type is the universal donor?", options: ["A+", "B+", "AB+", "O−"], correctIndex: 3, explanation: "O− (O negative) is the universal donor for red blood cells as it lacks A, B, and Rh antigens.", points: 1000, timeLimit: 25 },
    { text: "What is DNA replication?", options: ["Making RNA from DNA", "Copying DNA before cell division", "Making protein from DNA", "Breaking down DNA"], correctIndex: 1, explanation: "DNA replication is the process of duplicating a cell's DNA before division, ensuring each daughter cell gets a complete genome.", points: 1000, timeLimit: 30 },
    { text: "Which organ produces insulin?", options: ["Liver", "Kidney", "Pancreas", "Stomach"], correctIndex: 2, explanation: "Insulin is produced by the beta cells of the islets of Langerhans in the pancreas.", points: 1000, timeLimit: 25 },
    { text: "What is natural selection?", options: ["Humans selecting animals", "Survival and reproduction of better-adapted organisms", "Random genetic mutations", "Planned breeding"], correctIndex: 1, explanation: "Natural selection is the mechanism by which organisms better adapted to their environment tend to survive and reproduce more.", points: 1000, timeLimit: 30 },
    { text: "What is the function of red blood cells?", options: ["Fight infection", "Transport oxygen", "Produce antibodies", "Clot blood"], correctIndex: 1, explanation: "Red blood cells (erythrocytes) carry oxygen from the lungs to body tissues via hemoglobin.", points: 1000, timeLimit: 25 },
    { text: "What is osmosis?", options: ["Movement of solutes across a membrane", "Movement of water across a semipermeable membrane", "Active transport of ions", "Cell digestion"], correctIndex: 1, explanation: "Osmosis is the passive movement of water molecules across a semipermeable membrane from lower to higher solute concentration.", points: 1000, timeLimit: 30 },
    { text: "What is the largest organ in the human body?", options: ["Liver", "Skin", "Brain", "Lungs"], correctIndex: 1, explanation: "The skin is the largest organ of the human body, covering approximately 2 square meters.", points: 1000, timeLimit: 25 },
    { text: "What molecule carries amino acids to the ribosome?", options: ["mRNA", "DNA", "tRNA", "rRNA"], correctIndex: 2, explanation: "Transfer RNA (tRNA) carries specific amino acids to the ribosome during protein synthesis.", points: 1000, timeLimit: 25 },
    { text: "What is the process of cell division called in body cells?", options: ["Meiosis", "Mitosis", "Binary fission", "Budding"], correctIndex: 1, explanation: "Mitosis is cell division in somatic (body) cells, producing two genetically identical daughter cells.", points: 1000, timeLimit: 25 },
    { text: "Which kingdom do mushrooms belong to?", options: ["Plantae", "Protista", "Fungi", "Animalia"], correctIndex: 2, explanation: "Mushrooms belong to the kingdom Fungi, distinct from plants as they cannot photosynthesize.", points: 1000, timeLimit: 25 },
  ],

  SPORTS: [
    { text: "How many players are on a standard soccer team on the field?", options: ["9", "10", "11", "12"], correctIndex: 2, explanation: "A soccer team fields 11 players including the goalkeeper.", points: 1000, timeLimit: 25 },
    { text: "Which country has won the most FIFA World Cups?", options: ["Germany", "Argentina", "Italy", "Brazil"], correctIndex: 3, explanation: "Brazil has won the FIFA World Cup 5 times (1958, 1962, 1970, 1994, 2002).", points: 1000, timeLimit: 25 },
    { text: "How many points is a basketball three-pointer worth?", options: ["1", "2", "3", "4"], correctIndex: 2, explanation: "A shot made from behind the three-point arc counts as 3 points in basketball.", points: 1000, timeLimit: 25 },
    { text: "In tennis, what does 'love' mean?", options: ["A serve fault", "Zero points", "Winning a set", "A tiebreak"], correctIndex: 1, explanation: "In tennis, 'love' means zero points — the score starts at love-love (0-0).", points: 1000, timeLimit: 25 },
    { text: "How many sets does a standard men's Grand Slam tennis match go up to?", options: ["3", "5", "7", "4"], correctIndex: 1, explanation: "Men's Grand Slam matches are best of 5 sets, while women's are best of 3.", points: 1000, timeLimit: 25 },
    { text: "Which sport uses the term 'birdie'?", options: ["Basketball", "Cricket", "Golf", "Tennis"], correctIndex: 2, explanation: "In golf, a birdie is a score of one under par on a hole.", points: 1000, timeLimit: 25 },
    { text: "How many gold medals did Michael Phelps win in his Olympic career?", options: ["18", "20", "23", "25"], correctIndex: 2, explanation: "Michael Phelps won 23 Olympic gold medals — the most by any athlete in history.", points: 1000, timeLimit: 25 },
    { text: "In cricket, how many balls are in an over?", options: ["4", "5", "6", "8"], correctIndex: 2, explanation: "An over in cricket consists of 6 legal deliveries bowled by one bowler.", points: 1000, timeLimit: 25 },
    { text: "Which sport is known as 'the beautiful game'?", options: ["Basketball", "Rugby", "Soccer/Football", "Cricket"], correctIndex: 2, explanation: "Soccer (Association Football) is famously called 'the beautiful game', a phrase popularized by Pelé.", points: 1000, timeLimit: 25 },
    { text: "What does NBA stand for?", options: ["National Baseball Association", "National Basketball Association", "North Basketball Athletics", "National Block Association"], correctIndex: 1, explanation: "NBA stands for the National Basketball Association, founded in 1946.", points: 1000, timeLimit: 25 },
    { text: "How many players are on a volleyball team on the court?", options: ["5", "6", "7", "8"], correctIndex: 1, explanation: "Six players are on the court per team in standard volleyball.", points: 1000, timeLimit: 25 },
    { text: "Which country hosted the 2016 Summer Olympics?", options: ["Japan", "China", "Brazil", "UK"], correctIndex: 2, explanation: "Brazil hosted the 2016 Summer Olympics in Rio de Janeiro.", points: 1000, timeLimit: 25 },
    { text: "In Formula 1, what flag signals the end of the race?", options: ["Red flag", "Yellow flag", "Black flag", "Checkered flag"], correctIndex: 3, explanation: "The checkered (black and white) flag is waved to signal the end of a Formula 1 race.", points: 1000, timeLimit: 25 },
    { text: "How long is a standard marathon?", options: ["26.2 miles / 42.195 km", "25 miles / 40.2 km", "30 km", "50 km"], correctIndex: 0, explanation: "A standard marathon is 26.2 miles or 42.195 kilometers.", points: 1000, timeLimit: 25 },
    { text: "Which player has won the most Grand Slam singles titles in men's tennis?", options: ["Roger Federer", "Rafael Nadal", "Novak Djokovic", "Pete Sampras"], correctIndex: 2, explanation: "Novak Djokovic holds the record for most men's Grand Slam singles titles with 24 (as of 2024).", points: 1000, timeLimit: 25 },
  ],

  HISTORY: [
    { text: "In which year did World War II end?", options: ["1943", "1944", "1945", "1946"], correctIndex: 2, explanation: "World War II ended in 1945 — VE Day (victory in Europe) on May 8 and VJ Day (victory over Japan) on August 15.", points: 1000, timeLimit: 25 },
    { text: "Who was the first President of the United States?", options: ["John Adams", "Thomas Jefferson", "George Washington", "Benjamin Franklin"], correctIndex: 2, explanation: "George Washington served as the first President of the United States from 1789 to 1797.", points: 1000, timeLimit: 25 },
    { text: "In which city did the French Revolution begin?", options: ["Lyon", "Versailles", "Paris", "Marseille"], correctIndex: 2, explanation: "The French Revolution began in Paris in 1789, triggered by the storming of the Bastille on July 14.", points: 1000, timeLimit: 25 },
    { text: "Who built the Great Pyramids of Giza?", options: ["The Romans", "Ancient Egyptians", "The Mesopotamians", "The Greeks"], correctIndex: 1, explanation: "The Great Pyramids were built by the Ancient Egyptians around 2560 BCE as tombs for pharaohs.", points: 1000, timeLimit: 25 },
    { text: "What year did the Berlin Wall fall?", options: ["1987", "1988", "1989", "1990"], correctIndex: 2, explanation: "The Berlin Wall fell on November 9, 1989, symbolizing the end of the Cold War division of Germany.", points: 1000, timeLimit: 25 },
    { text: "Who was Napoleon Bonaparte?", options: ["A French emperor and military commander", "A British general", "A Russian tsar", "A Spanish king"], correctIndex: 0, explanation: "Napoleon Bonaparte was a French military general who became Emperor of the French and conquered much of Europe.", points: 1000, timeLimit: 25 },
    { text: "Which empire was the largest in history by land area?", options: ["Roman Empire", "British Empire", "Mongol Empire", "Ottoman Empire"], correctIndex: 1, explanation: "The British Empire was the largest in history, covering about 24% of Earth's land area at its peak in 1920.", points: 1000, timeLimit: 25 },
    { text: "Who was the first woman to win a Nobel Prize?", options: ["Mother Teresa", "Marie Curie", "Rosa Parks", "Florence Nightingale"], correctIndex: 1, explanation: "Marie Curie won her first Nobel Prize in Physics in 1903 and a second in Chemistry in 1911.", points: 1000, timeLimit: 25 },
    { text: "In what year did Christopher Columbus arrive in the Americas?", options: ["1488", "1490", "1492", "1495"], correctIndex: 2, explanation: "Christopher Columbus arrived in the Americas on October 12, 1492, landing in the Bahamas.", points: 1000, timeLimit: 25 },
    { text: "What ancient wonder stood in Alexandria, Egypt?", options: ["The Colosseum", "The Lighthouse of Alexandria", "The Parthenon", "The Hanging Gardens"], correctIndex: 1, explanation: "The Lighthouse of Alexandria was one of the Seven Wonders of the Ancient World, built around 280 BCE.", points: 1000, timeLimit: 25 },
    { text: "Who was the last Pharaoh of Ancient Egypt?", options: ["Nefertiti", "Cleopatra VII", "Tutankhamun", "Ramesses II"], correctIndex: 1, explanation: "Cleopatra VII was the last active ruler of the Ptolemaic Kingdom of Egypt before Roman conquest in 30 BCE.", points: 1000, timeLimit: 25 },
    { text: "The Cold War was primarily between which two superpowers?", options: ["USA and China", "USA and USSR", "UK and USSR", "France and Germany"], correctIndex: 1, explanation: "The Cold War (1947–1991) was the geopolitical tension between the United States and the Soviet Union.", points: 1000, timeLimit: 25 },
    { text: "In which year did India gain independence from Britain?", options: ["1945", "1946", "1947", "1948"], correctIndex: 2, explanation: "India gained independence from Britain on August 15, 1947.", points: 1000, timeLimit: 25 },
    { text: "Who wrote 'The Art of War'?", options: ["Confucius", "Sun Tzu", "Lao Tzu", "Genghis Khan"], correctIndex: 1, explanation: "Sun Tzu, a Chinese military strategist, wrote 'The Art of War' around the 5th century BC.", points: 1000, timeLimit: 25 },
    { text: "What was the name of the first artificial satellite?", options: ["Explorer 1", "Luna 1", "Sputnik 1", "Apollo 1"], correctIndex: 2, explanation: "Sputnik 1, launched by the Soviet Union on October 4, 1957, was the first artificial satellite.", points: 1000, timeLimit: 25 },
  ],

  MOVIES: [
    { text: "Which film won the first Academy Award for Best Picture?", options: ["Sunrise", "Wings", "The Jazz Singer", "Metropolis"], correctIndex: 1, explanation: "Wings (1927) won the first Academy Award for Best Picture at the 1st Academy Awards ceremony.", points: 1000, timeLimit: 25 },
    { text: "Who directed 'Jurassic Park' (1993)?", options: ["James Cameron", "Steven Spielberg", "George Lucas", "Ron Howard"], correctIndex: 1, explanation: "Steven Spielberg directed Jurassic Park (1993), which became a landmark in CGI filmmaking.", points: 1000, timeLimit: 25 },
    { text: "Which film holds the record for the most Academy Awards (11 wins)?", options: ["Titanic", "The Lord of the Rings: Return of the King", "Ben-Hur", "All of the above"], correctIndex: 3, explanation: "Three films share the record of 11 Oscar wins: Ben-Hur (1959), Titanic (1997), and Return of the King (2003).", points: 1000, timeLimit: 30 },
    { text: "What is the highest-grossing film of all time (not adjusted for inflation)?", options: ["Avatar (2009)", "Avengers: Endgame", "Avatar: The Way of Water", "Titanic"], correctIndex: 0, explanation: "Avatar (2009) is the highest-grossing film of all time at approximately $2.9 billion worldwide.", points: 1000, timeLimit: 25 },
    { text: "Who played the Joker in 'The Dark Knight' (2008)?", options: ["Jared Leto", "Joaquin Phoenix", "Heath Ledger", "Jack Nicholson"], correctIndex: 2, explanation: "Heath Ledger played the Joker in The Dark Knight, winning a posthumous Academy Award for Best Supporting Actor.", points: 1000, timeLimit: 25 },
    { text: "Which quote is from 'Star Wars'?", options: ["I'll be back", "May the Force be with you", "Here's looking at you, kid", "You can't handle the truth"], correctIndex: 1, explanation: "'May the Force be with you' is the iconic phrase from the Star Wars franchise.", points: 1000, timeLimit: 25 },
    { text: "Who directed 'Schindler's List'?", options: ["Martin Scorsese", "Francis Ford Coppola", "Steven Spielberg", "Oliver Stone"], correctIndex: 2, explanation: "Steven Spielberg directed Schindler's List (1993), which won 7 Academy Awards including Best Picture.", points: 1000, timeLimit: 25 },
    { text: "What year was the original 'Star Wars' film released?", options: ["1975", "1977", "1979", "1980"], correctIndex: 1, explanation: "Star Wars (later subtitled 'A New Hope') was released on May 25, 1977.", points: 1000, timeLimit: 25 },
    { text: "Which studio produced the Marvel Cinematic Universe?", options: ["Warner Bros.", "Sony Pictures", "Marvel Studios / Disney", "Universal Pictures"], correctIndex: 2, explanation: "Marvel Studios (owned by Disney since 2009) produces the Marvel Cinematic Universe films.", points: 1000, timeLimit: 25 },
    { text: "Who plays Tony Stark / Iron Man in the MCU?", options: ["Chris Evans", "Chris Hemsworth", "Robert Downey Jr.", "Mark Ruffalo"], correctIndex: 2, explanation: "Robert Downey Jr. played Tony Stark / Iron Man across the MCU from 2008 to 2019.", points: 1000, timeLimit: 25 },
    { text: "What film features the famous line 'You can't handle the truth!'?", options: ["The Godfather", "A Few Good Men", "Goodfellas", "JFK"], correctIndex: 1, explanation: "The line 'You can't handle the truth!' is delivered by Jack Nicholson in A Few Good Men (1992).", points: 1000, timeLimit: 25 },
    { text: "Who directed 'Inception' and 'Interstellar'?", options: ["David Fincher", "Ridley Scott", "Christopher Nolan", "Denis Villeneuve"], correctIndex: 2, explanation: "Christopher Nolan directed both Inception (2010) and Interstellar (2014).", points: 1000, timeLimit: 25 },
    { text: "What is the name of the island in 'Jaws' (1975)?", options: ["Block Island", "Amity Island", "Nantucket", "Martha's Vineyard"], correctIndex: 1, explanation: "Jaws is set on the fictional Amity Island, though it was filmed on Martha's Vineyard.", points: 1000, timeLimit: 25 },
    { text: "Which film is considered the first feature-length animated film?", options: ["Bambi", "Fantasia", "Snow White and the Seven Dwarfs", "Pinocchio"], correctIndex: 2, explanation: "Snow White and the Seven Dwarfs (1937) by Disney is considered the first feature-length animated film.", points: 1000, timeLimit: 25 },
    { text: "What film won the Palme d'Or at Cannes 2019?", options: ["Roma", "Parasite", "1917", "Once Upon a Time in Hollywood"], correctIndex: 1, explanation: "Parasite (Gisaengchung) by Bong Joon-ho won the Palme d'Or and later the Oscar for Best Picture.", points: 1000, timeLimit: 25 },
  ],

  RELIGION: [
    { text: "What is the holy book of Islam?", options: ["The Bible", "The Torah", "The Quran", "The Vedas"], correctIndex: 2, explanation: "The Quran is the central religious text of Islam, believed by Muslims to be revealed to Prophet Muhammad.", points: 1000, timeLimit: 25 },
    { text: "Who is considered the founder of Buddhism?", options: ["Confucius", "Siddhartha Gautama", "Lao Tzu", "Mahavira"], correctIndex: 1, explanation: "Buddhism was founded by Siddhartha Gautama (the Buddha) in the 5th century BCE in ancient India.", points: 1000, timeLimit: 25 },
    { text: "What is the holiest city in Islam?", options: ["Jerusalem", "Medina", "Mecca", "Istanbul"], correctIndex: 2, explanation: "Mecca is the holiest city in Islam and the birthplace of the Prophet Muhammad.", points: 1000, timeLimit: 25 },
    { text: "What are the Four Noble Truths associated with?", options: ["Hinduism", "Christianity", "Buddhism", "Jainism"], correctIndex: 2, explanation: "The Four Noble Truths are the foundational teachings of Buddhism taught by the Buddha.", points: 1000, timeLimit: 25 },
    { text: "What is the sacred text of Hinduism?", options: ["The Quran", "The Vedas and Upanishads", "The Torah", "The Tripitaka"], correctIndex: 1, explanation: "The Vedas and Upanishads are among the oldest and most sacred scriptures of Hinduism.", points: 1000, timeLimit: 25 },
    { text: "How many books are in the Christian Old Testament (Protestant)?", options: ["27", "39", "46", "66"], correctIndex: 1, explanation: "The Protestant Old Testament contains 39 books. The Catholic Old Testament has 46 due to deuterocanonical books.", points: 1000, timeLimit: 25 },
    { text: "What is the holiest site in Judaism?", options: ["The Church of the Holy Sepulchre", "The Western Wall", "The Dome of the Rock", "Temple Mount Mosque"], correctIndex: 1, explanation: "The Western Wall (Wailing Wall) in Jerusalem is the holiest accessible site in Judaism.", points: 1000, timeLimit: 25 },
    { text: "What is the Ramadan?", options: ["An Islamic festival of lights", "The holy month of fasting in Islam", "A Hindu festival", "A pilgrimage to Mecca"], correctIndex: 1, explanation: "Ramadan is the ninth month of the Islamic calendar, observed by Muslims worldwide as a month of fasting and prayer.", points: 1000, timeLimit: 25 },
    { text: "What is Nirvana in Buddhism?", options: ["A state of eternal bliss and liberation from suffering", "Heaven in Christianity", "A Hindu concept of God", "A type of meditation"], correctIndex: 0, explanation: "Nirvana is the ultimate goal in Buddhism — liberation from suffering, desire, and the cycle of rebirth.", points: 1000, timeLimit: 25 },
    { text: "Who is believed to have written most of the New Testament?", options: ["Peter", "John", "Paul (Saul of Tarsus)", "Matthew"], correctIndex: 2, explanation: "The Apostle Paul (formerly Saul of Tarsus) wrote 13 of the 27 books of the New Testament.", points: 1000, timeLimit: 25 },
    { text: "What is the Hajj?", options: ["An Islamic prayer ritual", "The annual pilgrimage to Mecca", "A Muslim holiday", "An Islamic law"], correctIndex: 1, explanation: "Hajj is the annual Islamic pilgrimage to Mecca, Saudi Arabia, and one of the Five Pillars of Islam.", points: 1000, timeLimit: 25 },
    { text: "What is Karma in Hinduism and Buddhism?", options: ["A concept of fate", "The law of cause and effect governing future lives", "A meditation technique", "A type of prayer"], correctIndex: 1, explanation: "Karma is the law of cause and effect — good actions lead to positive outcomes in this life and future rebirths.", points: 1000, timeLimit: 25 },
    { text: "Which religion celebrates Diwali?", options: ["Islam", "Buddhism", "Hinduism (and Jainism, Sikhism)", "Christianity"], correctIndex: 2, explanation: "Diwali is celebrated primarily by Hindus, as well as Jains and Sikhs, symbolizing the triumph of light over darkness.", points: 1000, timeLimit: 25 },
    { text: "What is the Talmud?", options: ["The Jewish prayer book", "The central text of Rabbinic Judaism", "The Jewish Old Testament", "A Jewish holiday"], correctIndex: 1, explanation: "The Talmud is the central text of Rabbinic Judaism containing rabbinical discussions of Jewish law, ethics, and history.", points: 1000, timeLimit: 25 },
    { text: "Who is considered the father of the three Abrahamic religions?", options: ["Moses", "Abraham", "Jesus", "Muhammad"], correctIndex: 1, explanation: "Abraham is considered the common patriarch of Judaism, Christianity, and Islam — the three major Abrahamic faiths.", points: 1000, timeLimit: 25 },
  ],

  CUSTOM: [
    { text: "What is the capital city of Japan?", options: ["Osaka", "Kyoto", "Tokyo", "Hiroshima"], correctIndex: 2, explanation: "Tokyo is the capital and largest city of Japan.", points: 1000, timeLimit: 25 },
    { text: "How many continents are there on Earth?", options: ["5", "6", "7", "8"], correctIndex: 2, explanation: "Earth has 7 continents: Africa, Antarctica, Asia, Australia, Europe, North America, and South America.", points: 1000, timeLimit: 25 },
    { text: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Gl", "Au"], correctIndex: 3, explanation: "Gold's chemical symbol is Au, from the Latin word 'aurum'.", points: 1000, timeLimit: 25 },
    { text: "Which planet is known as the Red Planet?", options: ["Jupiter", "Venus", "Mars", "Saturn"], correctIndex: 2, explanation: "Mars is called the Red Planet due to iron oxide (rust) on its surface.", points: 1000, timeLimit: 25 },
    { text: "What is the speed of light approximately?", options: ["200,000 km/s", "300,000 km/s", "400,000 km/s", "150,000 km/s"], correctIndex: 1, explanation: "Light travels at approximately 299,792 km/s (often rounded to 300,000 km/s) in a vacuum.", points: 1000, timeLimit: 25 },
    { text: "Who painted the Mona Lisa?", options: ["Michelangelo", "Rafael", "Leonardo da Vinci", "Caravaggio"], correctIndex: 2, explanation: "The Mona Lisa was painted by Leonardo da Vinci between approximately 1503 and 1519.", points: 1000, timeLimit: 25 },
    { text: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correctIndex: 3, explanation: "The Pacific Ocean is the largest, covering more area than all of Earth's landmasses combined.", points: 1000, timeLimit: 25 },
    { text: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], correctIndex: 1, explanation: "A hexagon has 6 sides. The prefix 'hexa' means six in Greek.", points: 1000, timeLimit: 25 },
    { text: "What year did the Titanic sink?", options: ["1910", "1912", "1914", "1916"], correctIndex: 1, explanation: "The Titanic sank on April 15, 1912 after striking an iceberg on its maiden voyage.", points: 1000, timeLimit: 25 },
    { text: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Leo Tolstoy"], correctIndex: 2, explanation: "Romeo and Juliet is a tragedy written by William Shakespeare around 1594–1596.", points: 1000, timeLimit: 25 },
    { text: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Quartz"], correctIndex: 2, explanation: "Diamond is the hardest natural material, scoring 10 on the Mohs scale of mineral hardness.", points: 1000, timeLimit: 25 },
    { text: "How many hours are in a week?", options: ["148", "162", "168", "180"], correctIndex: 2, explanation: "A week has 7 days × 24 hours = 168 hours.", points: 1000, timeLimit: 25 },
    { text: "Which element has the atomic number 1?", options: ["Helium", "Hydrogen", "Lithium", "Carbon"], correctIndex: 1, explanation: "Hydrogen has atomic number 1 — it is the lightest and most abundant element in the universe.", points: 1000, timeLimit: 25 },
    { text: "What is the tallest mountain in the world?", options: ["K2", "Kangchenjunga", "Mount Everest", "Lhotse"], correctIndex: 2, explanation: "Mount Everest, in the Himalayas, is the world's highest mountain at 8,848.86 meters above sea level.", points: 1000, timeLimit: 25 },
    { text: "What language has the most native speakers in the world?", options: ["English", "Spanish", "Mandarin Chinese", "Hindi"], correctIndex: 2, explanation: "Mandarin Chinese has the most native speakers with approximately 920 million people.", points: 1000, timeLimit: 25 },
  ],
};

function getFallbackQuestions(
  category: QuizCategory,
  count: number,
  timeLimit: number
): Question[] {
  const pool = QUESTION_BANK[category] || QUESTION_BANK.CUSTOM;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  return selected.map((q, i) => ({ ...q, id: `q_${i + 1}`, order: i + 1, timeLimit }));
}

export async function generateQuizQuestions(
  category: QuizCategory,
  difficulty: Difficulty,
  count: number,
  customTopic?: string,
  timeLimit: number = 30
): Promise<Question[]> {
  const topic =
    category === "CUSTOM" && customTopic
      ? customTopic
      : CATEGORY_PROMPTS[category];

  const difficultyDesc =
    difficulty === "EASY"
      ? "simple, beginner-friendly"
      : difficulty === "MEDIUM"
      ? "moderately challenging"
      : "challenging, expert-level";

  const prompt = `You are a quiz master. Generate exactly ${count} ${difficultyDesc} multiple-choice questions about ${topic}.

Return ONLY a valid JSON array with this exact structure:
[
  {
    "text": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief explanation of why this is correct.",
    "points": 1000,
    "timeLimit": ${timeLimit}
  }
]

Rules:
- Each question must have exactly 4 options
- correctIndex must be 0, 1, 2, or 3
- Questions should be factually accurate
- Mix different aspects of the topic
- Make distractors plausible but clearly wrong
- timeLimit: ${timeLimit} for all questions
- points: 1000 for all
- No duplicate questions
- Return ONLY the JSON array, no other text`;

  // Try Anthropic first
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const message = await client.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 8000,
        messages: [{ role: "user", content: prompt }],
      });

      const content = message.content[0];
      if (content.type === "text") {
        const raw = content.text.trim();
        // Strip markdown code fences if present
        const json = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
        const parsed = JSON.parse(json);
        return parsed.map((q: Omit<Question, "id" | "order">, i: number) => ({
          ...q,
          id: `q_${i + 1}`,
          order: i + 1,
          timeLimit,
        }));
      }
    } catch (err) {
      console.error("Anthropic generation failed, trying fallback:", err);
    }
  }

  // Fallback to OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 8000,
      });

      const text = completion.choices[0].message.content || "{}";
      const parsed = JSON.parse(text);
      const questions = Array.isArray(parsed) ? parsed : parsed.questions || [];
      return questions.map((q: Omit<Question, "id" | "order">, i: number) => ({
        ...q,
        id: `q_${i + 1}`,
        order: i + 1,
        timeLimit,
      }));
    } catch (err) {
      console.error("OpenAI generation failed, using built-in questions:", err);
    }
  }

  // Built-in fallback — always works, no API keys needed
  console.log(`Using built-in question bank for category: ${category}`);
  return getFallbackQuestions(category, count, timeLimit);
}
