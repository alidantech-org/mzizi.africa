import 'package:json_annotation/json_annotation.dart';

/// Platform
enum CommunityPlatform {
  @JsonValue('android')
  android,
  @JsonValue('ios')
  ios,
  @JsonValue('web')
  web,
}
