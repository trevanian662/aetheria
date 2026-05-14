// ========== PLAYER DATA ==========
let player = {
    id: null, name: "", email: "", password: "",
    level: 1, exp: 0, gold: 10000, diamond: 0, vip: 0,
    hp: 5000, maxHp: 5000, damage: 550,
    inventory: [], guild: null, firstPurchase: false,
    equipment: { weapon: null, armor: null, ring: null, necklace: null, boots: null, mount: null, pet: null, costume: null, wings: null }
};
let level10GiftClaimed = false;
let currentEnemy = null;
let combatLog = document.getElementById("combatLog");

// ========== DAILY QUESTS ==========
let dailyQuests = {
    lastReset: Date.now(),
    quests: [
        { id: 1, name: "Monster Slayer", desc: "Kill 10 monsters", target: 10, progress: 0, completed: false, claimed: false, rewardExp: 5000, rewardGold: 2000, rewardDiamond: 0 },
        { id: 2, name: "PvP Warrior", desc: "Win 3 PvP matches", target: 3, progress: 0, completed: false, claimed: false, rewardExp: 8000, rewardGold: 3000, rewardDiamond: 1 },
        { id: 3, name: "World Boss Hunter", desc: "Hit World Boss 3 times", target: 3, progress: 0, completed: false, claimed: false, rewardExp: 10000, rewardGold: 5000, rewardDiamond: 2 },
        { id: 4, name: "Gear Up", desc: "Equip 3 items", target: 3, progress: 0, completed: false, claimed: false, rewardExp: 4000, rewardGold: 1500, rewardDiamond: 0 },
        { id: 5, name: "Rich Player", desc: "Spend 5000 Gold", target: 5000, progress: 0, completed: false, claimed: false, rewardExp: 6000, rewardGold: 1000, rewardDiamond: 1 }
    ]
};

// ========== PVP SYSTEM ==========
let pvp = {
    score: 0,
    rank: "Mortal",
    rankIndex: 0,
    wins: 0,
    losses: 0,
    dailyMatches: 0,
    lastReset: Date.now()
};

const rankData = [
    { name: "Mortal", minScore: 0, maxScore: 99, apBonus: 0, icon: "👤" },
    { name: "Guardian", minScore: 100, maxScore: 299, apBonus: 3000, icon: "🛡️" },
    { name: "Virtue", minScore: 300, maxScore: 599, apBonus: 6000, icon: "⚜️" },
    { name: "Dominion", minScore: 600, maxScore: 999, apBonus: 12000, icon: "👑" },
    { name: "Cherubim", minScore: 1000, maxScore: 1499, apBonus: 25000, icon: "✨" },
    { name: "Seraphim", minScore: 1500, maxScore: 2099, apBonus: 50000, icon: "🔥" },
    { name: "Archangel", minScore: 2100, maxScore: 2799, apBonus: 100000, icon: "⚡" },
    { name: "Nephilim", minScore: 2800, maxScore: 3599, apBonus: 200000, icon: "🌟" },
    { name: "Divine", minScore: 3600, maxScore: 4999, apBonus: 350000, icon: "👁️" },
    { name: "Emperor", minScore: 5000, maxScore: Infinity, apBonus: 500000, icon: "👑" }
];

let currentPvPOpponent = null;
let pvpBattleActive = false;

// ========== WORLD BOSS ==========
const worldBosses = [
    { id: 1, name: "Hell Dragon", level: 50, hp: 1000000, attack: 2000, icon: "🐉" },
    { id: 2, name: "Shadow Titan", level: 60, hp: 2000000, attack: 2500, icon: "🗿" },
    { id: 3, name: "Frost Giant King", level: 70, hp: 3500000, attack: 3000, icon: "❄️" },
    { id: 4, name: "Fire Lord", level: 80, hp: 5000000, attack: 3500, icon: "🔥" },
    { id: 5, name: "Ancient Demon King", level: 100, hp: 10000000, attack: 5000, icon: "👑" }
];
let currentWorldBoss = null;
let worldBossCurrentHp = 0;
let worldBossActive = true;
let worldBossDamageRanking = [];
let playerWorldBossDamage = 0;
let playerWorldBossHitsLeft = 3;
let worldBossLastHitReset = Date.now();

// ========== ACHIEVEMENTS ==========
let achievements = {
    list: [
        { id: 1, name: "Monster Hunter", desc: "Kill monsters", type: "kill", target: [10, 100, 1000], progress: 0, tier: 0, apBonus: [500, 2000, 10000], icon: "👹" },
        { id: 2, name: "PvP Champion", desc: "Win PvP matches", type: "pvp_win", target: [5, 25, 100], progress: 0, tier: 0, apBonus: [1000, 5000, 25000], icon: "🏆" },
        { id: 3, name: "World Boss Slayer", desc: "Damage to World Boss", type: "wb_damage", target: [100000, 500000, 2000000], progress: 0, tier: 0, apBonus: [2000, 10000, 50000], icon: "🌍" },
        { id: 4, name: "Gear Master", desc: "Upgrade items", type: "upgrade", target: [5, 25, 100], progress: 0, tier: 0, apBonus: [500, 2500, 12500], icon: "⚙️" },
        { id: 5, name: "Rich Player", desc: "Earn Gold", type: "gold", target: [100000, 500000, 2000000], progress: 0, tier: 0, apBonus: [1000, 5000, 20000], icon: "💰" },
        { id: 6, name: "VIP Elite", desc: "Reach VIP level", type: "vip", target: [1, 2, 3], progress: 0, tier: 0, apBonus: [5000, 15000, 50000], icon: "👑" },
        { id: 7, name: "Guild Leader", desc: "Create or join guild", type: "guild", target: [1, 1, 1], progress: 0, tier: 0, apBonus: [3000, 8000, 20000], icon: "🏰" },
        { id: 8, name: "Item Collector", desc: "Collect rare items", type: "item_rarity", target: [5, 15, 40], progress: 0, tier: 0, apBonus: [1000, 4000, 15000], icon: "🎁" }
    ],
    totalBonusAp: 0
};

// ========== CHAT ==========
let chatMessages = { global: [], guild: [], maxMessages: 50 };

// ========== MAIL ==========
let mails = [];

// ========== FRIENDS ==========
let friends = { list: [], requests: [] };

// ========== CLASS DATA ==========
let playerClass = null;
const classData = {
    Warrior: { name: "Warrior", apBonus: 10000, icon: "⚔️", baseHp: 5500, baseDamage: 600 },
    Guardian: { name: "Guardian", apBonus: 12000, icon: "🛡️", baseHp: 6500, baseDamage: 520 },
    Ranger: { name: "Ranger", apBonus: 8000, icon: "🏹", baseHp: 5000, baseDamage: 580 },
    Wizard: { name: "Wizard", apBonus: 9000, icon: "🔮", baseHp: 4800, baseDamage: 620 },
    Assassin: { name: "Assassin", apBonus: 11000, icon: "🗡️", baseHp: 5200, baseDamage: 640 }
};

// ========== UPGRADE DATA ==========
const upgradeData = {
    1: { chance: 1.00, name: "+1", apBonus: 500 }, 2: { chance: 0.95, name: "+2", apBonus: 550 },
    3: { chance: 0.90, name: "+3", apBonus: 600 }, 4: { chance: 0.85, name: "+4", apBonus: 650 },
    5: { chance: 0.80, name: "+5", apBonus: 700 }, 6: { chance: 0.70, name: "+6", apBonus: 750 },
    7: { chance: 0.60, name: "+7", apBonus: 800 }, 8: { chance: 0.50, name: "+8", apBonus: 850 },
    9: { chance: 0.45, name: "+9", apBonus: 900 }, 10: { chance: 0.40, name: "+10", apBonus: 1000 },
    11: { chance: 0.35, name: "+11", apBonus: 1100 }, 12: { chance: 0.30, name: "+12", apBonus: 1200 },
    13: { chance: 0.25, name: "+13", apBonus: 1300 }, 14: { chance: 0.20, name: "+14", apBonus: 1400 },
    15: { chance: 0.18, name: "+15", apBonus: 1500 }, 16: { chance: 0.15, name: "+16", apBonus: 1600 },
    17: { chance: 0.12, name: "+17", apBonus: 1700 }, 18: { chance: 0.10, name: "+18", apBonus: 1800 },
    19: { chance: 0.08, name: "+19", apBonus: 1900 }, 20: { chance: 0.06, name: "+20", apBonus: 2000 },
    21: { chance: 0.05, name: "+21", apBonus: 2200 }, 22: { chance: 0.04, name: "+22", apBonus: 2400 },
    23: { chance: 0.03, name: "+23", apBonus: 2600 }, 24: { chance: 0.02, name: "+24", apBonus: 2800 },
    25: { chance: 0.01, name: "+25", apBonus: 3000 }
};
let upgradeScrolls = { normal: 0, premium: 0 };
let selectedItemsForSale = [];

// ========== DAILY LOGIN ==========
let dailyLogin = {
    lastLoginDate: null,
    consecutiveDays: 0,
    lastClaimedDay: 0,
    claimed30DayReward: false
};

const dailyRewards = {
    1: { gold: 5000 }, 2: { exp: 3000 }, 3: { gold: 7500 }, 4: { normalScroll: 1 },
    5: { gold: 10000 }, 6: { exp: 5000 }, 7: { gold: 12500 }, 8: { diamond: 5 },
    9: { gold: 15000 }, 10: { exp: 8000 }, 11: { gold: 17500 }, 12: { normalScroll: 2 },
    13: { gold: 20000 }, 14: { exp: 10000 }, 15: { diamond: 10 }, 16: { gold: 25000 },
    17: { exp: 12000 }, 18: { gold: 30000 }, 19: { normalScroll: 3 }, 20: { gold: 35000 },
    21: { exp: 15000 }, 22: { diamond: 15 }, 23: { gold: 40000 }, 24: { premiumScroll: 1 },
    25: { gold: 50000 }, 26: { exp: 20000 }, 27: { gold: 60000 }, 28: { diamond: 20 },
    29: { premiumScroll: 2 }, 30: { costume: "Golden Dragon Costume", costumeAp: 50000 }
};

// ========== TOURNAMENT ==========
let tournament = {
    active: true,
    week: 1,
    participants: [],
    rankings: [],
    playerMatches: 0,
    playerScore: 0,
    joined: false,
    matchesLeft: 5,
    lastReset: Date.now()
};

// ========== LOCAL STORAGE ==========
let users = JSON.parse(localStorage.getItem("aetheria_users")) || {};
let guilds = JSON.parse(localStorage.getItem("aetheria_guilds")) || {};

// ========== HELPERS ==========
function addLog(msg) { if(combatLog) combatLog.innerHTML += `<br>> ${msg}`; combatLog.scrollTop = combatLog.scrollHeight; }

function saveUser() {
    users[player.email] = {
        id: player.id, name: player.name, password: player.password,
        gameData: {
            level: player.level, exp: player.exp, gold: player.gold, diamond: player.diamond, vip: player.vip,
            inventory: player.inventory, equipment: player.equipment, guild: player.guild,
            firstPurchase: player.firstPurchase, level10GiftClaimed, pvp: pvp, dailyQuests: dailyQuests,
            achievements: achievements, mails: mails, playerClass: playerClass, friends: friends,
            dailyLogin: dailyLogin, tournament: tournament
        }
    };
    localStorage.setItem("aetheria_users", JSON.stringify(users));
}

