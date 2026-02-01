import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Monitor, Search, Check, Smartphone, Tv, Laptop, ArrowLeft, Ruler, CreditCard, Layout, Maximize2, Minimize2, Info, FileText, ExternalLink, ShoppingBag, Maximize, X, Grid, Columns, Layers } from 'lucide-react';

// 1. 핵심 데이터 (기존 데이터 유지)
const DEVICE_DATA = {
  mobile: {
    "iphone16p": { id: "iphone16p", brand: "Apple", name: "iPhone 16 Pro", keywords: "아이폰 16 프로 apple", diagonal: 6.3, ratioW: 19.5, ratioH: 9, color: "#3B82F6" },
    "iphone16pm": { id: "iphone16pm", brand: "Apple", name: "iPhone 16 Pro Max", keywords: "아이폰 16 프로 맥스 apple", diagonal: 6.9, ratioW: 19.5, ratioH: 9, color: "#1D4ED8" },
    "iphone15p": { id: "iphone15p", brand: "Apple", name: "iPhone 15 Pro", keywords: "아이폰 15 프로 apple", diagonal: 6.1, ratioW: 19.5, ratioH: 9, color: "#4B5563" },
    "iphone15pm": { id: "iphone15pm", brand: "Apple", name: "iPhone 15 Pro Max", keywords: "아이폰 15 프로 맥스 apple", diagonal: 6.7, ratioW: 19.5, ratioH: 9, color: "#374151" },
    "s24u": { id: "s24u", brand: "Samsung", name: "Galaxy S24 Ultra", keywords: "갤럭시 s24 울트라 삼성", diagonal: 6.8, ratioW: 19.5, ratioH: 9, color: "#10B981" },
    "zfold6": { id: "zfold6", brand: "Samsung", name: "Galaxy Z Fold6", keywords: "갤럭시 제트 폴드6 삼성", diagonal: 7.6, ratioW: 20.9, ratioH: 18, color: "#0D9488" },
    "ipadpro13": { id: "ipadpro13", brand: "Apple", name: "iPad Pro 13 (M4)", keywords: "아이패드 프로 13 apple", diagonal: 13.0, ratioW: 4, ratioH: 3, color: "#6366F1" },
  },
  laptop: {
    "mbp16_m3": { id: "mbp16_m3", brand: "Apple", name: "MacBook Pro 16 (M3)", keywords: "맥북 프로 16 apple m3", diagonal: 16.2, ratioW: 16, ratioH: 10, color: "#2563EB" },
    "mbp14_m3": { id: "mbp14_m3", brand: "Apple", name: "MacBook Pro 14 (M3)", keywords: "맥북 프로 14 apple m3", diagonal: 14.2, ratioW: 16, ratioH: 10, color: "#3B82F6" },
    "gram17": { id: "gram17", brand: "LG", name: "LG gram Pro 17", keywords: "엘지 그램 프로 17", diagonal: 17, ratioW: 16, ratioH: 10, color: "#F59E0B" },
    "mon27": { id: "mon27", brand: "Standard", name: "27인치 모니터 (16:9)", keywords: "27 inch monitor", diagonal: 27, ratioW: 16, ratioH: 9, color: "#C026D3" },
    "mon32": { id: "mon32", brand: "Standard", name: "32인치 모니터 (16:9)", keywords: "32 inch monitor", diagonal: 31.5, ratioW: 16, ratioH: 9, color: "#A855F7" },
  },
  tv: {
    "tv55": { id: "tv55", brand: "Standard", name: "55인치 TV (Standard)", keywords: "55 inch tv", diagonal: 55, ratioW: 16, ratioH: 9, color: "#F97316" },
    "tv65": { id: "tv65", brand: "Standard", name: "65인치 TV (Standard)", keywords: "65 inch tv", diagonal: 65, ratioW: 16, ratioH: 9, color: "#C2410C" },
    "tv75": { id: "tv75", brand: "Standard", name: "75인치 TV (Standard)", keywords: "75 inch tv", diagonal: 75, ratioW: 16, ratioH: 9, color: "#7C2D12" },
    "tv85": { id: "tv85", brand: "Samsung", name: "Samsung 85인치 TV", keywords: "삼성 85 tv", diagonal: 85, ratioW: 16, ratioH: 9, color: "#B45309" },
  }
};

