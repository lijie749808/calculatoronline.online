export default function Bg() {
  return (
    <div className="absolute inset-0 -z-50 overflow-hidden">
      {/* 主背景渐变 - 可见的淡橙色调 */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-orange-25/20 to-orange-100/30"></div>
      
      {/* 计算器按钮网格背景 - 柔和的径向渐变 */}
      <div className="absolute inset-0 opacity-8">
        <div className="h-full w-full" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(251, 146, 60, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(251, 146, 60, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(251, 146, 60, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.10) 0%, transparent 50%)
          `,
        }}></div>
      </div>

      {/* 计算器按钮网格图案 - 适度可见 */}
      <div className="absolute inset-0 opacity-6">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="calculator-grid" x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
              {/* 3x3 计算器按钮网格 */}
              <rect x="30" y="30" width="18" height="18" rx="4" fill="none" stroke="rgb(251, 146, 60)" strokeWidth="0.8" opacity="0.5"/>
              <rect x="60" y="30" width="18" height="18" rx="4" fill="none" stroke="rgb(251, 146, 60)" strokeWidth="0.8" opacity="0.4"/>
              <rect x="90" y="30" width="18" height="18" rx="4" fill="none" stroke="rgb(251, 146, 60)" strokeWidth="0.8" opacity="0.6"/>
              
              <rect x="30" y="60" width="18" height="18" rx="4" fill="none" stroke="rgb(251, 146, 60)" strokeWidth="0.8" opacity="0.6"/>
              <rect x="60" y="60" width="18" height="18" rx="4" fill="rgb(251, 146, 60)" fillOpacity="0.05" stroke="rgb(251, 146, 60)" strokeWidth="0.8" opacity="0.8"/>
              <rect x="90" y="60" width="18" height="18" rx="4" fill="none" stroke="rgb(251, 146, 60)" strokeWidth="0.8" opacity="0.5"/>
              
              <rect x="30" y="90" width="18" height="18" rx="4" fill="none" stroke="rgb(251, 146, 60)" strokeWidth="0.8" opacity="0.4"/>
              <rect x="60" y="90" width="18" height="18" rx="4" fill="none" stroke="rgb(251, 146, 60)" strokeWidth="0.8" opacity="0.7"/>
              <rect x="90" y="90" width="18" height="18" rx="4" fill="none" stroke="rgb(251, 146, 60)" strokeWidth="0.8" opacity="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#calculator-grid)" />
        </svg>
      </div>

      {/* 数学符号装饰 - 增强透明度 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 左侧符号 - 更清晰 */}
        <div className="absolute left-16 top-1/4 opacity-25 text-orange-500">
          <div className="flex flex-col space-y-16 text-2xl font-mono rotate-8 font-bold">
            <span>+</span>
            <span>=</span>
            <span>π</span>
            <span>√</span>
          </div>
        </div>

        {/* 右侧符号 - 更清晰 */}
        <div className="absolute right-16 top-1/3 opacity-25 text-orange-500">
          <div className="flex flex-col space-y-14 text-xl font-mono -rotate-8 font-bold">
            <span>×</span>
            <span>÷</span>
            <span>²</span>
            <span>∞</span>
          </div>
        </div>

        {/* 顶部分散符号 - 增强 */}
        <div className="absolute left-1/3 top-16 opacity-20 text-orange-400 rotate-12">
          <span className="text-lg font-mono font-bold">sin</span>
        </div>
        
        <div className="absolute right-1/3 top-20 opacity-20 text-orange-400 -rotate-8">
          <span className="text-lg font-mono font-bold">cos</span>
        </div>

        {/* 底部公式 - 增强 */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 opacity-20 text-orange-400">
          <div className="text-lg font-mono font-bold">E = mc²</div>
        </div>
      </div>

      {/* 浮动计算器按钮装饰 - 增强可见度 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 左上角 - 更明显 */}
        <div className="absolute left-24 top-24 opacity-30">
          <div className="w-10 h-10 rounded-lg border-2 border-orange-300 bg-orange-100/70 flex items-center justify-center text-orange-600 text-lg font-bold transform rotate-12 shadow-md">
            +
          </div>
        </div>
        
        {/* 右上角 - 更明显 */}
        <div className="absolute right-28 top-28 opacity-30">
          <div className="w-12 h-12 rounded-lg border-2 border-orange-300 bg-orange-100/70 flex items-center justify-center text-orange-600 text-xl font-bold transform -rotate-8 shadow-md">
            =
          </div>
        </div>

        {/* 左下角 - 更明显 */}
        <div className="absolute left-28 bottom-32 opacity-30">
          <div className="w-8 h-8 rounded-md border-2 border-orange-300 bg-orange-100/70 flex items-center justify-center text-orange-600 text-sm font-bold transform rotate-45 shadow-md">
            ×
          </div>
        </div>

        {/* 右下角 - 更明显 */}
        <div className="absolute right-24 bottom-24 opacity-30">
          <div className="w-9 h-9 rounded-lg border-2 border-orange-300 bg-orange-100/70 flex items-center justify-center text-orange-600 text-base font-bold transform -rotate-15 shadow-md">
            √
          </div>
        </div>

        {/* 中间区域小装饰 - 增强 */}
        <div className="absolute left-1/4 top-2/3 opacity-25">
          <div className="w-6 h-6 rounded border-2 border-orange-400 bg-orange-100/60 flex items-center justify-center text-orange-500 text-xs font-bold transform rotate-20">
            %
          </div>
        </div>

        <div className="absolute right-1/4 top-1/5 opacity-25">
          <div className="w-7 h-7 rounded border-2 border-orange-400 bg-orange-100/60 flex items-center justify-center text-orange-500 text-sm font-bold transform -rotate-25">
            ±
          </div>
        </div>
      </div>

      {/* 减弱的边缘渐变 - 让两边更清晰 */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-white/20"></div>
      
      {/* 中心内容保护区域 - 保持轻度保护 */}
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-1/6 bottom-1/6 bg-gradient-to-r from-white/10 via-transparent to-white/10"></div>
      </div>
    </div>
  );
}
