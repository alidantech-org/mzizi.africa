import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/user/user_store.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Interface language. The words of the interface live here (English and Swahili); names and labels of places,
/// offices and kinds come from the API in the language chosen here, so the system's own translations are used
/// wherever it holds them. Hand-written.
final languageProvider = StateProvider<String>(
  (ref) => UserStore.instance.language,
);

const _words = <String, Map<String, String>>{
  'en': {
    'tagline':
        'Who serves you, where the money goes, and the evidence behind it.',
    'home': 'Home',
    'places': 'Places',
    'search': 'Search',
    'explore': 'Explore',
    'rankings': 'Rankings',
    'settings': 'Settings',
    'profile': 'Profile',
    'sources': 'Sources',
    'heroTitle': 'Know your place in Kenya',
    'heroBody':
        'Find the people who represent you, the public projects around you, and the sources behind every claim.',
    'useLocation': 'Use my location',
    'locating': 'Finding where you are…',
    'locationDenied':
        'We could not read your location. Search for your place by name instead.',
    'searchHint': 'Search a county, constituency or ward',
    'noResults': 'No places match that name.',
    'representatives': 'Who represents you',
    'procurement': 'Public projects and procurement',
    'contracts': 'contracts',
    'totalAwarded': 'Awarded in total',
    'awardedTo': 'Awarded to',
    'evidence': 'Evidence',
    'seeEvidence': 'See evidence',
    'sourcesBody':
        'Every fact points back to a source. These are the datasets and documents behind it.',
    'files': 'files',
    'citations': 'citations',
    'filterSources': 'Filter sources',
    'inOffice': 'In office since',
    'party': 'Party',
    'notRecorded': 'Not recorded yet',
    'gaps': 'What is missing',
    'retry': 'Try again',
    'locator': 'Where in the file',
    'edition': 'Edition',
    'sampleNotice':
        'Sample development data: people, parties and amounts are invented.',
    'likeLeader': 'Follow this leader',
    'likeProject': 'Like this project',
    'savePlace': 'Save place',
    'savedPlace': 'Saved',
    'saveSpot': 'Save my spot',
    'spotSaved': 'Spot saved',
    'saved': 'Saved',
    'savedBody':
        'Places, leaders and spots you keep. They stay on this device; nothing is sent anywhere.',
    'savedEmpty':
        'Nothing saved yet. Open a place and tap the star or the heart.',
    'myPlaces': 'Places',
    'myLeaders': 'Leaders you follow',
    'myProjects': 'Projects you like',
    'mySpots': 'Spots from your GPS',
    'mapTitle': 'On the map',
  },
  'sw': {
    'tagline': 'Nani anakuhudumia, pesa zinakwenda wapi, na ushahidi wake.',
    'home': 'Mwanzo',
    'places': 'Maeneo',
    'search': 'Tafuta',
    'explore': 'Gundua',
    'rankings': 'Viwango',
    'settings': 'Mipangilio',
    'profile': 'Wasifu',
    'sources': 'Vyanzo',
    'heroTitle': 'Jua eneo lako nchini Kenya',
    'heroBody':
        'Pata wanaokuwakilisha, miradi ya umma karibu nawe, na vyanzo vya kila dai.',
    'useLocation': 'Tumia mahali nilipo',
    'locating': 'Tunatafuta mahali ulipo…',
    'locationDenied':
        'Hatukuweza kusoma mahali ulipo. Tafuta eneo lako kwa jina.',
    'searchHint': 'Tafuta kaunti, eneobunge au wadi',
    'noResults': 'Hakuna maeneo yanayolingana na jina hilo.',
    'representatives': 'Wanaokuwakilisha',
    'procurement': 'Miradi ya umma na ununuzi',
    'contracts': 'mikataba',
    'totalAwarded': 'Jumla iliyotolewa',
    'awardedTo': 'Imetolewa kwa',
    'evidence': 'Ushahidi',
    'seeEvidence': 'Tazama ushahidi',
    'sourcesBody':
        'Kila taarifa inarudi kwenye chanzo. Hivi ndivyo seti za data na hati zilizo nyuma yake.',
    'files': 'faili',
    'citations': 'marejeo',
    'filterSources': 'Chuja vyanzo',
    'inOffice': 'Ofisini tangu',
    'party': 'Chama',
    'notRecorded': 'Bado haijarekodiwa',
    'gaps': 'Kinachokosekana',
    'retry': 'Jaribu tena',
    'locator': 'Mahali kwenye faili',
    'edition': 'Toleo',
    'sampleNotice': 'Data ya majaribio: watu, vyama na kiasi vimebuniwa.',
    'likeLeader': 'Mfuate kiongozi huyu',
    'likeProject': 'Penda mradi huu',
    'savePlace': 'Hifadhi eneo',
    'savedPlace': 'Imehifadhiwa',
    'saveSpot': 'Hifadhi mahali pangu',
    'spotSaved': 'Mahali pamehifadhiwa',
    'saved': 'Hifadhi',
    'savedBody':
        'Maeneo, viongozi na mahali unavyohifadhi. Vinabaki kwenye kifaa hiki; hakuna kinachotumwa popote.',
    'savedEmpty':
        'Hujahifadhi chochote bado. Fungua eneo kisha bonyeza nyota au moyo.',
    'myPlaces': 'Maeneo',
    'myLeaders': 'Viongozi unaowafuata',
    'myProjects': 'Miradi unayopenda',
    'mySpots': 'Mahali kutoka GPS yako',
    'mapTitle': 'Kwenye ramani',
  },
};