const INCH_TO_CM = 2.54;

const calculateDims = (diag, rw, rh) => {
  const angle = Math.atan(rh / rw);
  const widthInch = diag * Math.cos(angle);
  const heightInch = diag * Math.sin(angle);
  const areaInch = widthInch * heightInch;
  return { 
    widthInch, heightInch, areaInch,
    widthCm: widthInch * INCH_TO_CM,
    heightCm: heightInch * INCH_TO_CM,
    areaCm: areaInch * (INCH_TO_CM * INCH_TO_CM)
  };
};

const generateVerdict = (d1, d2, n1, n2) => {
  const diffArea = d2.areaInch - d1.areaInch;
  const isD2Larger = diffArea > 0;
  const absDiff = Math.abs(diffArea);
  const percent = (absDiff / (isD2Larger ? d1.areaInch : d2.areaInch)) * 100;
  const largerName = isD2Larger ? n2 : n1;
  const smallerName = isD2Larger ? n1 : n2;
  
  let analogy = "";
  if (absDiff < 2) analogy = "거의 동일한 크기입니다.";
  else if (absDiff < 8) analogy = "신용카드 한 장 정도의 면적 차이입니다.";
  else if (absDiff < 18) analogy = "스마트폰 하나를 더 붙여놓은 것과 같은 차이입니다.";
  else if (absDiff < 35) analogy = "A4 용지의 약 1/4 정도가 더 넓은 셈입니다.";
  else analogy = "기존 화면보다 완전히 새로운 시각적 경험을 줄 만큼 큰 차이입니다.";

  return {
    title: `${largerName}가 ${percent.toFixed(0)}% 더 넓습니다`,
    detail: `${largerName}를 선택하면 ${smallerName}보다 실제 작업 영역이 약 ${Math.abs(d2.areaCm - d1.areaCm).toFixed(0)}cm² 더 확보됩니다. ${analogy}`
  };
};

