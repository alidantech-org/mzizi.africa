/// Typed route registry for the Reference group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class ReferenceEndpoints {
  const ReferenceEndpoints();

  /// GET /v1/reference/countries/{code}
  String getCountry({required String code}) => '/v1/reference/countries/$code';

  /// GET /v1/reference/countries
  String get listCountries => '/v1/reference/countries';

  /// GET /v1/reference/currencies
  String get listCurrencies => '/v1/reference/currencies';

  /// GET /v1/reference/hierarchies
  String get listHierarchies => '/v1/reference/hierarchies';

  /// GET /v1/reference/languages
  String get listLanguages => '/v1/reference/languages';

  /// GET /v1/reference/units
  String get listUnits => '/v1/reference/units';
}