// ========== EXP SYSTEM ==========
function getExpNeeded() {
    let lvl = player.level;
    if(lvl < 10) return 50000 + (lvl-1)*5000;
    if(lvl < 20) return 95000 + (lvl-10)*10000;
    if(lvl < 30) return 195000 + (lvl-20)*15000;
    if(lvl < 40) return 345000 + (lvl-30)*20000;
    if(lvl < 50) return 545000 + (lvl-40)*25000;
    return 795000 + (lvl-50)*30000;
}

function addExp(amt) {
    player.exp += amt;
    addLog(`✨ +${amt.toLocaleString()} EXP`);
    let need = getExpNeeded();
    while(player.exp >= need) {
        player.exp -= need;
        player.level++;
        addLog(`🎉 LEVEL ${player.level} REACHED!`);
        if(player.level >= 10 && !level10GiftClaimed) document.getElementById("giftBox").style.display = "block";
        if(player.level === 15) addLog(`🏰 GUILD SYSTEM UNLOCKED!`);
        need = getExpNeeded();
    }
    updateUI(); saveUser();
}

// ========== AP SYSTEM ==========
function calcAP() {
    let total = achievements.totalBonusAp;
    let rankBonus = rankData.find(r => r.name === pvp.rank)?.apBonus || 0;
    total += rankBonus;
    for(let s in player.equipment) if(player.equipment[s]) total += player.equipment[s].ap;
    return total;
}

function updateStats() {
    let ap = calcAP();
    player.maxHp = 5000 + Math.floor(ap/100);
    player.hp = player.maxHp;
    player.damage = 550 + Math.floor(ap/50);
    if(player.vip >= 1) {
        player.damage = Math.floor(player.damage * 1.2);
        player.maxHp = Math.floor(player.maxHp * 1.2);
        player.hp = player.maxHp;
    }
    updateUI();
}

// ========== PVP RANK UPDATE ==========
function updateRank() {
    let currentRank = rankData.find(r => pvp.score >= r.minScore && pvp.score <= r.maxScore);
    if(currentRank && currentRank.name !== pvp.rank) {
        pvp.rank = currentRank.name;
        addLog(`🎉 RANK UP! You are now ${pvp.rank} ${currentRank.icon}! +${currentRank.apBonus.toLocaleString()} AP Bonus!`);
        updateStats();
    }
}

// ========== ENEMY MAP ==========
let enemyMap = {
    1:{ name:"Goblin", hp:800, attack:200, exp:5000, gold:1500 },
    2:{ name:"Goblin Archer", hp:900, attack:250, exp:7500, gold:1800 },
    3:{ name:"Goblin Warrior", hp:1100, attack:300, exp:10000, gold:2000 },
    5:{ name:"Orc", hp:1500, attack:350, exp:15000, gold:2500 },
    10:{ name:"Forest Troll", hp:3000, attack:450, exp:30000, gold:4000 },
    15:{ name:"Stone Golem", hp:5000, attack:550, exp:60000, gold:6000 },
    20:{ name:"Fire Demon", hp:8000, attack:700, exp:120000, gold:9000 },
    30:{ name:"Ice Dragon", hp:15000, attack:900, exp:300000, gold:15000 },
    40:{ name:"Shadow Lord", hp:25000, attack:1200, exp:600000, gold:25000 },
    50:{ name:"Ancient Titan", hp:40000, attack:1500, exp:1000000, gold:40000 }
};

function renderEnemyMap() {
    let div = document.getElementById("enemyMap");
    if(!div) return;
    div.innerHTML = "";
    for(let lvl in enemyMap) {
        let e = enemyMap[lvl];
        div.innerHTML += `<div class="enemy-card"><button onclick="fightEnemy(${lvl})">⚔️ Lv${lvl} ${e.name}</button><div>💰 +${e.gold} ✨ +${e.exp.toLocaleString()}</div></div>`;
    }
}

function fightEnemy(lvl) {
    let e = enemyMap[lvl];
    currentEnemy = { ...e, currentHp: e.hp };
    addLog(`⚔️ FIGHT ${currentEnemy.name}`);
    renderBattle();
}

function renderBattle() {
    if(currentEnemy) {
        document.getElementById("heroCombat").innerHTML = `${player.name} ❤️ ${player.hp}/${player.maxHp} | ⚔️ ${player.damage} dmg`;
        document.getElementById("enemyCombat").innerHTML = `${currentEnemy.name} ❤️ ${currentEnemy.currentHp}/${currentEnemy.hp}`;
    }
}

function attackEnemy() {
    if(!currentEnemy) { addLog("Select enemy first!"); return; }
    if(player.hp <= 0) { addLog("You died!"); return; }
    let dmg = Math.floor(Math.random() * player.damage) + 100;
    currentEnemy.currentHp -= dmg;
    addLog(`${player.name} hits for ${dmg}`);
    if(currentEnemy.currentHp <= 0) {
        addLog(`✅ ${currentEnemy.name} DEFEATED!`);
        player.gold += currentEnemy.gold;
        addExp(currentEnemy.exp);
        let item = genItem();
        player.inventory.push(item);
        addLog(`🎁 DROP: ${item.name} (+${item.ap.toLocaleString()} AP)`);
        updateQuestProgress(1, 1);
        checkAchievement("kill", 1);
        checkAchievement("gold", currentEnemy.gold);
        currentEnemy = null;
        renderEnemyMap(); renderBattle(); updateStats(); saveUser(); updateUI();
        return;
    }
    let eDmg = Math.floor(Math.random() * currentEnemy.attack) + 50;
    player.hp -= eDmg;
    addLog(`${currentEnemy.name} hits you for ${eDmg}`);
    if(player.hp <= 0) addLog("💀 GAME OVER");
    renderBattle(); updateUI();
}

// ========== ITEM DROP ==========
const itemColors = [
    { color:"white", apMin:5000, apMax:50000, chance:0.50 },
    { color:"green", apMin:50000, apMax:200000, chance:0.30 },
    { color:"blue", apMin:200000, apMax:500000, chance:0.15 },
    { color:"purple", apMin:500000, apMax:2000000, chance:0.04 },
    { color:"orange", apMin:2000000, apMax:10000000, chance:0.009 },
    { color:"red", apMin:10000000, apMax:50000000, chance:0.001 }
];
const itemTypes = ["Sword","Armor","Ring","Necklace","Boots"];

function genItem() {
    let r=Math.random(), cum=0, sel=itemColors[0];
    for(let c of itemColors) { cum+=c.chance; if(r<cum){sel=c;break;} }
    let ap=Math.floor(Math.random()*(sel.apMax-sel.apMin)+sel.apMin);
    let type=itemTypes[Math.floor(Math.random()*itemTypes.length)];
    let slot={Sword:"weapon",Armor:"armor",Ring:"ring",Necklace:"necklace",Boots:"boots"}[type];
    return { id:Date.now()+Math.random(), name:`${sel.color.toUpperCase()} ${type}`, baseAp:ap, ap:ap, slot, upgradeLevel:0 };
}

// ========== DAILY QUESTS FUNCTIONS ==========
function checkDailyReset() {
    let now = Date.now();
    if(now - dailyQuests.lastReset > 86400000) {
        for(let q of dailyQuests.quests) { q.progress = 0; q.completed = false; q.claimed = false; }
        dailyQuests.lastReset = now;
        addLog(`📅 Daily quests reset!`);
        renderDailyQuests(); saveUser();
    }
}

function updateQuestProgress(questId, amount) {
    checkDailyReset();
    let quest = dailyQuests.quests.find(q => q.id === questId);
    if(quest && !quest.completed) {
        quest.progress += amount;
        if(quest.progress >= quest.target) { quest.progress = quest.target; quest.completed = true; addLog(`✅ QUEST: ${quest.name} completed!`); }
        renderDailyQuests(); saveUser();
    }
}

function claimQuestReward(questId) {
    let quest = dailyQuests.quests.find(q => q.id === questId);
    if(quest && quest.completed && !quest.claimed) {
        quest.claimed = true;
        player.gold += quest.rewardGold; player.diamond += quest.rewardDiamond; addExp(quest.rewardExp);
        addLog(`🎁 Claimed ${quest.name}: +${quest.rewardGold}💰 +${quest.rewardExp}✨`);
        renderDailyQuests(); saveUser(); updateUI();
        if(dailyQuests.quests.every(q => q.completed && q.claimed)) {
            addLog(`🏆 ALL DAILY QUESTS COMPLETED! BONUS: +10000 EXP, +5000 Gold, +5💎`);
            addExp(10000); player.gold += 5000; player.diamond += 5; saveUser(); updateUI();
        }
    }
}

function renderDailyQuests() {
    let div = document.getElementById("dailyQuestsPanel");
    if(!div) return;
    checkDailyReset();
    let html = `<h3>📅 DAILY QUESTS</h3>`;
    for(let q of dailyQuests.quests) {
        let status = q.completed ? (q.claimed ? "✅ CLAIMED" : "✔️ COMPLETE") : `${q.progress}/${q.target}`;
        let claimBtn = (q.completed && !q.claimed) ? `<button onclick="claimQuestReward(${q.id})">CLAIM</button>` : "";
        html += `<div class="quest-item ${q.completed ? (q.claimed ? 'claimed' : 'completed') : ''}"><div><strong>${q.name}</strong><br>${q.desc}</div><div>${status}</div><div>🏆 +${q.rewardGold}💰 +${q.rewardExp}✨</div>${claimBtn}</div>`;
    }
    div.innerHTML = html;
}

// ========== ACHIEVEMENT FUNCTIONS ==========
function checkAchievement(type, amount = 1) {
    for(let ach of achievements.list) {
        if(ach.tier >= ach.target.length) continue;
        if(ach.type === type) {
            ach.progress += amount;
            while(ach.tier < ach.target.length && ach.progress >= ach.target[ach.tier]) {
                let bonus = ach.apBonus[ach.tier];
                achievements.totalBonusAp += bonus;
                addLog(`🏅 ACHIEVEMENT: ${ach.name} Tier ${ach.tier+1}! +${bonus.toLocaleString()} AP!`);
                ach.tier++;
                updateStats();
            }
        }
    }
    renderAchievements(); saveUser();
}

function renderAchievements() {
    let div = document.getElementById("achievementPanel");
    if(!div) return;
    let html = `<h3>🏅 ACHIEVEMENTS (Bonus AP: ${achievements.totalBonusAp.toLocaleString()})</h3>`;
    for(let ach of achievements.list) {
        let tierName = ach.tier === 0 ? "🔒" : ach.tier === 1 ? "🥉" : ach.tier === 2 ? "🥈" : "🥇";
        let currentTarget = ach.target[ach.tier] || ach.target[ach.target.length-1];
        let percent = ach.tier >= ach.target.length ? 100 : (ach.progress / currentTarget) * 100;
        html += `<div class="achievement-item ${ach.tier > 0 ? 'completed' : ''}"><div class="ach-header"><span>${ach.icon} ${ach.name}</span><span>${tierName}</span></div><div class="ach-progress"><div class="ach-progress-bar" style="width:${Math.min(percent,100)}%"></div></div><div class="ach-stats">${ach.tier >= ach.target.length ? '✅' : `${ach.progress}/${currentTarget}`}</div></div>`;
    }
    div.innerHTML = html;
}

