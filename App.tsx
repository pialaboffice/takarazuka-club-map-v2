import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Search,
  Map as MapIcon,
  List,
  ChevronRight,
  School as SchoolIcon,
  Filter,
  ExternalLink,
  Mail,
  Calendar,
} from 'lucide-react';
import { CLUBS, SCHOOLS } from './data';
import { Club, ClubCategory } from './types';

/**
 * 座標の揺れ（形式違い）を吸収：
 * - [lat,lng]
 * - [lng,lat]
 * - { lat, lng } / { latitude, longitude }
 * - "lat,lng" / "lng,lat"
 */
const toLatLng = (coords: any): [number, number] | null => {
  if (coords == null) return null;

  if (typeof coords === 'string') {
    const parts = coords.split(',').map((s) => s.trim());
    if (parts.length >= 2) {
      const a = Number(parts[0]);
      const b = Number(parts[1]);
      if (Number.isFinite(a) && Number.isFinite(b) && !(a === 0 && b === 0)) {
        if (Math.abs(a) <= 90 && Math.abs(b) <= 180) return [a, b];
        if (Math.abs(b) <= 90 && Math.abs(a) <= 180) return [b, a];
      }
    }
    return null;
  }

  if (typeof coords === 'object' && !Array.isArray(coords)) {
    const a = Number((coords as any).lat ?? (coords as any).latitude);
    const b = Number((coords as any).lng ?? (coords as any).lon ?? (coords as any).longitude);
    if (Number.isFinite(a) && Number.isFinite(b) && !(a === 0 && b === 0)) {
      if (Math.abs(a) <= 90 && Math.abs(b) <= 180) return [a, b];
      if (Math.abs(b) <= 90 && Math.abs(a) <= 180) return [b, a];
    }
    return null;
  }

  if (!Array.isArray(coords) || coords.length < 2) return null;

  const a = Number(coords[0]);
  const b = Number(coords[1]);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  if (a === 0 && b === 0) return null;

  if (Math.abs(a) <= 90 && Math.abs(b) <= 180) return [a, b];
  if (Math.abs(b) <= 90 && Math.abs(a) <= 180) return [b, a];

  return null;
};

