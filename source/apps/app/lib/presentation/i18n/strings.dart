import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Interface language. The words of the interface live here (English and Swahili); names and labels of places,
/// offices and kinds come from the API in the language chosen here, so the system's own translations are used
/// wherever it holds them. Hand-written.
final languageProvider = StateProvider<String>((ref) => 'en');

const _words = <String, Map<String, String>>{
  'en': {
    'tagline':
        'Who serves you, where the money goes, and the evidence behind it.',
    'home': 'Home',
    'places': 'Places',
    'search': 'Search',
    'explore': 'Explore',
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
    'saved': 'Vilivyohifadhiwa',
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
