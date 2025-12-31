// 计算到最近的 “12 月 31 日 24:00”（等同于下一年 1 月 1 日 00:00）的倒计时
(function(){
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const messageEl = document.getElementById('message');

  function getTargetDate(){
    const now = new Date();
    // 使用当前年份的 12 月 31 日 24:00（JS 会把小时 24 自动滚到下一天的 00:00）
    let target = new Date(now.getFullYear(), 11, 31, 24, 0, 0);
    if (target <= now) {
      // 如果目标已过，切换到下一年的 12 月 31 日 24:00
      target = new Date(now.getFullYear() + 1, 11, 31, 24, 0, 0);
    }
    return target;
  }

  let target = getTargetDate();

  function pad(n){ return String(n).padStart(2,'0'); }

  function update(){
    const now = new Date();
    let diff = Math.max(0, target - now);
    if (diff <= 0) {
      daysEl.textContent = '0';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      messageEl.classList.remove('hidden');
      messageEl.textContent = '倒计时结束，祝你新年快乐！ 🎉';
      clearInterval(timer);
      return;
    }

    const totalSec = Math.floor(diff / 1000);
    const days = Math.floor(totalSec / (3600*24));
    const hours = Math.floor((totalSec % (3600*24)) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    daysEl.textContent = days;
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  // 每秒更新一次；页面可见时确保时间正确（处理系统时钟变化）
  update();
  const timer = setInterval(update, 1000);

  // 若系统时间变动或页面长时间不活跃，重新计算目标日期并立即刷新
  window.addEventListener('visibilitychange', function(){ if (!document.hidden){ target = getTargetDate(); update(); } });
  window.addEventListener('focus', function(){ target = getTargetDate(); update(); });
})();