// 学校マーカー（文）
const createSchoolIcon = () =>
  L.divIcon({
    className: 'school-marker',
    html: '<div class="school-marker-inner">文</div>',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

// クラブの色付きピン（外部画像不要・消えにくい）
const markerIconCache: Record<'活動中' | '調整中' | '検討中', L.DivIcon> = {
  活動中: L.divIcon({ className: '', html: '' }),
  調整中: L.divIcon({ className: '', html: '' }),
  検討中: L.divIcon({ className: '', html: '' }),
};

const buildPinHtml = (color: string) => `
  <div style="
    position: relative;
    width: 26px;
    height: 26px;
    background: ${color};
    border: 3px solid #fff;
    border-radius: 9999px;
    box-shadow: 0 8px 18px rgba(0,0,0,0.25);
  ">
    <div style="
      position: absolute;
      left: 50%;
      bottom: -10px;
      transform: translateX(-50%) rotate(45deg);
      width: 14px;
      height: 14px;
      background: ${color};
      border-right: 3px solid #fff;
      border-bottom: 3px solid #fff;
      border-bottom-right-radius: 3px;
      box-shadow: 6px 6px 12px rgba(0,0,0,0.10);
    "></div>
    <div style="
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      background: rgba(255,255,255,0.95);
      border-radius: 9999px;
    "></div>
  </div>
`;

const getMarkerIcon = (status: '活動中' | '調整中' | '検討中') => {
  if ((markerIconCache[status] as any)._built) return markerIconCache[status];

  const color =
    status === '活動中' ? '#22c55e' : status === '調整中' ? '#fb923c' : '#9ca3af';

  const icon = L.divIcon({
    className: '',
    html: buildPinHtml(color),
    iconSize: [26, 36],
    iconAnchor: [13, 34],
    popupAnchor: [0, -34],
  });

  (icon as any)._built = true;
  markerIconCache[status] = icon;
  return icon;
};

// 地図の中心を移動
const RecenterMap: React.FC<{ club: Club | null }> = ({ club }) => {
  const map = useMap();
  const last = React.useRef<string>('');

  useEffect(() => {
    if (!club) return;
    const latlng = toLatLng((club as any).coordinates);
    if (!latlng) return;

    const [lat, lng] = latlng;
    const key = `${club.id}:${lat}:${lng}`;
    if (last.current === key) return;
    last.current = key;

    map.flyTo([lat, lng], 16, { duration: 0.8 });
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
    const q = searchQuery.toLowerCase();
    const filtered = CLUBS.filter((club) => {
      const matchesSearch =
        club.name.toLowerCase().includes(q) ||
        club.subject.toLowerCase().includes(q) ||
        club.location.toLowerCase().includes(q) ||
        (club.description || '').toLowerCase().includes(q);

      const matchesCategory = selectedCategory === 'すべて' || club.majorCategory === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const statusPriority: Record<'活動中' | '調整中' | '検討中', number> = {
      活動中: 0,
      調整中: 1,
      検討中: 2,
    };
    return [...filtered].sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);
  }, [searchQuery, selectedCategory]);

  // ★ここが肝：描画に使う座標を事前に確定させる（nullは落とす）
  const clubsWithLatLng = useMemo(() => {
    const list = filteredClubs
      .map((club) => ({ club, latlng: toLatLng((club as any).coordinates) }))
      .filter((x) => x.latlng) as Array<{ club: Club; latlng: [number, number] }>;

    // デバッグ：0件なら「座標が全部変」確定（Consoleで気づける）
    if (list.length === 0 && filteredClubs.length > 0) {
      // eslint-disable-next-line no-console
      console.warn('[Map] clubsWithLatLng is 0. coordinates format may be unexpected.', filteredClubs[0]);
    }
    return list;
  }, [filteredClubs]);

  const handleClubSelect = (club: Club) => {
    setSelectedClub(club);
    const hasCoords = !!toLatLng((club as any).coordinates);
    if (window.innerWidth < 768 && hasCoords) setActiveTab('map');
  };

  const openExternalLink = (club: Club) => {
    if (!club.url) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent('宝塚市 地域部活動 ' + club.name)}`, '_blank');
      return;
    }

    const urlString = club.url.toLowerCase().trim();
    const invalidKeywords = ['今後', '予定', '検討', 'なし', '未定', '開設', '作成', '確認'];
    const isInvalid = invalidKeywords.some((keyword) => urlString.includes(keyword));
    const isUrl = urlString.startsWith('http') || urlString.includes('.com') || urlString.includes('.jp') || urlString.includes('.io');

    if (!isInvalid && isUrl) window.open(club.url, '_blank');
    else window.open(`https://www.google.com/search?q=${encodeURIComponent('宝塚市 地域部活動 ' + club.name)}`, '_blank');
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
              <p className="text-[10px] text-blue-100 uppercase tracking-widest font-medium opacity-90">
                Takarazuka Community Club Portal
              </p>
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
        <aside
          className={`flex-none w-full md:w-[420px] bg-white border-r border-gray-100 flex flex-col z-20 transition-all duration-300
          ${activeTab === 'list' ? 'translate-x-0 relative h-full' : '-translate-x-full md:translate-x-0 absolute md:relative h-full'}`}
        >
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
                  const school = SCHOOLS.find((s) => s.id === club.schoolId);
                  const isSelected = selectedClub?.id === club.id;

                  return (
                    <div
                      key={club.id}
                      className={`p-5 cursor-pointer transition-all border-l-4 ${
                        isSelected ? 'bg-blue-50 border-blue-600' : 'border-transparent hover:bg-gray-50'
                      }`}
                      onClick={() => handleClubSelect(club)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span
                          className={`px-2 py-0.5 text-[9px] font-bold rounded tracking-wider ${
                            club.majorCategory === '運動系'
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-purple-100 text-purple-600'
                          }`}
                        >
                          {club.majorCategory}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              club.status === '活動中'
                                ? 'bg-green-500'
                                : club.status === '調整中'
                                ? 'bg-orange-400'
                                : 'bg-gray-400'
                            }`}
                          ></div>
                          <span className="text-[10px] font-bold text-gray-500">{club.status}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-gray-900 text-lg leading-snug mb-2">{club.name}</h3>

                      <div className="space-y-1.5 text-xs text-gray-600">
                        <div className="flex items-start gap-2">
                          <MapIcon className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                          <span className="font-medium">
                            {school?.name || '地域拠点'} <span className="text-gray-400 font-normal">({club.location})</span>
                          </span>
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
            preferCanvas={true}
            updateWhenZooming={false}
            updateWhenIdle={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              updateWhenIdle={true}
              updateWhenZooming={false}
              keepBuffer={2}
            />

            {/* 学校拠点 */}
            {SCHOOLS.map((school) => {
              const latlng = toLatLng((school as any).coordinates);
              if (!latlng) return null;
              return (
                <Marker key={school.id} position={latlng} icon={schoolMarkerIcon}>
                  <Popup>
                    <div className="text-sm font-bold">{school.name}</div>
                  </Popup>
                </Marker>
              );
            })}

            {/* 団体（クラスタなしで確実に表示） */}
            {clubsWithLatLng.map(({ club, latlng }) => (
              <Marker
                key={club.id}
                position={latlng}
                icon={getMarkerIcon(club.status)}
                eventHandlers={{ click: () => setSelectedClub(club) }}
              >
                <Popup>
                  <div className="p-1 min-w-[180px]">
                    <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">
                      {club.subject}
                    </span>
                    <h4 className="font-bold text-sm text-gray-900 mt-1">{club.name}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClub(club);
                      }}
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
                className={`flex-1 py-3.5 flex items-center justify-center gap-2 text-sm font-black rounded-xl transition-all duration-300 ${
                  activeTab === 'map' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'
                }`}
              >
                <MapIcon className="w-4.5 h-4.5" />
                <span>地図で見る</span>
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`flex-1 py-3.5 flex items-center justify-center gap-2 text-sm font-black rounded-xl transition-all duration-300 ${
                  activeTab === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'
                }`}
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
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[2000] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedClub(null)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:hidden flex justify-center py-3">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
            </div>

            <div className={`p-6 text-white ${selectedClub.majorCategory === '運動系' ? 'bg-orange-500' : 'bg-purple-600'}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black bg-black/20 px-2 py-1 rounded tracking-widest uppercase">
                  {selectedClub.majorCategory}
                </span>
                <button
                  onClick={() => setSelectedClub(null)}
                  className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                >
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
                  <p className="font-bold text-gray-900">{SCHOOLS.find((s) => s.id === selectedClub.schoolId)?.name || '地域拠点'}</p>
                  <p className="text-xs text-gray-500 leading-tight">{selectedClub.location}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">活動状況</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        selectedClub.status === '活動中'
                          ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                          : selectedClub.status === '調整中'
                          ? 'bg-orange-400'
                          : 'bg-gray-400'
                      }`}
                    ></div>
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
