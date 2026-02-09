/* ---------------- DATA ---------------- */
let selectedSeries = null;
let currentWheelSeries = null;

const wheelPrices = { "Naruto":5, "One Piece":5, "One Punch Man":10, "Dandadan":10, "Jujutsu Kaisen":10 };
const rarityXP = { Common:15, Uncommon:25, Rare:50, Legendary:100 };

const defaultData = {
  hwp: 0,
  tasks: [],
  selectedCharacter: 'naruto',
  characters: {
    /*Naruto Characters*/
    naruto:{name:"Naruto",series:"Naruto",rarity:"Common",unlocked:true,level:1,xp:0},
    sakura:{name:"Sakura",series:"Naruto",rarity:"Common",unlocked:false,level:1,xp:0},
    sasuke:{name:"Sasuke",series:"Naruto",rarity:"Uncommon",unlocked:false,level:1,xp:0},
    hinata:{name:"Hinata",series:"Naruto",rarity:"Uncommon",unlocked:false,level:1,xp:0},
    rocklee:{name:"Rock Lee",series:"Naruto",rarity:"Uncommon",unlocked:false,level:1,xp:0},
    kakashi:{name:"Kakashi",series:"Naruto",rarity:"Rare",unlocked:false,level:1,xp:0},
    tsunade:{name:"Tsunade",series:"Naruto",rarity:"Rare",unlocked:false,level:1,xp:0},
    hiruzen:{name:"Hiruzen",series:"Naruto",rarity:"Rare",unlocked:false,level:1,xp:0},
    madara:{name:"Madara",series:"Naruto",rarity:"Legendary",unlocked:false,level:1,xp:0},
    /*One Piece Characters*/
    luffy:{name:"Luffy",series:"One Piece",rarity:"Common",unlocked:false,level:1,xp:0},
    nami:{name:"Nami",series:"One Piece",rarity:"Common",unlocked:false,level:1,xp:0},
    sanji:{name:"Sanji",series:"One Piece",rarity:"Uncommon",unlocked:false,level:1,xp:0},
    chopper:{name:"Chopper",series:"One Piece",rarity:"Rare",unlocked:false,level:1,xp:0},
    zoro:{name:"Zoro",series:"One Piece",rarity:"Rare",unlocked:false,level:1,xp:0},
    shanks:{name:"Shanks",series:"One Piece",rarity:"Legendary",unlocked:false,level:1,xp:0},
    enel:{name:"Enel",series:"One Piece",rarity:"Legendary",unlocked:false,level:1,xp:0},
    /*One Punch Man Characters*/
    smileman:{name:"Smile Man",series:"One Punch Man",rarity:"Common",unlocked:false,level:1,xp:0},
    tanktoptiger:{name:"Tank Top Tiger",series:"One Punch Man",rarity:"Common",unlocked:false,level:1,xp:0},
    mumenrider:{name:"Mumen Rider",series:"One Punch Man",rarity:"Uncommon",unlocked:false,level:1,xp:0},
    fubuki:{name:"Fubuki",series:"One Punch Man",rarity:"Uncommon",unlocked:false,level:1,xp:0},
    genos:{name:"Genos",series:"One Punch Man",rarity:"Rare",unlocked:false,level:1,xp:0},
    garou:{name:"Garou",series:"One Punch Man",rarity:"Legendary",unlocked:false,level:1,xp:0},
    saitama:{name:"Saitama",series:"One Punch Man",rarity:"Legendary",unlocked:false,level:1,xp:0},
    /*Dandadan Characters*/
    okarun:{name:"Okarun",series:"Dandadan",rarity:"Common",unlocked:false,level:1,xp:0},
    manjiro:{name:"Manjiro",series:"Dandadan",rarity:"Common",unlocked:false,level:1,xp:0},
    aira:{name:"Aira",series:"Dandadan",rarity:"Common",unlocked:false,level:1,xp:0},
    jiji:{name:"Jiji",series:"Dandadan",rarity:"Uncommon",unlocked:false,level:1,xp:0},
    momo:{name:"Momo",series:"Dandadan",rarity:"Rare",unlocked:false,level:1,xp:0},
    seiko:{name:"Seiko",series:"Dandadan",rarity:"Rare",unlocked:false,level:1,xp:0},
    turbogranny:{name:"Turbo Granny",series:"Dandadan",rarity:"Legendary",unlocked:false,level:1,xp:0},
    /*Jujutsu Kaisen*/
    momojjk:{name:"Momo",series:"Jujutsu Kaisen",rarity:"Common",unlocked:false,level:1,xp:0},
    maijjk:{name:"Mai Zenin",series:"Jujutsu Kaisen",rarity:"Common",unlocked:false,level:1,xp:0},
    maki:{name:"Maki Zenin",series:"Jujutsu Kaisen",rarity:"Uncommon",unlocked:false,level:1,xp:0},
    pandajjk:{name:"Panda",series:"Jujutsu Kaisen",rarity:"Uncommon",unlocked:false,level:1,xp:0},
    inumaki:{name:"Inumaki",series:"Jujutsu Kaisen",rarity:"Uncommon",unlocked:false,level:1,xp:0},
    itadori:{name:"Yuji",series:"Jujutsu Kaisen",rarity:"Rare",unlocked:false,level:1,xp:0},
    megumi:{name:"Megumi",series:"Jujutsu Kaisen",rarity:"Rare",unlocked:false,level:1,xp:0},
    nobara:{name:"Nobara",series:"Jujutsu Kaisen",rarity:"Rare",unlocked:false,level:1,xp:0},
    nanami:{name:"Nanami",series:"Jujutsu Kaisen",rarity:"Rare",unlocked:false,level:1,xp:0},
    sukuna:{name:"Sukuna",series:"Jujutsu Kaisen",rarity:"Legendary",unlocked:false,level:1,xp:0},
    gojo:{name:"Gojo",series:"Jujutsu Kaisen",rarity:"Legendary",unlocked:false,level:1,xp:0},
  },
  achievementsClaimed: {} 
};

