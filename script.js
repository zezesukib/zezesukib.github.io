// 计算到最近的 “12 月 31 日 24:00”（等同于下一年 1 月 1 日 00:00）的倒计时
(function(){
  const MODE_NEW = 'newyear';
  const MODE_CHUXI = 'chuxi';
  const btn = document.getElementById('modeBtn');
  const labelEl = document.getElementById('label');
  const el = document.getElementById('countdown');

  // 简单表：公历对应的春节（农历新年）第一天（可扩展）
  const CNY = {
    2025: '2025-01-29',
    2026: '2026-02-17',
    2027: '2027-02-06',
    2028: '2028-01-26',
    2029: '2029-02-13',
    2030: '2030-02-03',
    2031: '2031-01-23',
    2032: '2032-02-11',
    2033: '2033-01-31',
    2034: '2034-02-19',
    2035: '2035-02-08'
  };

  function pad(n){ return String(n).padStart(2,'0'); }

  function getNextCNY(now){
    for (let y = now.getFullYear(); y <= now.getFullYear() + 10; y++){
      if (CNY[y]){
        const d = new Date(CNY[y] + 'T00:00:00');
        if (d > now) return d;
      }
    }
    // 回退到下一年 1 月 1 日（万一表中没有）
    return new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
  }

  function getTarget(mode){
    const now = new Date();
    if (mode === MODE_CHUXI){
      // 除夕：我们以春节（农历新年）第一天的 00:00 为目标（除夕的午夜即到达）
      return getNextCNY(now);
    }
    // 新年：下一年 1 月 1 日 00:00
    return new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
  }

  // 显示格式：纵向排列 DD天 hh小时 mm分钟 ss秒，加空格对齐
  function format(totalSec){
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return ` ${pad(days)} 天 \n${pad(hours)} 小时\n${pad(minutes)} 分钟\n ${pad(seconds)} 秒 `;
  }

  // 初始化模式
  let mode = localStorage.getItem('count_mode') || MODE_NEW;
  let target = getTarget(mode);
  let timer = null;

  function updateOnce(){
    const now = new Date();
    let diff = Math.max(0, target - now);
    const totalSec = Math.floor(diff / 1000);

    if (totalSec <= 0){
      el.textContent = '00.00.00';
      el.setAttribute('data-text', '00.00.00');
      clearInterval(timer);
      timer = null;
      return;
    }

    const txt = format(totalSec);
    el.textContent = txt;
    el.setAttribute('data-text', txt);
  }

  function start(){
    if (timer) clearInterval(timer);
    updateOnce();
    timer = setInterval(updateOnce, 1000);
  }

  function updateUI(){
    if (mode === MODE_CHUXI){
      labelEl.textContent = '距离除夕还有';
      btn.textContent = '切换为新年';
      btn.setAttribute('aria-pressed','true');
    } else {
      labelEl.textContent = '距离新年还有';
      btn.textContent = '切换为除夕';
      btn.setAttribute('aria-pressed','false');
    }
  }

  btn.addEventListener('click', function(){
    mode = (mode === MODE_NEW) ? MODE_CHUXI : MODE_NEW;
    localStorage.setItem('count_mode', mode);
    target = getTarget(mode);
    updateUI();
    start();
  });

  // 若系统时间有变化或页面可见性恢复，重新计算目标以防时钟错误
  window.addEventListener('visibilitychange', function(){ if (!document.hidden){ target = getTarget(mode); start(); } });
  window.addEventListener('focus', function(){ target = getTarget(mode); start(); });

  // 首次渲染
  updateUI();
  start();
})();