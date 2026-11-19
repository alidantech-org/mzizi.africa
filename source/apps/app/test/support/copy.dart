import 'dart:convert';
import 'dart:io';

import 'package:mzizi_app/presentation/i18n/strings.dart';

/// Installs the development copy rows (the same file the database seed is built from) for [language], as the app does
/// after fetching `GET /v1/copy`, so tests run against the real wording.
void installCopy(String language) {
  final data =
      jsonDecode(
            File(
              '../../../scripts/dev/dev_seed/data/copy.json',
            ).readAsStringSync(),
          )
          as Map<String, dynamic>;
  final app = data['app'] as Map<String, dynamic>;
  final copy = <String, String>{};
  final words =
      (app['words'] as Map<String, dynamic>)[language] as Map<String, dynamic>;
  words.forEach(
    (name, text) => copy['app.word.${name.toLowerCase()}'] = text as String,
  );
  if (language != 'en') {
    (app['phrases'] as Map<String, dynamic>).forEach((english, text) {
      copy[phraseKey(english)] = text as String;
    });
  }
  setCopy(copy);
}
