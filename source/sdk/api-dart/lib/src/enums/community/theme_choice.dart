import 'package:json_annotation/json_annotation.dart';

/// Theme Choice
enum CommunityThemeChoice {
  @JsonValue('dark')
  dark,
  @JsonValue('light')
  light,
  @JsonValue('system')
  system,
}
