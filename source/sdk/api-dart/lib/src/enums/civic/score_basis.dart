import 'package:json_annotation/json_annotation.dart';

/// Score Basis
enum CivicScoreBasis {
  @JsonValue('contracts')
  contracts,
  @JsonValue('modelled')
  modelled,
  @JsonValue('standard-cost')
  standardCost,
  @JsonValue('survey')
  survey,
}
