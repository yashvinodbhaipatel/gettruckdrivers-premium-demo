'use strict';
document.documentElement.classList.add('js-enabled');
const $ = (s, parent=document) => parent.querySelector(s);
const $$ = (s, parent=document) => [...parent.querySelectorAll(s)];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionEnabled = !motionPreference.matches;
function setMotion(enabled) {
  motionEnabled = enabled;
  document.body.classList.toggle('motion-off', !enabled);
  document.documentElement.classList.toggle('motion-off', !enabled);
  $('.motion-toggle').setAttribute('aria-pressed', String(enabled));
  $('.motion-state').textContent = enabled ? 'on' : 'off';
  $('.motion-icon').textContent = enabled ? 'Ⅱ' : '▶';
  document.dispatchEvent(new CustomEvent('motionchange', {detail:enabled}));
  $$('svg').forEach(svg => { if(svg.pauseAnimations) enabled ? svg.unpauseAnimations() : svg.pauseAnimations(); });
}
setMotion(motionEnabled);
$('.motion-toggle').addEventListener('click',()=>setMotion(!motionEnabled));
motionPreference.addEventListener('change',e=>setMotion(!e.matches));
const revealObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}),{threshold:.08});
$$('.reveal').forEach(el=>revealObserver.observe(el));
let scrollQueued = false;
function updateScroll(){
  const height = document.documentElement.scrollHeight - innerHeight;
  $('.scroll-progress').style.transform = `scaleX(${height>0?scrollY/height:0})`;
  $('.header').classList.toggle('scrolled',scrollY>40);
  scrollQueued = false;
}
addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll);}},{passive:true});
updateScroll();
$('.menu-toggle').addEventListener('click',()=>{const expanded=$('.menu-toggle').getAttribute('aria-expanded')==='true';$('.menu-toggle').setAttribute('aria-expanded',String(!expanded));$('.menu-toggle').setAttribute('aria-label',expanded?'Open menu':'Close menu');$('#mobile-nav').style.top=`${$('.header').getBoundingClientRect().bottom}px`;$('#mobile-nav').hidden=expanded;});
$$('#mobile-nav a').forEach(a=>a.addEventListener('click',()=>{$('#mobile-nav').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').setAttribute('aria-label','Open menu');}));
const journeys=[
  {kicker:'THE FOUNDATION',title:'A fleet worth choosing.',description:'Turn your lanes, home time, pay, and culture into a clear story. Give the right driver a real reason to start a conversation.',tags:['Fleet positioning','Driver fit','Clear messaging'],labels:['YOUR ROUTES','YOUR CULTURE','YOUR PEOPLE','YOUR FUTURE']},
  {kicker:'THE RIGHT AUDIENCE',title:'Be where your people are.',description:'Build outreach around the drivers who fit your routes and requirements. Make your opportunity easy to understand and easy to explore.',tags:['Driver audience','Relevant outreach','A clear next step'],labels:['YOUR LANES','EXPERIENCE','HOME TIME','DRIVER FIT']},
  {kicker:'THE HUMAN CONNECTION',title:'Make every hello count.',description:'A thoughtful first response sets the tone. Listen to the driver, explain the opportunity, and make the next step feel simple and personal.',tags:['Personal follow-up','Clear expectations','Real conversations'],labels:['FIRST HELLO','LISTEN WELL','CLEAR ANSWERS','NEXT STEP']},
  {kicker:'THE LONG-TERM VIEW',title:'Build a rhythm that lasts.',description:'Bring your team together around a process they can repeat. Review what you learn, improve the experience, and keep your recruiting moving.',tags:['Team ownership','Regular review','Continuous improvement'],labels:['YOUR TEAM','YOUR PROCESS','YOUR LEARNING','MOMENTUM']}
];
function selectStep(index,focus=false){const data=journeys[index];$$('.journey-tab').forEach((el,i)=>{el.classList.toggle('active',i===index);el.setAttribute('aria-selected',String(i===index));el.tabIndex=i===index?0:-1;});$('#journey-panel').setAttribute('aria-labelledby',`tab-${index}`);$('#journey-count').textContent=`0${index+1} / 04`;$('#journey-kicker').textContent=data.kicker;$('#journey-title').textContent=data.title;$('#journey-description').textContent=data.description;$('#journey-tags').replaceChildren(...data.tags.map(text=>{const span=document.createElement('span');span.textContent=text;return span;}));$$('.network-label').forEach((el,i)=>el.textContent=data.labels[i]);$('.journey-detail').classList.remove('changing');requestAnimationFrame(()=>$('.journey-detail').classList.add('changing'));if(focus)$(`#tab-${index}`).focus();}
$$('.journey-tab').forEach((tab,index)=>{tab.addEventListener('click',()=>selectStep(index));tab.addEventListener('keydown',e=>{let next=index;if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(index+1)%4;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(index+3)%4;else if(e.key==='Home')next=0;else if(e.key==='End')next=3;else return;e.preventDefault();selectStep(next,true);});});
const money = amount=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(amount);
function updateCalculator(){const trucks=Number($('#trucks').value),revenue=Number($('#revenue').value);$('#trucks-output').textContent=`${trucks} ${trucks===1?'truck':'trucks'}`;$('#revenue-output').textContent=money(revenue);$('#calc-total').textContent=money(trucks*revenue*4.33);[$('#trucks'),$('#revenue')].forEach(el=>{el.style.setProperty('--range',`${(el.value-el.min)/(el.max-el.min)*100}%`);el.setAttribute('aria-valuetext',el.id==='trucks'?`${trucks} unseated trucks`:`${money(revenue)} per truck per week`);});}
$('#trucks').addEventListener('input',updateCalculator);$('#revenue').addEventListener('input',updateCalculator);updateCalculator();
let lastFocus=null;
function openModal(id){lastFocus=document.activeElement;$$('dialog[open]').forEach(dialog=>dialog.close());$(id).showModal();document.body.style.overflow='hidden';}
function closeModal(dialog){dialog.close();}
$$('dialog').forEach(dialog=>{dialog.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)closeModal(dialog);}});$('.modal-close',dialog).addEventListener('click',()=>closeModal(dialog));dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.style.overflow='';if(dialog.id==='film-modal'){filmPlaying=false;cancelAnimationFrame(filmFrame);}if(lastFocus&&lastFocus.isConnected&&(!lastFocus.closest('dialog')||lastFocus.closest('dialog').open))lastFocus.focus();});});
$$('[data-book]').forEach(button=>button.addEventListener('click',()=>openModal('#booking-modal')));
let briefText='';
$('#fleet-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const values=new FormData(form),company=String(values.get('company')).trim(),challenge=String(values.get('challenge')).trim();if(!company||!challenge){const input=form.elements[!company?'company':'challenge'];input.setCustomValidity('Please enter a little more detail.');input.reportValidity();return;}
  const fields=[['Fleet',company],['Fleet size',values.get('size')],['Operation',values.get('operation')],['Recruiting challenge',challenge]];const dl=document.createElement('dl');fields.forEach(([label,value])=>{const row=document.createElement('div');row.className='brief-field';const dt=document.createElement('dt');dt.textContent=label;const dd=document.createElement('dd');dd.textContent=String(value);row.append(dt,dd);dl.append(row);});$('#brief-summary').replaceChildren(dl);briefText=`FLEET DISCOVERY BRIEF\nPrepared with the independent GTD concept by Yash Patel\n\n${fields.map(([label,value])=>`${label}: ${value}`).join('\n\n')}\n\nQuestions for the discovery conversation:\n1. Which driver profiles and lanes are the priority?\n2. What makes this fleet a good place to work?\n3. Where do candidates get stuck in the current process?\n4. Who will own the next step and follow-up?\n\nNo enquiry has been sent. No appointment has been booked.\nOfficial booking: https://gettruckdrivers.com/calendar\n`;
  $('.booking-start').hidden=true;$('.booking-result').hidden=false;$('#booking-modal').scrollTop=0;$('#download-brief').focus();
});
$$('#fleet-form input, #fleet-form textarea').forEach(input=>input.addEventListener('input',()=>input.setCustomValidity('')));
$('#edit-brief').addEventListener('click',()=>{$('.booking-result').hidden=true;$('.booking-start').hidden=false;$('#fleet-form input').focus();});
$('#download-brief').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([briefText],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download='fleet-discovery-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
const filmScenes=[
  ['EVERY GREAT FLEET STARTS WITH PEOPLE.','A truck is just a truck.<br><em>Until the right person<br>takes the wheel.</em>'],
  ['YOUR FLEET HAS A STORY WORTH TELLING.','Your routes.<br>Your culture.<br><em>Your reason why.</em>'],
  ['RECRUITING IS A HUMAN CONNECTION.','The right conversation.<br>The right opportunity.<br><em>The right fit.</em>'],
  ['BUILD A PROCESS YOUR TEAM CAN OWN.','From the first hello<br>to the first mile.<br><em>Keep moving forward.</em>'],
  ['GETTRUCKDRIVERS.COM / AN INDEPENDENT CONCEPT','Great drivers.<br>Stronger fleets.<br><em>A better road.</em>']
];
let filmTime=0,filmPlaying=false,filmFrame=0,filmLast=0,filmScene=-1;
function renderFilm(){let next=Math.max(0,Math.min(4,Math.floor(filmTime/6)));if(next!==filmScene){filmScene=next;$('#film-eyebrow').textContent=filmScenes[next][0];$('#film-title').innerHTML=filmScenes[next][1];$('.film-scene-number').textContent=`0${next+1} / 05`;$('.film-text').classList.remove('switching');requestAnimationFrame(()=>$('.film-text').classList.add('switching'));}$('#film-time').textContent=`0:${String(Math.floor(filmTime)).padStart(2,'0')} / 0:30`;$('#film-scrub').value=filmTime;$('#film-scrub').style.setProperty('--range',`${filmTime/30*100}%`);$('#film-play').textContent=filmPlaying?'Ⅱ':'▶';$('#film-play').setAttribute('aria-label',filmPlaying?'Pause film':'Play film');}
function filmTick(now){if(!filmPlaying)return;const dt=Math.max(0,Math.min((now-filmLast)/1000,.1));filmLast=now;if(!document.hidden)filmTime=Math.min(30,filmTime+dt);if(filmTime>=30)filmPlaying=false;renderFilm();if(filmPlaying)filmFrame=requestAnimationFrame(filmTick);}
function playFilm(){if(filmTime>=30)filmTime=0;filmPlaying=true;filmLast=performance.now();cancelAnimationFrame(filmFrame);renderFilm();filmFrame=requestAnimationFrame(filmTick);}
$$('[data-film]').forEach(button=>button.addEventListener('click',()=>{openModal('#film-modal');filmTime=0;filmScene=-1;filmPlaying=false;renderFilm();if(motionEnabled)playFilm();}));
$('#film-play').addEventListener('click',()=>{if(filmPlaying){filmPlaying=false;cancelAnimationFrame(filmFrame);renderFilm();}else playFilm();});
$('#film-replay').addEventListener('click',()=>{filmTime=0;filmScene=-1;playFilm();});
$('#film-scrub').addEventListener('input',e=>{filmTime=Number(e.target.value);filmLast=performance.now();renderFilm();});
document.addEventListener('motionchange',event=>{if(!event.detail&&filmPlaying){filmPlaying=false;cancelAnimationFrame(filmFrame);renderFilm();}});
const articles=[
 {category:'THE PLAYBOOK / FIELD NOTE 001',title:'What makes a fleet<br><em>worth choosing?</em>',body:'<p>A driver is choosing more than a truck. They are choosing a working relationship, a schedule, and a place for their professional life. Clear recruiting begins with a clear answer to one question: why would the right person choose your fleet?</p><h3>Start with the everyday experience.</h3><p>Talk to the drivers who know you best. Ask what made them join, what makes them stay, and what they wish they had known before orientation. Look for patterns you can describe honestly.</p><h3>Make the important details easy to find.</h3><p>Explain lanes, home time, compensation structure, equipment, and expectations in plain language. Specific information helps a driver judge fit and gives your recruiting team a stronger starting point.</p><h3>Keep the promise consistent.</h3><p>The first ad, the first call, and the first day should tell the same story. A clear employer promise is only useful when the daily experience supports it.</p><p><strong>A question to take with you:</strong> If your best driver explained your fleet to a friend, what would they say first?</p>'},
 {category:'PEOPLE & CULTURE / FIELD NOTE 002',title:'First, <em>listen.</em><br>Then, connect.',body:'<p>Recruiting conversations work better when both people can assess whether the opportunity makes sense. That starts with curiosity, clear questions, and the space to answer.</p><h3>Ask what a better opportunity means.</h3><p>For one driver, it might mean more predictable home time. For another, it might be a different lane or clearer communication. Avoid assuming everyone is looking for the same thing.</p><h3>Explain the trade-offs.</h3><p>Every operation has constraints. Share the realities of the schedule and the work early. An honest answer can help both sides avoid an expensive mismatch later.</p><h3>Finish with a clear next step.</h3><p>Tell the driver what happens next, who will contact them, and what they need to prepare. If there is no fit, say so respectfully rather than leaving the conversation open indefinitely.</p><p><strong>Try this question:</strong> What would need to be different for your next driving role to be a better one?</p>'},
 {category:'SYSTEMS & STRATEGY / FIELD NOTE 003',title:'Build for<br><em>the long haul.</em>',body:'<p>When recruiting only gets attention after a truck sits empty, the team has to solve a long-term problem under short-term pressure. A regular recruiting rhythm makes the work more visible and easier to improve.</p><h3>Map the journey.</h3><p>Write down the steps from first contact through orientation. For each step, identify the person responsible, the information needed, and the action that moves a candidate forward.</p><h3>Review the process together.</h3><p>Set aside time to look at where conversations are moving and where they stop. Use your own data to ask useful questions about response time, qualification, communication, and candidate experience.</p><h3>Improve one step at a time.</h3><p>A clearer message or a better handover can be more useful than adding another tool. Choose a specific bottleneck, make a focused change, and review what happens.</p><p><strong>A starting exercise:</strong> Map your current recruiting journey on one page. Circle the step that creates the most uncertainty for your team.</p>'}
];
$$('[data-article]').forEach(button=>button.addEventListener('click',()=>{const article=articles[Number(button.dataset.article)];$('#article-category').textContent=article.category;$('#article-title').innerHTML=article.title;$('#article-body').innerHTML=article.body;openModal('#article-modal');$('#article-modal').scrollTop=0;}));
