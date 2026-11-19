import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/user/user_store.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Interface language. The words of the interface live here (English and Swahili); names and labels of places,
/// offices and kinds come from the API in the language chosen here, so the system's own translations are used
/// wherever it holds them. Hand-written.
final languageProvider = StateProvider<String>(
  (ref) => UserStore.instance.language,
);

/// The interface word for [key], from the copy delivered by the API for the interface language; shows the key when the
/// copy has no row.
String tr(String language, String key) =>
    _copy['app.word.${key.toLowerCase()}'] ?? key;

/// The interface wording delivered by the API (`reference.copy`) for the interface language: copy key to text.
Map<String, String> _copy = const {};

/// Replaces the wording after [loadCopy] fetched it.
void setCopy(Map<String, String> copy) => _copy = copy;

/// The copy key of an English sentence: lowercased, every run of other characters one hyphen, `{}` read as `n`; a slug
/// over 60 characters is cut to 50 and ends with the FNV-1a hash of the whole slug. The database rows use the same rule.
String phraseKey(String english) {
  var slug = english
      .toLowerCase()
      .replaceAll('{}', ' n ')
      .replaceAll(RegExp(r'[^a-z0-9]+'), '-')
      .replaceAll(RegExp(r'^-+|-+$'), '');
  if (slug.length > 60) {
    var hash = 0x811c9dc5;
    for (final unit in slug.codeUnits) {
      hash = ((hash ^ unit) * 0x01000193) & 0xFFFFFFFF;
    }
    slug =
        '${slug.substring(0, 50).replaceAll(RegExp(r'-+$'), '')}-${hash.toRadixString(16)}';
  }
  return 'app.phrase.$slug';
}

/// Whether the copy holds a Swahili sentence for [en] (for tests that check a list is translated).
bool hasSwahili(String en) => _copy.containsKey(phraseKey(en));

String _sub(String text, List<Object?> values) {
  var out = text;
  for (final v in values) {
    out = out.replaceFirst('{}', '$v');
  }
  return out;
}

/// Translates a sentence of the newer screens into the interface language of [context].
String t(BuildContext context, String en) =>
    uiLanguage == 'sw' ? (_copy[phraseKey(en)] ?? en) : en;

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
