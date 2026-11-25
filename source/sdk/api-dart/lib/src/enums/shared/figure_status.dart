import 'package:json_annotation/json_annotation.dart';

/// Figure Status
enum SharedFigureStatus {
  @JsonValue('estimated')
  estimated,
  @JsonValue('final')
  finalValue,
  @JsonValue('missing')
  missing,
  @JsonValue('projected')
  projected,
  @JsonValue('provisional')
  provisional,
  @JsonValue('revised')
  revised,
  @JsonValue('suppressed')
  suppressed,
}
