
import { Club, School } from './types';

// ご指定いただいた正確な座標データ
export const SCHOOLS: School[] = [
  { id: 's1', name: '宝塚中学校', coordinates: [34.802924, 135.361438] },
  { id: 's2', name: '宝塚第一中学校', coordinates: [34.781453, 135.348135] },
  { id: 's4', name: '御殿山中学校', coordinates: [34.817130, 135.347164] },
  { id: 's5', name: '光ガ丘中学校', coordinates: [34.801897, 135.334235] },
  { id: 's6', name: '長尾中学校', coordinates: [34.814131, 135.381845] },
  { id: 's7', name: '南ひばりガ丘中学校', coordinates: [34.821768, 135.398834] },
  { id: 's8', name: '安倉中学校', coordinates: [34.801649, 135.379061] },
  { id: 's9', name: '中山五月台中学校', coordinates: [34.8312, 135.3681] },
  { id: 's10', name: '山手台中学校', coordinates: [34.827821, 135.377913] },
  { id: 's11', name: '宝梅中学校', coordinates: [34.797495, 135.336279] },
  { id: 's12', name: '高司中学校', coordinates: [34.786090, 135.361741] },
  { id: 's13', name: '西谷中学校', coordinates: [34.911017, 135.303492] }
];

// 重なり防止のためのオフセット関数（学校拠点のみ使用）
const offset = (schoolId: string, index: number): [number, number] => {
  const school = SCHOOLS.find(s => s.id === schoolId);
  if (!school) return [0, 0]; // 地図非表示用
  const coords = school.coordinates;
  const step = 0.00015; 
  const angle = index * (Math.PI / 4); 
  return [coords[0] + Math.sin(angle) * step, coords[1] + Math.cos(angle) * step];
};

