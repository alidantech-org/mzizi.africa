import 'package:json_annotation/json_annotation.dart';

/// Figure Basis
enum SharedFigureBasis {
  @JsonValue('aggregated')
  aggregated,
  @JsonValue('estimated')
  estimated,
  @JsonValue('measured')
  measured,
  @JsonValue('modelled')
  modelled,
  @JsonValue('projected')
  projected,
}