/// The word for [key] in [language], falling back to English.
String tr(String language, String key) =>
    _words[language]?[key] ?? _words['en']![key] ?? key;

/// Swahili for the sentences of the newer screens, keyed by their English text. A sentence with `{}` takes values in
/// order. Anything missing shows in English.
/// The Swahili sentences, for tests that check every English sentence of a list has one.
bool hasSwahili(String en) => _sw.containsKey(en);

const _sw = <String, String>{
  'Reset view': 'Rejesha mwonekano',
  'No leaders are recorded at this level.':
      'Hakuna viongozi waliorekodiwa katika ngazi hii.',
  'Choose another level below.': 'Chagua ngazi nyingine hapa chini.',
  'Only relationships within the selected level are shown.':
      'Mahusiano ya ndani ya ngazi iliyochaguliwa pekee ndiyo yanaonyeshwa.',

  'Development preview: some figures are illustrative and unverified.':
      'Onyesho la majaribio: baadhi ya takwimu ni mifano na hazijathibitishwa.',
  'Compared with places at the same ranking level.':
      'Inalinganishwa na maeneo ya ngazi sawa ya upangaji.',
  'Both places record zero. Relative percentage change is undefined.':
      'Maeneo yote mawili yamerekodi sifuri. Mabadiliko ya asilimia hayawezi kuhesabiwa.',
  'The comparison place records zero. Relative percentage change is undefined.':
      'Eneo la kulinganisha limerekodi sifuri. Mabadiliko ya asilimia hayawezi kuhesabiwa.',
  'No results match your search.':
      'Hakuna matokeo yanayolingana na utafutaji wako.',
  'Try another name or category.': 'Jaribu jina au kundi jingine.',
  'No images are recorded yet.': 'Hakuna picha zilizorekodiwa bado.',
  'Close gallery': 'Funga picha',

  'Speeches & contributions': 'Hotuba na michango',
  'No speeches are recorded here yet.':
      'Hakuna hotuba zilizorekodiwa hapa bado.',
  '{} words': 'Maneno {}',
  'View debate': 'Tazama mjadala',
  'Focus leaders': 'Lenga viongozi',
  'Fit whole tree': 'Onyesha mti wote',
  'Read & understand': 'Soma na uelewe',
  'Legal basis': 'Msingi wa kisheria',
  'No legal reference is recorded yet.':
      'Hakuna rejea ya kisheria iliyorekodiwa bado.',
  'Review status: {}': 'Hali ya uhakiki: {}',
  'Read full provision': 'Soma kifungu chote',
  'The full legal provision is not available in this record.':
      'Kifungu kizima hakipatikani kwenye rekodi hii.',
  'Continue reading': 'Endelea kusoma',
  'No explanation is recorded yet.': 'Hakuna maelezo yaliyorekodiwa bado.',
  'Development content. Names, explanations and figures may be illustrative and are not verified public records.':
      'Maudhui ya majaribio. Majina, maelezo na takwimu zinaweza kuwa mifano na si rekodi rasmi zilizothibitishwa.',
  'Understand public bodies': 'Elewa taasisi za umma',
  'What they do, who leads them and the law behind them.':
      'Kazi zao, viongozi wao na sheria zinazozianzisha.',
  'Find an institution': 'Tafuta taasisi',
  'No institutions match your search.':
      'Hakuna taasisi inayolingana na utafutaji wako.',
  'Institution': 'Taasisi',
  'Explore leadership tree': 'Chunguza mti wa uongozi',
  'What it does': 'Kazi zake',
  'Leadership': 'Uongozi',
  'No office holders are recorded yet.': 'Hakuna viongozi waliorekodiwa bado.',
  'Related bodies': 'Taasisi zinazohusiana',
  'Bodies within this institution': 'Taasisi zilizo ndani ya taasisi hii',
  'Explore explanations and the evidence behind public life.':
      'Chunguza maelezo na ushahidi wa shughuli za umma.',
  'No explanations are recorded in this language yet.':
      'Hakuna maelezo yaliyorekodiwa kwa lugha hii bado.',
  'All institutions': 'Taasisi zote',
  'All office holders': 'Viongozi wote',
  'No leaders are recorded for this selection.':
      'Hakuna viongozi waliorekodiwa kwa chaguo hili.',
  'Choose another category or institution.':
      'Chagua kundi au taasisi nyingine.',
  'Drag to explore. Pinch to zoom. Tap a person or body.':
      'Buruta kuchunguza. Bana kukuza. Gusa mtu au taasisi.',
  'How to read this tree': 'Jinsi ya kusoma mti huu',
  'All levels': 'Ngazi zote',
  'Choose an institution': 'Chagua taasisi',
  'No performance measure is recorded. This is not a zero score.':
      'Hakuna kipimo cha utendaji kilichorekodiwa. Hii si alama ya sifuri.',
  'View leader': 'Tazama kiongozi',
  'View institution': 'Tazama taasisi',
  'Reference records': 'Rekodi za marejeo',
  'Performance not recorded': 'Utendaji haujarekodiwa',
  'Choose a place to start comparing.': 'Chagua eneo kuanza kulinganisha.',
  'Start with your place': 'Anza na eneo lako',
  'Change starting place': 'Badilisha eneo la kuanzia',
  'Compare at another level': 'Linganisha katika ngazi nyingine',
  'Ranking measure': 'Kipimo cha upangaji',
  'Choose another place': 'Chagua eneo jingine',
  'Closest places': 'Maeneo yaliyo karibu zaidi',
  'Nearby places are not available at this level.':
      'Maeneo ya karibu hayapatikani katika ngazi hii.',
  'Top performers': 'Yanayoongoza',
  'Each axis is scaled to the larger of the two values. It is a comparison, not an overall score.':
      'Kila mhimili umepimwa kulingana na thamani kubwa kati ya mbili. Huu ni ulinganisho, si alama ya jumla.',
  'Missing values are shown as a dash, never as zero.':
      'Thamani zinazokosekana zinaonyeshwa kwa kistari, si sifuri.',
  'Loading information': 'Inapakia taarifa',
  'We could not load this information. Please try again.':
      'Hatukuweza kupakia taarifa hizi. Tafadhali jaribu tena.',
  'No ranking measures are available yet.':
      'Hakuna vipimo vya upangaji vinavyopatikana bado.',
  'About this place': 'Kuhusu eneo hili',
  'Biography & background': 'Wasifu na historia',
  'Copy source link': 'Nakili kiungo cha chanzo',

  'Area': 'Eneo',
  'People': 'Watu',
  'People per km²': 'Watu kwa km²',
  'Size rank': 'Nafasi kwa ukubwa',
  'Skip': 'Ruka',
  'Next': 'Endelea',
  'Welcome to Mzizi': 'Karibu Mzizi',
  'Your place, in numbers': 'Eneo lako kwa nambari',
  'Leaders you can check': 'Viongozi unaoweza kuwakagua',
  'Mzizi means root. We trace public life in Kenya back to its source: who leads, what is built and where the money goes.':
      'Mzizi maana yake ni mzizi. Tunafuatilia maisha ya umma nchini Kenya hadi chanzo: nani anaongoza, nini kinajengwa na pesa zinakwenda wapi.',
  'See how your county, constituency or ward compares with the rest of the country: people, projects, votes and funding.':
      'Ona jinsi kaunti, eneobunge au wadi yako inavyolinganishwa na sehemu nyingine za nchi: watu, miradi, kura na fedha.',
  'Find who represents you, how they voted and what they delivered. Every figure shows where it came from.':
      'Jua nani anakuwakilisha, alivyopiga kura na alichotekeleza. Kila nambari inaonyesha chanzo chake.',
  'Where are you?': 'Uko wapi?',
  'We use your place to show the numbers and leaders that matter to you. Your location stays on this phone.':
      'Tunatumia eneo lako kukuonyesha nambari na viongozi wanaokuhusu. Mahali ulipo hubaki kwenye simu hii.',
  'Use my location': 'Tumia mahali nilipo',
  'Finding where you are…': 'Tunatafuta ulipo…',
  'We could not read your location. You can allow it in settings, or search for your place below.':
      'Hatukuweza kusoma mahali ulipo. Unaweza kuruhusu kwenye mipangilio, au utafute eneo lako hapa chini.',
  'Or search for a county, town or ward': 'Au tafuta kaunti, mji au wadi',
  'For example Kisumu or Kibera': 'Kwa mfano Kisumu au Kibera',
  'Not now, show me Kenya': 'Si sasa, nionyeshe Kenya',
  'Kenya': 'Kenya',
  'All of Kenya': 'Kenya yote',
  'Your place': 'Eneo lako',
  'Set place': 'Weka eneo',
  'Switch': 'Badilisha',
  'How {} compares': 'Jinsi {} inavyolinganishwa',
  'Against every county in Kenya.': 'Dhidi ya kila kaunti nchini Kenya.',
  'Against every constituency in Kenya.':
      'Dhidi ya kila eneobunge nchini Kenya.',
  'Compare places': 'Linganisha maeneo',
  'Your leaders': 'Viongozi wako',
  'Choose your place to see how it compares with the rest of Kenya.':
      'Chagua eneo lako uone linavyolinganishwa na sehemu nyingine za Kenya.',
  'Did you know?': 'Je, ulijua?',
  'Elections': 'Uchaguzi',
  'Parliament': 'Bunge',
  'Projects': 'Miradi',
  'Tenders': 'Zabuni',
  'Choose your place': 'Chagua eneo lako',
  'Search a county, town or ward': 'Tafuta kaunti, mji au wadi',
  'Compare with': 'Linganisha na',
  'Compare {} with another place': 'Linganisha {} na eneo lingine',
  'Choose a place': 'Chagua eneo',
  'Ranked as part of {}': 'Inalinganishwa kama sehemu ya {}',
  'Top {}': 'Bora {}',
  '#{} of {}': 'Nafasi ya {} kati ya {}',
  'the average': 'wastani',
  'the top, {}': 'kinara, {}',
  'Not enough data to compare': 'Data haitoshi kulinganisha',
  'About the same as {}': 'Karibu sawa na {}',
  '{} above {}': '{} juu ya {}',
  '{} below {}': '{} chini ya {}',
  'Light or dark': 'Mwanga au giza',
  'Rankings': 'Viwango',
  'Elected': 'Waliochaguliwa',
  'Appointed': 'Walioteuliwa',
  'Nominated': 'Waliopendekezwa',
  '{} leaders': 'Viongozi {}',
  'and {} more': 'na {} zaidi',
  '2013': '2013',
  '2017': '2017',
  '2022': '2022',
  'About': 'Kuhusu',
  'About the data': 'Kuhusu data',
  'Absent': 'Hawakuwepo',
  'Abstained': 'Hawakupiga kura',
  'Acts': 'Sheria',
  'Appearance': 'Mwonekano',
  'Attendance': 'Mahudhurio',
  'Auto': 'Kiotomatiki',
  'Awarded': 'Zilizotolewa',
  'Back': 'Rudi',
  'Bids and contract': 'Zabuni na mkataba',
  'Bills': 'Miswada',
  'Bills and motions, how each member voted and what they said.':
      'Miswada na hoja, jinsi kila mbunge alivyopiga kura na alichosema.',
  'By region': 'Kwa eneo',
  'Cancel': 'Ghairi',
  'Census': 'Sensa',
  'Chapters': 'Sura',
  'Choose': 'Chagua',
  'Choose a ranking': 'Chagua kiwango',
  'Choose {}': 'Chagua {}',
  'Citations': 'Marejeo',
  'Commissions': 'Tume',
  'Contracts': 'Mikataba',
  'Could not load places. Check your connection.':
      'Maeneo hayakupakia. Angalia mtandao wako.',
  'Counties': 'Kaunti',
  'Counties of Kenya': 'Kaunti za Kenya',
  'Dark': 'Giza',
  'Debug build': 'Toleo la majaribio',
  'Density': 'Msongamano',
  'Divisions': 'Kura za bunge',
  'Documents': 'Hati',
  'Everything Mzizi covers, and what to find in each part.':
      'Yote ambayo Mzizi inashughulikia, na unachoweza kupata kila sehemu.',
  'Explore': 'Gundua',
  'Facts': 'Ukweli',
  'Forget my place': 'Sahau eneo langu',
  'Funding': 'Ufadhili',
  'Funds': 'Fedha',
  'Inside {}': 'Ndani ya {}',
  'Institutions': 'Taasisi',
  'Judiciary': 'Idara ya Mahakama',
  'Language': 'Lugha',
  'Latest allocation': 'Mgao wa hivi karibuni',
  'Latest fund': 'Mfuko wa hivi karibuni',
  'Leaders': 'Viongozi',
  'Light': 'Mwanga',
  'Map': 'Ramani',
  'Maps': 'Ramani',
  'Members': 'Wanachama',
  'Money': 'Pesa',
  'Money & projects': 'Pesa na miradi',
  'My place': 'Eneo langu',
  'No': 'Hapana',
  'No figure is recorded for this place yet. Smaller places such as towns and wards often have none; the next place up usually does.':
      'Hakuna takwimu iliyorekodiwa kwa eneo hili bado. Maeneo madogo kama miji na wadi mara nyingi hayana; eneo la juu yake kwa kawaida lina.',
  'No place chosen': 'Hakuna eneo lililochaguliwa',
  'No places match.': 'Hakuna maeneo yanayolingana.',
  'Not available yet': 'Haipatikani bado',
  'Not recorded': 'Haijarekodiwa',
  'Nothing is recorded inside this place.':
      'Hakuna kilichorekodiwa ndani ya eneo hili.',
  'On record': 'Iliyorekodiwa',
  'Open': 'Wazi',
  'Parliament & votes': 'Bunge na kura',
  'Parties': 'Vyama',
  'Per 1,000 km²': 'Kwa km² 1,000',
  'Per 100,000': 'Kwa watu 100,000',
  'Places': 'Maeneo',
  'Population': 'Idadi ya watu',
  'Population & statistics': 'Idadi ya watu na takwimu',
  'Population over time': 'Idadi ya watu kwa miaka',
  'Privacy': 'Faragha',
  'Publishers': 'Wachapishaji',
  'Rank': 'Nafasi',
  'Registered political parties, their members and their funding.':
      'Vyama vya siasa vilivyosajiliwa, wanachama wao na ufadhili wao.',
  'Release build': 'Toleo rasmi',
  'Results by year and by place, turnout and who won.':
      'Matokeo kwa mwaka na kwa eneo, idadi ya waliopiga kura na aliyeshinda.',
  'Sample data': 'Data ya mfano',
  'Saved': 'Vilivyohifadhiwa',
  'Saved places, spots and leaders': 'Maeneo, mahali na viongozi uliohifadhi',
  'Search': 'Tafuta',
  'Search places, leaders, parties and projects':
      'Tafuta maeneo, viongozi, vyama na miradi',
  'Seats': 'Viti',
  'Settings': 'Mipangilio',
  'Short facts about Kenya and the place you are in.':
      'Ukweli mfupi kuhusu Kenya na eneo ulipo.',
  'Show the welcome screens again': 'Onyesha skrini za kukaribisha tena',
  'Some places and people shown are development samples and are labelled where they appear.':
      'Baadhi ya maeneo na watu wanaoonyeshwa ni mifano ya majaribio na wamewekewa alama.',
  'Sources & evidence': 'Vyanzo na ushahidi',
  'Sources and evidence': 'Vyanzo na ushahidi',
  'Speeches': 'Hotuba',
  'Start again': 'Anza upya',
  'Start again?': 'Anza upya?',
  'Statistics': 'Takwimu',
  'The Constitution': 'Katiba',
  'The bodies that run the country, what each is for and who leads it.':
      'Taasisi zinazoendesha nchi, kila moja ni ya nini na nani anaiongoza.',
  'This part is not available in the app yet.':
      'Sehemu hii bado haipatikani kwenye programu.',
  'Trends': 'Mwelekeo',
  'Wards': 'Wadi',
  'What government is buying, who bid and who won.':
      'Serikali inanunua nini, nani alizabuni na nani alishinda.',
  'Where every figure comes from, so you can check it yourself.':
      'Kila nambari inatoka wapi, ili uweze kuikagua mwenyewe.',
  'Where every figure comes from.': 'Kila nambari inatoka wapi.',
  'Who comes top, and where you stand.': 'Nani anaongoza, na wewe uko wapi.',
  'Yes': 'Ndiyo',
  'You will see the welcome screens and choose a place again.':
      'Utaona skrini za kukaribisha na kuchagua eneo tena.',
  'Your place and saved items stay on this phone. Location is read only when you ask.':
      'Eneo lako na vitu ulivyohifadhi hubaki kwenye simu hii. Mahali ulipo husomwa tu unapoomba.',
  'Your region': 'Eneo lako',
  'of {} alike': 'kati ya {} zinazofanana',
  '{} inside': '{} ndani',
  '{} kept on this phone': '{} vimehifadhiwa kwenye simu hii',
  'Home': 'Mwanzo',
  'No ranking is recorded for this measure yet.':
      'Hakuna kiwango kilichorekodiwa kwa kipimo hiki bado.',
  'Start at the counties and narrow down to a constituency, ward or town.':
      'Anza na kaunti kisha shuka hadi eneobunge, wadi au mji.',
  'How many people live where, how crowded it is and how it has changed.':
      'Watu wangapi wanaishi wapi, msongamano ukoje na umebadilikaje.',
  'Who holds each seat, from the president down to the ward, and how they got there.':
      'Nani ana kila kiti, kuanzia rais hadi wadi, na walivyofika huko.',
  'Read the rules that create offices and bodies, and see what they explain.':
      'Soma kanuni zinazounda ofisi na taasisi, uone zinavyoeleza nini.',
  'Public projects on a map, development funds and whether they were finished.':
      'Miradi ya umma kwenye ramani, fedha za maendeleo na kama ilikamilika.',
  'Against its parents': 'Dhidi ya maeneo yaliyo juu yake',
  'Decisions': 'Maamuzi',
  'Get in touch': 'Wasiliana',
  'How each member voted': 'Jinsi kila mbunge alivyopiga kura',
  'How they got the seat': 'Walivyopata kiti',
  'Leadership here': 'Uongozi hapa',
  'On the map': 'Kwenye ramani',
  'Parliament and other bodies': 'Bunge na taasisi nyingine',
  'Parties, ranked': 'Vyama kwa nafasi',
  'Pictures': 'Picha',
  'Places · leaders · parties · projects': 'Maeneo · viongozi · vyama · miradi',
  'Population by county': 'Idadi ya watu kwa kaunti',
  'Public procurement': 'Ununuzi wa umma',
  'Recent decisions': 'Maamuzi ya hivi karibuni',
  'Registered voters': 'Wapiga kura waliosajiliwa',
  'Round table': 'Meza ya duara',
  'Search everything': 'Tafuta kila kitu',
  'Tenders & contracts': 'Zabuni na mikataba',
  'Top candidates': 'Wagombea wa juu',
  'Votes and voters': 'Kura na wapiga kura',
  'Votes by party': 'Kura kwa chama',
  'Votes obtained': 'Kura zilizopatikana',
  'What the money was for': 'Pesa zilikuwa za nini',
  'Where the money goes': 'Pesa zinakwenda wapi',
  'Who is doing what': 'Nani anafanya nini',
  'Who lives here': 'Nani anaishi hapa',
  'Recorded': 'Iliyorekodiwa',
  'Complete': 'Zilizokamilika',
  'Public projects': 'Miradi ya umma',
  'Full screen': 'Skrini nzima',
  'Zoom in': 'Kuza',
  'Zoom out': 'Punguza',
  'Show everything': 'Onyesha vyote',
  'My location': 'Mahali nilipo',
  'Done': 'Zimekamilika',
  'Ongoing': 'Zinaendelea',
  'Planned': 'Zilizopangwa',
  'Stalled': 'Zilizokwama',
  'Profile': 'Wasifu',
  'Change': 'Badilisha',
  'Find your area': 'Tafuta eneo lako',
};