let data = JSON.parse(JSON.stringify(defaultData));
data.selectedPFP = data.selectedPFP || null; 
data.pfpNames = data.pfpNames || {};

/* ---------------- SAVE EXPORT / IMPORT ---------------- */
function exportSave(){
  const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'anime-habit-tracker-save.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importSave(e){
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);

      // Merge characters
      Object.entries(imported.characters||{}).forEach(([k,c])=>{data.characters[k]=c;});
      if(imported.tasks) data.tasks = imported.tasks;
      if(imported.hwp) data.hwp = imported.hwp;
      if(imported.selectedCharacter) data.selectedCharacter = imported.selectedCharacter;
      if(imported.selectedPFP) data.selectedPFP = imported.selectedPFP;
      if(imported.pfpNames) data.pfpNames = imported.pfpNames;
      if(imported.achievementsClaimed) data.achievementsClaimed = imported.achievementsClaimed;

      // Fix PFPs: ensure every series array exists
      data.pfps = data.pfps || {};
      if(imported.pfps){
        Object.entries(imported.pfps).forEach(([series,pfps])=>{
          data.pfps[series] = data.pfps[series] || [];
          pfps.forEach(p=>{
            // only add if it doesn't exist already
            if(!data.pfps[series].some(x=>x.image===p.image)) data.pfps[series].push(p);
          });
        });
      }

      selectedPFPSeries = null; // reset selected series so menu can pick the first one
      render();
      alert('Save imported successfully!');
    } catch { alert('Invalid save file'); }
  };
  reader.readAsText(file);
}

