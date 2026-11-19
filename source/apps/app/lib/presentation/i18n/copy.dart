import 'package:intl/intl.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';

/// Fetches the interface wording for [language] from the API and installs it. Failing to reach the API leaves the
/// previous wording (English text shows as written); the app still opens.
Future<void> loadCopy(String language) async {
  try {
    final result = await ExperienceFeature(
      MziziApi.connection,
    ).getCopy(input: ExperienceCopyInput(languageCode: language));
    final catalog = result.dataOrNull;
    if (catalog != null) {
      setCopy({for (final e in catalog.entries) e.key: e.text});
    }
  } on Object {
    // The wording is a convenience layered over the English text in the code.
  }
}

/// The visitor's country as the API context decided it: its name and the symbol of its currency. Nothing in the app
/// names a country or a currency.
class AppCountry {
  static String name = '';
  static String currencySymbol = '';
}

/// Fetches the context and installs the country name and currency symbol.
Future<void> loadCountry(String language) async {
  try {
    final result = await ExperienceFeature(
      MziziApi.connection,
    ).getContext(languageCode: language);
    final country = result.dataOrNull?.country;
    if (country == null) return;
    AppCountry.name = country.name;
    final code = country.currencyCode?.split('.').last.toUpperCase();
    AppCountry.currencySymbol = code == null
        ? ''
        : NumberFormat.simpleCurrency(name: code).currencySymbol;
  } on Object {
    // The app opens without a country name; amounts then show without a symbol.
  }
}
