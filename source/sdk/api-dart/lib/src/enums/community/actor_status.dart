import 'package:json_annotation/json_annotation.dart';

/// Actor Status
enum CommunityActorStatus {
  @JsonValue('active')
  active,
  @JsonValue('blocked')
  blocked,
  @JsonValue('closed')
  closed,
}
