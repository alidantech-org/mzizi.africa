import 'package:json_annotation/json_annotation.dart';

/// Post State
enum CommunityPostState {
  @JsonValue('draft')
  draft,
  @JsonValue('pending')
  pending,
  @JsonValue('published')
  published,
  @JsonValue('rejected')
  rejected,
  @JsonValue('removed')
  removed,
}