// ========== CHAT FUNCTIONS ==========
function sendMessage(channel, message) {
    if(!message.trim()) return;
    let msgObj = { player: player.name, message: message.substring(0,200), timestamp: new Date().toLocaleTimeString(), color: player.vip ? "#facc15" : "#38bdf8", vip: player.vip, rank: pvp.rank };
    if(channel === "global") { chatMessages.global.unshift(msgObj); if(chatMessages.global.length > 50) chatMessages.global.pop(); renderGlobalChat(); }
    else if(channel === "guild" && player.guild) { chatMessages.guild.unshift(msgObj); if(chatMessages.guild.length > 50) chatMessages.guild.pop(); renderGuildChat(); }
    saveUser();
}

function renderGlobalChat() {
    let div = document.getElementById("globalChat");
    if(!div) return;
    div.innerHTML = `<h3>💬 GLOBAL CHAT</h3><div class="chat-messages" id="globalMessages">${chatMessages.global.map(m => `<div class="chat-message"><span class="chat-time">[${m.timestamp}]</span><span class="chat-name" style="color:${m.color}">${m.player}${m.vip?'👑':''} (${m.rank}):</span><span class="chat-text">${m.message}</span></div>`).join("")}</div><div class="chat-input"><input type="text" id="globalChatInput" placeholder="Type..."><button onclick="sendGlobalMessage()">SEND</button></div>`;
}

function renderGuildChat() {
    let div = document.getElementById("guildChat");
    if(!div) return;
    if(!player.guild) { div.innerHTML = `<h3>💬 GUILD CHAT</h3><p>Join a guild to chat!</p>`; return; }
    div.innerHTML = `<h3>💬 GUILD CHAT [${player.guild}]</h3><div class="chat-messages" id="guildMessages">${chatMessages.guild.map(m => `<div class="chat-message"><span class="chat-time">[${m.timestamp}]</span><span class="chat-name" style="color:${m.color}">${m.player}${m.vip?'👑':''}:</span><span class="chat-text">${m.message}</span></div>`).join("")}</div><div class="chat-input"><input type="text" id="guildChatInput" placeholder="Type..."><button onclick="sendGuildMessage()">SEND</button></div>`;
}

function sendGlobalMessage() { let inp = document.getElementById("globalChatInput"); if(inp) { sendMessage("global", inp.value); inp.value = ""; } }
function sendGuildMessage() { let inp = document.getElementById("guildChatInput"); if(inp && player.guild) { sendMessage("guild", inp.value); inp.value = ""; } }
window.sendGlobalMessage = sendGlobalMessage; window.sendGuildMessage = sendGuildMessage;

// ========== PVP ==========
function checkPvpReset() { if(Date.now() - pvp.lastReset > 86400000) { pvp.dailyMatches = 0; pvp.lastReset = Date.now(); addLog("📅 PvP daily reset!"); } }

function findOpponent() {
    checkPvpReset();
    if(pvp.dailyMatches >= 10) {
        if(player.diamond >= 5 && confirm("Spend 5💎 for +3 matches?")) { player.diamond -= 5; pvp.dailyMatches = 7; saveUser(); }
        else { addLog("No free matches!"); return; }
    }
    let totalAP = calcAP();
    let botAP = totalAP * (0.8 + Math.random() * 0.4);
    let scoreGain = 10 + Math.floor(Math.random() * 20);
    currentPvPOpponent = {
        name: `Opp_${Math.floor(Math.random()*1000)}`,
        hp: 5000 + Math.floor(botAP/100),
        maxHp: 5000 + Math.floor(botAP/100),
        damage: 550 + Math.floor(botAP/50),
        scoreGain: scoreGain
    };
    addLog(`🏆 PVP: ${currentPvPOpponent.name}`);
    pvpBattleActive = true;
    renderBattle();
}

function pvpAttack() {
    if(!pvpBattleActive || !currentPvPOpponent) { addLog("Find opponent!"); return; }
    if(player.hp <= 0) { endPvP(false); return; }
    let dmg = Math.floor(Math.random() * player.damage) + 100;
    currentPvPOpponent.hp -= dmg;
    addLog(`You hit for ${dmg}`);
    if(currentPvPOpponent.hp <= 0) { endPvP(true); return; }
    let eDmg = Math.floor(Math.random() * currentPvPOpponent.damage) + 80;
    player.hp -= eDmg;
    addLog(`${currentPvPOpponent.name} hits you for ${eDmg}`);
    if(player.hp <= 0) { endPvP(false); return; }
    renderBattle(); updateUI();
}

function endPvP(win) {
    if(win) {
        let gain = currentPvPOpponent.scoreGain;
        pvp.score += gain;
        pvp.wins++;
        addLog(`🏆 +${gain} PvP Score! Total: ${pvp.score}`);
        updateRank();
        player.gold += 500 + pvp.score;
        addExp(1000 + pvp.score);
        updateQuestProgress(2, 1);
        checkAchievement("pvp_win", 1);
    } else {
        let loss = 5;
        pvp.score = Math.max(0, pvp.score - loss);
        pvp.losses++;
        addLog(`💔 -${loss} PvP Score! Total: ${pvp.score}`);
        updateRank();
    }
    pvp.dailyMatches++;
    player.hp = player.maxHp;
    currentPvPOpponent = null;
    pvpBattleActive = false;
    saveUser(); updateUI();
}

function getRankReward() {
    let rankInfo = rankData.find(r => r.name === pvp.rank);
    let rewardGold = 5000;
    let rewardDiamond = 5;
    if(rankInfo.name === "Guardian") { rewardGold = 10000; rewardDiamond = 10; }
    else if(rankInfo.name === "Virtue") { rewardGold = 15000; rewardDiamond = 15; }
    else if(rankInfo.name === "Dominion") { rewardGold = 20000; rewardDiamond = 20; }
    else if(rankInfo.name === "Cherubim") { rewardGold = 30000; rewardDiamond = 30; }
    else if(rankInfo.name === "Seraphim") { rewardGold = 40000; rewardDiamond = 40; }
    else if(rankInfo.name === "Archangel") { rewardGold = 50000; rewardDiamond = 50; }
    else if(rankInfo.name === "Nephilim") { rewardGold = 75000; rewardDiamond = 75; }
    else if(rankInfo.name === "Divine") { rewardGold = 100000; rewardDiamond = 100; }
    else if(rankInfo.name === "Emperor") { rewardGold = 200000; rewardDiamond = 200; }
    
    addLog(`🏆 WEEKLY RANK REWARD (${pvp.rank}): +${rewardGold} Gold, +${rewardDiamond}💎`);
    player.gold += rewardGold;
    player.diamond += rewardDiamond;
    saveUser(); updateUI();
}

function renderPvpPanel() {
    let div = document.getElementById("pvpPanel");
    if(!div) return;
    let rankInfo = rankData.find(r => r.name === pvp.rank);
    div.innerHTML = `
        <h3>🏆 PVP ARENA</h3>
        <div>Rank: <span style="color:#facc15">${pvp.rank} ${rankInfo?.icon || ''}</span></div>
        <div>Score: ${pvp.score}</div>
        <div>Wins: ${pvp.wins} | Losses: ${pvp.losses}</div>
        <div>Daily Matches: ${pvp.dailyMatches}/10</div>
        <button onclick="findOpponent()">🔍 FIND OPPONENT</button>
        <button onclick="getRankReward()">🎁 WEEKLY RANK REWARD</button>
    `;
}

// ========== WORLD BOSS ==========
function selectWorldBoss() { let week = Math.floor(Date.now() / (7 * 86400000)); let idx = week % worldBosses.length; currentWorldBoss = { ...worldBosses[idx] }; worldBossCurrentHp = currentWorldBoss.hp; worldBossActive = true; worldBossDamageRanking = []; playerWorldBossDamage = 0; addLog(`🌍 WORLD BOSS: ${currentWorldBoss.name} ${currentWorldBoss.icon}`); }
function checkWorldBossReset() { if(Date.now() - worldBossLastHitReset > 86400000) { playerWorldBossHitsLeft = 3; worldBossLastHitReset = Date.now(); addLog(`📅 World Boss hits reset!`); } }
function attackWorldBoss() {
    if(!worldBossActive || !currentWorldBoss) { addLog("No active World Boss!"); return; }
    if(worldBossCurrentHp <= 0) { addLog("Boss already defeated!"); worldBossActive = false; return; }
    checkWorldBossReset();
    if(playerWorldBossHitsLeft <= 0) { addLog("No hits left!"); return; }
    let dmg = Math.floor(Math.random() * player.damage * 2) + player.damage;
    worldBossCurrentHp -= dmg; playerWorldBossDamage += dmg; playerWorldBossHitsLeft--;
    updateQuestProgress(3, 1); checkAchievement("wb_damage", dmg);
    let idx = worldBossDamageRanking.findIndex(r => r.playerId === player.id);
    if(idx !== -1) worldBossDamageRanking[idx].damage += dmg;
    else worldBossDamageRanking.push({ playerName: player.name, playerId: player.id, damage: playerWorldBossDamage });
    worldBossDamageRanking.sort((a, b) => b.damage - a.damage);
    addLog(`⚔️ Hit for ${dmg.toLocaleString()}! (${playerWorldBossHitsLeft} left)`);
    if(worldBossCurrentHp <= 0) { worldBossActive = false; addLog(`🏆 ${currentWorldBoss.name} DEFEATED!`); distributeWorldBossRewards(); }
    renderWorldBossUI();
}
function distributeWorldBossRewards() {
    let top = worldBossDamageRanking.slice(0, 3);
    for(let i=0;i<top.length;i++) { let r = top[i]; let gold = i===0?50000:i===1?30000:20000; let exp = i===0?25000:i===1?15000:10000; if(r.playerId === player.id) { player.gold += gold; addExp(exp); addLog(`🏆 WORLD BOSS #${i+1}! +${gold}💰 +${exp}✨`); } }
    for(let r of worldBossDamageRanking) { if(r.playerId === player.id && !top.find(t=>t.playerId===player.id)) { player.gold += 5000; addExp(2500); addLog(`🎁 Participation reward!`); break; } }
    saveUser(); updateUI();
}
function renderWorldBossUI() {
    let div = document.getElementById("worldBossPanel");
    if(!div) return;
    if(!worldBossActive || !currentWorldBoss) { div.innerHTML = `<h3>🌍 WORLD BOSS</h3><p>Next boss next week</p>`; return; }
    let hpPercent = (worldBossCurrentHp / currentWorldBoss.hp) * 100;
    let myRank = worldBossDamageRanking.findIndex(r => r.playerId === player.id) + 1;
    let top10 = worldBossDamageRanking.slice(0, 10);
    div.innerHTML = `<h3>🌍 ${currentWorldBoss.name} ${currentWorldBoss.icon}</h3><div>❤️ ${Math.max(0,worldBossCurrentHp).toLocaleString()}/${currentWorldBoss.hp.toLocaleString()}</div><div class="hp-bar"><div class="hp-fill" style="width:${hpPercent}%"></div></div><div>⚔️ Your dmg: ${playerWorldBossDamage.toLocaleString()}</div><div>📅 Hits left: ${playerWorldBossHitsLeft}/3</div><button onclick="attackWorldBoss()">⚔️ ATTACK</button><h4>🏅 TOP 10</h4><div class="ranking-list">${top10.map((r,i)=>`<div>${i+1}. ${r.playerName} - ${r.damage.toLocaleString()}</div>`).join("")}</div>${myRank>10?`<div style="background:#facc15;color:#000;padding:5px;margin-top:10px;">Your rank: #${myRank}</div>`:""}`;
}

