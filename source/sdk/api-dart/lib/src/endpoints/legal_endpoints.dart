/// Typed route registry for the Legal group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class LegalEndpoints {
  const LegalEndpoints();

  /// GET /v1/legal/instruments/{code}
  String getInstrument({required String code}) => '/v1/legal/instruments/$code';

  /// GET /v1/legal/effects
  String get listEffects => '/v1/legal/effects';

  /// GET /v1/legal/instruments
  String get listInstruments => '/v1/legal/instruments';

  /// GET /v1/legal/provisions
  String get listProvisions => '/v1/legal/provisions';
}
