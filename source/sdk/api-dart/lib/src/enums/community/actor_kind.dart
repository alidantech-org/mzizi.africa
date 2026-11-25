import 'package:json_annotation/json_annotation.dart';

/// Actor Kind
enum CommunityActorKind {
  @JsonValue('member')
  member,
  @JsonValue('visitor')
  visitor,
}