// ========== GUILD ==========
function isGuildAvailable() { return player.level >= 15; }
function renderGuildPanel() {
    let div = document.getElementById("guildPanel");
    if(!div) return;
    if(!isGuildAvailable()) { div.innerHTML = `<h3>🏰 GUILD</h3><p>🔒 Unlocks at Lv15 (${player.level}/15)</p><progress value="${player.level}" max="15"></progress>`; return; }
    if(player.guild && guilds[player.guild]) { let g = guilds[player.guild]; div.innerHTML = `<h3>🏰 ${player.guild}</h3><p>Leader: ${g.leader}</p><p>Members: ${g.members.length}/20</p><button onclick="leaveGuild()">Leave</button>`; }
    else { div.innerHTML = `<h3>🏰 CREATE GUILD (500💎)</h3><input id="newGuildName" placeholder="Guild name"><button onclick="createGuild()">Create</button><hr><select id="guildSelect">${Object.keys(guilds).map(g=>`<option value="${g}">${g} (${guilds[g].members.length}/20)</option>`)}</select><button onclick="joinGuild()">Join</button>`; }
}
function createGuild() {
    if(!isGuildAvailable()) return alert("Level 15 required");
    let name = document.getElementById("newGuildName")?.value.trim();
    if(!name) return alert("Enter name");
    if(player.diamond < 500) return alert("Need 500💎");
    if(guilds[name]) return alert("Exists");
    if(player.guild) return alert("Already in guild");
    player.diamond -= 500;
    guilds[name] = { name, leader: player.name, leaderId: player.id, members: [player.name], memberIds: [player.id] };
    player.guild = name;
    localStorage.setItem("aetheria_guilds", JSON.stringify(guilds));
    saveUser(); addLog(`🏰 Guild "${name}" created!`); renderGuildPanel(); updateUI();
}
function joinGuild() {
    if(!isGuildAvailable()) return alert("Level 15 required");
    let name = document.getElementById("guildSelect")?.value;
    if(!name || !guilds[name]) return alert("Invalid");
    if(player.guild) return alert("Already in guild");
    if(guilds[name].members.length >= 20) return alert("Full");
    guilds[name].members.push(player.name); guilds[name].memberIds.push(player.id);
    player.guild = name;
    localStorage.setItem("aetheria_guilds", JSON.stringify(guilds));
    saveUser(); addLog(`🏰 Joined "${name}"!`); renderGuildPanel(); updateUI(); checkAchievement("guild", 1);
}
function leaveGuild() {
    if(!player.guild || !guilds[player.guild]) return;
    let g = guilds[player.guild];
    g.members = g.members.filter(m=>m!==player.name); g.memberIds = g.memberIds.filter(id=>id!==player.id);
    if(g.members.length===0) delete guilds[player.guild];
    player.guild = null;
    localStorage.setItem("aetheria_guilds", JSON.stringify(guilds));
    saveUser(); addLog(`🏰 Left guild`); renderGuildPanel(); updateUI();
}

// ========== PREMIUM SHOP ==========
const premiumItems = [
    { id: "wings_angel", name: "Angel Wings", type: "wings", ap: 15000, price: 300, icon: "🦋" },
    { id: "wings_demon", name: "Demon Wings", type: "wings", ap: 25000, price: 400, icon: "🦋" },
    { id: "wings_dragon", name: "Dragon Wings", type: "wings", ap: 50000, price: 600, icon: "🦋" },
    { id: "costume_angel", name: "Angel Armor", type: "costume", ap: 10000, price: 200, icon: "👘" },
    { id: "costume_demon", name: "Demon Costume", type: "costume", ap: 20000, price: 300, icon: "👘" },
    { id: "mount_light_horse", name: "Light Horse", type: "mount", ap: 20000, price: 350, icon: "🐴" },
    { id: "mount_hell_horse", name: "Hell Horse", type: "mount", ap: 35000, price: 500, icon: "🐴" },
    { id: "pet_fire_fox", name: "Fire Fox", type: "pet", ap: 8000, price: 150, icon: "🐾" },
    { id: "pet_angel", name: "Angel Companion", type: "pet", ap: 20000, price: 300, icon: "🐾" }
];
function buyPremiumItem(id) { let item = premiumItems.find(i=>i.id===id); if(!item) return; if(player.diamond < item.price) { addLog(`Need ${item.price}💎`); return; } player.diamond -= item.price; let newItem = { id: item.id, name: item.name, ap: item.ap, slot: item.type || "costume" }; player.inventory.push(newItem); addLog(`🛒 Bought ${item.name} (+${item.ap.toLocaleString()} AP)`); saveUser(); updateUI(); }
function renderShop() {
    let div = document.getElementById("shopList");
    if(!div) return;
    let packs = [{ dia:100, price:0.99 }, { dia:500, price:4.99 }, { dia:1000, price:9.99 }, { dia:5000, price:42.99 }];
    div.innerHTML = `<h4>💎 DIAMONDS</h4>${packs.map(p=>`<button onclick="buyDiamonds(${p.dia},${p.price})">💎 ${p.dia} 💎 $${p.price}</button>`).join("")}<h4>🛒 ITEMS</h4>${premiumItems.map(i=>`<div style="display:flex;justify-content:space-between;margin:8px 0"><span>${i.icon} ${i.name}</span><span>+${i.ap.toLocaleString()} AP</span><span>💎 ${i.price}</span><button onclick="buyPremiumItem('${i.id}')">BUY</button></div>`).join("")}`;
}
function buyDiamonds(dia, price) { if(confirm(`Buy ${dia}💎 for $${price}?`)) { player.diamond += dia; addLog(`💎 +${dia} Diamonds!`); saveUser(); updateUI(); } }

// ========== EQUIPMENT ==========
function equipItem(item, slot) { if(player.equipment[slot]) player.inventory.push(player.equipment[slot]); player.equipment[slot] = item; player.inventory = player.inventory.filter(i => i.id !== item.id); addLog(`🛡️ Equipped ${item.name} (+${item.ap.toLocaleString()} AP)`); updateQuestProgress(4, 1); updateStats(); saveUser(); updateUI(); }

// ========== LEADERBOARD ==========
function getGlobalLeaderboard() { let lb = []; for(let email in users) { if(users[email].gameData && users[email].gameData.pvp) lb.push({ name: users[email].name, score: users[email].gameData.pvp.score || 0 }); } lb.sort((a,b)=>b.score - a.score); return lb; }
function renderGlobalLeaderboard() {
    let div = document.getElementById("leaderboardPanel");
    if(!div) return;
    let lb = getGlobalLeaderboard();
    let myRank = lb.findIndex(p => p.name === player.name) + 1;
    let top10 = lb.slice(0,10);
    div.innerHTML = `<h3>🏆 GLOBAL RANKINGS</h3><div class="leaderboard-list">${top10.map((p,i)=>`<div class="leaderboard-entry ${p.name===player.name?'current-player':''}"><span>${i+1}.</span><span>${p.name}</span><span>${p.score}🏅</span></div>`).join("")}</div>${myRank?`<div class="leaderboard-entry current-player" style="margin-top:10px">📍 Your Rank: #${myRank}</div>`:''}<button onclick="getRankReward()">🎁 CLAIM RANK REWARD</button>`;
}

// ========== INVENTORY ==========
function toggleItemForSale(itemId) { let idx = selectedItemsForSale.indexOf(itemId); if(idx === -1) selectedItemsForSale.push(itemId); else selectedItemsForSale.splice(idx,1); renderInventory(); }
function sellSelectedItems() {
    if(selectedItemsForSale.length === 0) { addLog("No items selected!"); return; }
    let totalGold = 0, sold = [];
    for(let id of selectedItemsForSale) {
        let idx = player.inventory.findIndex(i => i.id == id);
        if(idx !== -1) { let item = player.inventory[idx]; if(!item.isClassItem) { totalGold += Math.floor(item.ap/2); sold.push(item.name); player.inventory.splice(idx,1); } }
    }
    if(totalGold > 0) { player.gold += totalGold; addLog(`💰 Sold ${sold.length} items for ${totalGold.toLocaleString()} Gold!`); selectedItemsForSale = []; saveUser(); updateUI(); }
}
function sellAllItems() {
    if(confirm("Sell ALL non-class items?")) {
        let totalGold = 0, count = 0, newInv = [];
        for(let item of player.inventory) { if(item.isClassItem) newInv.push(item); else { totalGold += Math.floor(item.ap/2); count++; } }
        player.inventory = newInv; player.gold += totalGold; addLog(`💰 Sold ${count} items for ${totalGold.toLocaleString()} Gold!`); saveUser(); updateUI();
    }
}
function sortInventoryByAp() { player.inventory.sort((a,b)=>b.ap - a.ap); renderInventory(); }
function sortInventoryByName() { player.inventory.sort((a,b)=>a.name.localeCompare(b.name)); renderInventory(); }
function renderInventory() {
    let div = document.getElementById("invList");
    if(!div) return;
    if(player.inventory.length === 0) { div.innerHTML = "<div>Empty</div>"; return; }
    let totalValue = player.inventory.reduce((s,i)=>s+(i.isClassItem?0:Math.floor(i.ap/2)),0);
    let html = `<div class="inv-controls"><button onclick="sortInventoryByAp()">📊 Sort by AP</button><button onclick="sortInventoryByName()">🔤 Sort by Name</button><button onclick="sellSelectedItems()">💰 Sell Selected</button><button onclick="sellAllItems()">🗑️ Sell All</button></div><div class="inv-total">💰 Total Value: ${totalValue.toLocaleString()} Gold</div><div class="inv-list">`;
    for(let item of player.inventory) {
        let isSelected = selectedItemsForSale.includes(item.id);
        let sellPrice = item.isClassItem ? 0 : Math.floor(item.ap/2);
        let upgrade = item.upgradeLevel ? `+${item.upgradeLevel}` : "";
        let icon = item.slot === "weapon" ? "⚔️" : item.slot === "armor" ? "🛡️" : "🎁";
        html += `<div class="inv-item ${isSelected ? 'selected' : ''}" onclick="toggleItemForSale(${item.id})"><div class="inv-item-info"><span class="inv-item-name">${icon} ${item.name} ${upgrade}</span><span class="inv-item-ap">⚡ ${item.ap.toLocaleString()} AP</span>${!item.isClassItem ? `<span class="inv-item-price">💰 ${sellPrice.toLocaleString()}</span>` : '<span class="inv-item-price">🔒 Class</span>'}</div><div class="inv-item-actions"><button onclick="event.stopPropagation(); equipItem(${JSON.stringify(item).replace(/'/g, "\\'")}, '${item.slot}')">Equip</button></div></div>`;
    }
    html += `</div>`; div.innerHTML = html;
}

