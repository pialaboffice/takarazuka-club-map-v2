
import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, Map as MapIcon, List, Info, ChevronRight, School as SchoolIcon, Filter, ExternalLink, Mail, Calendar } from 'lucide-react';
import { CLUBS, SCHOOLS } from './data';
import { Club, ClubCategory } from './types';

// カスタムマーカーアイコンの定義
const createSchoolIcon = () => L.divIcon({
  className: 'school-marker',
  html: '<div class="school-marker-inner">文</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const getMarkerIcon = (status: '活動中' | '調整中' | '検討中') => {
  const color = status === '活動中' ? 'green' : 'orange';
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// 地図の中心を移動させるコンポーネント
const RecenterMap: React.FC<{ club: Club | null }> = ({ club }) => {
  const map = useMap();
  useEffect(() => {
    if (!club) return;
    const coords = club.coordinates;
    const isValid = coords && !isNaN(coords[0]) && !isNaN(coords[1]) && (coords[0] !== 0 || coords[1] !== 0);
    
    if (isValid && map) {
      map.flyTo(coords, 16, { duration: 1.2 });
    }
  }, [club, map]);
  return null;
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ClubCategory | 'すべて'>('すべて');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const schoolMarkerIcon = useMemo(() => createSchoolIcon(), []);

  const filteredClubs = useMemo(() => {
    const filtered = CLUBS.filter(club => {
      const matchesSearch = 
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        club.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (club.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'すべて' || club.majorCategory === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // ステータスによるソート: 活動中(0) > 調整中(1) > 検討中(2)
    const statusPriority = { '活動中': 0, '調整中': 1, '検討中': 2 };
    return [...filtered].sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);
  }, [searchQuery, selectedCategory]);

  const handleClubSelect = (club: Club) => {
    setSelectedClub(club);
    // モバイルの場合は即座に地図タブへ切り替え
    // ただし、地図用座標がない場合はリストのまま詳細を表示する
    const hasCoords = club.coordinates[0] !== 0 || club.coordinates[1] !== 0;
    if (window.innerWidth < 768 && hasCoords) {
      setActiveTab('map');
    }
  };

  const openExternalLink = (club: Club) => {
    if (!club.url) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent('宝塚市 地域部活動 ' + club.name)}`, '_blank');
      return;
    };
    
    const urlString = club.url.toLowerCase().trim();
    const invalidKeywords = ['今後', '予定', '検討', 'なし', '未定', '開設', '作成', '確認'];
    const isInvalid = invalidKeywords.some(keyword => urlString.includes(keyword));
    const isUrl = urlString.startsWith('http') || urlString.includes('.com') || urlString.includes('.jp') || urlString.includes('.io');

    if (!isInvalid && isUrl) {
      window.open(club.url, '_blank');
    } else {
      window.open(`https://www.google.com/search?q=${encodeURIComponent('宝塚市 地域部活動 ' + club.name)}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg z-30 flex-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SchoolIcon className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold leading-none mb-1">宝塚市 地域部活動ナビ</h1>
              <p className="text-[10px] text-blue-100 uppercase tracking-widest font-medium opacity-90">Takarazuka Community Club Portal</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-bold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <span>活動中</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
              <span>調整/検討中</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar / List View */}
        <aside className={`flex-none w-full md:w-[420px] bg-white border-r border-gray-100 flex flex-col z-20 transition-all duration-300
          ${activeTab === 'list' ? 'translate-x-0 relative h-full' : '-translate-x-full md:translate-x-0 absolute md:relative h-full'}`}>
          
          <div className="p-4 border-b bg-gray-50 space-y-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="団体名、種目、場所でさがす..." 
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {['すべて', '運動系', '文化系'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedCategory === cat 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white pb-24 md:pb-0">
            <div className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 flex justify-between items-center sticky top-0 z-10 border-b">
              <span>LISTINGS ({filteredClubs.length})</span>
              <Filter className="w-3 h-3" />
            </div>
            {filteredClubs.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {filteredClubs.map((club) => {
                  const school = SCHOOLS.find(s => s.id === club.schoolId);
                  const isSelected = selectedClub?.id === club.id;
                  return (
                    <div 
                      key={club.id} 
                      className={`p-5 cursor-pointer transition-all border-l-4 ${isSelected ? 'bg-blue-50 border-blue-600' : 'border-transparent hover:bg-gray-50'}`}
                      onClick={() => handleClubSelect(club)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded tracking-wider ${club.majorCategory === '運動系' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                          {club.majorCategory}
                        </span>
                        <div className="flex items-center gap-1.5">
                           <div className={`w-2 h-2 rounded-full ${club.status === '活動中' ? 'bg-green-500' : (club.status === '調整中' ? 'bg-orange-400' : 'bg-gray-400')}`}></div>
                           <span className="text-[10px] font-bold text-gray-500">{club.status}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-gray-900 text-lg leading-snug mb-2">{club.name}</h3>
                      
                      <div className="space-y-1.5 text-xs text-gray-600">
                        <div className="flex items-start gap-2">
                          <MapIcon className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                          <span className="font-medium">{school?.name || '地域拠点'} <span className="text-gray-400 font-normal">({club.location})</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{club.frequency}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400">
                <p className="text-sm">条件に合う団体が見つかりませんでした</p>
              </div>
            )}
          </div>
        </aside>

        {/* Map View */}
        <section className={`flex-1 relative bg-gray-200 ${activeTab === 'map' ? 'block' : 'hidden md:block'}`}>
          <MapContainer 
            center={[34.81, 135.36]} 
            zoom={13} 
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* 学校拠点のみ表示 */}
            {SCHOOLS.map(school => (
              <Marker key={school.id} position={school.coordinates} icon={schoolMarkerIcon}>
                <Popup><div className="text-sm font-bold">{school.name}</div></Popup>
              </Marker>
            ))}

            {/* coordinatesが [0,0] でない団体のみ地図に表示 */}
            {filteredClubs.filter(club => club.coordinates[0] !== 0 || club.coordinates[1] !== 0).map(club => (
              <Marker 
                key={club.id} 
                position={club.coordinates} 
                icon={getMarkerIcon(club.status)}
                eventHandlers={{ click: () => setSelectedClub(club) }}
              >
                <Popup>
                  <div className="p-1 min-w-[180px]">
                    <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">{club.subject}</span>
                    <h4 className="font-bold text-sm text-gray-900 mt-1">{club.name}</h4>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedClub(club); }}
                      className="mt-3 w-full text-center bg-gray-900 text-white text-[10px] py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                    >
                      詳細を見る
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {selectedClub && <RecenterMap club={selectedClub} />}
          </MapContainer>

          {/* Floating Mobile Tab Bar */}
          <div className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-[320px]">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 flex p-1.5 ring-1 ring-black/5">
              <button 
                onClick={() => setActiveTab('map')} 
                className={`flex-1 py-3.5 flex items-center justify-center gap-2 text-sm font-black rounded-xl transition-all duration-300 ${activeTab === 'map' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}
              >
                <MapIcon className="w-4.5 h-4.5" /> 
                <span>地図で見る</span>
              </button>
              <button 
                onClick={() => setActiveTab('list')} 
                className={`flex-1 py-3.5 flex items-center justify-center gap-2 text-sm font-black rounded-xl transition-all duration-300 ${activeTab === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}
              >
                <List className="w-4.5 h-4.5" /> 
                <span>一覧で探す</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Detail Overlay */}
      {selectedClub && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[2000] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200" onClick={() => setSelectedClub(null)}>
          <div className="bg-white w-full max-w-2xl rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
            <div className="md:hidden flex justify-center py-3">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
            </div>

            <div className={`p-6 text-white ${selectedClub.majorCategory === '運動系' ? 'bg-orange-500' : 'bg-purple-600'}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black bg-black/20 px-2 py-1 rounded tracking-widest uppercase">{selectedClub.majorCategory}</span>
                <button onClick={() => setSelectedClub(null)} className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </button>
              </div>
              <h2 className="text-2xl font-black leading-tight mb-1">{selectedClub.name}</h2>
              <div className="inline-block bg-white/20 px-2 py-0.5 rounded text-xs font-bold">{selectedClub.subject}</div>
            </div>
            
            <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto">
              <div className="mb-6">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-2">紹介・目的</p>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedClub.description || '紹介文は現在準備中です。'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">主な拠点</p>
                  <p className="font-bold text-gray-900">{SCHOOLS.find(s => s.id === selectedClub.schoolId)?.name || '地域拠点'}</p>
                  <p className="text-xs text-gray-500 leading-tight">{selectedClub.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">活動状況</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${selectedClub.status === '活動中' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-orange-400'}`}></div>
                    <p className="font-bold text-gray-900">{selectedClub.status}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">活動頻度</p>
                  <p className="font-bold text-gray-900 leading-snug whitespace-pre-wrap">{selectedClub.frequency}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">費用目安</p>
                  <p className="font-bold text-gray-900 leading-snug whitespace-pre-wrap">{selectedClub.fee}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">申込・問合せ方法</p>
                  <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <Mail className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="font-bold text-blue-900 break-all leading-snug">{selectedClub.applyMethod || '窓口は確認中です。'}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  className="flex-1 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 bg-gray-900 text-white hover:bg-blue-600 active:scale-[0.98]"
                  onClick={() => openExternalLink(selectedClub)}
                >
                  <ExternalLink className="w-4 h-4" /> 
                  公式サイト・詳細情報
                </button>
                <button 
                  className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all active:scale-[0.98]"
                  onClick={() => setSelectedClub(null)}
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