/* ---------------- MENUS ---------------- */
function openMenu(id){ document.querySelectorAll('.menu').forEach(m=>m.classList.remove('active')); document.getElementById(id).classList.add('active'); }
function backToWheelMenu(){ currentWheelSeries=null; openMenu('wheelMenu'); renderWheelMenu(); }

/* ---------------- TASKS ---------------- */
function addTask(){
  const name = taskName.value.trim();
  let hwp = Number(taskHWP.value);

  if(!name || hwp <= 0) return;

  // Cap HWP at 100
  if(hwp > 100) hwp = 100;

  data.tasks.push({ name, hwp, done:false });
  taskName.value=''; taskHWP.value='';
  render();
}


function completeTask(i){
  const t = data.tasks[i];
  if(t.done) return;
  t.done = true;
  data.hwp += t.hwp;
  gainXP(t.hwp);
  render();
}

function deleteTask(i){ data.tasks.splice(i,1); render(); }
function resetTasks(){ data.tasks.forEach(t=>t.done=false); render(); }

/* ---------------- XP ---------------- */
function gainXP(amount){
  const c = data.characters[data.selectedCharacter];
  if(!c || !c.unlocked) return;
  c.xp += amount;
}

/* Manual level-up */
function levelUp(key){
  const c = data.characters[key];
  if(!c || !c.unlocked) return;
  const baseXP = rarityXP[c.rarity] || 100;
  const nextLevelXP = c.level * baseXP;
  if(c.xp >= nextLevelXP){
    c.xp -= nextLevelXP;
    c.level++;
    render();
  }
}

function selectCharacter(key){ const c=data.characters[key]; if(!c.unlocked) return; data.selectedCharacter=key; render(); }

/* ---------------- WHEEL ---------------- */
function spinWheel(){
  const price = wheelPrices[currentWheelSeries] || 50;
  if(data.hwp < price) return;
  data.hwp -= price;

  const roll = Math.random()*100;
  let rarity='Nothing';
  if(roll<=1) rarity='Legendary';
  else if(roll<=6) rarity='Rare';
  else if(roll<=16) rarity='Uncommon';
  else if(roll<=46) rarity='Common';

  const locked = Object.entries(data.characters).filter(([k,c])=>!c.unlocked && c.rarity===rarity && c.series===currentWheelSeries);

  if(locked.length){ locked[0][1].unlocked=true; wheelResult.innerText=`Unlocked ${locked[0][1].name}!`; }
  else wheelResult.innerText = "Nothing";

  render();
}

/* ---------------- REWARDS ---------------- */
const rewardShop = [
  { id:"socials", name:"Use Social Media For 15 Minutes", cost:10, emoji:"📱", text:"Doomscroll" },
  { id:"anime", name:"Watch 1 Anime Episode", cost:20, emoji:"🎬", text:"Summer Time Rendering is peak" },
  { id:"game", name:"Play Games For 30 Minutes", cost:30, emoji:"🎮", text:"Spin A Baddie..." }
];

function renderRewards(){
  const rewardList=document.getElementById('rewardList');
  rewardList.innerHTML='';
  rewardShop.forEach(r=>{
    const card=document.createElement('div');
    card.className='reward-card';
    card.innerHTML=`
      <div class="reward-emoji">${r.emoji}</div>
      <strong>${r.name}</strong>
      <div>Cost: ${r.cost} HWP</div>
      <div class="reward-text">${r.text}</div>
      <button onclick="claimReward('${r.id}')">CLAIM</button>
    `;
    rewardList.appendChild(card);
  });
}

function claimReward(id){
  const reward = rewardShop.find(r=>r.id===id);
  if(!reward) return;
  if(data.hwp < reward.cost){ alert("Not enough HWP!"); return; }
  data.hwp -= reward.cost;
  render();
  alert(`Reward claimed: ${reward.name} 🎉 Enjoy!`);
  openMenu('tasks');
}