// ========== CLASS SELECTION ==========
function showClassSelection() {
    let storyDiv = document.getElementById("storyContainer");
    if(!storyDiv) { let c = document.querySelector(".container"); storyDiv = document.createElement("div"); storyDiv.id = "storyContainer"; c.insertBefore(storyDiv, c.querySelector(".game-area")); }
    storyDiv.innerHTML = `<div class="story-box"><h2>⚔️ CHOOSE YOUR CLASS ⚔️</h2><div class="class-selection-grid">${Object.entries(classData).map(([k,c])=>`<div class="class-card" onclick="selectClass('${k}')"><div class="class-icon">${c.icon}</div><div class="class-name">${c.name}</div><div class="class-bonus">+${c.apBonus.toLocaleString()} AP</div><div class="class-stats">❤️ ${c.baseHp} HP | ⚔️ ${c.baseDamage} DMG</div></div>`).join("")}</div></div>`;
    storyDiv.style.display = "block";
}
function selectClass(className) {
    let c = classData[className]; playerClass = className; player.ap += c.apBonus; player.maxHp = c.baseHp; player.hp = c.baseHp; player.damage = c.baseDamage;
    player.inventory.push({ id: "class_"+className.toLowerCase()+"_"+Date.now(), name: `${c.icon} ${className} Insignia`, ap: c.apBonus, slot: "costume", isClassItem: true });
    addLog(`✨ You chose ${className}! +${c.apBonus.toLocaleString()} AP!`);
    document.getElementById("storyContainer").style.display = "none"; updateStats(); updateUI(); selectWorldBoss(); saveUser();
}
function claimVipGift() {
    if(level10GiftClaimed) return;
    level10GiftClaimed = true; player.vip = 1;
    player.inventory.push({ id: "vip_mount", name: "VIP Armored Horse", ap: 15000, slot: "mount" }, { id: "vip_pet", name: "VIP Fire Fox", ap: 8000, slot: "pet" }, { id: "vip_costume", name: "VIP Royal Costume", ap: 10000, slot: "costume" });
    addLog(`👑 VIP 1 UNLOCKED!`); document.getElementById("giftBox").style.display = "none"; checkAchievement("vip", 1); updateStats(); saveUser(); updateUI();
}

