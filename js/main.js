// ============ boot sequence ============
(function boot(){
  const boot = document.getElementById('boot');
  const fill = document.getElementById('bootFill');
  const pct = document.getElementById('bootPct');
  let n = 0;
  const timer = setInterval(() => {
    n += Math.ceil(Math.random() * 18);
    if (n >= 100) { n = 100; clearInterval(timer); setTimeout(finish, 300); }
    fill.style.width = n + '%';
    pct.textContent = n + '%';
  }, 90);
  function finish(){ boot.classList.add('hide'); setTimeout(() => boot.remove(), 600); }
  window.addEventListener('keydown', finish, { once: true });
  boot.addEventListener('click', finish, { once: true });
})();

// ============ nav toggle (mobile) ============
(function nav(){
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  }));
})();

// ============ hero typewriter ============
(function typewriter(){
  const el = document.getElementById('heroType');
  const lines = ['whoami', 'cat manifesto.asc', 'run proof.sh --anonymous'];
  let li = 0, ci = 0, deleting = false;
  function tick(){
    const full = lines[li];
    el.textContent = deleting ? full.slice(0, ci--) : full.slice(0, ci++);
    let delay = deleting ? 40 : 85;
    if (!deleting && ci > full.length) { deleting = true; delay = 1400; }
    else if (deleting && ci < 0) { deleting = false; li = (li + 1) % lines.length; ci = 0; delay = 400; }
    setTimeout(tick, delay);
  }
  tick();
})();

// ============ town: movement + npc dialogue ============
(function town(){
  const stage = document.getElementById('townStage');
  const player = document.getElementById('player');
  if (!stage || !player) return;

  let pos = { x: 46, y: 80 }; // percent
  const speed = 2.2;
  const keys = new Set();

  function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

  function loop(){
    let dx = 0, dy = 0;
    if (keys.has('ArrowUp') || keys.has('w')) dy -= 1;
    if (keys.has('ArrowDown') || keys.has('s')) dy += 1;
    if (keys.has('ArrowLeft') || keys.has('a')) dx -= 1;
    if (keys.has('ArrowRight') || keys.has('d')) dx += 1;
    if (dx || dy) {
      const norm = Math.sqrt(dx * dx + dy * dy) || 1;
      pos.x = clamp(pos.x + (dx / norm) * speed * 0.6, 4, 96);
      pos.y = clamp(pos.y + (dy / norm) * speed, 8, 94);
      player.style.left = pos.x + '%';
      player.style.top = pos.y + '%';
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  stage.addEventListener('keydown', (e) => { keys.add(e.key); });
  stage.addEventListener('keyup', (e) => { keys.delete(e.key); });
  window.addEventListener('keydown', (e) => {
    if (document.activeElement === stage || stage.contains(document.activeElement)) keys.add(e.key);
  });
  window.addEventListener('keyup', (e) => keys.delete(e.key));
  stage.addEventListener('click', () => stage.focus());

  // NPC dialogue
  const box = document.getElementById('dialogueBox');
  const nameEl = document.getElementById('dialogueName');
  const textEl = document.getElementById('dialogueText');
  const closeBtn = document.getElementById('dialogueClose');

  document.querySelectorAll('.npc').forEach(npc => {
    npc.addEventListener('click', () => {
      nameEl.textContent = `${npc.dataset.name} — ${npc.dataset.role}`;
      textEl.textContent = npc.dataset.blurb;
      box.hidden = false;
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
  closeBtn.addEventListener('click', () => { box.hidden = true; });
})();

// ============ status: fake live counter ============
(function statusCounter(){
  const el = document.getElementById('proofsCounter');
  if (!el) return;
  let n = 128;
  el.textContent = n.toLocaleString();
  setInterval(() => {
    n += Math.floor(Math.random() * 3);
    el.textContent = n.toLocaleString();
  }, 2600);
})();

// ============ proof arena: zero-knowledge cave demo ============
(function arena(){
  const btnEnter = document.getElementById('btnEnter');
  const controls = document.getElementById('arenaControls');
  const statusEl = document.getElementById('arenaStatus');
  const doorA = document.getElementById('doorA');
  const doorB = document.getElementById('doorB');
  const figure = document.getElementById('caveFigure');
  const roundEl = document.getElementById('roundCount');
  const confEl = document.getElementById('confidence');
  if (!btnEnter) return;

  let rounds = 0;
  let enteredSide = null; // 'A' or 'B'
  let stage = 'idle'; // idle -> entered -> challenged -> resolved

  function reset(){
    doorA.classList.remove('lit');
    doorB.classList.remove('lit');
    figure.style.opacity = 0;
  }

  function render(){
    if (stage === 'idle') {
      statusEl.textContent = 'Pick a side. The Witness will enter unseen.';
      controls.innerHTML = '<button class="btn btn-primary" id="btnEnter">enter the cave →</button>';
      document.getElementById('btnEnter').addEventListener('click', enter);
    }
    if (stage === 'entered') {
      statusEl.textContent = 'The Witness is inside. Now call out a side for them to exit from.';
      controls.innerHTML = `
        <button class="btn btn-ghost" id="callA">call: exit A</button>
        <button class="btn btn-ghost" id="callB">call: exit B</button>`;
      document.getElementById('callA').addEventListener('click', () => challenge('A'));
      document.getElementById('callB').addEventListener('click', () => challenge('B'));
    }
    if (stage === 'resolved') {
      controls.innerHTML = '<button class="btn btn-primary" id="btnAgain">run again →</button>';
      document.getElementById('btnAgain').addEventListener('click', () => { stage = 'idle'; reset(); render(); });
    }
  }

  function enter(){
    reset();
    enteredSide = Math.random() < 0.5 ? 'A' : 'B';
    stage = 'entered';
    statusEl.textContent = 'The Witness slips into the cave through a random door...';
    setTimeout(render, 500);
  }

  function challenge(called){
    stage = 'resolved';
    rounds += 1;
    const success = true; // an honest witness who knows the secret door can ALWAYS comply
    doorA.classList.toggle('lit', called === 'A');
    doorB.classList.toggle('lit', called === 'B');
    figure.style.left = called === 'A' ? '24%' : '76%';
    figure.style.opacity = 1;

    roundEl.textContent = rounds;
    const confidence = Math.round((1 - Math.pow(0.5, rounds)) * 100);
    confEl.textContent = confidence + '%';

    statusEl.innerHTML = success
      ? `They walked out of door <strong>${called}</strong> — exactly the side you called. If they didn't
         know the secret word for the inner door, that's only a coin-flip's chance of happening.
         Do it enough times and luck stops being a believable explanation.`
      : '';
  }

  render();
})();
