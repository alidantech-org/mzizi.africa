import 'package:json_annotation/json_annotation.dart';

/// Good Status
enum EconomyGoodStatus {
  @JsonValue('active')
  active,
  @JsonValue('retired')
  retired,
}