// ========== DAILY LOGIN ==========
function checkDailyLogin() {
    let today = new Date().toDateString();
    if(!dailyLogin.lastLoginDate) {
        dailyLogin.lastLoginDate = today;
        dailyLogin.consecutiveDays = 1;
        claimDailyReward();
        return;
    }
    let lastDate = new Date(dailyLogin.lastLoginDate);
    let currentDate = new Date(today);
    let dayDiff = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));
    if(dayDiff === 1) {
        dailyLogin.consecutiveDays++;
        dailyLogin.lastLoginDate = today;
        claimDailyReward();
    } else if(dayDiff > 1) {
        dailyLogin.consecutiveDays = 1;
        dailyLogin.lastLoginDate = today;
        dailyLogin.lastClaimedDay = 0;
        claimDailyReward();
        addLog(`⚠️ Login streak broken! Starting from day 1.`);
    }
}
function claimDailyReward() {
    let day = dailyLogin.consecutiveDays;
    if(day > 30) day = 30;
    if(day <= dailyLogin.lastClaimedDay) return;
    let reward = dailyRewards[day];
    if(!reward) return;
    if(reward.gold) { player.gold += reward.gold; addLog(`📅 DAY ${day}: +${reward.gold} Gold`); }
    if(reward.exp) { addExp(reward.exp); addLog(`📅 DAY ${day}: +${reward.exp} EXP`); }
    if(reward.diamond) { player.diamond += reward.diamond; addLog(`📅 DAY ${day}: +${reward.diamond}💎`); }
    if(reward.normalScroll) { upgradeScrolls.normal += reward.normalScroll; addLog(`📅 DAY ${day}: +${reward.normalScroll} Normal Scroll`); }
    if(reward.premiumScroll) { upgradeScrolls.premium += reward.premiumScroll; addLog(`📅 DAY ${day}: +${reward.premiumScroll} Premium Scroll`); }
    if(reward.costume && !dailyLogin.claimed30DayReward) {
        player.inventory.push({ id: "30day_costume", name: reward.costume, ap: reward.costumeAp, slot: "costume" });
        addLog(`📅 DAY 30: +${reward.costume} (+${reward.costumeAp.toLocaleString()} AP)!`);
        dailyLogin.claimed30DayReward = true;
    }
    dailyLogin.lastClaimedDay = day;
    saveUser(); updateUI(); renderDailyLoginPanel();
}
function renderDailyLoginPanel() {
    let div = document.getElementById("dailyLoginPanel");
    if(!div) return;
    
    let today = new Date().toDateString();
    let isTodayLogged = (dailyLogin.lastLoginDate === today);
    let canClaim = !isTodayLogged && dailyLogin.consecutiveDays > dailyLogin.lastClaimedDay;
    let nextClaimDay = dailyLogin.lastClaimedDay + 1;
    if(nextClaimDay > 30) nextClaimDay = 30;
    
    // Build calendar
    let calendarHtml = `<div class="daily-calendar">`;
    for(let day = 1; day <= 30; day++) {
        let reward = dailyRewards[day];
        let icon = "";
        if(reward.gold) icon = "💰";
        else if(reward.exp) icon = "✨";
        else if(reward.diamond) icon = "💎";
        else if(reward.normalScroll) icon = "📜";
        else if(reward.premiumScroll) icon = "🛡️";
        else if(reward.costume) icon = "🎁";
        
        let statusClass = "";
        if(dailyLogin.lastClaimedDay >= day) statusClass = "claimed";
        else if(day === nextClaimDay && canClaim) statusClass = "current";
        else if(day > dailyLogin.lastClaimedDay) statusClass = "future";
        
        if(day === 30 && !dailyLogin.claimed30DayReward) statusClass += " reward-day";
        
        calendarHtml += `
            <div class="calendar-day ${statusClass}">
                <span class="calendar-reward-icon">${icon}</span>
                <span class="calendar-day-number">Day ${day}</span>
            </div>
        `;
    }
    calendarHtml += `</div>`;
    
    // Legend
    let legendHtml = `
        <div class="calendar-legend">
            <div class="legend-item"><div class="legend-color" style="background:#22c55e"></div><span>Claimed</span></div>
            <div class="legend-item"><div class="legend-color" style="background:#facc15"></div><span>Today</span></div>
            <div class="legend-item"><div class="legend-color" style="background:#e94560"></div><span>30th Day</span></div>
        </div>
    `;
    
    let rewardText = "";
    let nextReward = dailyRewards[nextClaimDay];
    if(nextReward) {
        if(nextReward.gold) rewardText = `${nextReward.gold.toLocaleString()} Gold`;
        else if(nextReward.exp) rewardText = `${nextReward.exp.toLocaleString()} EXP`;
        else if(nextReward.diamond) rewardText = `${nextReward.diamond} Diamonds`;
        else if(nextReward.normalScroll) rewardText = `${nextReward.normalScroll} Normal Scroll`;
        else if(nextReward.premiumScroll) rewardText = `${nextReward.premiumScroll} Premium Scroll`;
        else if(nextReward.costume) rewardText = `${nextReward.costume} (+${nextReward.costumeAp.toLocaleString()} AP)`;
    }
    
    div.innerHTML = `
        <h3>🎁 DAILY LOGIN REWARD</h3>
        <div class="login-streak">🔥 Streak: ${dailyLogin.consecutiveDays} days</div>
        <div class="login-next">📅 Next reward (Day ${nextClaimDay}): ${rewardText}</div>
        ${canClaim ? `<button onclick="claimDailyLoginReward()" class="tournament-join-btn" style="background:#22c55e">🎁 CLAIM DAY ${dailyLogin.consecutiveDays} REWARD</button>` : `<div style="background:#334155;padding:8px;border-radius:40px;text-align:center;margin:10px 0">✅ Today's reward claimed! Come back tomorrow.</div>`}
        ${calendarHtml}
        ${legendHtml}
        ${dailyLogin.claimed30DayReward ? '<div style="background:#22c55e;color:#0f172a;padding:8px;border-radius:16px;text-align:center;margin-top:10px">🌟 30-DAY COSTUME CLAIMED! 🌟</div>' : '<div style="background:#1e293b;padding:8px;border-radius:16px;text-align:center;margin-top:10px">🎯 30 days = Golden Dragon Costume (+50,000 AP)</div>'}
    `;
}
function claimDailyLoginReward() {
    let today = new Date().toDateString();
    if(dailyLogin.lastLoginDate === today) { addLog("Already claimed today!"); return; }
    checkDailyLogin();
    renderDailyLoginPanel();
}
window.claimDailyLoginReward = claimDailyLoginReward;

// ========== TOURNAMENT ==========
function checkTournamentReset() {
    if(Date.now() - tournament.lastReset > 7 * 24 * 60 * 60 * 1000) {
        tournament.week++; tournament.participants = []; tournament.rankings = []; tournament.joined = false;
        tournament.playerMatches = 0; tournament.playerScore = 0; tournament.matchesLeft = 5; tournament.lastReset = Date.now();
        addLog(`🏆 NEW TOURNAMENT WEEK #${tournament.week}!`); renderTournamentPanel(); saveUser();
    }
}
function joinTournament() {
    checkTournamentReset();
    if(tournament.joined) { addLog("Already joined this week!"); return; }
    if(player.diamond < 50) { addLog("Need 50💎 to join!"); return; }
    player.diamond -= 50; tournament.joined = true; tournament.playerScore = 0; tournament.matchesLeft = 5; tournament.playerMatches = 0;
    tournament.participants.push({ name: player.name, id: player.id, score: 0, matches: 0 });
    addLog(`🏆 Joined tournament! 5 matches left.`); saveUser(); renderTournamentPanel(); updateUI();
}
function playTournamentMatch() {
    checkTournamentReset();
    if(!tournament.joined) { addLog("Join tournament first! (50💎)"); return; }
    if(tournament.matchesLeft <= 0) { addLog("All matches played!"); return; }
    let isWin = Math.random() > 0.4;
    let points = isWin ? 10 + Math.floor(Math.random() * 20) : -5 - Math.floor(Math.random() * 10);
    tournament.playerScore = Math.max(0, tournament.playerScore + points);
    tournament.matchesLeft--; tournament.playerMatches++;
    addLog(`${isWin ? '🏆 WIN!' : '💔 LOSS!'} ${points > 0 ? `+${points}` : points} points! (${tournament.matchesLeft} left)`);
    let p = tournament.participants.find(p => p.id === player.id);
    if(p) { p.score = tournament.playerScore; p.matches = tournament.playerMatches; }
    tournament.rankings = [...tournament.participants].sort((a,b) => b.score - a.score);
    if(tournament.matchesLeft === 0) {
        let myRank = tournament.rankings.findIndex(r => r.id === player.id) + 1;
        addLog(`🏁 Tournament finished! Rank #${myRank} with ${tournament.playerScore} points`);
        if(myRank === 1) { player.gold += 50000; player.diamond += 100; addLog(`🏆 TOURNAMENT WINNER! +50000 Gold, +100💎`); }
        else if(myRank === 2) { player.gold += 30000; player.diamond += 50; addLog(`🥈 2nd PLACE! +30000 Gold, +50💎`); }
        else if(myRank === 3) { player.gold += 20000; player.diamond += 25; addLog(`🥉 3rd PLACE! +20000 Gold, +25💎`); }
        else if(myRank <= 10) { player.gold += 10000; addLog(`🎉 TOP 10! +10000 Gold`); }
        else { player.gold += 5000; addLog(`👍 Completed! +5000 Gold`); }
        saveUser(); updateUI();
    }
    saveUser(); renderTournamentPanel(); updateUI();
}
function renderTournamentPanel() {
    let div = document.getElementById("tournamentPanel");
    if(!div) return;
    
    checkTournamentReset();
    
    let status = tournament.joined ? `${tournament.matchesLeft}/5 matches | ${tournament.playerScore} pts` : "Not joined";
    let winRate = tournament.playerMatches > 0 ? Math.round((tournament.playerScore / (tournament.playerMatches * 20)) * 100) : 0;
    
    // Lobby - all participants
    let lobbyHtml = `<div class="tournament-lobby"><h4>👥 PARTICIPANTS (${tournament.participants.length})</h4>`;
    for(let p of tournament.rankings.slice(0, 15)) {
        let isCurrent = p.id === player.id;
        lobbyHtml += `
            <div class="lobby-player ${isCurrent ? 'current-player' : ''}">
                <span class="lobby-rank">#${tournament.rankings.indexOf(p)+1}</span>
                <span class="lobby-name">${p.name} ${isCurrent ? '(You)' : ''}</span>
                <span class="lobby-score">${p.score} pts</span>
                <span class="lobby-matches">${p.matches}/5</span>
            </div>
        `;
    }
    lobbyHtml += `</div>`;
    
    // Match feed (simulated recent matches)
    let matchFeedHtml = `<div class="match-feed"><h4>📋 RECENT MATCHES</h4>`;
    let recentMatches = [
        { winner: "ShadowKnight", loser: "FireMage", score: "25-18" },
        { winner: "DragonSlayer", loser: "IceWitch", score: "30-22" },
        { winner: "Player_" + Math.floor(Math.random()*100), loser: "Opponent_" + Math.floor(Math.random()*100), score: "20-15" }
    ];
    for(let m of recentMatches) {
        matchFeedHtml += `<div class="match-item"><span class="match-winner">${m.winner}</span> defeated <span class="match-loser">${m.loser}</span> (${m.score})</div>`;
    }
    matchFeedHtml += `</div>`;
    
    // Player stats
    let playerStatsHtml = `
        <div class="player-stats">
            <div><div>🏆 Rank</div><div class="stat-value">#${tournament.rankings.findIndex(r => r.id === player.id) + 1 || '?'}</div></div>
            <div><div>⭐ Score</div><div class="stat-value">${tournament.playerScore}</div></div>
            <div><div>📊 Win Rate</div><div class="stat-value">${winRate}%</div></div>
            <div><div>⚔️ Matches</div><div class="stat-value">${tournament.playerMatches}/5</div></div>
        </div>
    `;
    
    let top3 = tournament.rankings.slice(0, 3);
    
    div.innerHTML = `
        <h3>🏆 WEEKLY TOURNAMENT #${tournament.week} 🏆</h3>
        <div class="tournament-status">${status}</div>
        <div class="tournament-rankings">
            <h4>🏅 TOP 3</h4>
            ${top3.map((p,i)=>`<div class="tournament-entry top-${i+1}"><span>${i+1}. ${p.name}</span><span>${p.score} pts</span></div>`).join("")}
        </div>
        ${lobbyHtml}
        ${playerStatsHtml}
        ${matchFeedHtml}
        ${!tournament.joined ? 
            `<button class="tournament-join-btn" onclick="joinTournament()">⚔️ JOIN TOURNAMENT (50💎)</button>` : 
            tournament.matchesLeft > 0 ?
            `<button class="tournament-join-btn" onclick="playTournamentMatch()">⚔️ PLAY MATCH (${tournament.matchesLeft} left)</button>` :
            `<div class="tournament-status" style="background:#22c55e">✅ Tournament completed! Final rank: #${tournament.rankings.findIndex(r => r.id === player.id) + 1}</div>`
        }
    `;
}
 

// ========== MAIL & FRIENDS ==========
function addSystemMail(subject, content, reward = null) {
    mails.unshift({ id: Date.now(), sender: "SYSTEM", subject, content, date: new Date().toLocaleString(), read: false, reward, rewardClaimed: false });
    renderMailList(); saveUser(); addLog(`📬 New mail: ${subject}`);
}
function renderMailList() {
    let div = document.getElementById("mailPanel");
    if(!div) return;
    let unreadCount = mails.filter(m => !m.read).length;
    div.innerHTML = `<h3>📬 MAIL ${unreadCount ? `(${unreadCount})` : ''}</h3><div class="mail-list">${mails.map(m => `<div class="mail-item ${!m.read ? 'unread' : ''}" onclick="openMail(${m.id})"><div>${m.sender}</div><div>${m.subject}</div></div>`).join("")}</div><div id="mailDetailPanel"></div>`;
}
function openMail(mailId) {
    let mail = mails.find(m => m.id === mailId);
    if(!mail) return;
    mail.read = true;
    let rewardHtml = mail.reward && !mail.rewardClaimed ? `<button onclick="claimMailReward(${mail.id})">CLAIM REWARD</button>` : '';
    document.getElementById("mailDetailPanel").innerHTML = `<div><h4>${mail.subject}</h4><p>${mail.content}</p>${rewardHtml}<button onclick="deleteMail(${mail.id})">DELETE</button></div>`;
    renderMailList(); saveUser();
}
function claimMailReward(mailId) {
    let mail = mails.find(m => m.id === mailId);
    if(mail && mail.reward && !mail.rewardClaimed) {
        if(mail.reward.gold) player.gold += mail.reward.gold;
        if(mail.reward.diamond) player.diamond += mail.reward.diamond;
        mail.rewardClaimed = true;
        addLog(`💰 Claimed mail reward!`);
        saveUser(); updateUI(); openMail(mailId);
    }
}
function deleteMail(mailId) { mails = mails.filter(m => m.id !== mailId); renderMailList(); saveUser(); }
function sendFriendRequest(name) {
    let found = Object.values(users).find(u => u.name === name);
    if(!found) { addLog("Player not found!"); return; }
    if(friends.list.some(f => f.name === name)) { addLog("Already friend!"); return; }
    friends.requests.push({ from: player.name, to: name });
    addLog(`📨 Friend request sent to ${name}!`); saveUser(); renderFriendPanel();
}
function acceptFriendRequest(name) {
    friends.list.push({ name, online: false });
    friends.requests = friends.requests.filter(r => r.from !== name);
    addLog(`✅ ${name} is now your friend!`); saveUser(); renderFriendPanel();
}
function removeFriend(name) { friends.list = friends.list.filter(f => f.name !== name); addLog(`❌ Removed ${name}`); saveUser(); renderFriendPanel(); }
function renderFriendPanel() {
    let div = document.getElementById("friendPanel");
    if(!div) return;
    div.innerHTML = `<h3>👥 FRIENDS</h3><div class="friend-list">${friends.list.map(f => `<div class="friend-item"><span>${f.name}</span><button onclick="removeFriend('${f.name}')">❌</button></div>`).join("")}</div><div class="chat-input"><input id="friendNameInput" placeholder="Player name"><button onclick="sendFriendRequest(document.getElementById('friendNameInput').value)">ADD</button></div><h4>REQUESTS</h4>${friends.requests.map(r => `<div class="friend-item"><span>${r.from}</span><button onclick="acceptFriendRequest('${r.from}')">✅</button></div>`).join("")}`;
}

// ========== START GAME ==========
function loadUser(email, pass) {
    let u = users[email];
    if(u && u.password === pass) {
        player.id = u.id; player.name = u.name; player.email = email; player.password = pass;
        let d = u.gameData;
        player.level = d.level; player.exp = d.exp; player.gold = d.gold; player.diamond = d.diamond; player.vip = d.vip;
        player.inventory = d.inventory || []; player.equipment = d.equipment || {};
        player.guild = d.guild; player.firstPurchase = d.firstPurchase || false; level10GiftClaimed = d.level10GiftClaimed || false;
        if(d.pvp) { pvp.score = d.pvp.score || 0; pvp.wins = d.pvp.wins || 0; pvp.losses = d.pvp.losses || 0; pvp.dailyMatches = d.pvp.dailyMatches || 0; pvp.lastReset = d.pvp.lastReset || Date.now(); updateRank(); }
        if(d.dailyQuests) { dailyQuests = d.dailyQuests; }
        if(d.achievements) { achievements = d.achievements; }
        if(d.mails) { mails = d.mails; }
        if(d.playerClass) { playerClass = d.playerClass; }
        if(d.friends) { friends = d.friends; }
        if(d.dailyLogin) { dailyLogin = d.dailyLogin; }
        if(d.tournament) { tournament = d.tournament; }
        updateStats(); return true;
    }
    return false;
}
function registerUser(name, email, pass) {
    if(users[email]) return false;
    player.id = Date.now().toString(); player.name = name; player.email = email; player.password = pass;
    player.level = 1; player.exp = 0; player.gold = 10000; player.diamond = 0; player.vip = 0;
    player.inventory = []; player.equipment = {}; player.guild = null; player.firstPurchase = false; level10GiftClaimed = false; playerClass = null;
    pvp = { score: 0, rank: "Mortal", rankIndex: 0, wins: 0, losses: 0, dailyMatches: 0, lastReset: Date.now() };
    dailyQuests.lastReset = Date.now(); dailyQuests.quests.forEach(q => { q.progress = 0; q.completed = false; q.claimed = false; });
    achievements.list.forEach(a => { a.progress = 0; a.tier = 0; }); achievements.totalBonusAp = 0;
    mails = []; friends = { list: [], requests: [] };
    dailyLogin = { lastLoginDate: null, consecutiveDays: 0, lastClaimedDay: 0, claimed30DayReward: false };
    tournament = { active: true, week: 1, participants: [], rankings: [], playerMatches: 0, playerScore: 0, joined: false, matchesLeft: 5, lastReset: Date.now() };
    addSystemMail("Welcome to Aetheria!", "Thank you for joining! Here's a gift.", { gold: 5000, diamond: 10 });
    updateRank(); updateStats(); saveUser(); return true;
}
function startGame() {
    document.getElementById("entryScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    let hasClass = player.inventory.some(i => i.isClassItem === true);
    if(!hasClass && !playerClass) { showClassSelection(); }
    else { updateStats(); updateUI(); selectWorldBoss(); checkDailyLogin(); renderDailyLoginPanel(); addLog(`🌟 Welcome ${player.name} (Level ${player.level})`); }
}
function updateUI() {
    document.getElementById("playerLevel").innerText = player.level;
    document.getElementById("playerAp").innerText = calcAP().toLocaleString();
    document.getElementById("playerHp").innerText = player.hp;
    document.getElementById("playerDmg").innerText = player.damage;
    document.getElementById("playerGold").innerText = player.gold.toLocaleString();
    document.getElementById("playerDia").innerText = player.diamond;
    document.getElementById("playerVip").innerText = player.vip;
    renderInventory(); renderEnemyMap(); renderGuildPanel(); renderShop(); renderPvpPanel(); renderWorldBossUI();
    renderDailyQuests(); renderGlobalLeaderboard(); renderGlobalChat(); renderGuildChat(); renderAchievements();
    renderMailList(); renderFriendPanel(); renderDailyLoginPanel(); renderTournamentPanel(); renderSeasonPanel(); renderQuestLinePanel(); renderEventPanel();renderEventPanel();
    renderSetBonusPanel();
}

document.getElementById("loginTabBtn").onclick = () => { document.getElementById("loginPanel").style.display = "flex"; document.getElementById("registerPanel").style.display = "none"; document.getElementById("loginTabBtn").classList.add("active"); document.getElementById("registerTabBtn").classList.remove("active"); };
document.getElementById("registerTabBtn").onclick = () => { document.getElementById("loginPanel").style.display = "none"; document.getElementById("registerPanel").style.display = "flex"; document.getElementById("registerTabBtn").classList.add("active"); document.getElementById("loginTabBtn").classList.remove("active"); };
document.getElementById("doLoginBtn").onclick = () => { let email = document.getElementById("loginEmail").value.trim(); let pass = document.getElementById("loginPassword").value.trim(); if(loadUser(email, pass)) startGame(); else alert("Invalid credentials"); };
document.getElementById("doRegisterBtn").onclick = () => { let name = document.getElementById("regUsername").value.trim(); let email = document.getElementById("regEmail").value.trim(); let pass = document.getElementById("regPassword").value.trim(); if(registerUser(name, email, pass)) { alert("Registered! Please login."); document.getElementById("loginTabBtn").click(); } else alert("Email exists"); };
document.getElementById("googleLoginBtn").onclick = () => { let fakeEmail = "google_" + Date.now() + "@user.com"; if(!users[fakeEmail]) registerUser("GoogleHero", fakeEmail, "googlepass"); loadUser(fakeEmail, "googlepass"); startGame(); };
document.getElementById("attackBtn").onclick = () => { if(pvpBattleActive) pvpAttack(); else attackEnemy(); };
document.getElementById("claimVipBtn").onclick = claimVipGift;
// ========== SEASON SYSTEM ==========
let season = {
    current: 1,
    startDate: Date.now(),
    endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
    playerScore: 0,
    rankings: [],
    missions: [
        { id: 1, name: "Season Warrior", desc: "Win 10 PvP matches", target: 10, progress: 0, completed: false, rewardGold: 50000, rewardDiamond: 50, rewardExp: 50000 },
        { id: 2, name: "Season Hunter", desc: "Kill 50 monsters", target: 50, progress: 0, completed: false, rewardGold: 30000, rewardDiamond: 30, rewardExp: 30000 },
        { id: 3, name: "Season Boss Slayer", desc: "Deal 500k damage to World Boss", target: 500000, progress: 0, completed: false, rewardGold: 100000, rewardDiamond: 100, rewardExp: 100000 }
    ],
    history: []
};

function checkSeasonReset() {
    let now = Date.now();
    if(now > season.endDate) {
        // Save to history
        season.history.push({
            season: season.current,
            rankings: [...season.rankings],
            endDate: new Date().toLocaleString()
        });
        
        // Start new season
        season.current++;
        season.startDate = now;
        season.endDate = now + 30 * 24 * 60 * 60 * 1000;
        season.playerScore = 0;
        season.rankings = [];
        season.missions.forEach(m => { m.progress = 0; m.completed = false; });
        addLog(`🌟 NEW SEASON #${season.current} HAS STARTED! 🌟`);
        saveUser();
    }
}

