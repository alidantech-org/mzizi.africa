import 'package:json_annotation/json_annotation.dart';

/// Form Status
enum ElectionFormStatus {
  @JsonValue('final')
  finalValue,
  @JsonValue('provisional')
  provisional,
}
