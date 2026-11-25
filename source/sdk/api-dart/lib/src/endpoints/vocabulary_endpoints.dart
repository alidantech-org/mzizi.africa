/// Typed route registry for the Vocabulary group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class VocabularyEndpoints {
  const VocabularyEndpoints();

  /// GET /v1/vocabulary/schemes/{code}
  String getScheme({required String code}) => '/v1/vocabulary/schemes/$code';

  /// GET /v1/vocabulary/terms
  String get listTerms => '/v1/vocabulary/terms';
}
