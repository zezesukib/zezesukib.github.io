// 计算到最近的 “12 月 31 日 24:00”（等同于下一年 1 月 1 日 00:00）的倒计时
(function(){
  const el = document.getElementById('countdown');

  function getTargetDate(){
    const now = new Date();
    // 目标：本地当前年份的 12 月 31 日 24:00（等同于下一年 1 月 1 日 00:00）
    let target = new Date(now.getFullYear(), 11, 31, 24, 0, 0, 0);
    if (target <= now) {
      target = new Date(now.getFullYear() + 1, 11, 31, 24, 0, 0, 0);
    }
    return target;
  }

  let target = getTargetDate();

  function pad(n){ return String(n).padStart(2,'0'); }

  function update(){
    const now = new Date();
    let diff = Math.max(0, target - now);
    let totalSec = Math.floor(diff / 1000);

    // 到达目标时停止并显示 00:00:00
    if (totalSec <= 0){
      el.textContent = '00:00:00';
      clearInterval(timer);
      return;
    }

    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    el.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  // 每秒更新一次；页面可见时确保时间正确（处理系统时钟变化）
  update();
  const timer = setInterval(update, 1000);

  // 若系统时间变动或页面长时间不活跃，重新计算目标日期并立即刷新
  window.addEventListener('visibilitychange', function(){ if (!document.hidden){ target = getTargetDate(); update(); } });
  window.addEventListener('focus', function(){ target = getTargetDate(); update(); });
})();