export default function App() {
  const [viewMode, setViewMode] = useState('home');
  const [category, setCategory] = useState('laptop');
  const [deviceA, setDeviceA] = useState(null); 
  const [deviceB, setDeviceB] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  
  const [showRefObject, setShowRefObject] = useState('none');
  const [compareMode, setCompareMode] = useState('overlay');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const currentDeviceList = useMemo(() => {
    const list = Object.values(DEVICE_DATA[category] || {});
    const term = searchTerm.toLowerCase().replace(/\s+/g, '');
    
    return list.filter(d => {
      const nameMatch = d.name.toLowerCase().replace(/\s+/g, '').includes(term);
      const keywordMatch = d.keywords && d.keywords.replace(/\s+/g, '').includes(term);
      const brandMatch = selectedBrand === 'All' || d.brand === selectedBrand;
      
      return (nameMatch || keywordMatch) && brandMatch;
    });
  }, [category, searchTerm, selectedBrand]);

  const brands = useMemo(() => {
    const list = Object.values(DEVICE_DATA[category] || {});
    return ['All', ...new Set(list.map(d => d.brand))].sort();
  }, [category]);

  const safeDeviceA = deviceA || (Object.values(DEVICE_DATA[category])[0]);
  const safeDeviceB = deviceB || (Object.values(DEVICE_DATA[category])[1]);

  const d1 = useMemo(() => calculateDims(safeDeviceA.diagonal, safeDeviceA.ratioW, safeDeviceA.ratioH), [safeDeviceA]);
  const d2 = useMemo(() => calculateDims(safeDeviceB.diagonal, safeDeviceB.ratioW, safeDeviceB.ratioH), [safeDeviceB]);
  const verdict = useMemo(() => generateVerdict(d1, d2, safeDeviceA.name, safeDeviceB.name), [d1, d2, safeDeviceA, safeDeviceB]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    if (viewMode !== 'compare') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const updateCanvasSize = () => {
      const w = isFullscreen ? window.innerWidth : canvas.parentElement.clientWidth;
      const h = isFullscreen ? window.innerHeight : canvas.parentElement.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      return { width: w, height: h };
    };

    const rect = updateCanvasSize();
    const isMobile = window.innerWidth < 768;
    // 여백 조절 (화면 크기에 맞춰 반응형으로 설정)
    const padding = isFullscreen ? (isMobile ? 40 : 100) : (isMobile ? 30 : 60);
    
    let contentWidth = 0;
    let contentHeight = 0;

    // 비교 모드에 따른 가상 콘텐츠 영역 계산
    if (compareMode === 'overlay') {
      contentWidth = Math.max(d1.widthInch, d2.widthInch);
      contentHeight = Math.max(d1.heightInch, d2.heightInch);
    } else {
      contentWidth = d1.widthInch + d2.widthInch + 2; // +2는 사이 간격 인치
      contentHeight = Math.max(d1.heightInch, d2.heightInch);
    }

    // 참조 물체(A4)가 더 크면 영역 확장
    if (showRefObject === 'a4') {
      contentWidth = Math.max(contentWidth, 11.7);
      contentHeight = Math.max(contentHeight, 8.3);
    }

    // PPI 스케일 계산 (이 부분이 핵심: 가용한 창 크기에 맞춰 최대한 크게 그리기)
    const ppiScale = Math.min((rect.width - padding) / contentWidth, (rect.height - padding) / contentHeight);

    const render = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // 배경 격자 (cm 단위)
      const cmInPixels = (1 / 2.54) * ppiScale; 
      ctx.beginPath();
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let x = cx % cmInPixels; x < rect.width; x += cmInPixels) { ctx.moveTo(x, 0); ctx.lineTo(x, rect.height); }
      for (let y = cy % cmInPixels; y < rect.height; y += cmInPixels) { ctx.moveTo(0, y); ctx.lineTo(rect.width, y); }
      ctx.stroke();

      const drawDevice = (dims, color, name, centerX, centerY, isDashed) => {
        const w = dims.widthInch * ppiScale;
        const h = dims.heightInch * ppiScale;
        ctx.beginPath();
        ctx.roundRect(centerX - w/2, centerY - h/2, w, h, isMobile ? 4 : 8);
        ctx.lineWidth = isMobile ? 2 : 4;
        ctx.strokeStyle = color;
        ctx.setLineDash(isDashed ? [8, 8] : []);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.1;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
        ctx.fillStyle = color;
        ctx.font = `bold ${isMobile ? 12 : 16}px sans-serif`;
        ctx.textAlign = 'center';
        // 텍스트 위치도 화면 크기에 반응하여 조정
        ctx.fillText(`${name}`, centerX, centerY - h/2 - (isMobile ? 10 : 15));
      };

      if (compareMode === 'overlay') {
        drawDevice(d2, safeDeviceB.color, safeDeviceB.name, cx, cy, true);
        drawDevice(d1, safeDeviceA.color, safeDeviceA.name, cx, cy, false);
      } else {
        const gap = 2 * ppiScale;
        const totalW = (d1.widthInch * ppiScale) + (d2.widthInch * ppiScale) + gap;
        const startX = cx - totalW / 2;
        const cx1 = startX + (d1.widthInch * ppiScale) / 2;
        const cx2 = startX + (d1.widthInch * ppiScale) + gap + (d2.widthInch * ppiScale) / 2;
        drawDevice(d1, safeDeviceA.color, safeDeviceA.name, cx1, cy, false);
        drawDevice(d2, safeDeviceB.color, safeDeviceB.name, cx2, cy, false);
      }

      // 참조 물체 그리기
      if (showRefObject === 'card') {
        const cw = 3.37 * ppiScale;
        const ch = 2.125 * ppiScale;
        const margin = isMobile ? 15 : 40;
        const refX = margin + cw/2;
        const refY = rect.height - margin - ch/2;
        
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(refX - cw/2, refY - ch/2, cw, ch, 6);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = `bold ${isMobile ? 10 : 12}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('신용카드', refX, refY + 4);
      } else if (showRefObject === 'a4') {
        const aw = (21 / 2.54) * ppiScale;
        const ah = (29.7 / 2.54) * ppiScale;
        ctx.strokeStyle = '#64748b';
        ctx.setLineDash([10, 5]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(cx - ah/2, cy - aw/2, ah, aw);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    };

    render();
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, [safeDeviceA, safeDeviceB, d1, d2, viewMode, showRefObject, compareMode, isFullscreen]);

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${isFullscreen ? 'overflow-hidden' : ''}`}>
      {!isFullscreen && (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setViewMode('home')}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition">
                <Monitor size={18} />
              </div>
              <span className="font-bold text-lg md:text-xl tracking-tight">DisplayPro</span>
            </div>
            {viewMode === 'compare' && (
              <button onClick={() => setViewMode('select')} className="bg-slate-100 hover:bg-slate-200 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold transition flex items-center gap-2">
                <ArrowLeft size={14} /> <span className="hidden md:inline">기기 변경</span>
              </button>
            )}
          </div>
        </nav>
      )}

      <main className={`${isFullscreen ? 'p-0 h-screen w-screen' : 'max-w-6xl mx-auto px-4 py-6 md:py-8'}`}>
        
        {viewMode === 'home' && (
          <div className="py-8 md:py-12 animate-in fade-in">
            <div className="text-center mb-10 md:mb-16">
              <h1 className="text-3xl md:text-4xl font-black mb-3 md:mb-4 tracking-tight">어떤 화면을 비교할까요?</h1>
              <p className="text-slate-500 font-medium text-sm md:text-lg">카테고리를 선택하면 실제 크기 비교를 시작합니다.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
              {[
                { id: 'mobile', label: '핸드폰 & 태블릿', icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-50' },
                { id: 'laptop', label: '노트북 & 모니터', icon: Laptop, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { id: 'tv', label: '티비', icon: Tv, color: 'text-orange-600', bg: 'bg-orange-50' },
              ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => { setCategory(item.id); setDeviceA(null); setDeviceB(null); setViewMode('select'); setSearchTerm(''); setSelectedBrand('All'); }}
                  className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group flex flex-row md:flex-col items-center gap-4 md:gap-6"
                >
                  <div className={`w-16 h-16 md:w-24 md:h-24 ${item.bg} rounded-xl md:rounded-[2rem] flex items-center justify-center ${item.color} group-hover:scale-110 transition shadow-inner shrink-0`}>
                    <item.icon size={32} className="md:w-11 md:h-11" />
                  </div>
                  <div className="text-left md:text-center">
                    <span className="font-bold text-lg md:text-2xl block mb-1">{item.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'select' && (
          <div className="max-w-6xl mx-auto animate-in slide-in-from-right-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
                <Layout className="text-blue-600" size={28} /> 모델 선택
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 flex-1 justify-end">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="모델명 검색" 
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 transition shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
              {['A', 'B'].map((slot, idx) => (
                <div key={slot} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-[400px] md:h-[500px] relative">
                  <div className={`flex items-center justify-between mb-4 px-2`}>
                     <div className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-black text-white ${idx === 0 ? 'bg-blue-500' : 'bg-violet-500'} shadow-md`}>
                      DEVICE {slot}
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                    {currentDeviceList.map(d => {
                      const isSelected = (idx === 0 ? deviceA?.id : deviceB?.id) === d.id;
                      return (
                        <button
                          key={d.id}
                          onClick={() => idx === 0 ? setDeviceA(d) : setDeviceB(d)}
                          className={`w-full p-3 md:p-4 rounded-2xl text-left flex justify-between items-center transition-all border-2 ${
                            isSelected ? (idx === 0 ? 'border-blue-500 bg-blue-50/50' : 'border-violet-500 bg-violet-50/50') : 'border-transparent bg-slate-50/50 hover:bg-slate-100'
                          }`}
                        >
                          <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.brand}</span>
                            <div className="text-sm md:text-base font-bold text-slate-800">{d.name}</div>
                            <span className="text-[10px] md:text-xs text-slate-500">{d.diagonal}" ({d.ratioW}:{d.ratioH})</span>
                          </div>
                          {isSelected && <Check size={18} className={idx === 0 ? "text-blue-500" : "text-violet-500"} strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button 
              disabled={!deviceA || !deviceB}
              onClick={() => setViewMode('compare')}
              className="w-full bg-slate-900 text-white py-5 md:py-6 rounded-2xl md:rounded-3xl font-black text-lg md:text-xl hover:bg-slate-800 disabled:opacity-20 transition-all shadow-2xl flex items-center justify-center gap-2"
            >
              비교 화면으로 이동 <ArrowLeft className="rotate-180" />
            </button>
          </div>
        )}

        {viewMode === 'compare' && (
          <div className={`animate-in slide-in-from-bottom-4 ${isFullscreen ? 'fixed inset-0 z-[100] bg-white' : 'space-y-6'}`}>
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${isFullscreen ? 'h-full' : ''}`}>
              <div className={`${isFullscreen ? 'lg:col-span-12 h-full' : 'lg:col-span-8'}`}>
                <div className={`bg-white relative transition-all duration-300 ${isFullscreen ? 'h-full w-full' : 'rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-1 md:p-2 shadow-sm'}`}>
                  
                  {/* 도구 모음 */}
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <div className="bg-white/90 backdrop-blur rounded-full p-1 border border-slate-200 shadow-sm flex">
                      <button onClick={() => setCompareMode('overlay')} className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold transition ${compareMode === 'overlay' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}>겹치기</button>
                      <button onClick={() => setCompareMode('side')} className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold transition ${compareMode === 'side' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}>나란히</button>
                    </div>
                  </div>

                  <button onClick={toggleFullscreen} className="absolute top-4 right-4 z-20 p-2 md:p-3 bg-white shadow-xl rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 transition">
                    {isFullscreen ? <Minimize2 size={20} /> : <Maximize size={20} />}
                  </button>

                  {/* 캔버스 컨테이너 (h-full과 flex-grow를 통해 화면을 최대한 채움) */}
                  <div className={`bg-slate-50/50 overflow-hidden relative ${isFullscreen ? 'h-full w-full' : 'rounded-[1.5rem] md:rounded-[2rem] h-[50vh] md:h-[65vh] min-h-[400px]'}`} ref={containerRef}>
                    <canvas ref={canvasRef} className="w-full h-full block" />
                    
                    {/* 범례 및 참조 도구 */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 w-full px-4">
                      <div className="flex gap-4 text-[10px] md:text-xs font-black bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-200/50">
                        <div className="flex items-center gap-2 text-blue-600"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> {safeDeviceA.name}</div>
                        <div className="flex items-center gap-2 text-violet-600"><div className="w-3 h-3 border border-violet-500 border-dashed rounded-sm"></div> {safeDeviceB.name}</div>
                      </div>
                      <div className="flex gap-2 bg-slate-900 text-white p-1 rounded-xl shadow-xl">
                        <button onClick={() => setShowRefObject(showRefObject === 'card' ? 'none' : 'card')} className={`px-3 py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${showRefObject === 'card' ? 'bg-white/20' : 'hover:bg-white/10'}`}>신용카드</button>
                        <button onClick={() => setShowRefObject(showRefObject === 'a4' ? 'none' : 'a4')} className={`px-3 py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${showRefObject === 'a4' ? 'bg-white/20' : 'hover:bg-white/10'}`}>A4 용지</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {!isFullscreen && (
                <div className="lg:col-span-4 space-y-4 flex flex-col">
                  <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-100 p-6 md:p-8 shadow-sm flex-grow">
                    <h3 className="font-black mb-6 text-slate-400 uppercase text-xs tracking-widest">상세 수치</h3>
                    <div className="space-y-6">
                      {[
                        { label: "가로 폭 (W)", val1: `${d1.widthCm.toFixed(1)}cm`, val2: `${d2.widthCm.toFixed(1)}cm` },
                        { label: "세로 높이 (H)", val1: `${d1.heightCm.toFixed(1)}cm`, val2: `${d2.heightCm.toFixed(1)}cm` },
                        { label: "총 면적", val1: `${d1.areaCm.toFixed(0)}cm²`, val2: `${d2.areaCm.toFixed(0)}cm²` },
                      ].map((row, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase">{row.label}</div>
                          <div className="flex justify-between font-black text-lg">
                            <span className="text-blue-600">{row.val1}</span>
                            <span className="text-violet-600">{row.val2}</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                             <div className="bg-blue-500" style={{ width: `${(parseFloat(row.val1) / (parseFloat(row.val1) + parseFloat(row.val2))) * 100}%` }}></div>
                             <div className="bg-violet-500 flex-1"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 shadow-xl">
                     <h3 className="text-lg font-black mb-3">{verdict.title}</h3>
                     <p className="text-slate-400 text-sm leading-relaxed">{verdict.detail}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {!isFullscreen && (
        <footer className="mt-12 py-8 text-center border-t border-slate-100">
          <p className="text-[10px] text-slate-300">© 2025 DisplayPro. Responsive Layout Active.</p>
        </footer>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
}