export const CLUBS: Club[] = [
  {
    id: 'c1', majorCategory: '運動系', name: '安倉・宝塚ベースボールクラブ（仮）', subject: '軟式野球', location: '安倉中学校', schoolId: 's8', target: '市内中学生', fee: '月:3,000円', frequency: '木金 16:30〜、土日祝', status: '検討中', coordinates: offset('s8', 1),
    applyMethod: 't109215@sumire2.takarazuka.ed.jp', description: '学校教員と地域指導者が連携。初心者歓迎、競技力向上を目指します。'
  },
  {
    id: 'c2', majorCategory: '運動系', name: '宝梅BC（仮）', subject: '軟式野球', location: '宝梅中学校', schoolId: 's11', target: '中学生', fee: '月:3,000円', frequency: '平日週4、休日1日', status: '活動中', coordinates: offset('s11', 1),
    applyMethod: 't100969@sumire2.takarazuka.ed.jp', description: '文武両道を掲げ、みんなが野球を楽しめる環境を。'
  },
  {
    id: 'c3', majorCategory: '運動系', name: '御殿山軟式野球部', subject: '軟式野球', location: '御殿山中学校', schoolId: 's4', target: '初心者大歓迎', fee: '月3,000円', frequency: '火〜金、土日', status: '検討中', coordinates: offset('s4', 1),
    applyMethod: '確認中', description: '野球が好きな子はぜひ参加してください。'
  },
  {
    id: 'c4', majorCategory: '運動系', name: '阪神クラブ', subject: '軟式野球', location: '山手台中学校', schoolId: 's10', target: '中学生', fee: '月3,000〜5,000円', frequency: '火金 17時〜、土日祝', status: '活動中', coordinates: offset('s10', 1),
    applyMethod: 'チラシのフォームより', description: '身体の使い方の習得と社会で活躍できる人材育成。'
  },
  {
    id: 'c5', majorCategory: '運動系', name: '兵庫宝塚プリンセス (西谷)', subject: '女子軟式野球', location: '西谷中学校', schoolId: 's13', target: '女子中学生', fee: '月/5,000円', frequency: '土日祝 9時〜16時', status: '活動中', coordinates: offset('s13', 1),
    applyMethod: '090-7882-1109 山本', url: 'https://www.instagram.com/hyogo_tp_baseball', description: '宝塚初の中学女子軟式野球チーム。「一戦必笑」！'
  },
  {
    id: 'c6', majorCategory: '運動系', name: '南ひばりガ丘ベースボールクラブ（仮）', subject: '軟式野球', location: '南ひばりガ丘中学校', schoolId: 's7', target: '中学生', fee: '月3,000円', frequency: '平日4回、土日どちらか', status: '活動中', coordinates: offset('s7', 1),
    applyMethod: '調整中', description: '部員全員が野球を楽しめる団体を目指します。'
  },
  {
    id: 'c7', majorCategory: '運動系', name: '長尾ベースボールクラブ（仮）', subject: '軟式野球', location: '長尾中学校', schoolId: 's6', target: '中学生', fee: '月3,000円', frequency: '平日週4、休日1日', status: '活動中', coordinates: offset('s6', 1),
    applyMethod: '確認中', description: '基礎スキルから段階的に、丁寧に指導を行います。'
  },
  {
    id: 'c8', majorCategory: '運動系', name: '宝塚第一ベースボールクラブ（仮）', subject: '軟式野球', location: '宝塚第一中学校', schoolId: 's2', target: '中学生', fee: '月3,000円', frequency: '平日週4、休日1日', status: '活動中', coordinates: offset('s2', 1),
    applyMethod: '確認中', description: '学童野球チーム指導者と連携し健全な成長を目指します。'
  },
  {
    id: 'c9', majorCategory: '運動系', name: '高司ベースボールクラブ（仮）', subject: '軟式野球', location: '高司中学校', schoolId: 's12', target: '中学生', fee: '月3,000円', frequency: '平日週4、休日1日', status: '活動中', coordinates: offset('s12', 1),
    applyMethod: '確認中', description: '心技体の育成に務め、学校生活を1番に考えます。'
  },
  {
    id: 'c10', majorCategory: '運動系', name: '光ガ丘ベースボールクラブ（仮）', subject: '軟式野球', location: '光ガ丘中学校', schoolId: 's5', target: '中学生', fee: '月3,000円', frequency: '平日週4、休日1日', status: '活動中', coordinates: offset('s5', 1),
    applyMethod: '確認中', description: '競技力向上と健全な成長を目的に活動しています。'
  },
  {
    id: 'c11', majorCategory: '運動系', name: '兵庫宝塚プリンセス (中/五月台)', subject: '女子軟式野球', location: '宝塚中/五月台中', schoolId: 's1', target: '女子中学生', fee: '月3,000円', frequency: '平日週4、休日1日', status: '活動中', coordinates: offset('s1', 1),
    applyMethod: '確認中', description: '学童女子野球と連携し、初心者から丁寧に指導。'
  },
  {
    id: 'c12', majorCategory: '運動系', name: 'Central', subject: 'サッカー', location: '宝塚中', schoolId: 's1', target: '中学生', fee: '月5,000円', frequency: '週11時間目途', status: '活動中', coordinates: offset('s1', 2),
    applyMethod: 't844099@sumire2.takarazuka.ed.jp', description: '中体連やリーグ戦にも参加。うまくなりたい人歓迎。'
  },
  {
    id: 'c13', majorCategory: '運動系', name: 'West', subject: 'サッカー', location: '高司中', schoolId: 's12', target: '中学生', fee: '月5,000円', frequency: '週11時間目途', status: '活動中', coordinates: offset('s12', 2),
    applyMethod: 't117644@sumire2.takarazuka.ed.jp', description: '地域指導者とともに。リーグ戦にも参加予定。'
  },
  {
    id: 'c14', majorCategory: '運動系', name: 'East', subject: 'サッカー', location: '南ひばりガ丘中', schoolId: 's7', target: '中学生', fee: '月5,000円', frequency: '週11時間目途', status: '活動中', coordinates: offset('s7', 2),
    applyMethod: 't102937@sumire2.takarazuka.ed.jp', description: 'サッカーを通じた地域交流とレベルアップを目指します。'
  },
  {
    id: 'c15', majorCategory: '運動系', name: '中山五月台FC', subject: 'サッカー', location: '中山五月台中学校', schoolId: 's9', target: '中学生・小学生', fee: '月3,000円〜', frequency: '火水木夕方、土日祝午前', status: '活動中', coordinates: offset('s9', 1),
    applyMethod: '112709230915.a.m@ezweb.ne.jp', description: '宝塚最初の地域部活。北摂U-13でベスト4の実績。'
  },
  {
    id: 'c16', majorCategory: '運動系', name: 'FC宝塚第一Rossignol', subject: 'サッカー', location: '宝塚第一中学校', schoolId: 's2', target: '中学生', fee: '月1,000円', frequency: '火〜金放課後、日曜午前', status: '活動中', coordinates: offset('s2', 2),
    applyMethod: '090-4769-3997', description: '単独チームとして中体連等の大会に参加中。'
  },
  {
    id: 'c17', majorCategory: '運動系', name: '山手台FC', subject: 'サッカー', location: '山手台中学校', schoolId: 's10', target: '未経験・経験者', fee: '月3,000円', frequency: '調整中', status: '活動中', coordinates: offset('s10', 2),
    applyMethod: 'Formsより申込予定', description: 'スポーツクラブ21が主体。エンジョイサッカー歓迎。'
  },
  {
    id: 'c18', majorCategory: '運動系', name: '宝塚市ジュニアバレーボールクラブ', subject: 'バレーボール', location: '美座小学校', schoolId: 's-others', target: '中学生男子・小5,6', fee: '月5,000円', frequency: '火水金夕方、土日のどちらか', status: '活動中', coordinates: [0,0],
    applyMethod: 'インスタDM', url: 'https://www.instagram.com/volleyball_takarazuka/', description: '元オリンピック強化本部長らが基礎から丁寧に指導。'
  },
  {
    id: 'c19', majorCategory: '運動系', name: 'Treasure Mound Basketball', subject: 'バスケットボール', location: '長尾・山手台・宝梅中', schoolId: 's6', target: '中学生', fee: '保険料・会場費等', frequency: '検討中', status: '検討中', coordinates: offset('s6', 2),
    applyMethod: 'Formsより申し込み', description: '実証実験の成果を元に教員が協力して行う認証団体。'
  },
  {
    id: 'c20', majorCategory: '運動系', name: 'GOTE UNITS', subject: 'バスケットボール', location: '御殿山中学校', schoolId: 's4', target: 'U15女子', fee: '月3,000円', frequency: '火木夕方、土日', status: '調整中', coordinates: offset('s4', 2),
    applyMethod: 'goteunitsbaske20260109@gmail.com', description: '長く楽しむための技術と人間性を育みます。'
  },
  {
    id: 'c21', majorCategory: '運動系', name: '宝塚インシエメSTC', subject: '女子ソフトテニス', location: '御殿山中学校', schoolId: 's4', target: '女子中学生', fee: '月3,000円', frequency: '火木夕方、土曜午前', status: '活動中', coordinates: offset('s4', 3),
    applyMethod: 't103899@sumire.takarazuka.ed.JP', description: '「仲良く・楽しく・一生懸命」がモットー。'
  },
  {
    id: 'c22', majorCategory: '運動系', name: 'ソフトテニス検討中', subject: '男女ソフトテニス', location: '安倉・山手台中', schoolId: 's8', target: '中学生', fee: '検討中', frequency: '検討中', status: '調整中', coordinates: offset('s8', 2),
    applyMethod: 'インスタDM予定', description: '教員が中心となり立ち上げた新規クラブです。'
  },
  {
    id: 'c23', majorCategory: '運動系', name: 'マッチポイント', subject: '硬式テニス', location: '中山五月台中学校', schoolId: 's9', target: '中学生', fee: '未定', frequency: '火木土', status: '調整中', coordinates: offset('s9', 2),
    applyMethod: 'uhh36356@gmail.com', description: '地域指導者が競技力向上のため活動。初心者歓迎。'
  },
  {
    id: 'c24', majorCategory: '運動系', name: 'ランタメ宝塚AC', subject: '陸上競技', location: '武庫川河川敷等', schoolId: 's1', target: '中学生', fee: '年60,000円', frequency: '平日2〜3、休日1', status: '活動中', coordinates: offset('s1', 3),
    applyMethod: 'HPより申込', url: 'https://sites.google.com/view/tf-takarazuka/', description: '思いっきり走れて跳べて投げられる環境を提供。'
  },
  {
    id: 'c25', majorCategory: '運動系', name: '五月台バドミントンクラブJr.', subject: 'バドミントン', location: '中山五月台中体育館', schoolId: 's9', target: '中学生', fee: '週3回 1,500円', frequency: '火木金 18:00〜19:30', status: '活動中', coordinates: offset('s9', 3),
    applyMethod: 'メールにて問合せ', description: 'バドミントンを楽しく続けてほしいと願っています。'
  },
  {
    id: 'c26', majorCategory: '運動系', name: 'AC・ユナイテッド', subject: 'バドミントン', location: '長尾中学校', schoolId: 's6', target: '中学生', fee: '600円/回', frequency: '金曜 19時〜21時', status: '活動中', coordinates: offset('s6', 3),
    applyMethod: '090-3657-6737', description: '競技力向上と人間力向上を目的として活動。'
  },
  {
    id: 'c27', majorCategory: '文化系', name: '陽凪ビリヤードJrクラブ', subject: 'ビリヤード', location: '陽凪ビリヤード店舗', schoolId: 's-others', target: '中学生', fee: '月3,000円', frequency: '月木 18:00〜19:30', status: '活動中', coordinates: [0,0],
    applyMethod: 'hinabilli2025@gmail.com', url: 'https://hina-billi.com/', description: '元塾講師とプロが初歩から伝えます。検定も実施。'
  },
  {
    id: 'c28', majorCategory: '運動系', name: '宝塚市テコンドー部', subject: 'テコンドー', location: '韓国民団宝塚支部', schoolId: 's-others', target: '中学生', fee: '5,500〜8,500円', frequency: '金曜 16:15〜21:00', status: '活動中', coordinates: [0,0],
    applyMethod: '公式ラインより', url: 'https://www.itf-h.com/', description: '元代表王者が指導。挨拶と挑戦の心を育てます。'
  },
  {
    id: 'c29', majorCategory: '運動系', name: '宝塚テコンドークラブ', subject: 'テコンドー', location: '未定', schoolId: 's-others', target: '中学生', fee: '月3,500円', frequency: '月水 17:00〜18:30', status: '調整中', coordinates: [0,0],
    applyMethod: 'tuiteru0508@gmail.com', description: '健全な成長と競技力向上を目的。体験大歓迎。'
  },
  {
    id: 'c30', majorCategory: '運動系', name: '少林寺拳法 宝塚売布支部', subject: '少林寺拳法', location: '売布会館', schoolId: 's-others', target: '中学生', fee: '問合せ', frequency: '火土 19時〜21時', status: '活動中', coordinates: [0,0],
    applyMethod: '090-3721-9747', description: '大人の先生が丁寧に指導。合同練習で仲間も。'
  },
  {
    id: 'c31', majorCategory: '運動系', name: '少林寺拳法 宝塚西支部', subject: '少林寺拳法', location: '光明会館', schoolId: 's-others', target: '中学生', fee: '問合せ', frequency: '火土 19時〜21時', status: '活動中', coordinates: [0,0],
    applyMethod: '090-1077-7500', description: '和気あいあいと楽しく稽古しております。'
  },
  {
    id: 'c32', majorCategory: '運動系', name: '少林寺拳法 宝塚東支部', subject: '少林寺拳法', location: '山本駅前・長尾南小', schoolId: 's-others', target: '中学生', fee: '問合せ', frequency: '月火木 19時〜21時', status: '活動中', coordinates: [0,0],
    applyMethod: '090-3495-9826', description: '笑いを交えながらコーチングスキルを活かして指導。'
  },
  {
    id: 'c33', majorCategory: '運動系', name: '少林寺拳法 宝塚千種スポーツ少年団', subject: '少林寺拳法', location: '市立武道館', schoolId: 's-others', target: '中学生', fee: '月2,500円', frequency: '火土 19時〜21時', status: '活動中', coordinates: [0,0],
    applyMethod: 'sasaki_chigusa@outlook.jp', description: '「強く、優しく、正しい人になる」が目標。'
  },
  {
    id: 'c34', majorCategory: '運動系', name: '護身琉術 夢想圓武會', subject: '護身術・武道', location: '中筋会館', schoolId: 's-others', target: '中学生以上', fee: '月4,000円', frequency: '土曜 19時〜21時', status: '活動中', coordinates: [0,0],
    applyMethod: '080-5780-0888', url: 'https://occteni.wixsite.com/musou', description: '自分を守る知恵と技術。未経験者でも大丈夫。'
  },
  {
    id: 'c35', majorCategory: '運動系', name: '仁川インドアスポーツクラブ', subject: '体育館競技全般', location: '宝塚第一中体育館', schoolId: 's2', target: '中学生', fee: '基本無料', frequency: '火木土日', status: '調整中', coordinates: offset('s2', 3),
    applyMethod: 'nigawaindoor2025@outlook.jp', description: '競技志向でないエンジョイスポーツの場を提供。'
  },
  {
    id: 'c36', majorCategory: '運動系', name: '一般財団法人 淑水館', subject: '学校体育全般', location: '淑水館', schoolId: 's-others', target: '小中学生', fee: '月5,000円', frequency: '月曜 18時〜20時半', status: '活動中', coordinates: [0,0],
    applyMethod: '072-758-8595', url: 'https://syukusui.com', description: '器械体操を中心に40年以上の実績があります。'
  },
  {
    id: 'c37', majorCategory: '運動系', name: 'ニュースポーツクラブ（仮称）', subject: 'ニュースポーツ', location: '中山台コミセン等', schoolId: 's9', target: '中学生', fee: '月1,000円程度', frequency: '原則水曜日', status: '活動中', coordinates: offset('s9', 4),
    applyMethod: '090-9055-8739 田中', description: 'ボッチャ、モルックなど仲間と楽しく。'
  },
  {
    id: 'c38', majorCategory: '文化系', name: 'CABOダンスフィットネス部', subject: 'フィットネス', location: '学校内等', schoolId: 's-others', target: '中学生', fee: '月2,200円', frequency: '月火 16:30〜', status: '調整中', coordinates: [0,0],
    applyMethod: '0797-87-2000 三村', url: 'https://studio.cabo-pb.com/', description: '音楽付で体幹と表現力を鍛える。未経験OK。'
  },
  {
    id: 'c39', majorCategory: '文化系', name: 'ダンスクラブ「ジョイフル」', subject: 'ダンス', location: '宝塚公会堂等', schoolId: 's-others', target: '中学生', fee: '600〜900円/回', frequency: '月曜放課後', status: '活動中', coordinates: [0,0],
    applyMethod: 'チラシQRより', description: '初めてでも大丈夫◎ サマーフェスタ等にも出演。'
  },
  {
    id: 'c40', majorCategory: '文化系', name: 'バレエスタジオLiebe', subject: 'バレエトレーニング', location: '中学校教室', schoolId: 's-others', target: '男女問わず', fee: '月2,000〜3,000円', frequency: '土日 月4回 90分', status: '活動中', coordinates: [0,0],
    applyMethod: 'amoreayumi0819@gmail.com', url: 'http://www.ballet-liebe.com/', description: '柔軟性と姿勢改善、体幹強化トレーニング。'
  },
  {
    id: 'c41', majorCategory: '文化系', name: 'ウィッシュダンスファクトリー', subject: 'バレエダンス', location: '宝塚市内中学校', schoolId: 's-others', target: '中学生', fee: '5,500円(検討中)', frequency: '木曜 16時〜', status: '活動中', coordinates: [0,0],
    applyMethod: 'rie.barea.dance@gmail.com', url: 'https://balle-dance0410.jimdofree.com', description: 'モダンバレエ、ダンス、体幹強化。'
  },
  {
    id: 'c42', majorCategory: '文化系', name: 'Yoga & Pilates cayo_co.co', subject: 'ヨガ・ピラティス', location: '宝塚中', schoolId: 's1', target: '中学生', fee: '月4,000円', frequency: '金曜放課後', status: '調整中', coordinates: offset('s1', 4),
    applyMethod: 'lovinxxx824@gmail.com', description: '呼吸と身体のつながりを感じてリラックス。'
  },
  {
    id: 'c43', majorCategory: '文化系', name: '南ひばりガ丘ウインドシンフォニー', subject: '吹奏楽', location: '南ひばりガ丘中', schoolId: 's7', target: '未経験・所持不問', fee: '月3,000円', frequency: '月火木金、土午前', status: '活動中', coordinates: offset('s7', 3),
    applyMethod: 'メールにて問合せ', description: '感動の音楽体験と最高の青春を仲間とともに。'
  },
  {
    id: 'c44', majorCategory: '文化系', name: '宝梅吹奏楽団', subject: '吹奏楽', location: '宝梅中', schoolId: 's11', target: '中学生', fee: '月5,000円', frequency: '平日4回、土日1回', status: '活動中', coordinates: offset('s11', 2),
    applyMethod: 'umenotakarasuibu@gmail.com', description: '仲間づくりと社会に通用する人間形成の場に。'
  },
  {
    id: 'c45', majorCategory: '文化系', name: 'Edible Takarazuka', subject: '自然科学', location: '宝塚中', schoolId: 's1', target: '中学生', fee: '未定', frequency: '不定期', status: '活動中', coordinates: offset('s1', 5),
    applyMethod: 'edibletakarazuka@gmail.com', url: 'https://www.instagram.com/edible_takarazuka665', description: '食や農・SDGs環境をテーマにした実習活動。'
  },
  {
    id: 'c46', majorCategory: '文化系', name: 'モノコトLab.Club', subject: 'ドローンサッカー等', location: '市内中学校', schoolId: 's-others', target: '中学生、親子', fee: '月謝3,300円', frequency: '月2回 17時〜', status: '調整中', coordinates: [0,0],
    applyMethod: 'monokotolab.club@tk-holdings.co.jp', url: 'https://tke.jpn.com/tkhd_monokoto', description: 'エンジニアが教える最新の未来型教育。'
  },
  {
    id: 'c47', majorCategory: '文化系', name: 'みんなの茶道クラブ', subject: '裏千家流茶道', location: '第一中・自宅', schoolId: 's2', target: '中学生', fee: '月3,000円', frequency: '放課後 調整可', status: '活動中', coordinates: offset('s2', 4),
    applyMethod: '090-1719-2999', description: 'お互いを思いやる心が育つ場となりますように。'
  },
  {
    id: 'c48', majorCategory: '文化系', name: 'チャレンジクッキング', subject: '料理教室', location: '御殿山中', schoolId: 's4', target: '中学生', fee: '月4,500円', frequency: '木曜 16:30〜', status: '活動中', coordinates: offset('s4', 4),
    applyMethod: 'm-scotch@nifty.com', url: 'http://kyoko-dining.jp/', description: '料理を通じて実生活に役立つ生きる力を。'
  },
  {
    id: 'c49', majorCategory: '文化系', name: 'ボランティア部', subject: '安倉地区ボランティア', location: '安倉小別館', schoolId: 's8', target: '中学生', fee: '共済500円/年', frequency: '第2土・第4木', status: '活動中', coordinates: offset('s8', 3),
    applyMethod: 'LINE公式より', url: 'https://akura-machikyou.jimdofree.com/', description: '地域とつながり、まちを元気にする活動。'
  },
  {
    id: 'c50', majorCategory: '文化系', name: 'IT部', subject: 'AI、プログラミング', location: 'ピアラボ', schoolId: 's-others', target: 'パソコン初心者歓迎', fee: '月5,000円', frequency: '月水金土 調整可', status: '活動中', coordinates: [34.822, 135.389],
    applyMethod: '0797-61-4565', url: 'https://pia-lab.com/', description: '動画制作やAI活用など最新の体験ができます。'
  },
  {
    id: 'c51', majorCategory: '文化系', name: '大空・未来設計部', subject: '英会話、AI、美容等', location: '南口会館', schoolId: 's-others', target: '中学生', fee: '月5,000円〜', frequency: '平日・土日', status: '活動中', coordinates: [0,0],
    applyMethod: 'ozora.tsubasa.tk@gmail.com', url: 'https://www.ozora-future-wings.com', description: '20の多様なプログラムを自由に体験。'
  },
  {
    id: 'c52', majorCategory: '文化系', name: 'もはらびと 美術部', subject: '美術・アート', location: 'ぷらざこむ１', schoolId: 's-others', target: '中学生歓迎', fee: '無料(保険別途)', frequency: '第2・4土曜 13:30〜', status: '活動中', coordinates: [0,0],
    applyMethod: '現地にて直接', description: 'やりたいアートを、やりたいように。'
  },
  {
    id: 'c53', majorCategory: '文化系', name: 'もはらびと アート書道部', subject: '書道アート', location: 'ぷらざこむ１', schoolId: 's-others', target: '中学生', fee: '無料(保険別途)', frequency: '第2・4土曜 13:30〜', status: '活動中', coordinates: [0,0],
    applyMethod: 'インスタDM', description: '書とアートを融合させる、創造の居場所。'
  },
  {
    id: 'c54', majorCategory: '文化系', name: '愛明教室～書道クラブ', subject: '書道', location: '南ひばりガ丘中', schoolId: 's7', target: '中学生', fee: '月3,000円', frequency: '毎週木曜 16時〜', status: '調整中', coordinates: offset('s7', 4),
    applyMethod: 'raika.koumei@gmail.com', description: '忙しい生活の中に「無心」になる時間を。'
  },
  {
    id: 'c55', majorCategory: '文化系', name: '紅翠会いけばな教室', subject: 'いけばな 華道', location: '南口会館', schoolId: 's-others', target: '学生', fee: '確認中', frequency: '第1・2金曜 18時〜', status: '活動中', coordinates: [0,0],
    applyMethod: '現地問合せ', description: '塾帰りなどの遅い来室も調整可能です。'
  },
  {
    id: 'c56', majorCategory: '文化系', name: '弦楽合奏部', subject: '弦楽アンサンブル', location: '市内学校', schoolId: 's-others', target: '楽器持参の方', fee: '月5,000円', frequency: '週末3時間程度', status: '調整中', coordinates: [0,0],
    applyMethod: 't.strings.ensemble@gmail.com', description: '音楽を通じて社会とつながる体験を。'
  },
  {
    id: 'c57', majorCategory: '文化系', name: 'もはらびと リメイク部', subject: 'リメイク', location: 'ぷらざこむ１', schoolId: 's-others', target: '中学生', fee: '無料(保険別途)', frequency: '第2・4土曜 13:30〜', status: '活動中', coordinates: [0,0],
    applyMethod: 'インスタDM', description: '洋服を蘇らせる、世界に一つのアイテム作り。'
  },
  {
    id: 'c58', majorCategory: '運動系', name: '宝塚空手', subject: '空手', location: '中山五月台中学武道場', schoolId: 's9', target: '学生限定', fee: '月4,000円', frequency: '毎週火曜 17:30〜', status: '検討中', coordinates: offset('s9', 4),
    applyMethod: '090-9877-2029', description: '初心者向け。週1回で強くなる。怖くない。'
  },
  {
    id: 'c59', majorCategory: '文化系', name: '邦楽笑会', subject: '筝・三弦', location: '清荒神駅等', schoolId: 's-others', target: '中学生', fee: '月500円', frequency: '水・土 月3回', status: '活動中', coordinates: [0,0],
    applyMethod: 'masae_gesang@yahoo.co.jp', description: 'ポップスを中心に和の音色を楽しみます。'
  },
  {
    id: 'c60', majorCategory: '文化系', name: '光ガ丘中学校吹奏楽クラブ(仮)', subject: '吹奏楽', location: '光ガ丘中', schoolId: 's5', target: '光ガ丘中生徒', fee: '月3,000円予定', frequency: '平日4回、土曜午前', status: '調整中', coordinates: offset('s5', 2),
    applyMethod: '090-2280-4210 鈴木誠まで', description: '学校で吹奏楽に親しみ、集団で一つの音楽を作り上げます。'
  }
];