/* ---------------- RENDER ---------------- */
function render(){
  hwpDisplay.innerText=data.hwp;
  taskList.innerHTML='';
  data.tasks.forEach((t,i)=>{
    const d=document.createElement('div');
    d.className='task'+(t.done?' done':'');
    d.innerHTML=`<span>${t.name} (+${t.hwp})</span>
      <span>
        <button onclick="completeTask(${i})" ${t.done?'disabled':''}>Done</button>
        <button onclick="deleteTask(${i})">❌</button>
      </span>`;
    taskList.appendChild(d);
  });

  const allDone=data.tasks.length && data.tasks.every(t=>t.done);
  document.getElementById('taskMessage').style.display=allDone?'block':'none';

  characterList.innerHTML=''; seriesButtons.innerHTML='';
  const bySeries={};
  Object.entries(data.characters).forEach(([k,c])=>{
    if(!bySeries[c.series]) bySeries[c.series]=[];
    bySeries[c.series].push({key:k,...c});
  });

  Object.keys(bySeries).sort().forEach(series=>{
    const btn=document.createElement('button');
    btn.innerText=series;
    btn.onclick=()=>{ selectedSeries=series; render(); };
    seriesButtons.appendChild(btn);
  });

  if(!selectedSeries) selectedSeries = Object.keys(bySeries)[0];

  const seriesDiv=document.createElement('div');
  seriesDiv.innerHTML=`<h3>${selectedSeries}</h3>`;
  bySeries[selectedSeries].forEach(c=>{
    const baseXP = rarityXP[c.rarity]||100;
    const nextLevelXP = c.level*baseXP;
    const pct=Math.min(100,(c.xp/nextLevelXP)*100);
    const div=document.createElement('div');
    div.className='character'+(c.unlocked?'':' locked')+(data.selectedCharacter===c.key?' selected':'');
    div.innerHTML=`<strong>${c.name}</strong> (${c.rarity})<br>${c.unlocked?`Lvl ${c.level}`:'🔒 Locked'}
      <div class='xp-bar'><div class='xp-fill' style='width:${pct}%'></div></div>
      <small>${c.xp}/${nextLevelXP} XP</small>
      ${c.unlocked && c.xp>=nextLevelXP ? `<button onclick="levelUp('${c.key}')">LEVEL UP</button>` : ''}`;
    div.onclick=()=>selectCharacter(c.key);
    seriesDiv.appendChild(div);
  });
  characterList.appendChild(seriesDiv);
  renderWheelMenu();
  renderRewards();
  renderAchievements();
  renderProfile();
  updateProfilePFP(); // at the end of renderProfile to update the circle
}

/* ---------------- WHEEL MENU ---------------- */
function renderWheelMenu(){
  wheelSeriesButtons.innerHTML='';
  const seriesList=[...new Set(Object.values(data.characters).map(c=>c.series))];
  seriesList.forEach(s=>{
    const btn=document.createElement('button');
    btn.innerText=`${s} Wheel`;
    btn.onclick=()=>openWheel(s);
    wheelSeriesButtons.appendChild(btn);
  });
}

function openWheel(series){
  currentWheelSeries=series;
  const price=wheelPrices[series]||50;
  wheelTitle.innerText=`${series} Wheel`;
  spinButton.innerText=`Spin (${price} HWP)`;
  wheelResult.innerText='SPIN';
  openMenu('wheel');
}

/* ---------------- ACHIEVEMENT HELPERS ---------------- */
function isUnlocked(...keys) {
  return keys.every(k => data.characters[k]?.unlocked);
}

function anyUnlocked(...keys) {
  return keys.some(k => data.characters[k]?.unlocked);
}

function isLevelAtLeast(level, ...keys) {
  return keys.every(k => data.characters[k]?.level >= level);
}