function updateSeasonScore(amount) {
    checkSeasonReset();
    season.playerScore += amount;
    
    // Update global rankings
    let existing = season.rankings.find(r => r.id === player.id);
    if(existing) {
        existing.score = season.playerScore;
    } else {
        season.rankings.push({ name: player.name, id: player.id, score: season.playerScore });
    }
    season.rankings.sort((a,b) => b.score - a.score);
    saveUser();
}

function updateSeasonMission(missionId, amount) {
    checkSeasonReset();
    let mission = season.missions.find(m => m.id === missionId);
    if(mission && !mission.completed) {
        mission.progress += amount;
        if(mission.progress >= mission.target) {
            mission.completed = true;
            addLog(`🏆 SEASON MISSION COMPLETED: ${mission.name}!`);
            player.gold += mission.rewardGold;
            player.diamond += mission.rewardDiamond;
            addExp(mission.rewardExp);
            addLog(`💰 Rewards: +${mission.rewardGold} Gold, +${mission.rewardDiamond}💎, +${mission.rewardExp} EXP`);
            saveUser();
            updateUI();
        }
    }
}

function claimSeasonReward() {
    checkSeasonReset();
    let myRank = season.rankings.findIndex(r => r.id === player.id) + 1;
    let reward = { gold: 0, diamond: 0, costume: null };
    
    if(myRank === 1) {
        reward = { gold: 500000, diamond: 500, costume: "Season Champion Costume" };
    } else if(myRank <= 10) {
        reward = { gold: 200000, diamond: 200, costume: "Season Elite Costume" };
    } else if(myRank <= 50) {
        reward = { gold: 100000, diamond: 100, costume: null };
    } else if(myRank <= 100) {
        reward = { gold: 50000, diamond: 50, costume: null };
    } else {
        reward = { gold: 20000, diamond: 20, costume: null };
    }
    
    if(season.playerScore > 0) {
        player.gold += reward.gold;
        player.diamond += reward.diamond;
        if(reward.costume) {
            player.inventory.push({ id: "season_costume_" + season.current, name: reward.costume, ap: 100000, slot: "costume" });
            addLog(`🎁 +${reward.costume} (+100,000 AP)!`);
        }
        addLog(`🏆 SEASON #${season.current} REWARD: +${reward.gold} Gold, +${reward.diamond}💎`);
        saveUser();
        updateUI();
    } else {
        addLog("⚠️ No season points earned yet!");
    }
}

function renderSeasonPanel() {
    let div = document.getElementById("seasonPanel");
    if(!div) return;
    
    checkSeasonReset();
    let daysLeft = Math.ceil((season.endDate - Date.now()) / (1000 * 60 * 60 * 24));
    let myRank = season.rankings.findIndex(r => r.id === player.id) + 1;
    let top10 = season.rankings.slice(0, 10);
    
    let missionsHtml = `<h4>📜 SEASON MISSIONS</h4>`;
    for(let m of season.missions) {
        let status = m.completed ? "✅ COMPLETED" : `${m.progress}/${m.target}`;
        missionsHtml += `<div class="quest-item ${m.completed ? 'completed' : ''}">
            <div><strong>${m.name}</strong><br>${m.desc}</div>
            <div>${status}</div>
            <div>🏆 +${m.rewardGold}💰 +${m.rewardExp}✨ +${m.rewardDiamond}💎</div>
        </div>`;
    }
    
    div.innerHTML = `
        <h3>🌟 SEASON #${season.current} 🌟</h3>
        <div>⏰ Ends in: ${daysLeft} days</div>
        <div>⭐ Your Season Score: ${season.playerScore.toLocaleString()}</div>
        <div>🏅 Current Rank: #${myRank > 0 ? myRank : '?'}</div>
        <div class="tournament-rankings">
            <h4>🏆 TOP 10</h4>
            ${top10.map((p,i)=>`<div class="leaderboard-entry ${p.id===player.id?'current-player':''}"><span>${i+1}.</span><span>${p.name}</span><span>${p.score} pts</span></div>`).join("")}
        </div>
        ${missionsHtml}
        <button onclick="claimSeasonReward()" class="tournament-join-btn" style="background:#facc15;color:#0f172a">🎁 CLAIM SEASON REWARD</button>
    `;
}// ========== QUEST LINE SYSTEM ==========
let questLine = {
    currentQuest: 1,
    completedQuests: [],
    quests: [
        { id: 1, name: "The First Step", desc: "Kill 5 Goblins", type: "kill", target: 5, progress: 0, completed: false, levelReq: 1, rewardExp: 5000, rewardGold: 2000, rewardDiamond: 0, rewardItem: null },
        { id: 2, name: "Goblin Problem", desc: "Kill 10 Goblins", type: "kill", target: 10, progress: 0, completed: false, levelReq: 2, rewardExp: 10000, rewardGold: 5000, rewardDiamond: 0, rewardItem: null },
        { id: 3, name: "Forest Danger", desc: "Kill 3 Forest Trolls", type: "kill_specific", target: 3, progress: 0, completed: false, levelReq: 5, rewardExp: 15000, rewardGold: 8000, rewardDiamond: 5, rewardItem: "Forest Hunter Bow" },
        { id: 4, name: "Dark Forces", desc: "Win 3 PvP matches", type: "pvp_win", target: 3, progress: 0, completed: false, levelReq: 8, rewardExp: 20000, rewardGold: 10000, rewardDiamond: 10, rewardItem: null },
        { id: 5, name: "World Boss Threat", desc: "Hit World Boss 5 times", type: "wb_hit", target: 5, progress: 0, completed: false, levelReq: 10, rewardExp: 30000, rewardGold: 15000, rewardDiamond: 15, rewardItem: "Dragon Scale Armor" },
        { id: 6, name: "Guild Unity", desc: "Join or create a guild", type: "guild", target: 1, progress: 0, completed: false, levelReq: 15, rewardExp: 40000, rewardGold: 20000, rewardDiamond: 20, rewardItem: null },
        { id: 7, name: "Arena Champion", desc: "Reach 1000 PvP Score", type: "pvp_score", target: 1000, progress: 0, completed: false, levelReq: 20, rewardExp: 50000, rewardGold: 30000, rewardDiamond: 30, rewardItem: "Champion's Sword" },
        { id: 8, name: "Legendary Hunter", desc: "Kill 100 monsters", type: "kill", target: 100, progress: 0, completed: false, levelReq: 25, rewardExp: 75000, rewardGold: 50000, rewardDiamond: 50, rewardItem: null },
        { id: 9, name: "Divine Power", desc: "Reach Divine rank", type: "rank", target: 1, progress: 0, completed: false, levelReq: 30, rewardExp: 100000, rewardGold: 100000, rewardDiamond: 100, rewardItem: "Divine Wings" },
        { id: 10, name: "The Final Chapter", desc: "Complete all previous quests", type: "complete_all", target: 1, progress: 0, completed: false, levelReq: 35, rewardExp: 200000, rewardGold: 200000, rewardDiamond: 200, rewardItem: "Legendary Hero Costume" }
    ]
};

