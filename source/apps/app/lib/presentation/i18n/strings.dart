import 'package:material_ui/material_ui.dart';
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
    'rankings': 'Rankings',
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
const _sw = <String, String>{
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
  'Against every constituency in Kenya.': 'Dhidi ya kila eneobunge nchini Kenya.',
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
    Localizations.localeOf(context).languageCode == 'sw' ? (_sw[en] ?? en) : en;

/// Like [t] for a sentence with `{}` holes.
String tf(BuildContext context, String en, [List<Object?> values = const []]) =>
    _sub(t(context, en), values);

/// A [Text] that translates its string when the interface language is Swahili.
class Tx extends StatelessWidget {
  const Tx(this.data, {super.key, this.style, this.textAlign, this.maxLines, this.overflow});
  final String data;
  final TextStyle? style;
  final TextAlign? textAlign;
  final int? maxLines;
  final TextOverflow? overflow;
  @override
  Widget build(BuildContext context) => Text(t(context, data), style: style, textAlign: textAlign, maxLines: maxLines, overflow: overflow);
}