/* ---------------- ACHIEVEMENTS ---------------- */
const achievementsData = {
  /*Naruto*/
  "Naruto": [{id: "naruto_level5", task: "Naruto - Level 5", displayName: "Kid Naruto", hwp: 5, image: "images/kidnaruto.png", unlocked: false, claimed: false, condition: () => isLevelAtLeast(5, "naruto")},
  {id: "sakura_level5", task: "Sakura - Level 5", displayName: "Kid Sakura", hwp: 5, image: "images/kidsakura.png", unlocked: false, claimed: false, condition: () => isLevelAtLeast(5, "sakura")},
  {id: "sasuke_level5", task: "Sasuke - Level 5", displayName: "Kid Sasuke", hwp: 5, image: "images/kidsasuke.png", unlocked: false, claimed: false, condition: () => isLevelAtLeast(5, "sasuke")},
  {id: "team7_unlocked", task: "Unlock All Of Team 7", displayName: "Team 7", hwp: 10, image: "images/team7.png", unlocked: false, claimed: false, condition: () => isUnlocked("naruto", "sakura", "sasuke")},
  {id: "kakashi_level5", task: "Kakashi - Level 5", displayName: "Kakashi", hwp: 5, image: "images/kakashi.png", unlocked: false, claimed: false, condition: () => isLevelAtLeast(5, "kakashi")},
  {id: "madara_unlocked", task: "Unlock Madara", displayName: "Madara", hwp: 10, image: "images/madara.png", unlocked: false, claimed: false, condition: () => isUnlocked("madara")}],
  /*One Piece*/
  "One Piece": [{id: "luffy_level5", task: "Luffy - Level 5", displayName: "PTS Luffy", hwp: 5, image: "images/ptsluffy.png", unlocked: false, claimed: false, condition: () => isLevelAtLeast(5, "luffy")},
  {id: "nami_level5", task: "Nami - Level 5", displayName: "PTS Nami", hwp: 5, image: "images/ptsnami.png", unlocked: false, claimed: false, condition: () => isLevelAtLeast(5, "nami")},
  {id: "sanji_level5", task: "Sanji - Level 5", displayName: "PTS Sanji", hwp: 5, image: "images/ptssanji.png", unlocked: false, claimed: false, condition: () => isLevelAtLeast(5, "sanji")},
  {id: "chopper_level5", task: "Chopper - Level 5", displayName: "Chopper", hwp: 5, image: "images/chopper.png", unlocked: false, claimed: false, condition: () => isLevelAtLeast(5, "chopper")},
  {id: "zoro_level5", task: "Zoro - Level 5", displayName: "PTS Zoro", hwp: 5, image: "images/ptszoro.png", unlocked: false, claimed: false, condition: () => isLevelAtLeast(5, "zoro")},
  {id: "shanks_level5", task: "Unlock Shanks", displayName: "PTS Shanks", hwp: 10, image: "images/ptsshanks.png", unlocked: false, claimed: false, condition: () => isUnlocked("shanks")}],
  /*One Punch Man*/
  "One Punch Man": [{id: "smileman_level5", task: "Smileman - Level 5", displayName: "Smileman", hwp: 5, image: "images/smileman.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "smileman")},
    {id: "tanktop_level5", task: "Tank Top Tiger - Level 5", displayName: "Tank Top Tiger", hwp: 5, image: "images/tanktop.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "tanktop")},
    {id: "mumenrider_level5", task: "Mumen Rider - Level 5", displayName: "Mumen Rider", hwp: 5, image: "images/mumenrider.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "mumenider")},
    {id: "fubuki_level5", task: "Fubuki - Level 5", displayName: "Fubuki", hwp: 5, image: "images/fubuki.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "fubuki")},
    {id: "genos_level5", task: "Genos - Level 5", displayName: "Genos", hwp: 5, image: "images/genos.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "genos")},
    {id: "garou_unlocked", task: "Unlock Garou", displayName: "Garou", hwp: 10, image: "images/garou.png", unlocked: false, claimed: false, condition: ()=> isUnlocked("garou")},
    {id: "saitama_unlocked", task: "Unlock Saitama", displayName: "Saitama", hwp: 10, image: "images/saitama.png", unlocked: false, claimed: false, condition: ()=> isUnlocked("saitama")}],
  /*Dandadan*/
  "Dandadan": [{id: "okarun_level5", task: "Okarun - Level 5", displayName: "Okarun", hwp: 5, image: "images/okarun.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "okarun")},
  {id: "aira_level5", task: "Aira - Level 5", displayName: "Aira", hwp: 5, image: "images/aira.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "aira")},
  {id: "jiji_level5", task: "Jiji - Level 5", displayName: "Jiji", hwp: 5, image: "images/jiji.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "jiji")},
  {id: "momo_level5", task: "Momo - Level 5", displayName: "Momo", hwp: 5, image: "images/momo.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "momo")},
  {id: "seiko_level5", task: "Seiko - Level 5", displayName: "Seiko", hwp: 5, image: "images/seiko.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "seiko")},
  {id: "turbogranny_unlocked", task: "Unlock Turbo Granny", displayName: "Turbo Granny", hwp: 10, image: "images/turbogranny.png", unlocked: false, claimed: false, condition: ()=> isUnlocked("turbogranny")}],
  /*Jujutsu Kaisen*/
  "Jujutsu Kaisen": [{id: "momojjk_level5", task: "Momo - Level 5", displayName: "Momo", hwp: 5, image: "images/momojjk.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "momojjk")},
  {id: "maijjk_level5", task: "Mai - Level 5", displayName: "Mai Zenin", hwp: 5, image: "images/maizenin.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "maijjk")},
  {id: "makizenin_level5", task: "Maki - Level 5", displayName: "Maki Zenin", hwp: 5, image: "images/makizenin.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "maki")},
  {id: "pandajjk_level5", task: "Panda - Level 5", displayName: "Panda", hwp: 5, image: "images/panda.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "pandajjk")},
  {id: "inumaki_level5", task: "Inumaki - Level 5", displayName: "Inumaki", hwp: 5, image: "images/inumaki.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "inumaki")},
  {id: "itadori_level5", task: "Yuji - Level 5", displayName: "Yuji", hwp: 5, image: "images/yuji.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "itadori")},
  {id: "megumi_level5", task: "Megumi - Level 5", displayName: "Megumi", hwp: 5, image: "images/megumi.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "megumi")},
  {id: "nobara_level5", task: "Nobara - Level 5", displayName: "Nobara", hwp: 5, image: "images/nobara.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "nobara")},
  {id: "nanami_level5", task: "Nanami - Level 5", displayName: "Nanami", hwp: 5, image: "images/nanami.png", unlocked: false, claimed: false, condition: ()=> isLevelAtLeast(5, "nanami")},
  {id: "sukuna_unlocked", task: "Unlock Sukuna", displayName: "Sukuna", hwp: 10, image: "images/sukuna.png", unlocked: false, claimed: false, condition: ()=> isUnlocked("sukuna")},
  {id: "gojo_unlocked", task: "Unlock Gojo", displayName: "Gojo", hwp: 10, image: "images/gojo.png", unlocked: false, claimed: false, condition: ()=> isUnlocked("gojo")}],
};

let selectedAchievementSeries = null;

function renderAchievements(){
  achievementSeriesButtons.innerHTML='';
  Object.keys(achievementsData).sort().forEach(series=>{
    const btn=document.createElement('button');
    btn.innerText=series;
    btn.onclick=()=>{ selectedAchievementSeries=series; renderAchievements(); };
    achievementSeriesButtons.appendChild(btn);
  });

  if(!selectedAchievementSeries) selectedAchievementSeries=Object.keys(achievementsData)[0];

  achievementList.innerHTML='';
  const list = achievementsData[selectedAchievementSeries];
  list.forEach(a=>{
    if(!a.unlocked && a.condition()) a.unlocked=true;
    if(data.achievementsClaimed[a.id]) a.claimed = true;

    const div=document.createElement('div');
    div.style.display='flex';
    div.style.alignItems='center';
    div.style.justifyContent='space-between';
    div.style.background='#222744';
    div.style.padding='8px';
    div.style.borderRadius='8px';
    div.style.margin='6px 0';

    div.innerHTML = `
   <span>${a.task}</span>
   <span>HWP: ${a.hwp}</span>
   <img src="${a.image}" style="width:40px;height:40px;border-radius:50%;margin-left:10px;">
   <button ${a.claimed ? 'disabled' : (a.unlocked ? '' : 'disabled')}
     onclick="claimAchievement('${a.id}')">
    ${a.claimed ? 'Claimed' : 'Claim'}
  </button>
   `;

    achievementList.appendChild(div);
  });
}

data.pfps = data.pfps || {}; // store unlocked PFPs by series

function claimAchievement(id){
  for(const series in achievementsData){
    const ach = achievementsData[series].find(a => a.id === id);
    if(ach && ach.unlocked && !ach.claimed){

      // Give the correct HWP reward
      data.hwp += ach.hwp;

      // Mark as claimed
      ach.claimed = true;
      data.achievementsClaimed[ach.id] = true;

      // Add achievement PFP
      data.pfps[series] = data.pfps[series] || [];
      if(!data.pfps[series].some(p => p.image === ach.image)) {
        data.pfps[series].push({ image: ach.image });
        data.pfpNames[ach.image] = ach.displayName || ach.task;
      }

      alert(`Achievement Claimed: ${ach.task} +${ach.hwp} HWP!`);
      renderAchievements();
      render();
      return;
    }
  }
}

/* ---------------- Profile & PFP Stuff ---------------- */
let selectedPFPSeries = null;

function renderProfile() {
  // Update HWP
  document.getElementById('profileHWP').innerText = data.hwp;

  updateProfilePFP(); // always update the circle
}

/* ---------------- Profile Circle & Menu ---------------- */
function updateProfilePFP() {
  const img = document.getElementById('profilePFP');
  if (data.selectedPFP) {
    img.src = data.selectedPFP;
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
  }
}

/* Clicking the black circle opens the PFP menu */
function openPFPMenu() {
  const menu = document.getElementById('pfpMenu');
  menu.style.display = 'block'; // always show menu on click

  renderPFPMenus();
}

/* Render the PFP menu with series first, then PFPs */
function renderPFPMenus() {
  const seriesList = Object.keys(data.pfps).sort();
  const seriesButtons = document.getElementById('pfpSeriesButtons');
  seriesButtons.innerHTML = '';

  seriesList.forEach(series => {
    const btn = document.createElement('button');
    btn.innerText = series;
    btn.className = (selectedPFPSeries === series ? 'selected' : '');
    btn.onclick = () => {
      selectedPFPSeries = series;
      renderPFPMenus(); // refresh grid
    };
    seriesButtons.appendChild(btn);
  });

  if (!selectedPFPSeries && seriesList.length > 0) selectedPFPSeries = seriesList[0];

  const grid = document.getElementById('pfpGrid');
  grid.innerHTML = '';
  (data.pfps[selectedPFPSeries] || []).forEach(pfp => {
    const div = document.createElement('div');
    div.className = 'reward-card' + (data.selectedPFP === pfp.image ? ' selected' : '');
    div.innerHTML = `
      <img src="${pfp.image}" style="width:80px;height:80px;border-radius:50%;">
      <div>${data.pfpNames[pfp.image] || 'Unlocked PFP'}</div>
    `;
    div.onclick = () => {
      data.selectedPFP = pfp.image;
      updateProfilePFP();
      document.getElementById('pfpMenu').style.display = 'none';
      renderPFPMenus();
    };
    grid.appendChild(div);
  });
}

render();