function updateQuestLineProgress(type, amount = 1, extra = null) {
    let current = questLine.quests.find(q => q.id === questLine.currentQuest);
    if(!current || current.completed) return;
    
    if(type === "kill_specific" && extra) {
        if(current.type === "kill_specific" && current.desc.includes(extra)) {
            current.progress += amount;
        }
    } else if(current.type === type) {
        current.progress += amount;
    } else if(type === "kill" && current.type === "kill") {
        current.progress += amount;
    } else if(type === "pvp_score" && current.type === "pvp_score") {
        current.progress = pvp.score;
    } else if(type === "rank" && current.type === "rank") {
        if(pvp.rank === "Divine" || pvp.rank === "Emperor") current.progress = 1;
    } else if(type === "guild" && current.type === "guild") {
        if(player.guild) current.progress = 1;
    }
    
    if(current.progress >= current.target) {
        current.progress = current.target;
        current.completed = true;
        addLog(`📜 QUEST COMPLETED: ${current.name}!`);
        
        // Claim rewards automatically
        player.gold += current.rewardGold;
        player.diamond += current.rewardDiamond;
        addExp(current.rewardExp);
        addLog(`💰 Rewards: +${current.rewardGold} Gold, +${current.rewardExp} EXP, +${current.rewardDiamond}💎`);
        
        if(current.rewardItem) {
            let item = { id: "quest_" + current.id, name: current.rewardItem, ap: 10000 * current.id, slot: "costume" };
            player.inventory.push(item);
            addLog(`🎁 Item reward: ${current.rewardItem}`);
        }
        
        // Move to next quest
        if(questLine.currentQuest < questLine.quests.length) {
            questLine.currentQuest++;
            addLog(`📜 New quest unlocked: ${questLine.quests[questLine.currentQuest-1].name}`);
        } else {
            addLog(`🏆 ALL QUESTS COMPLETED! You are a true hero of Aetheria! 🏆`);
        }
        
        saveUser();
        updateUI();
        renderQuestLinePanel();
    }
    saveUser();
    renderQuestLinePanel();
}

function renderQuestLinePanel() {
    let div = document.getElementById("questLinePanel");
    if(!div) return;
    
    let current = questLine.quests.find(q => q.id === questLine.currentQuest);
    let completedCount = questLine.quests.filter(q => q.completed).length;
    
    let html = `<h3>📜 MAIN QUEST LINE (${completedCount}/${questLine.quests.length})</h3>`;
    
    if(current) {
        let percent = (current.progress / current.target) * 100;
        html += `
            <div class="current-quest">
                <div><strong>${current.name}</strong> (Level ${current.levelReq}+)</div>
                <div>${current.desc}</div>
                <div class="ach-progress"><div class="ach-progress-bar" style="width:${percent}%"></div></div>
                <div>Progress: ${current.progress}/${current.target}</div>
                <div class="quest-reward">🏆 Reward: +${current.rewardGold}💰 +${current.rewardExp}✨ ${current.rewardDiamond > 0 ? `+${current.rewardDiamond}💎` : ''} ${current.rewardItem ? `+${current.rewardItem}` : ''}</div>
            </div>
        `;
    }
    
    // Show upcoming quests
    let upcoming = questLine.quests.filter(q => q.id > questLine.currentQuest && !q.completed).slice(0, 3);
    if(upcoming.length > 0) {
        html += `<h4>🔒 Upcoming Quests</h4>`;
        for(let q of upcoming) {
            html += `<div class="upcoming-quest"><span>${q.name}</span><span>Level ${q.levelReq}+</span></div>`;
        }
    }
    
    div.innerHTML = html;
}// ========== EVENT SYSTEM ==========
let activeEvent = null;
let eventShop = [];
let eventCurrency = 0;

const events = [
    { id: 1, name: "Double EXP Weekend", desc: "2x EXP from all sources", type: "double_exp", startDate: Date.now(), endDate: Date.now() + 3 * 24 * 60 * 60 * 1000, bonus: 2 },
    { id: 2, name: "Boss Hunt", desc: "World Boss gives double rewards", type: "double_wb", startDate: Date.now(), endDate: Date.now() + 2 * 24 * 60 * 60 * 1000, bonus: 2 },
    { id: 3, name: "PvP Rush", desc: "Double PvP points", type: "double_pvp", startDate: Date.now(), endDate: Date.now() + 1 * 24 * 60 * 60 * 1000, bonus: 2 },
    { id: 4, name: "Golden Hour", desc: "Extra Gold from monsters", type: "double_gold", startDate: Date.now() + 5 * 24 * 60 * 60 * 1000, endDate: Date.now() + 6 * 24 * 60 * 60 * 1000, bonus: 2 }
];

const eventShopItems = [
    { id: 1, name: "Event Scroll x5", price: 100, type: "scroll", icon: "📜" },
    { id: 2, name: "Premium Scroll x1", price: 200, type: "premium_scroll", icon: "🛡️" },
    { id: 3, name: "Event Costume", price: 500, type: "costume", ap: 25000, icon: "👘" },
    { id: 4, name: "Event Mount", price: 400, type: "mount", ap: 20000, icon: "🐴" },
    { id: 5, name: "Diamond x10", price: 50, type: "diamond", icon: "💎" }
];

function checkActiveEvent() {
    let now = Date.now();
    for(let e of events) {
        if(now >= e.startDate && now <= e.endDate) {
            activeEvent = e;
            return e;
        }
    }
    activeEvent = null;
    return null;
}

function getEventBonus(type) {
    if(!activeEvent) return 1;
    if(activeEvent.type === type) return activeEvent.bonus;
    if(activeEvent.type === "double_exp" && type === "exp") return activeEvent.bonus;
    if(activeEvent.type === "double_gold" && type === "gold") return activeEvent.bonus;
    return 1;
}

function addEventCurrency(amount) {
    eventCurrency += amount;
    addLog(`🎉 +${amount} Event Currency! Total: ${eventCurrency}`);
    renderEventPanel();
    saveUser();
}

function buyEventItem(itemId) {
    let item = eventShopItems.find(i => i.id === itemId);
    if(!item) return;
    if(eventCurrency < item.price) {
        addLog(`❌ Need ${item.price} Event Currency!`);
        return;
    }
    eventCurrency -= item.price;
    
    if(item.type === "scroll") {
        upgradeScrolls.normal += 5;
        addLog(`📜 Bought 5 Normal Scrolls!`);
    } else if(item.type === "premium_scroll") {
        upgradeScrolls.premium += 1;
        addLog(`🛡️ Bought 1 Premium Scroll!`);
    } else if(item.type === "diamond") {
        player.diamond += 10;
        addLog(`💎 Bought 10 Diamonds!`);
    } else if(item.type === "costume") {
        player.inventory.push({ id: "event_costume", name: item.name, ap: item.ap, slot: "costume" });
        addLog(`👘 Bought ${item.name} (+${item.ap.toLocaleString()} AP)!`);
    } else if(item.type === "mount") {
        player.inventory.push({ id: "event_mount", name: item.name, ap: item.ap, slot: "mount" });
        addLog(`🐴 Bought ${item.name} (+${item.ap.toLocaleString()} AP)!`);
    }
    
    saveUser();
    updateUI();
    renderEventPanel();
}

function renderEventPanel() {
    let div = document.getElementById("eventPanel");
    if(!div) return;
    
    let event = checkActiveEvent();
    
    if(!event) {
        div.innerHTML = `<h3>🎉 ACTIVE EVENT</h3><div>No active event at the moment. Check back soon!</div>`;
        return;
    }
    
    let timeLeft = Math.ceil((event.endDate - Date.now()) / (1000 * 60 * 60));
    let bonusText = "";
    if(event.type === "double_exp") bonusText = "✨ 2x EXP from all sources!";
    else if(event.type === "double_wb") bonusText = "🌍 2x World Boss rewards!";
    else if(event.type === "double_pvp") bonusText = "🏆 2x PvP points!";
    else if(event.type === "double_gold") bonusText = "💰 2x Gold from monsters!";
    
    div.innerHTML = `
        <h3>🎉 ${event.name} 🎉</h3>
        <div>⏰ Ends in: ${timeLeft} hours</div>
        <div>${bonusText}</div>
        <div>🎁 Event Currency: ${eventCurrency}</div>
        <div class="event-shop">
            <h4>🛒 EVENT SHOP</h4>
            ${eventShopItems.map(item => `
                <div class="event-shop-item">
                    <span>${item.icon} ${item.name}</span>
                    <span>💰 ${item.price}</span>
                    <button onclick="buyEventItem(${item.id})">BUY</button>
                </div>
            `).join("")}
        </div>
    `;
}// ========== COSTUME SET SYSTEM ==========
const costumeSets = {
    Angel: { pieces: ["Angel Wings", "Angel Armor", "Angel Halo"], bonusAp: 50000, icon: "😇" },
    Demon: { pieces: ["Demon Wings", "Demon Costume", "Demon Horns"], bonusAp: 50000, icon: "😈" },
    Dragon: { pieces: ["Dragon Wings", "Dragon Scale Armor", "Dragon Helmet"], bonusAp: 75000, icon: "🐉" },
    Royal: { pieces: ["Royal Cloak", "Royal Crown", "Royal Scepter"], bonusAp: 40000, icon: "👑" },
    Shadow: { pieces: ["Shadow Wings", "Shadow Suit", "Shadow Mask"], bonusAp: 60000, icon: "🌑" }
};

let activeSetBonuses = {};

function calculateSetBonus() {
    let wornPieces = {};
    for(let set in costumeSets) {
        wornPieces[set] = 0;
    }
    
    for(let slot in player.equipment) {
        let item = player.equipment[slot];
        if(item && item.name) {
            for(let set in costumeSets) {
                if(costumeSets[set].pieces.includes(item.name)) {
                    wornPieces[set]++;
                }
            }
        }
    }
    
    let totalBonus = 0;
    for(let set in wornPieces) {
        let count = wornPieces[set];
        let bonus = 0;
        if(count >= 4) bonus = costumeSets[set].bonusAp;
        else if(count >= 3) bonus = Math.floor(costumeSets[set].bonusAp * 0.7);
        else if(count >= 2) bonus = Math.floor(costumeSets[set].bonusAp * 0.4);
        
        if(bonus > 0) {
            activeSetBonuses[set] = { count, bonus };
            totalBonus += bonus;
        } else {
            delete activeSetBonuses[set];
        }
    }
    
    return totalBonus;
}

function renderSetBonusPanel() {
    let div = document.getElementById("setBonusPanel");
    if(!div) return;
    
    let totalBonus = calculateSetBonus();
    
    let html = `<h3>👘 COSTUME SET BONUS</h3>`;
    html += `<div>✨ Total Set Bonus: +${totalBonus.toLocaleString()} AP</div>`;
    
    for(let set in activeSetBonuses) {
        let info = activeSetBonuses[set];
        let percent = info.count === 4 ? "100%" : info.count === 3 ? "70%" : "40%";
        html += `
            <div class="set-bonus-item active">
                <span>${costumeSets[set].icon} ${set} Set</span>
                <span>${info.count}/4 pieces (${percent})</span>
                <span>+${info.bonus.toLocaleString()} AP</span>
            </div>
        `;
    }
    
    // Show incomplete sets
    for(let set in costumeSets) {
        if(!activeSetBonuses[set]) {
            let worn = 0;
            for(let slot in player.equipment) {
                let item = player.equipment[slot];
                if(item && costumeSets[set].pieces.includes(item.name)) worn++;
            }
            if(worn > 0) {
                html += `
                    <div class="set-bonus-item incomplete">
                        <span>${costumeSets[set].icon} ${set} Set</span>
                        <span>${worn}/4 pieces</span>
                        <span>Next: ${worn === 1 ? 2 : worn === 2 ? 3 : 4} pieces for bonus</span>
                    </div>
                `;
            }
        }
    }
    
    div.innerHTML = html;
}