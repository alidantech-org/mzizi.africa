import 'package:json_annotation/json_annotation.dart';

/// Price Kind
enum EconomyPriceKind {
  @JsonValue('contract')
  contract,
  @JsonValue('farm-gate')
  farmGate,
  @JsonValue('modelled')
  modelled,
  @JsonValue('retail')
  retail,
  @JsonValue('standard-cost')
  standardCost,
  @JsonValue('wholesale')
  wholesale,
}
