import 'package:json_annotation/json_annotation.dart';

/// Crosswalk Kind
enum EconomyCrosswalkKind {
  @JsonValue('exact')
  exact,
  @JsonValue('partial')
  partial,
}
