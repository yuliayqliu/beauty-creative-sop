// ========== Hash 路由：多页切换 ==========
const ROUTES = ['home', 'dashboard', 'case', 'trend', 'diagnose', 'report', 'manual'];
const DEFAULT_ROUTE = 'home';

function getRouteFromHash() {
  const m = (location.hash || '').match(/^#\/?([^/?]+)/);
  const r = m ? m[1] : '';
  return ROUTES.includes(r) ? r : DEFAULT_ROUTE;
}

function switchPage(route) {
  // 切页面
  document.querySelectorAll('.page').forEach(p => {
    p.classList.toggle('active', p.dataset.page === route);
  });
  // 切顶部导航高亮
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.route === route);
  });
  // 滚回顶部
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

window.addEventListener('hashchange', () => switchPage(getRouteFromHash()));

// 初始化路由
if (!location.hash) location.hash = '#/' + DEFAULT_ROUTE;
switchPage(getRouteFromHash());

// ========== 子Tab/Seg 切换（每个页面独立） ==========
document.querySelectorAll('.sub-tabs').forEach(group => {
  const tabs = group.querySelectorAll('.sub-tab');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
  }));
});

document.querySelectorAll('.seg-toggle').forEach(group => {
  const segs = group.querySelectorAll('.seg');
  segs.forEach(s => s.addEventListener('click', () => {
    segs.forEach(x => x.classList.remove('active'));
    s.classList.add('active');
  }));
});

document.querySelectorAll('.industry-tabs').forEach(group => {
  const tabs = group.querySelectorAll('.ind-tab');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
  }));
});

// ========== 素材自分析诊断 ==========
const form = document.getElementById('diagForm');
const result = document.getElementById('diagResult');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const ctr = parseFloat(data.ctr) || 0;
    const cvr = parseFloat(data.cvr) || 0;
    const cost = parseFloat(data.cost) || 0;
    const play3 = parseFloat(data.play3) || 0;

    let judge = '';
    if (cost >= 1000 && ctr >= 1.5 && cvr >= 0.8) {
      judge = '✅ 已达爆量+优秀双重标准，可作为账户底层素材重点放量与复刻。';
    } else if (cost >= 1000 && ctr < 1.5) {
      judge = '⚡ 高消耗低点击型：素材已被系统放量，但前3秒钩子较弱，CTR拖低整体ROI。';
    } else if (cost >= 1000 && cvr < 0.8) {
      judge = '⚡ 高消耗低转化型：吸引到了人群但缺少落地转化理由，CVR低于行业基准。';
    } else if (cost < 1000 && ctr >= 1.5) {
      judge = '🌱 高点击未起量型：素材点击力可以，但放量信号不足，建议放大测试预算。';
    } else {
      judge = '⚠ 数据全面偏弱：素材整体竞争力不足，建议结构性重做。';
    }

    const problems = [];
    if (ctr < 1.5) problems.push(`CTR ${ctr || '—'}% 低于行业基准1.5%，前3秒缺少痛点特写或价格锤；`);
    if (play3 && play3 < 25) problems.push(`3秒完播率 ${play3}% 偏低，开头节奏拖沓或首帧不够吸睛；`);
    if (cvr < 0.8) problems.push(`浅层CVR ${cvr || '—'}% 低于行业基准0.8%，落地页或CTA信任背书不足；`);
    if (cost < 1000) problems.push(`日均消耗仅¥${cost || 0}，未达爆量阈值¥1000，系统放量信号不充分；`);
    if (problems.length === 0) problems.push('数据指标整体健康，建议保持现有结构持续测试。');

    const cat = data.category || '丽人';
    const next = `下一条建议参考${cat}爆款公式：黄金三秒采用「痛点特写+价格锤」开头（参考价格区间198/368/468）；中段加入"XX岁阿姨坐X小时车来体验"真实顾客证言；结尾接价格清单+"全国连锁300+门店"信任背书。时长控制在35-55秒，竖屏9:16，暖色调手机实拍纪实风。`;

    result.querySelector('[data-key="judge"]').textContent = judge;
    result.querySelector('[data-key="problems"]').innerHTML = problems.map(p => `· ${p}`).join('<br>');
    result.querySelector('[data-key="next"]').textContent = next;

    result.classList.remove('hidden');
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