String _sub(String text, List<Object?> values) {
  var out = text;
  for (final v in values) {
    out = out.replaceFirst('{}', '$v');
  }
  return out;
}

/// Translates a sentence of the newer screens into the interface language of [context].
String t(BuildContext context, String en) =>
    uiLanguage == 'sw' ? (_sw[en] ?? en) : en;

/// The interface language, kept in step with [languageProvider] by the app root (the widgets below are rebuilt when it
/// changes). Material has no Swahili locale, so the choice is held here rather than in a `Locale`.
String uiLanguage = 'en';

/// Like [t] for a sentence with `{}` holes.
String tf(BuildContext context, String en, [List<Object?> values = const []]) =>
    _sub(t(context, en), values);

/// A [Text] that translates its string when the interface language is Swahili.
class Tx extends StatelessWidget {
  const Tx(
    this.data, {
    super.key,
    this.style,
    this.textAlign,
    this.maxLines,
    this.overflow,
  });
  final String data;
  final TextStyle? style;
  final TextAlign? textAlign;
  final int? maxLines;
  final TextOverflow? overflow;
  @override
  Widget build(BuildContext context) => Text(
    t(context, data),
    style: style,
    textAlign: textAlign,
    maxLines: maxLines,
    overflow: overflow,
  );
}
