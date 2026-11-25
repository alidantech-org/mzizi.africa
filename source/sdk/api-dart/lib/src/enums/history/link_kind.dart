import 'package:json_annotation/json_annotation.dart';

/// Link Kind
enum HistoryLinkKind {
  @JsonValue('caused')
  caused,
  @JsonValue('followed')
  followed,
  @JsonValue('led-to')
  ledTo,
  @JsonValue('part-of')
  partOf,
  @JsonValue('replaced')
  replaced,
}
